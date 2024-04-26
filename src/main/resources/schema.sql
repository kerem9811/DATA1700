-- drop table if exists tickets;
CREATE TABLE if not exists tickets
(
    id        IDENTITY     NOT NULL PRIMARY KEY,
    filmid    INT          NOT NULL,
    film      VARCHAR(50)  NOT NULL,
    amount    INT          NOT NULL CHECK (amount >= 0),
    firstname VARCHAR(50)  NOT NULL,
    lastname  VARCHAR(50)  NOT NULL,
    tel       VARCHAR(20)  NOT NULL,
    email     VARCHAR(100) NOT NULL
);

CREATE TABLE if not exists ticketsjdbc
(
    id        IDENTITY     NOT NULL PRIMARY KEY,
    filmid    INT          NOT NULL,
    film      VARCHAR(50)  NOT NULL,
    amount    INT          NOT NULL CHECK (amount >= 0),
    firstname VARCHAR(50)  NOT NULL,
    lastname  VARCHAR(50)  NOT NULL,
    tel       VARCHAR(20)  NOT NULL,
    email     VARCHAR(100) NOT NULL
);

drop table if exists films;
CREATE TABLE if not exists films
(
    id   identity    not null primary key,
    name varchar(50) not null
);