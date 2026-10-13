from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    college = Column(String(255), nullable=True)
    branch = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    cgpa = Column(Float, nullable=True)
    target_role = Column(String(255), default="Software Development Engineer (SDE)")
    target_ctc = Column(String(100), default="12 LPA")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    applications = relationship(
        "JobApplication", back_populates="user", cascade="all, delete-orphan"
    )
    dsa_progress = relationship(
        "UserDSAProgress", back_populates="user", cascade="all, delete-orphan"
    )
    sql_progress = relationship(
        "UserSQLProgress", back_populates="user", cascade="all, delete-orphan"
    )
    aptitude_progress = relationship(
        "UserAptitudeProgress", back_populates="user", cascade="all, delete-orphan"
    )
    core_progress = relationship(
        "UserCoreProgress", back_populates="user", cascade="all, delete-orphan"
    )
