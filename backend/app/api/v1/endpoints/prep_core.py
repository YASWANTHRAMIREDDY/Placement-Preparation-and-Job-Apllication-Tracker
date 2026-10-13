from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.preparation import CoreSubjectTopic, UserCoreProgress
from app.schemas.preparation import CoreSubjectItem, CoreProgressUpdate

router = APIRouter()


@router.get("/", response_model=List[CoreSubjectItem])
def get_core_topics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    subject: Optional[str] = Query(None),
) -> Any:
    """Retrieve all Core Engineering CS topics with user mastery status."""
    query = db.query(CoreSubjectTopic)
    if subject and subject != "All":
        query = query.filter(CoreSubjectTopic.subject == subject)

    topics = query.order_by(CoreSubjectTopic.subject, CoreSubjectTopic.id).all()
    prog_map = {
        p.topic_id: p
        for p in db.query(UserCoreProgress).filter(UserCoreProgress.user_id == current_user.id).all()
    }

    result = []
    for top in topics:
        prog = prog_map.get(top.id)
        status_val = prog.status if prog else "Not Started"
        rating = prog.confidence_rating if prog else 1
        notes = prog.revision_notes if prog else None

        result.append(
            CoreSubjectItem(
                id=top.id,
                subject=top.subject,
                topic_name=top.topic_name,
                summary_notes=top.summary_notes,
                frequent_questions=top.frequent_questions,
                status=status_val,
                confidence_rating=rating,
                revision_notes=notes,
            )
        )
    return result


@router.put("/topics/{topic_id}/progress", response_model=CoreSubjectItem)
def update_core_progress(
    topic_id: int,
    progress_in: CoreProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update concept mastery status and confidence rating."""
    topic = db.query(CoreSubjectTopic).filter(CoreSubjectTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Core subject topic not found")

    prog = (
        db.query(UserCoreProgress)
        .filter(UserCoreProgress.user_id == current_user.id, UserCoreProgress.topic_id == topic_id)
        .first()
    )
    if not prog:
        prog = UserCoreProgress(
            user_id=current_user.id,
            topic_id=topic_id,
            status="Not Started",
            confidence_rating=1,
        )
        db.add(prog)

    if progress_in.status is not None:
        prog.status = progress_in.status
    if progress_in.confidence_rating is not None:
        prog.confidence_rating = progress_in.confidence_rating
    if progress_in.revision_notes is not None:
        prog.revision_notes = progress_in.revision_notes

    db.commit()
    db.refresh(prog)

    return CoreSubjectItem(
        id=topic.id,
        subject=topic.subject,
        topic_name=topic.topic_name,
        summary_notes=topic.summary_notes,
        frequent_questions=topic.frequent_questions,
        status=prog.status,
        confidence_rating=prog.confidence_rating,
        revision_notes=prog.revision_notes,
    )
