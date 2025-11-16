// BTPC-2: fetchBlog now includes timeout + headers
// BTPC-2 Fetch Blog Content - small comment to register commit
// BTPC-3 Clean HTML Content - commit marker
/*
  src/services.js
  REAL blog fetch using built-in fetch (Node 18+)
  Clean HTML for PDF usage
*/

/**
 * Fetch raw HTML from a blog URL
 */
async function fetchBlog(url) {
  if (!url) {
    throw new Error("invalid_url");
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    if (!res.ok) {
      throw new Error("fetch_failed");
    }

    const html = await res.text();
    return html;

  } catch (err) {
    console.error("Error fetching blog:", err);
    throw new Error("fetch_failed");
  }
}

/**
 * Clean HTML: remove tags, scripts, spacing
 */
function cleanHtml(html) {
  if (!html) return "";

  // Remove script/style tags
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Remove all HTML tags
  html = html.replace(/<[^>]+>/g, "");

  // Convert HTML entities
  html = html.replace(/&nbsp;/g, " ");
  html = html.replace(/&amp;/g, "&");
  html = html.replace(/&quot;/g, '"');

  // Normalize spacing
  html = html.replace(/\s+/g, " ").trim();

  return html;
}

module.exports = { fetchBlog, cleanHtml };
