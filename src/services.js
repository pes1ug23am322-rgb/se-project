async function fetchBlog(url) {
  if (!url) throw new Error('invalid_url');
  return '<html><body><h1>Mock</h1><p>content</p></body></html>';
}

function cleanHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').trim();
}

module.exports = { fetchBlog, cleanHtml };
