import sys
import json
import re

def extract_meta(content):
    desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', content)
    description = desc_match.group(1) if desc_match else ""
    title_match = re.search(r'<title>([^<]+)</title>', content)
    title = title_match.group(1) if title_match else ""
    return title, description

def add_jsonld(filepath, jsonld_content):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '</head>' in content:
        content = content.replace('</head>', f'<script type="application/ld+json">\n{jsonld_content}\n</script>\n</head>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')
    else:
        print(f'Failed to find </head> in {filepath}')

def process_homepage():
    home_json = '{"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"ToolMint","url":"https://toolmint.rishibanota.workers.dev/","potentialAction":{"@type":"SearchAction","target":"https://toolmint.rishibanota.workers.dev/?q={search_term_string}","query-input":"required name=search_term_string"}},{"@type":"Organization","name":"ToolMint","url":"https://toolmint.rishibanota.workers.dev/","logo":"https://toolmint.rishibanota.workers.dev/assets/favicon.svg"}]}'
    add_jsonld('public/index.html', home_json)

def process_categories():
    categories = [
        ('public/category/developer/index.html', 'Developer & Data', 'https://toolmint.rishibanota.workers.dev/category/developer/'),
        ('public/category/text/index.html', 'Text Utilities', 'https://toolmint.rishibanota.workers.dev/category/text/'),
        ('public/category/image/index.html', 'Image Utilities', 'https://toolmint.rishibanota.workers.dev/category/image/'),
        ('public/category/calculators/index.html', 'Calculators', 'https://toolmint.rishibanota.workers.dev/category/calculators/')
    ]
    
    for filepath, name, url in categories:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        title, description = extract_meta(content)
        data = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "name": title or name,
                    "url": url,
                    "description": description or f"Browser-based {name.lower()} tools on ToolMint."
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://toolmint.rishibanota.workers.dev/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": name
                        }
                    ]
                }
            ]
        }
        add_jsonld(filepath, json.dumps(data, separators=(',', ':')))

def process_statics():
    statics = [
        ('public/about/index.html', 'About', 'https://toolmint.rishibanota.workers.dev/about/'),
        ('public/contact/index.html', 'Contact', 'https://toolmint.rishibanota.workers.dev/contact/'),
        ('public/privacy/index.html', 'Privacy Policy', 'https://toolmint.rishibanota.workers.dev/privacy/'),
        ('public/terms/index.html', 'Terms of Use', 'https://toolmint.rishibanota.workers.dev/terms/')
    ]
    
    for filepath, name, url in statics:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        title, description = extract_meta(content)
        data = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebPage",
                    "name": title or name,
                    "url": url,
                    "description": description or f"{name} page for ToolMint."
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://toolmint.rishibanota.workers.dev/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": name
                        }
                    ]
                }
            ]
        }
        add_jsonld(filepath, json.dumps(data, separators=(',', ':')))

if __name__ == "__main__":
    process_homepage()
    process_categories()
    process_statics()
