
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(48) NOT NULL UNIQUE,
    hash VARCHAR(128) NOT NULL,
    registration BIGINT NOT NULL
);

CREATE TABLE web_activity
(
    userid INT,
    time_stamp BIGINT,
    domain text,
    faviconUrl text,
    PRIMARY KEY (userid, time_stamp)
);