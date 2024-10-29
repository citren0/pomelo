
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

CREATE TABLE roles
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL
);

CREATE TABLE user_to_role
(
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT role_id_fk FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE email_verification
(
    user_id INT,
    token text,
    PRIMARY KEY (user_id, token),
    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE forgot_password
(
    user_id INT,
    token text,
    time_stamp BIGINT,
    PRIMARY KEY (user_id, token),
    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE forgot_password_attempts
(
    user_id INT,
    time_stamp BIGINT,
    success BOOLEAN,
    PRIMARY KEY (user_id, time_stamp),
    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE login_attempts
(
    user_id INT,
    time_stamp BIGINT,
    success BOOLEAN,
    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

insert into roles (name) values
    ('Verified'),
    ('Admin');