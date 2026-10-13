from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from app.db.session import Base


# ==========================================
# 1. DSA (Data Structures & Algorithms)
# ==========================================
class DSAProblem(Base):
    __tablename__ = "dsa_problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    topic = Column(String(100), nullable=False, index=True)  # Arrays, Strings, Two Pointers, Trees, Graphs, DP, etc.
    difficulty = Column(String(50), nullable=False)  # Easy, Medium, Hard
    pattern = Column(String(100), nullable=True)  # Sliding Window, Fast & Slow Pointers, BFS/DFS, Top K
    leetcode_url = Column(String(500), nullable=True)
    gfg_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)

    user_progress = relationship("UserDSAProgress", back_populates="problem", cascade="all, delete-orphan")


class UserDSAProgress(Base):
    __tablename__ = "user_dsa_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    problem_id = Column(Integer, ForeignKey("dsa_problems.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="Todo")  # Todo, In Progress, Solved, Needs Revision
    needs_revision = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    solution_code = Column(Text, nullable=True)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="dsa_progress")
    problem = relationship("DSAProblem", back_populates="user_progress")


# ==========================================
# 2. SQL & Database Practice
# ==========================================
class SQLProblem(Base):
    __tablename__ = "sql_problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    topic = Column(String(100), nullable=False, index=True)  # Joins, Window Functions, Aggregations, CTEs, Subqueries
    difficulty = Column(String(50), default="Medium")
    scenario = Column(Text, nullable=True)
    expected_query = Column(Text, nullable=True)
    platform_url = Column(String(500), nullable=True)

    user_progress = relationship("UserSQLProgress", back_populates="problem", cascade="all, delete-orphan")


class UserSQLProgress(Base):
    __tablename__ = "user_sql_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    problem_id = Column(Integer, ForeignKey("sql_problems.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="Todo")  # Todo, Solved
    user_query = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="sql_progress")
    problem = relationship("SQLProblem", back_populates="user_progress")


# ==========================================
# 3. Aptitude & Logical Reasoning
# ==========================================
class AptitudeTopic(Base):
    __tablename__ = "aptitude_topics"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False, index=True)  # Quantitative, Logical Reasoning, Verbal Ability
    topic_name = Column(String(255), nullable=False)
    formula_summary = Column(Text, nullable=True)
    total_suggested_questions = Column(Integer, default=30)

    user_progress = relationship("UserAptitudeProgress", back_populates="topic", cascade="all, delete-orphan")


class UserAptitudeProgress(Base):
    __tablename__ = "user_aptitude_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("aptitude_topics.id", ondelete="CASCADE"), nullable=False, index=True)
    completed_questions = Column(Integer, default=0)
    accuracy_percentage = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="aptitude_progress")
    topic = relationship("AptitudeTopic", back_populates="user_progress")


# ==========================================
# 4. Core Computer Science Subjects
# ==========================================
class CoreSubjectTopic(Base):
    __tablename__ = "core_subject_topics"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(100), nullable=False, index=True)  # Operating Systems, DBMS, Computer Networks, OOP
    topic_name = Column(String(255), nullable=False)
    summary_notes = Column(Text, nullable=True)
    frequent_questions = Column(Text, nullable=True)

    user_progress = relationship("UserCoreProgress", back_populates="topic", cascade="all, delete-orphan")


class UserCoreProgress(Base):
    __tablename__ = "user_core_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("core_subject_topics.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="Not Started")  # Not Started, In Progress, Mastered
    confidence_rating = Column(Integer, default=1)  # 1 to 5
    revision_notes = Column(Text, nullable=True)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="core_progress")
    topic = relationship("CoreSubjectTopic", back_populates="user_progress")
