from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

db_url = settings.DATABASE_URL

# Handle dialect-specific connection options
engine_args = {}
if db_url.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}
else:
    # MySQL / PostgreSQL connection pool tuning
    engine_args["pool_pre_ping"] = True
    engine_args["pool_recycle"] = 3600
    engine_args["pool_size"] = 10
    engine_args["max_overflow"] = 20

engine = create_engine(db_url, **engine_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
