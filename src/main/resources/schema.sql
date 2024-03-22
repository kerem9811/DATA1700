drop table if exists ticket;
CREATE TABLE ticket
(
    id        IDENTITY NOT NULL PRIMARY KEY,
    film      VARCHAR(50)  NOT NULL,
    amount    INT          NOT NULL CHECK (amount >= 0),
    firstname VARCHAR(50)  NOT NULL,
    lastname  VARCHAR(50)  NOT NULL,
    tel       VARCHAR(20)  NOT NULL,
    email     VARCHAR(100) NOT NULL
);