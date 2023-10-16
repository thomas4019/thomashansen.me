+++
title = "Choosing a backend database: SQL vs Document vs Columnar"
date = 2023-10-15
page_template = "blog-page.html"
[extra]
image = "https://www.thomashansen.me/images/dbs_venn_diagram.png"
+++

There's a bunch of different databases once can choose and overtime as features have been added they seem more similar. Here's a venn diagram showing which features are shared and which are unique.

![features shared: ACID, Secondary Indexes, JSON. SQL and columnar: schemas. SQL and document: aggregate queries and unique indexes.](/images/dbs_venn_diagram.png)

## Guidelines

If you want join queries → use SQL.

If you want a deep document model and partial updates → then use a document database

If you want to be schemaless → this should not be a deciding criteria, since SQL databases now support JSON columns

If you mostly only do writes and need huge scale → use a column DB

Whether or not one uses a NoSQL database, many of the principles of NoSQL/document databases are helpful when designing an application. For example, ask yourself, how could I design a system where I wouldn’t need to use joins.

## Database notes

**MongoDB:** Nice for prototyping since it's so easy to use without schemas. It's very easy to end up with inconsistent data over time since the DB doesn't enforce much and people often don't do proper data migrations. Large nested document structures is great for data locality.

**PostgreSQL and MySQL:** Over time, these have become more similar e.g. both allow adding columns without locking, json columns, common table expressions and unicode. Note: there is a standard for SQL, but no DB implements it exactly, so inevitably your application will end up using quicks of the DB you choose.

**DynamoDB:** This is an Amazon proprietary DB. It's a cost effective option for write heavy workloads that you want to able to scale indefinitely.