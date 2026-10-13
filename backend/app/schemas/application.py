from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class JobApplicationBase(BaseModel):
    company_name: str
    role_title: str
    job_type: Optional[str] = "Full Time"
    location: Optional[str] = "Remote"
    ctc_or_stipend: Optional[str] = None
    status: Optional[str] = "Applied"
    application_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    next_interview_date: Optional[datetime] = None
    job_url: Optional[str] = None
    referral_name: Optional[str] = None
    notes: Optional[str] = None


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    role_title: Optional[str] = None
    job_type: Optional[str] = None
    location: Optional[str] = None
    ctc_or_stipend: Optional[str] = None
    status: Optional[str] = None
    application_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    next_interview_date: Optional[datetime] = None
    job_url: Optional[str] = None
    referral_name: Optional[str] = None
    notes: Optional[str] = None


class JobApplicationResponse(JobApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ApplicationSummaryStats(BaseModel):
    total_applications: int
    applied: int
    assessment: int
    interviewing: int
    offered: int
    rejected: int
    conversion_rate_percentage: float
