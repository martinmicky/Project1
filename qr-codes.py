from qrcode import make as qr
import img
from requests import get
from fnmatch import fnmatch

web_addr = ""
while web_addr == "":
    web_addr = input("Vložte adresu webu.:")

while not fnmatch(web_addr, 'https://*') and not fnmatch(web_addr, 'http://*'):
    web_addr = "https://" + web_addr

print(web_addr)
try:
    access = get(web_addr).status_code
    if access == 200:
        print_unactive = "y"
    else:
        print_unactive = "not200"
except:
    print_unactive = input("Web je nedostupný. Pokračovat?(y/n):").lower()

if print_unactive == "not200":
    print_unactive = input("Web je nedostupný. Pokračovat?(y/n):").lower()

if print_unactive == "y":
    img = qr(web_addr)
    img.save(web_addr+".png")