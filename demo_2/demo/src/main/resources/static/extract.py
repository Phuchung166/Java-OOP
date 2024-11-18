import os

# Read file from province.txt
#PAth: C:\Users\ADMIN\OneDrive - ptit.edu.vn\demo_2\demo\src\main\resources\static\province.txt
# Output: html_code.txt
with open('C:/Users/ADMIN/OneDrive - ptit.edu.vn/demo_2/demo/src/main/resources/static/province.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Open file to write html code

with open('C:/Users/ADMIN/OneDrive - ptit.edu.vn/demo_2/demo/src/main/resources/static/html_code.txt', 'w', encoding='utf-8') as f:
    f.write('<ul>\n')
    # Loop through each line in the file
    for line in lines:
        # Remove the newline character at the end of the line
        line = line.strip()
        # Extract id province
        id_province = line[:3]
        # Extract name province
        name_province = line[3:]
        f.write(f'<li><label><input type="checkbox" class="child-checkbox auto-submit-checkbox" name="cities" id="city_{id_province}" value="{id_province}">{name_province}</label></li>\n')
    f.write('</ul>')

# Read file from html_code.txt
# Output: html_code.txt

with open('C:/Users/ADMIN/OneDrive - ptit.edu.vn/demo_2/demo/src/main/resources/static/html_code.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for line in lines:
        print(line.strip())


