import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from neo4j import GraphDatabase
from geopy.distance import geodesic
from geopy.geocoders import Nominatim
import os
from dotenv import load_dotenv

load_dotenv()

NUMBER_PEOPLES = 10

driver = GraphDatabase.driver(os.getenv("DATABASE_URL_CONNECTION"), auth=(
    os.getenv("DATABASE_USERNAME"), os.getenv("DATABASE_PASSWORD")))


def add_states_to_neo4j():
    with driver.session() as session:
        # create a list of state names and abbreviations
        states = {
            "AC": "Acre",
            "AL": "Alagoas",
            "AP": "Amapá",
            "AM": "Amazonas",
            "BA": "Bahia",
            "CE": "Ceará",
            "DF": "Distrito Federal",
            "ES": "Espírito Santo",
            "GO": "Goiás",
            "MA": "Maranhão",
            "MT": "Mato Grosso",
            "MS": "Mato Grosso do Sul",
            "MG": "Minas Gerais",
            "PA": "Pará",
            "PB": "Paraíba",
            "PR": "Paraná",
            "PE": "Pernambuco",
            "PI": "Piauí",
            "RJ": "Rio de Janeiro",
            "RN": "Rio Grande do Norte",
            "RS": "Rio Grande do Sul",
            "RO": "Rondônia",
            "RR": "Roraima",
            "SC": "Santa Catarina",
            "SP": "São Paulo",
            "SE": "Sergipe",
            "TO": "Tocantins"
        }

        # create a Node object for each state and add it to the graph
        for abbreviation, name in states.items():
            session.run("""
                MERGE (s:State {abbreviation: $abbreviation, name: $name, country: 'Brasil'})
            """, abbreviation=abbreviation, name=name)


def add_city_to_neo4j():
    df = pd.read_csv('people.csv', sep=';')

    unique_rows = df.drop_duplicates(subset='City', keep='first')

    uniques_city = unique_rows[['City', 'State']]

    with driver.session() as session:
        for city, state in uniques_city.values:
            session.run("""
                MATCH (s:State {abbreviation: $state})
                MERGE (c:City {name: $city})
                MERGE (s)-[:HAS_CITY]->(c)
            """, city=city, state=state)


def add_people_to_neo4j():
    df = pd.read_csv('people.csv', sep=';')

    rows = df.values.tolist()
    with driver.session() as session:
        for name, birthday, cpf, cns, rg, email, cell, cep, address, neighborhood, city_name, city_state in rows:
            # Create the person node and return id
            people_id = session.run("""
                CREATE (p:People {name: $name, birthday: $birthday, cpf: $cpf, cns: $cns, rg: $rg, email: $email, 
                                   cell: $cell, cep: $cep, address: $address, neighborhood: $neighborhood})
                RETURN ID(p)
            """, name=name, birthday=birthday, cpf=cpf, cns=cns, rg=rg, email=email, cell=cell, cep=cep,
                                    address=address, neighborhood=neighborhood).single()[0]

            # Retrieves the corresponding city id and return
            city_id = session.run("""
                MATCH (c:City {name: $city_name})
                RETURN ID(c)
            """, city_name=city_name).single()[0]

            # Creates the relationship between the people and the city
            session.run("""
                MATCH (p:People), (c:City)
                WHERE id(p) = $people_id AND id(c) = $city_id
                CREATE (p)-[:LIVES_IN]->(c)
            """, people_id=people_id, city_id=city_id)


def add_distance_city_to_neo4j():
    # Read data from CSV file
    df = pd.read_csv('people.csv', sep=';')

    # Removes duplicate lines keeping only the first occurrence of each city
    unique_rows = df.drop_duplicates(subset='City', keep='first')

    # Selects City and State columns
    uniques_city = unique_rows[['City', 'State']]

    print(uniques_city)

    geolocator = Nominatim(user_agent="my-custom-user-agent")

    with driver.session() as session:

        for city1 in uniques_city.itertuples(index=False):
            for city2 in uniques_city.itertuples(index=False):
                if city1 != city2:

                    city1aux = geolocator.geocode(city1[0] + ", Brazil")

                    city2aux = geolocator.geocode(city2[0] + ", Brazil")

                    distance = geodesic(
                        (city1aux.latitude, city1aux.longitude), (city2aux.latitude, city2aux.longitude)).km

                    city1_id = session.run("""
                        MATCH (c:City {name: $city_name})
                        RETURN ID(c)
                    """, city_name=city1[0]).single()[0]

                    city2_id = session.run("""
                        MATCH (c:City {name: $city_name})
                        RETURN ID(c)
                    """, city_name=city2[0]).single()[0]

                    session.run("""
                         MATCH (p:City), (c:City)
                         WHERE id(p) = $city1_id AND id(c) = $city2_id
                         CREATE (p)-[r:DISTANCE_KM {distance: $distance}]->(c)
                     """, city1_id=city1_id, city2_id=city2_id, distance=distance)

                else:
                    continue


def scrape_person():
    # create an instance of the Chrome driver
    driver = webdriver.Chrome()

    # access the generator page
    driver.get("https://geradornv.com.br/gerador-pessoas/")
    time.sleep(2)  # wait for the page to load

    # create an empty DataFrame to store the data
    columns = ['Name', 'Birthday', 'CPF', 'CNS', 'RG', 'Email', 'Cellphone', 'CEP', 'Address', 'Neighborhood', 'City',
               'State']
    df = pd.DataFrame(columns=columns)

    while True:  # loop until all data is scraped successfully
        try:
            # loop 50 times to extract data for 50 different people
            for i in range(NUMBER_PEOPLES):
                # find the "Gerar Pessoa" button
                generate_person_btn = driver.find_element(
                    By.ID, "nv-new-generator-people")

                # click the "Gerar Pessoa" button
                generate_person_btn.click()
                # time.sleep(1)  # wait for the new person to be generated

                # extract the data from each field
                name = driver.find_element(By.ID, "nv-field-name").text
                birthday = driver.find_element(By.ID, "nv-field-birthday").text
                cpf = driver.find_element(By.ID, "nv-field-cpf").text
                cns = driver.find_element(By.ID, "nv-field-cns").text
                rg = driver.find_element(By.ID, "nv-field-rg").text
                email = driver.find_element(By.ID, "nv-field-email").text
                cell = driver.find_element(By.ID, "nv-field-cellphone").text
                cep = driver.find_element(By.ID, "nv-field-cep").text
                address = driver.find_element(By.ID, "nv-field-street").text
                neighborhood = driver.find_element(
                    By.ID, "nv-field-neighborhood").text
                city = driver.find_element(By.ID, "nv-field-city").text
                state = driver.find_element(By.ID, "nv-field-state").text

                # add the data to the DataFrame
                person = pd.DataFrame(
                    [[name, birthday, cpf, cns, rg, email, cell,
                        cep, address, neighborhood, city, state]],
                    columns=columns)

                df = pd.concat([df, person], ignore_index=True)

            # if all data is scraped successfully, break the while loop
            break
        except:
            # if any exception is raised, print the error message and try the loop again
            print("Error occurred while scraping. Retrying...")
            continue

    # close the browser
    driver.quit()

    # save the data to a CSV file with semicolon separator and UTF-8 encoding
    df.to_csv('people.csv', sep=';', index=False, encoding='utf-8-sig')


if __name__ == '__main__':
    scrape_person()
    add_states_to_neo4j()
    add_city_to_neo4j()
    add_people_to_neo4j()
    add_distance_city_to_neo4j()
