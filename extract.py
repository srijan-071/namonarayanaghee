import urllib.request
from bs4 import BeautifulSoup
import json
import re

url = "https://namonarayana.com/products/pure-a2-gir-cow-ghee-500-ml"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')

items = []
for item in soup.find_all(class_='nn-fth__featured'):
    step = item.find(class_='nn-fth__step').text.strip() if item.find(class_='nn-fth__step') else ""
    title = item.find(class_='nn-fth__item-heading').text.strip() if item.find(class_='nn-fth__item-heading') else ""
    desc = item.find(class_='nn-fth__item-desc').text.strip() if item.find(class_='nn-fth__item-desc') else ""
    
    pills = []
    for pill in item.find_all(class_='nn-fth__pill'):
        pills.append(pill.text.strip())
        
    img_tag = item.find('img')
    video_tag = item.find('video')
    
    media_url = ""
    is_video = False
    if video_tag and video_tag.find('source'):
        media_url = video_tag.find('source')['src']
        is_video = True
    elif img_tag and img_tag.has_attr('src'):
        media_url = img_tag['src']
    elif img_tag and img_tag.has_attr('data-src'):
        media_url = img_tag['data-src']
        
    if media_url.startswith('//'):
        media_url = 'https:' + media_url
    
    items.append({
        'step': step,
        'title': title,
        'desc': desc,
        'pills': pills,
        'media': media_url,
        'isVideo': is_video
    })

with open('src/lib/journey-data.ts', 'w') as f:
    f.write('export const JOURNEY_STEPS = ' + json.dumps(items, indent=2) + ';\n')
print("Extracted", len(items), "items")
