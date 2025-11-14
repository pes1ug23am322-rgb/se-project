const express = require('express');
const { fetchBlog, cleanHtml } = require('./services');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/convert', async (req, res) => {
  try {
    const url = req.body.url;

    if (!url) {
      return res.status(400).json({ error: 'url required' });
    }

    // Await fetchBlog - if it rejects, catch will run
    const html = await fetchBlog(url);

    const cleaned = cleanHtml(html);

    return res.json({ ok: true, cleanedLength: cleaned.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'conversion_failed' });
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(3000, () => console.log('Server running on port 3000'));
}
