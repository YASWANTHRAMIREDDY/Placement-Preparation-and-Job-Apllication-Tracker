"""
CLI Script to manually initialize and seed database tables.
Usage: python seed_db.py
"""
import sys
from app.db.session import SessionLocal
from app.db.init_db import init_db

if __name__ == "__main__":
    print("Starting database schema generation and curriculum seeding...")
    db = SessionLocal()
    try:
        init_db(db)
        print("Successfully initialized and seeded database!")
    except Exception as e:
        print(f"Error seeding database: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()
