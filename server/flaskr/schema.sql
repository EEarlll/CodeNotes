CREATE TABLE tdn_Notes(
    id INTEGER PRIMARY KEY,
    title TEXT,
    user TEXT,
    category TEXT,
    [message] TEXT,
    format TEXT,
    [uid] TEXT,
    DateCreated TEXT
);

CREATE TABLE tdn_Categories(
    id INTEGER PRIMARY KEY,
    title TEXT,
    user TEXT,
    [uid] TEXT,
    DateCreated TEXT
);

CREATE TABLE tdn_Pins(
    id INTEGER PRIMARY KEY,
    [uid] TEXT,
    user TEXT,
    note_id INTEGER,
    FOREIGN KEY (note_id) REFERENCES tdn_Notes(id)
);


-- DROP TABLE tdn_Notes;
-- CREATE TABLE tdn_Notes(
--     id INTEGER PRIMARY KEY,
--     title TEXT,
--     user TEXT,
--     category TEXT,
--     [message] TEXT,
--     format TEXT,
--     pin INT,
--     [uid] TEXT,
--     DateCreated TEXT
-- );

-- CREATE TABLE Categories(
--     id INTEGER PRIMARY KEY,
--     title TEXT,
--     user TEXT,
--     DateCreated TEXT
-- );

-- ALTER TABLE Notes RENAME TO tdn_Notes;
-- ALTER TABLE Categories RENAME TO tdn_Categories;
-- ALTER TABLE tdn_Notes ADD COLUMN pinID INT;
-- ALTER TABLE tdn_Notes ADD COLUMN [uid] TEXT;
-- ALTER TABLE tdn_Categories ADD COLUMN [uid] TEXT;

-- DELETE FROM tdn_Categories;
-- DELETE FROM tdn_Notes;


-- ALTER TABLE tdn_Notes DROP pin;
-- DROP TABLE tdn_Pins;
-- CREATE TABLE tdn_Pins(
--     id INTEGER PRIMARY KEY,
--     [uid] TEXT,
--     user TEXT,
--     note_id INTEGER,
--     FOREIGN KEY (note_id) REFERENCES tdn_Notes(id)
-- );


-- ALTER TABLE tdn_Pins ADD COLUMN id INT FOREIGN KEY (id) REFERENCES tdn_Notes(id);


