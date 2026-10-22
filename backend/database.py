"""Connection adapter for SQLite in development and persistent PostgreSQL on Render.

The production database is selected with DATABASE_URL. SQLite remains the
development/test fallback. This adapter supports the small SQLite query subset
used by the existing E-Motion backend without a disruptive endpoint rewrite.
"""
import os
import re
import sqlite3


class CompatibleRow(dict):
    """SQLite Row-like access, both row["column"] and row[0]."""

    def __getitem__(self, key):
        if isinstance(key, int):
            return tuple(self.values())[key]
        return super().__getitem__(key)


def _make_row_factory(cursor):
    # Psycopg also constructs a row maker for statements with no result rows
    # (CREATE TABLE, INSERT without RETURNING, UPDATE). 
    if cursor.description is None:
        return lambda values: values
    names = [item.name for item in cursor.description]

    def make_row(values):
        return CompatibleRow(zip(names, values))

    return make_row


def _postgres_sql(query):
    # Current app has no literal '?' tokens in SQL strings. All ? are bindings.
    query = query.replace("?", "%s")
    query = re.sub(
        r"\bINTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT\b",
        "SERIAL PRIMARY KEY", query, flags=re.IGNORECASE,
    )
    # All backend "read" flags are stored as integer 0/1, not PG booleans.
    query = re.sub(r"\bBOOLEAN\b", "INTEGER", query, flags=re.IGNORECASE)
    # `desc` is a reserved SQL sorting keyword in PostgreSQL; in E-Motion
    # it is also an existing SQLite notification column.
    query = re.sub(r"\bdesc(?=\s+TEXT\b)", '"desc"', query, flags=re.IGNORECASE)
    query = re.sub(r"([,(]\s*)desc(?=\s*,)", r'\1"desc"', query, flags=re.IGNORECASE)
    query = re.sub(
        r"\bDATE\('now',\s*'localtime'\)",
        "(CURRENT_DATE::text)", query, flags=re.IGNORECASE,
    )
    query = re.sub(
        r"\bDATETIME\('now'\)",
        "to_char(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS')",
        query, flags=re.IGNORECASE,
    )
    return query


class PostgresCursorAdapter:
    def __init__(self, connection):
        self._connection = connection
        self._cursor = connection._conn.cursor(row_factory=_make_row_factory)

    def execute(self, statement, params=()):
        import psycopg

        try:
            query = _postgres_sql(statement)
            # PostgreSQL syntax may contain literal '%' characters in seeded
            # strings. Psycopg interprets them only when params are supplied.
            if params:
                self._cursor.execute(query, params)
            else:
                self._cursor.execute(query)
        except psycopg.IntegrityError as exc:
            # Existing Flask endpoints handle sqlite3.IntegrityError.
            self._connection._conn.rollback()
            raise sqlite3.IntegrityError(str(exc).splitlines()[0]) from exc
        return self

    def fetchone(self):
        return self._cursor.fetchone()

    def fetchall(self):
        return self._cursor.fetchall()

    @property
    def rowcount(self):
        return self._cursor.rowcount

    def close(self):
        self._cursor.close()


class PostgresConnectionAdapter:
    def __init__(self, dsn, schema):
        import psycopg
        from psycopg import sql

        if not re.fullmatch(r"[a-z][a-z0-9_]{0,62}", schema):
            raise ValueError("E_MOTION_DB_SCHEMA must be a safe lowercase SQL identifier")

        self._conn = psycopg.connect(dsn, connect_timeout=10)
        if schema != "public":
            with self._conn.cursor() as cursor:
                cursor.execute(
                    sql.SQL("CREATE SCHEMA IF NOT EXISTS {}").format(sql.Identifier(schema))
                )
                cursor.execute(
                    sql.SQL("SET search_path TO {}").format(sql.Identifier(schema))
                )
            self._conn.commit()

    def cursor(self):
        return PostgresCursorAdapter(self)

    def execute(self, statement, params=()):
        return self.cursor().execute(statement, params)

    def executescript(self, script):
        # Only called for static CREATE TABLE statements in user_data.py.
        for statement in script.split(";"):
            if statement.strip():
                self.execute(statement)

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()


def connect_database(sqlite_filename):
    dsn = os.getenv("DATABASE_URL", "").strip()
    if dsn:
        return PostgresConnectionAdapter(
            dsn, os.getenv("E_MOTION_DB_SCHEMA", "public")
        )

    connection = sqlite3.connect(sqlite_filename)
    connection.row_factory = sqlite3.Row
    return connection
