import re

with open('src/lib/data-store.ts', 'r') as f:
    content = f.read()

products = [
  ('rogan-badam-oil', 50000, 60000),
  ('yellow-mustard-oil', 28000, 32000),
]

for handle, price, compare in products:
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if f'"{handle}": {{' in line:
            line = line.replace('"price":0', f'"price":{price}')
            line = line.replace('"price_min":0', f'"price_min":{price}')
            line = line.replace('"price_max":0', f'"price_max":{price}')
            line = line.replace('"available":false', '"available":true')
            line = line.replace('"compare_at_price":null', f'"compare_at_price":{compare}')
            line = line.replace('"compare_at_price_min":0', f'"compare_at_price_min":{compare}')
            line = line.replace('"compare_at_price_max":0', f'"compare_at_price_max":{compare}')
            
            lines[i] = line
            break
    content = '\n'.join(lines)

with open('src/lib/data-store.ts', 'w') as f:
    f.write(content)
