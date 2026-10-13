from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel


class UpcomingDeadline(BaseModel):
    id: int
    company_name: str
    role_title: str
    event_type: str  # "Interview" or "Deadline"
    event_date: datetime
    status: str


class CategoryMastery(BaseModel):
    category_name: str
    completed: int
    total: int
    percentage: float


class DashboardStatsResponse(BaseModel):
    placement_readiness_score: int  # 0 to 100
    
    # Preparation metrics
    dsa_total: int
    dsa_solved: int
    dsa_needs_revision: int
    dsa_percentage: float

    sql_total: int
    sql_solved: int
    sql_percentage: float

    aptitude_total: int
    aptitude_completed: int
    aptitude_percentage: float

    core_total: int
    core_mastered: int
    core_percentage: float

    # Application metrics
    total_applications: int
    applied_count: int
    oa_count: int
    interviewing_count: int
    offered_count: int
    rejected_count: int

    upcoming_events: List[UpcomingDeadline]
    category_breakdown: List[CategoryMastery]
