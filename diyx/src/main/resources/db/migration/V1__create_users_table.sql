CREATE TABLE users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT    NOT NULL,
    password   TEXT    NOT NULL,
    created_at TEXT    NOT NULL,
    CONSTRAINT uq_users_username UNIQUE (username)
);
