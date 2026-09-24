import re

with open('src/lib/data-store.ts', 'r') as f:
    content = f.read()

products = [
  ('besan', 15000, 18000),
  ('black-mustard-oil', 30000, 35000),
  ('coconut-oil', 40000, 45000),
  ('honey', 45000, 50000),
  ('jaggery-powder', 20000, 25000),
  ('khapli-atta', 25000, 30000),
  ('multi-grain-atta', 18000, 22000),
  ('pickle', 22000, 26000)
]

for handle, price, compare in products:
    # Find the line with the handle
    # E.g. "besan": {"id":..., "price":0, ... "available":false, ...}
    
    # We can just replace `"price":0` with `"price":PRICE` and `"available":false` with `"available":true` and `"compare_at_price":null` with `"compare_at_price":COMPARE`
    # but only for that specific line.
    
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if f'"{handle}": {{' in line:
            # Modify the line
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
