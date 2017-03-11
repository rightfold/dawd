BEGIN TRANSACTION;

CREATE DOMAIN username
  AS text
  CHECK (VALUE ~ '^[a-z0-9]+$');

CREATE TABLE users (
  username        username  NOT NULL,
  password_hash   text      NOT NULL,
  PRIMARY KEY (username)
);

COMMIT TRANSACTION;
