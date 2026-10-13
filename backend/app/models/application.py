from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name = Column(String(255), nullable=False, index=True)
    role_title = Column(String(255), nullable=False)
    job_type = Column(String(50), default="Full Time")  # Full Time, Internship, 6M Intern + FTE
    location = Column(String(100), default="Remote")
    ctc_or_stipend = Column(String(100), nullable=True)  # e.g., 16 LPA, 45,000 / month
    status = Column(
        String(50),
        default="Applied",
        index=True
    )  # Applied, Online Assessment, Tech Round 1, Tech Round 2, HR Round, Offered, Rejected, Withdrawn
    application_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    deadline = Column(DateTime, nullable=True)
    next_interview_date = Column(DateTime, nullable=True)
    job_url = Column(String(500), nullable=True)
    referral_name = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="applications")
