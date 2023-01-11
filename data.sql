DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies_industries;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('shell', 'Shell plc', 'British multinational company.'),
         ('3m', '3M', 'Minnesota Mining and Manufacturing Company.');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null),
         ('shell', 200, false, null),
         ('shell', 300, true, '2020-08-01'),
         ('3m', 400, false, null);

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

INSERT INTO industries
  VALUES ('tech', 'Technology'),
         ('oil', 'Oil & Gas'),
         ('health', 'Healthcare'),
         ('goods', 'Consumer Goods');

CREATE TABLE companies_industries (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    ind_code text NOT NULL REFERENCES industries ON DELETE CASCADE
);

INSERT INTO companies_industries (comp_code, ind_code)
  VALUES ('apple', 'tech'),
         ('ibm', 'tech'),
         ('shell', 'oil'),
         ('3m', 'health'),
         ('3m', 'goods');