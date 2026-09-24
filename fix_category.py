import re

with open('src/components/home/CategoryExperience.tsx', 'r') as f:
    content = f.read()

content = content.replace('"COMING SOON"', '"AVAILABLE NOW"')

with open('src/components/home/CategoryExperience.tsx', 'w') as f:
    f.write(content)
