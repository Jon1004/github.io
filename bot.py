from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import json

options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.binary_location = '/usr/bin/chromium-browser'

driver = webdriver.Chrome(options=options)

search_url = "https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=social%20d%C3%A9partemental%20formateur"
donnees_finales = []
try:
    print("Lancement du bot...")
    driver.get(search_url)
    time.sleep(5)
    
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    results_container = soup.find('div', class_='container-result')
    if results_container:
        offres_list = results_container.find_all('div', class_='card-offer')
        print(f"Trouvé {len(offres_list)} offres sur la page principale.")
        for offre_card in offres_list:
            titre_element = offre_card.find('h2', class_='card-title')
            titre = titre_element.text.strip() if titre_element else ""
            if titre:
                lien_element = offre_card.find_parent('a')
                lien_relatif = lien_element['href'] if lien_element else ''
                lien_complet = "https://www.apec.fr" + lien_relatif if lien_relatif else ""
                entreprise_element = offre_card.find('p', class_='card-offer
