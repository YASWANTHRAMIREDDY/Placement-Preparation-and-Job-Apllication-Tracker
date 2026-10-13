from typing import Any, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.application import JobApplication
from app.models.preparation import (
    DSAProblem,
    UserDSAProgress,
    SQLProblem,
    UserSQLProgress,
    AptitudeTopic,
    UserAptitudeProgress,
    CoreSubjectTopic,
    UserCoreProgress,
)
from app.schemas.dashboard import (
    DashboardStatsResponse,
    UpcomingDeadline,
    CategoryMastery,
)

router = APIRouter()


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Consolidated analytics for student dashboard."""

    # 1. DSA Stats
    dsa_total = db.query(DSAProblem).count()
    dsa_solved = (
        db.query(UserDSAProgress)
        .filter(UserDSAProgress.user_id == current_user.id, UserDSAProgress.status == "Solved")
        .count()
    )
    dsa_needs_rev = (
        db.query(UserDSAProgress)
        .filter(UserDSAProgress.user_id == current_user.id, UserDSAProgress.needs_revision == True)
        .count()
    )
    dsa_pct = round((dsa_solved / dsa_total * 100) if dsa_total > 0 else 0.0, 1)

    # 2. SQL Stats
    sql_total = db.query(SQLProblem).count()
    sql_solved = (
        db.query(UserSQLProgress)
        .filter(UserSQLProgress.user_id == current_user.id, UserSQLProgress.status == "Solved")
        .count()
    )
    sql_pct = round((sql_solved / sql_total * 100) if sql_total > 0 else 0.0, 1)

    # 3. Aptitude Stats
    apt_topics = db.query(AptitudeTopic).all()
    apt_total_questions = sum(t.total_suggested_questions for t in apt_topics) or 1
    apt_completed = (
        db.query(func.sum(UserAptitudeProgress.completed_questions))
        .filter(UserAptitudeProgress.user_id == current_user.id)
        .scalar()
    ) or 0
    apt_pct = round(min(100.0, (apt_completed / apt_total_questions * 100)), 1)

    # 4. Core CS Stats
    core_total = db.query(CoreSubjectTopic).count()
    core_mastered = (
        db.query(UserCoreProgress)
        .filter(UserCoreProgress.user_id == current_user.id, UserCoreProgress.status == "Mastered")
        .count()
    )
    core_pct = round((core_mastered / core_total * 100) if core_total > 0 else 0.0, 1)

    # 5. Calculate Placement Readiness Score (Weighted 0-100)
    # DSA (40%), Core CS (25%), SQL (20%), Aptitude (15%)
    readiness_score = int(
        (dsa_pct * 0.40) + (core_pct * 0.25) + (sql_pct * 0.20) + (apt_pct * 0.15)
    )
    readiness_score = max(0, min(100, readiness_score))

    # 6. Applications Pipeline
    apps = db.query(JobApplication).filter(JobApplication.user_id == current_user.id).all()
    total_apps = len(apps)
    applied_count = sum(1 for a in apps if a.status == "Applied")
    oa_count = sum(1 for a in apps if "Assessment" in a.status or a.status == "OA")
    interviewing_count = sum(1 for a in apps if "Round" in a.status or "Interview" in a.status or a.status == "HR Round")
    offered_count = sum(1 for a in apps if a.status == "Offered")
    rejected_count = sum(1 for a in apps if a.status == "Rejected")

    # 7. Upcoming Events (Interviews & Deadlines)
    upcoming_events: List[UpcomingDeadline] = []
    now = datetime.now(timezone.utc)

    for a in apps:
        if a.next_interview_date:
            upcoming_events.append(
                UpcomingDeadline(
                    id=a.id,
                    company_name=a.company_name,
                    role_title=a.role_title,
                    event_type="Interview",
                    event_date=a.next_interview_date,
                    status=a.status,
                )
            )
        if a.deadline:
            upcoming_events.append(
                UpcomingDeadline(
                    id=a.id,
                    company_name=a.company_name,
                    role_title=a.role_title,
                    event_type="Deadline",
                    event_date=a.deadline,
                    status=a.status,
                )
            )

    # Sort upcoming events by date
    upcoming_events.sort(key=lambda x: x.event_date)
    # Take top 5 upcoming
    upcoming_events = upcoming_events[:6]

    # 8. Category Breakdown
    category_breakdown = [
        CategoryMastery(category_name="DSA Coding", completed=dsa_solved, total=dsa_total, percentage=dsa_pct),
        CategoryMastery(category_name="SQL Queries", completed=sql_solved, total=sql_total, percentage=sql_pct),
        CategoryMastery(category_name="Core CS Concepts", completed=core_mastered, total=core_total, percentage=core_pct),
        CategoryMastery(category_name="Aptitude & Reasoning", completed=int(apt_completed), total=apt_total_questions, percentage=apt_pct),
    ]

    return DashboardStatsResponse(
        placement_readiness_score=readiness_score,
        dsa_total=dsa_total,
        dsa_solved=dsa_solved,
        dsa_needs_revision=dsa_needs_rev,
        dsa_percentage=dsa_pct,
        sql_total=sql_total,
        sql_solved=sql_solved,
        sql_percentage=sql_pct,
        aptitude_total=apt_total_questions,
        aptitude_completed=int(apt_completed),
        aptitude_percentage=apt_pct,
        core_total=core_total,
        core_mastered=core_mastered,
        core_percentage=core_pct,
        total_applications=total_apps,
        applied_count=applied_count,
        oa_count=oa_count,
        interviewing_count=interviewing_count,
        offered_count=offered_count,
        rejected_count=rejected_count,
        upcoming_events=upcoming_events,
        category_breakdown=category_breakdown,
    )
