CREATE TABLE clients (
    id_client SERIAL PRIMARY KEY,
    customer_name VARCHAR(50) NOT NULL,
    identification INT NOT NULL UNIQUE,
    address VARCHAR(100) NOT NULL,
    phone_number VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL
);

CREATE TABLE transactions (
    id_transaction VARCHAR(15) PRIMARY KEY,
    date_time TIMESTAMP NOT NULL,
    transaction_amount INT NOT NULL,
    state VARCHAR(25) CHECK (LOWER(state) IN ('pendiente', 'fallida', 'completada')),
    transaction_type VARCHAR(50) NOT NULL
);

CREATE TABLE billing (
    id_billing INT PRIMARY KEY,
    id_transaction VARCHAR(15) NOT NULL,
    id_client INT NOT NULL,
    used_platform VARCHAR(100),
    billing_period varchar(30) NOT NULL,
    invoice_amount BIGINT NOT NULL,
    amount_paid BIGINT NOT NULL,
    FOREIGN KEY (id_transaction) REFERENCES transactions(id_transaction),
    FOREIGN KEY (id_client) REFERENCES clients(id_client)
);

select *from clients;
select *from transactions;
select *from billing;
