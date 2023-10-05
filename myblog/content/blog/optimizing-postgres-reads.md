+++
title = "Optimizing Read Queries in PostgreSQL: A Step-by-Step Guide"
date = 2023-10-05
page_template = "blog-page.html"
+++

In a previous role, I honed my skills in optimizing PostgreSQL read queries. The result? A whopping 50% reduction in database costs and, in certain services, I eliminated the need for Redis caching of query results.

This post is mostly relevant to those with heavy read query load where multiple records are returned in each query on tables that also get frequent updates or deletes.

## Main Steps

1. Find your queries that are using the most CPU (heavy queries)

2. Run EXPLAIN on the heavy queries

3. Add basic indexes (if any are missing)

4. Add covering indexes

5. Vacuum and tune vacuum settings

I'll go through these steps in detail in the context of a specific example. We'll also delve deeper into certain steps later on.

## Example Walkthrough

For demonstration purposes, let's consider a table with the following schema and 144,000 records

```sql
CREATE TABLE "cities" (
  "id" serial,
  "name" varchar(255) NOT NULL,
  "state_id" integer NOT NULL,
  "country_code" char(2) NOT NULL,
  "latitude" decimal(10,8) NOT NULL,
  "longitude" decimal(11,8) NOT NULL,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
);
```

The most resource-intensive queries are as follows:

```sql
SELECT latitude, longitude, id FROM cities WHERE country_code = ?
```

We run explain and get this output.   
*Note: for each explain output, I ran it 5 times and took the median to reduce the noise a bit.*

```sql
explain (analyze, buffers) SELECT latitude, longitude, id FROM cities WHERE country_code = 'CA';
```

```sql
Seq Scan on cities  (cost=0.00..3840.89 rows=1055 width=20) (actual time=0.065..32.351 rows=1079 loops=1)
  Filter: ((country_code)::text = 'CA'::text)
  Rows Removed by Filter: 143472
  Buffers: shared hit=2034
Planning Time: 0.338 ms
Execution Time: 32.484 ms
```

We run `\d cities` in the psql terminal to get the current indexes and notice that country_code isn't in the list.

```
Indexes:
    "cities_country_id_idx" btree (country_id)
    "cities_id_idx" UNIQUE, btree (id)
    "cities_state_id_idx" btree (state_id)
```

We see that country_code isn’t indexed. We could change our application to use the `country_id` field or instead we can just add another index. Let's do that.

```sql
CREATE INDEX CONCURRENTLY ON cities (country_code);
```

As expected, it now runs much faster, as expected.

```sql
Index Scan using cities_country_code_idx on cities  (cost=0.29..932.17 rows=1055 width=20) (actual time=0.080..3.141 rows=1079 loops=1)
  Index Cond: ((country_code)::text = 'CA'::text)
  Buffers: shared hit=644
Planning Time: 0.651 ms
Execution Time: 3.275 ms
```

Great! But we’re not done yet though if we want to really optimize things. Let's add a covering index (one where all the data needed by this query is in the index)

```sql
CREATE INDEX CONCURRENTLY ON cities (country_code) INCLUDE (id, latitude, longitude);
```

```sql
Index Scan using cities_country_code_idx on cities  (cost=0.29..932.17 rows=1055 width=20) (actual time=0.073..3.758 rows=1079 loops=1)
  Index Cond: ((country_code)::text = 'CA'::text)
  Buffers: shared hit=644
Planning Time: 0.363 ms
Execution Time: 3.884 ms
```

We end up with similar performance which makes sense since it didn't do an index only query. When there's a lot of dead rows/pages, index only queries aren't as good since it will still need to check most rows for if they're visible (see [covering indexes section](#covering-indexes) below)

 Let's run a vacuum now and also update the table settings to vacuum if more than 1% of the rows are dead (the default is 20%).

```sql
VACUUM cities
ALTER TABLE cities SET (autovacuum_vacuum_scale_factor = 0.01);
```

Now our query is using the index only plan and is super fast and performant. 

```sql
Index Only Scan using cities_country_code_id_latitude_longitude_idx on cities  (cost=0.42..27.55 rows=1036 width=20) (actual time=0.057..0.398 rows=1079 loops=1)
  Index Cond: (country_code = 'CA'::text)
  Heap Fetches: 0
  Buffers: shared hit=11
Planning Time: 0.428 ms
Execution Time: 0.549 ms
```

The clear benefit is a reduction in execution time. I've found that generally execution time highly correlates with CPU usage so in this case so we should similarly see overall CPU usage reduction.

## Finding your queries that are using the most CPU (heavy queries)

* If you're on AWS RDS, leverage the [Performance Insights](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.Overview.html) tool to break down the CPU load by query

* Alternatively, if you connect directly to your Postgres instance (ensure you're connected to a reader in multi-instance setups) and run the following query, you'll get insights into which queries are currently active

```sql
SELECT pid, age(clock_timestamp(), query_start), usename, state, query 
FROM pg_stat_activity 
WHERE query != '<IDLE>' AND state != 'idle' AND query NOT ILIKE '%pg_stat_activity%' 
ORDER BY query_start desc;
```

* You can enable the slow query log inside postgres to have it log queries that take longer than N milliseconds. This approach is great at finding resource heavy queries by duration, but it isn’t helpful at finding queries that are running at a reasonable speed yet are called so frequently that they are worth optimizing. Caution: this logging can add overhead and flood logs if not tuned properly.

## Covering indexes

Usually when Postgres runs a query, it collects data from one or more indexes and then fetches the rows from the main data area (called the heap in Postgres). If we create an index that has all the info needed, then Postgres can avoid accessing the heap at all which saves time and CPU.

**"the visibility bit"**
Postgres uses the [MVCC](https://en.wikipedia.org/wiki/Multiversion_concurrency_control) approach, which means that some records in indexes and the heap may be part of a transaction that hasn't been committed yet. It ensures data consistency when multiple transactions are occurring. It does this by marking records with transaction IDs, so it knows when they should become visible or be hidden. For example, each row has a `xmin` which is the txid when that row should start being visible and an `xmax` which is txid when this should no longer be visible.

**"the visibility map**
PostgreSQL maintains a structure called the "visibility map" for each table. This map has one bit for every page in the table. If all the rows in a page are visible to all transactions (i.e., they are not part of any ongoing or future transaction), the bit for that page is set to "visible."

When performing an index-only scan, PostgreSQL can consult the visibility map. If the bit corresponding to a page is set, then PostgreSQL knows that every row on that page is visible to all transactions. In such cases, there's no need to fetch the page from the heap to check the visibility of individual rows. This can significantly reduce the I/O costs.

This is why running a [vacuum](https://www.postgresql.org/docs/current/sql-vacuum.html) and updating postgres to run vacuums more frequently help reduce resource usage.

## Conclusion

Optimizing read queries in PostgreSQL can lead to significant performance gains and cost savings. By understanding and applying these techniques, you can ensure your databases run efficiently and smoothly.

## More advanced follow ups to come
In upcoming articles, we'll explore advanced techniques such as ensuring optimal buffer cache ratios and optimizing data locality in the Postgres heap.