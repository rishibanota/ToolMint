const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'public', 'tools');
const files = fs.readdirSync(toolsDir)
  .filter(f => fs.statSync(path.join(toolsDir, f)).isDirectory())
  .map(f => path.join(toolsDir, f, 'index.html'));

const catToApp = {
  'developer': 'DeveloperApplication',
  'text': 'UtilitiesApplication',
  'image': 'UtilitiesApplication',
  'calculators': 'FinanceApplication'
};

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Extract Name (from h1)
  const nameMatch = content.match(/<h1>(.*?)<\/h1>/);
  const name = nameMatch ? nameMatch[1] : '';

  // Extract URL
  const urlMatch = content.match(/<link rel="canonical" href="(.*?)"/);
  const url = urlMatch ? urlMatch[1] : '';

  // Extract Description (from hero-copy)
  const descMatch = content.match(/<p class="hero-copy">(.*?)<\/p>/);
  const description = descMatch ? descMatch[1] : '';

  // Extract Category from breadcrumbs
  let categoryName = '';
  let categoryUrl = '';
  const breadcrumbMatch = content.match(/<nav class="breadcrumbs"><a href="\/">Home<\/a><span>›<\/span><a href="(\/category\/.*?\/)">(.*?)<\/a><span>›<\/span><span>(.*?)<\/span><\/nav>/);
  if (breadcrumbMatch) {
    categoryUrl = 'https://toolmint.rishibanota.workers.dev' + breadcrumbMatch[1];
    categoryName = breadcrumbMatch[2];
  }
  
  const categoryId = categoryName.toLowerCase();
  const appCat = catToApp[categoryId] || 'WebApplication';

  // Extract FAQs
  const faqRegex = /<details class="faq-item"><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g;
  let faqs = [];
  let match;
  while ((match = faqRegex.exec(content)) !== null) {
    faqs.push({
      "@type": "Question",
      "name": match[1],
      "acceptedAnswer": {
        "@type": "Answer",
        "text": match[2]
      }
    });
  }

  // Build JSON-LD
  const graph = [];
  
  graph.push({
    "@type": "WebApplication",
    "name": name,
    "url": url,
    "applicationCategory": appCat,
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "description": description
  });

  graph.push({
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://toolmint.rishibanota.workers.dev/" },
      { "@type": "ListItem", "position": 2, "name": categoryName, "item": categoryUrl },
      { "@type": "ListItem", "position": 3, "name": name }
    ]
  });

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "mainEntity": faqs
    });
  }

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph
  });

  const scriptTag = `  <script type="application/ld+json">${jsonLd}</script>\n</head>`;
  
  if (!content.includes('application/ld+json')) {
    content = content.replace('</head>', scriptTag);
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
