CREATE TABLE portfolios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT    NOT NULL,
    stocks     TEXT    NOT NULL DEFAULT '{}',
    created_at TEXT    NOT NULL,
    updated_at TEXT    NOT NULL,
    CONSTRAINT uq_portfolios_user_name UNIQUE (user_id, name)
);
