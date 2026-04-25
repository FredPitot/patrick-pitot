r"""Apply a SQL migration using DB settings from an env file.

Usage:
  python scripts/apply-db-migration.py db/migrations/001_patrick_pitot_schema.sql ^
    --env ..\pitsbi-gears\backend\.env
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path
from urllib.parse import quote_plus

import psycopg2


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def database_url(values: dict[str, str]) -> str:
    explicit = values.get("DATABASE_URL") or os.environ.get("DATABASE_URL")
    if explicit:
        if explicit.startswith("postgres://"):
            return "postgresql://" + explicit[len("postgres://") :]
        return explicit

    host = values.get("DB_HOST", os.environ.get("DB_HOST", "localhost"))
    port = values.get("DB_PORT", os.environ.get("DB_PORT", "5432"))
    user = values.get("DB_USER", os.environ.get("DB_USER", "user"))
    password = values.get("DB_PASSWORD", os.environ.get("DB_PASSWORD", "password"))
    name = values.get("DB_NAME", os.environ.get("DB_NAME", "postgres"))
    return f"postgresql://{quote_plus(user)}:{quote_plus(password)}@{host}:{port}/{name}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("migration", type=Path)
    parser.add_argument("--env", type=Path, required=True)
    args = parser.parse_args()

    if not args.env.exists():
        raise SystemExit(f"Env file not found: {args.env}")
    if not args.migration.exists():
        raise SystemExit(f"Migration file not found: {args.migration}")

    env_values = load_env(args.env)
    sql = args.migration.read_text(encoding="utf-8")

    with psycopg2.connect(database_url(env_values)) as connection:
        with connection.cursor() as cursor:
            cursor.execute(sql)
        connection.commit()

    print(f"Migration applied: {args.migration}")


if __name__ == "__main__":
    main()
