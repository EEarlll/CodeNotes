import json
import string
import random

# Constants for mock data
TITLE = "Note Title - "
USER = "example@gmail.com"
CATEGORY = "test infinite scroll"
MESSAGE = "Note content #"
FORMAT = "markdown"
PIN = 0
DATE = "2024-10-21 13:30:38.969680"
UID = "qwklekngqkwnevkwnqevq"
SQL_FILE_PATH = "mockItems.sql"


def generate_mock_data(entries=100, sql_file=SQL_FILE_PATH):
    """
    Generates mock SQL data for `tdn_Notes` table and writes it to `mockItems.sql`.

    Parameters:
        entries (int): The number of mock entries to generate.
        sql_file (str): The path to the SQL file to write to.
    """
    try:
        with open(sql_file, "x") as f:
            for i in range(entries):
                content = "".join(random.choices(string.ascii_letters, k=1000))
                f.write(
                    f"INSERT INTO tdn_Notes(title, user, category, message, DateCreated, pin, format, uid) "
                    f"VALUES('{TITLE + str(i)}', '{USER}', '{CATEGORY}', '{content + str(i)}', '{DATE}', {PIN}, '{FORMAT}', '{UID}');\n"
                )
        print(f"Mock data written to {sql_file}")
    except FileExistsError:
        print(
            f"File '{sql_file}' already exists. Please delete it or use a different file name."
        )


def service_to_env(
    service_account_path="server/flaskr/serviceAccount.json", env_file=".env"
):
    """
    Loads service account credentials from a JSON file and writes them to an `.env` file.

    Parameters:
        service_account_path (str): The path to the service account JSON file.
        env_file (str): The path to the `.env` file to write to.
    """
    try:
        with open(service_account_path, "r") as json_file:
            data = json.load(json_file)

        with open(env_file, "x") as env_file:
            for key, val in data.items():
                env_file.write(f"{key.upper()}={val}\n")
        print(f"Environment variables written to {env_file}")
    except FileExistsError:
        print(
            f"File '{env_file}' already exists. Please delete it or use a different file name."
        )
    except FileNotFoundError:
        print(f"Service account file '{service_account_path}' not found.")
    except json.JSONDecodeError:
        print(f"Error decoding JSON from '{service_account_path}'.")


# Uncomment the following lines to generate mock data or create .env from service account
# generate_mock_data()
# service_to_env()
