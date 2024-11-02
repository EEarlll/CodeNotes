import json
import os

# using random.choices() generating random strings


print(os.getcwd())
data = json.load(open("server/flaskr/serviceAccount.json"))

f = open(".env", "x")

for key,val in data.items():
    f.write(f"{key.upper()}={val}\n")

import string
import random

# title = "Note Title - "
# user = "earleustacio@gmail.com"
# category = "test infinite scroll"
# message = "Note content #"
# format = "markdown"
# pin = 0
# date = "2024-10-21 13:30:38.969680"
# uid = "Z5DvJUai5VhjT2HCuYr9Ynjylel1"

# f = open("mockItems.sql", "x")

# for i in range(100):
#     res = "".join(random.choices(string.ascii_letters, k=1000))
#     f.write(
#         f"INSERT INTO tdn_Notes(title, user, category, message, DateCreated, pin, format, uid) VALUES('{title + str(i)}', '{user}', '{category}', '{res + str(i)}', '{date}', {0}, '{format}', '{uid}');\n"
#     )


# INSERT INTO tdn_Notes(title, user, category, message, DateCreated, pin, format, uid) VALUES(?, ?, ?, ?, ?, ?, ?, ?)
