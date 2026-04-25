"""Verify that the Patrick Pitot schema exists in PostgreSQL."""

from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path

import psycopg2


def load_migration_helpers():
    helper_path = Path(__file__).with_name("apply-db-migration.py")
    spec = importlib.util.spec_from_file_location("apply_db_migration", helper_path)
    if spec is None or spec.loader is None:
        raise RuntimeError("Cannot load migration helper")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--env", type=Path, required=True)
    args = parser.parse_args()

    helpers = load_migration_helpers()
    env_values = helpers.load_env(args.env)

    with psycopg2.connect(helpers.database_url(env_values)) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'patrick_pitot'
                ORDER BY table_name
                """
            )
            tables = [row[0] for row in cursor.fetchall()]

            cursor.execute("SELECT count(*) FROM patrick_pitot.material")
            materials_count = cursor.fetchone()[0]

            cursor.execute("SELECT count(*) FROM patrick_pitot.product")
            products_count = cursor.fetchone()[0]

    print("tables=" + ", ".join(tables))
    print(f"materials={materials_count}")
    print(f"products={products_count}")


if __name__ == "__main__":
    main()
