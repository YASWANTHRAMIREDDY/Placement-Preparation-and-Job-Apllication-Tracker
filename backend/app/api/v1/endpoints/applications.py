from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.application import JobApplication
from app.schemas.application import (
    JobApplicationCreate,
    JobApplicationUpdate,
    JobApplicationResponse,
    ApplicationSummaryStats,
)

router = APIRouter()


@router.get("/", response_model=List[JobApplicationResponse])
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
) -> Any:
    """Retrieve all job applications submitted by the current user."""
    query = db.query(JobApplication).filter(JobApplication.user_id == current_user.id)

    if status_filter and status_filter != "All":
        query = query.filter(JobApplication.status == status_filter)

    if job_type and job_type != "All":
        query = query.filter(JobApplication.job_type == job_type)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                JobApplication.company_name.ilike(search_fmt),
                JobApplication.role_title.ilike(search_fmt),
                JobApplication.location.ilike(search_fmt),
            )
        )

    return query.order_by(desc(JobApplication.updated_at)).all()


@router.post("/", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    app_in: JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Create a new job application entry."""
    app_obj = JobApplication(
        **app_in.model_dump(),
        user_id=current_user.id,
    )
    db.add(app_obj)
    db.commit()
    db.refresh(app_obj)
    return app_obj


@router.get("/stats/summary", response_model=ApplicationSummaryStats)
def get_application_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Summary statistics and conversion rates for student's pipeline."""
    apps = db.query(JobApplication).filter(JobApplication.user_id == current_user.id).all()
    total = len(apps)
    
    applied = sum(1 for a in apps if a.status == "Applied")
    oa = sum(1 for a in apps if "Assessment" in a.status or a.status == "OA")
    interviewing = sum(1 for a in apps if "Round" in a.status or "Interview" in a.status)
    offered = sum(1 for a in apps if a.status == "Offered")
    rejected = sum(1 for a in apps if a.status == "Rejected")

    conversion_rate = (offered / total * 100) if total > 0 else 0.0

    return ApplicationSummaryStats(
        total_applications=total,
        applied=applied,
        assessment=oa,
        interviewing=interviewing,
        offered=offered,
        rejected=rejected,
        conversion_rate_percentage=round(conversion_rate, 1),
    )


@router.get("/{application_id}", response_model=JobApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get detailed information for a specific job application."""
    app_obj = (
        db.query(JobApplication)
        .filter(JobApplication.id == application_id, JobApplication.user_id == current_user.id)
        .first()
    )
    if not app_obj:
        raise HTTPException(status_code=404, detail="Job application not found")
    return app_obj


@router.put("/{application_id}", response_model=JobApplicationResponse)
def update_application(
    application_id: int,
    app_in: JobApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update status, interview date, or details of a job application."""
    app_obj = (
        db.query(JobApplication)
        .filter(JobApplication.id == application_id, JobApplication.user_id == current_user.id)
        .first()
    )
    if not app_obj:
        raise HTTPException(status_code=404, detail="Job application not found")

    update_data = app_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(app_obj, field, value)

    db.add(app_obj)
    db.commit()
    db.refresh(app_obj)
    return app_obj


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """Remove a job application entry."""
    app_obj = (
        db.query(JobApplication)
        .filter(JobApplication.id == application_id, JobApplication.user_id == current_user.id)
        .first()
    )
    if not app_obj:
        raise HTTPException(status_code=404, detail="Job application not found")

    db.delete(app_obj)
    db.commit()
