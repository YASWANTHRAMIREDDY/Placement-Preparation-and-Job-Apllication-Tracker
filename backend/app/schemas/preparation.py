from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


# =====================
# DSA Schemas
# =====================
class DSAProblemItem(BaseModel):
    id: int
    title: str
    topic: str
    difficulty: str
    pattern: Optional[str] = None
    leetcode_url: Optional[str] = None
    gfg_url: Optional[str] = None
    description: Optional[str] = None

    # User progress fields
    status: str = "Todo"  # Todo, In Progress, Solved
    needs_revision: bool = False
    notes: Optional[str] = None
    solution_code: Optional[str] = None

    class Config:
        from_attributes = True


class DSAProgressUpdate(BaseModel):
    status: Optional[str] = None
    needs_revision: Optional[bool] = None
    notes: Optional[str] = None
    solution_code: Optional[str] = None


class DSATopicGroup(BaseModel):
    topic: str
    total_problems: int
    solved_problems: int
    problems: List[DSAProblemItem]


# =====================
# SQL Schemas
# =====================
class SQLProblemItem(BaseModel):
    id: int
    title: str
    topic: str
    difficulty: str
    scenario: Optional[str] = None
    expected_query: Optional[str] = None
    platform_url: Optional[str] = None

    # User progress fields
    status: str = "Todo"  # Todo, Solved
    user_query: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class SQLProgressUpdate(BaseModel):
    status: Optional[str] = None
    user_query: Optional[str] = None
    notes: Optional[str] = None


# =====================
# Aptitude Schemas
# =====================
class AptitudeTopicItem(BaseModel):
    id: int
    category: str
    topic_name: str
    formula_summary: Optional[str] = None
    total_suggested_questions: int

    # User progress
    completed_questions: int = 0
    accuracy_percentage: float = 0.0
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class AptitudeProgressUpdate(BaseModel):
    completed_questions: Optional[int] = None
    accuracy_percentage: Optional[float] = None
    notes: Optional[str] = None


# =====================
# Core Subject Schemas
# =====================
class CoreSubjectItem(BaseModel):
    id: int
    subject: str
    topic_name: str
    summary_notes: Optional[str] = None
    frequent_questions: Optional[str] = None

    # User progress
    status: str = "Not Started"  # Not Started, In Progress, Mastered
    confidence_rating: int = 1  # 1-5
    revision_notes: Optional[str] = None

    class Config:
        from_attributes = True


class CoreProgressUpdate(BaseModel):
    status: Optional[str] = None
    confidence_rating: Optional[int] = None
    revision_notes: Optional[str] = None
