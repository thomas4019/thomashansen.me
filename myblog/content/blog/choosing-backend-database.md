+++
title = "Choosing a backend database: SQL vs Document vs Columnar"
date = 2023-10-15
page_template = "blog-page.html"
[extra]
image = "https://www.thomashansen.me/images/dbs_venn_diagram.png"
+++

In the evolving landscape of databases, the lines distinguishing one type from another have blurred as features converge. How do you pick the right one for your needs? Here's a venn diagram showing which features are shared and which are unique.

![Venn Diagram highlighting shared features among databases: All databases (ACID, Secondary Indexes, JSON), SQL & Columnar (schemas), SQL & Document (aggregate queries and unique indexes).](/images/dbs_venn_diagram.png)

## Guidelines

**Join Queries**: Opt for SQL databases if relational data handling is crucial.

**Deep Document Model**: Choose a document database for intricate document structures and partial updates.

**Schema Flexibility**: While the allure of schemalessness might steer you towards NoSQL, keep in mind that modern SQL databases offer JSON column support.

**Write-Heavy Workloads**: If your primary operation is writing and you require scalability, a columnar DB might be your best bet.

Whether or not one uses a NoSQL database, many of the principles of NoSQL/document databases are helpful when designing an application. For example, ask yourself, how could I design a system where I wouldn’t need to use joins.

## Database notes

**MongoDB:** Nice for prototyping since it's so easy to use without schemas. It's very easy to end up with inconsistent data over time since the DB doesn't enforce much and people often don't do proper data migrations. Large nested document structures is great for data locality.

**PostgreSQL and MySQL:** Over time, these have become more similar e.g. both allow adding columns without locking, json columns, common table expressions and unicode. Note: While there is a standard for SQL, no database adheres to it perfectly. As a result, your application may inherit quirks specific to the database you select.

**DynamoDB:** This is an Amazon proprietary DB. It's a cost effective option for write heavy workloads that you want to able to scale indefinitely.

