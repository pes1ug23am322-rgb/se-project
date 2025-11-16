// BTPC-4: Completed writing PDF stream
// BTPC-4: Generating PDF using PDFKit
// BTPC-2: Calling fetchBlog service here
// BTPC-1: Handles receiving blog URL from user
// Added documentation comments for clarity – commit improvement
// BTPC-7 PDF Generation Story Marker
// BTPC-4 PDF Generation - commit marker
// src/app.js
// Full server: POST /convert (returns JSON + stores cleaned content)
// GET /download.pdf?id=...   (streams real PDF from stored cleaned content)
// GET /download.pdf?url=...  (fetch+clean+stream on the fly)
// GET /health
//
// Requires Node 18+ (uses global fetch) and pdfkit installed.

const express = require('express');
const path = require('path');
const PDFDocument = require('pdfkit');
const { fetchBlog, cleanHtml } = require('./services');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// In-memory short-lived store for converted content.
// key -> { url, cleaned, metadata, ts }
const store = new Map();
// Store lifetime (ms) - we will clean up old entries occasionally
const STORE_TTL = 1000 * 60 * 10; // 10 minutes

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// background cleanup of old store entries
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (now - v.ts > STORE_TTL) store.delete(k);
  }
}, 1000 * 60); // every minute

app.get('/health', (req, res) => res.json({ ok: true }));

/**
 * POST /convert
 * Body: { url: "https://..." }
 * Response: JSON { ok:true, id, metadata, cleanedLength }
 * The cleaned content is stored in memory (short-lived) under id.
 */
app.post('/convert', async (req, res) => {
  try {
    const url = req.body?.url;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ ok: false, error: 'url required' });
    }

    // Fetch and clean
    const html = await fetchBlog(url);
    const cleaned = cleanHtml(html || '');

    const metadata = {
      title: `Converted PDF for ${url}`,
      url,
      cleanedLength: (cleaned || '').length
    };

    // store cleaned content for download
    const id = generateId();
    store.set(id, { url, cleaned, metadata, ts: Date.now() });

    return res.json({ ok: true, id, metadata });
  } catch (err) {
    console.error('POST /convert error:', err);
    return res.status(500).json({ ok: false, error: 'conversion_failed' });
  }
});

/**
 * GET /download.pdf?id=...  OR  /download.pdf?url=...
 *
 * If id is provided and present in store, we stream PDF built from stored cleaned text.
 * Otherwise, if url is provided, we fetch+clean+stream on-the-fly.
 */
app.get('/download.pdf', async (req, res) => {
  try {
    const { id, url } = req.query;

    let sourceUrl = null;
    let cleaned = null;

    if (id) {
      const entry = store.get(id);
      if (!entry) {
        return res.status(404).json({ ok: false, error: 'id_not_found_or_expired' });
      }
      sourceUrl = entry.url;
      cleaned = entry.cleaned;
      // optionally remove it after serving
      store.delete(id);
    } else if (url) {
      sourceUrl = url;
      const html = await fetchBlog(url);
      cleaned = cleanHtml(html || '');
    } else {
      return res.status(400).json({ ok: false, error: 'id_or_url_required' });
    }

    // Stream PDF directly to response using PDFKit
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');

    const doc = new PDFDocument({ autoFirstPage: true, margin: 50 });
    doc.pipe(res);

    // Header
    doc.fontSize(18).text('Converted PDF', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('blue').text(`Source: ${sourceUrl}`);
    doc.moveDown(0.8);
    doc.fillColor('black');

    // Body text: split large text into paragraphs to avoid huge single write
    const maxLineLength = 1000;
    const text = (cleaned || 'No content extracted.') || 'No content extracted.';
    // very simple: write the content as-is (PDFKit handles page breaks)
    doc.fontSize(11).text(text, { align: 'left' });

    doc.end();
    // no need to res.end() — doc.pipe(res) will end the response when doc.end() completes
  } catch (err) {
    console.error('GET /download.pdf error:', err);
    // If headers not sent, send JSON error; else just destroy connection
    if (!res.headersSent) {
      res.status(500).json({ ok: false, error: 'pdf_generation_failed' });
    } else {
      try { res.end(); } catch (e) {}
    }
  }
});

// fallback to default exported app for tests
module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}
