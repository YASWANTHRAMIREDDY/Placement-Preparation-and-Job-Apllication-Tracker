from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.preparation import AptitudeTopic, UserAptitudeProgress
from app.schemas.preparation import AptitudeTopicItem, AptitudeProgressUpdate

router = APIRouter()


@router.get("/", response_model=List[AptitudeTopicItem])
def get_aptitude_topics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    category: Optional[str] = Query(None),
) -> Any:
    """Retrieve all Aptitude topics with user progress."""
    query = db.query(AptitudeTopic)
    if category and category != "All":
        query = query.filter(AptitudeTopic.category == category)

    topics = query.order_by(AptitudeTopic.category, AptitudeTopic.id).all()
    prog_map = {
        p.topic_id: p
        for p in db.query(UserAptitudeProgress).filter(UserAptitudeProgress.user_id == current_user.id).all()
    }

    result = []
    for top in topics:
        prog = prog_map.get(top.id)
        comp_q = prog.completed_questions if prog else 0
        accuracy = prog.accuracy_percentage if prog else 0.0
        notes = prog.notes if prog else None

        result.append(
            AptitudeTopicItem(
                id=top.id,
                category=top.category,
                topic_name=top.topic_name,
                formula_summary=top.formula_summary,
                total_suggested_questions=top.total_suggested_questions,
                completed_questions=comp_q,
                accuracy_percentage=accuracy,
                notes=notes,
            )
        )
    return result


@router.put("/topics/{topic_id}/progress", response_model=AptitudeTopicItem)
def update_aptitude_progress(
    topic_id: int,
    progress_in: AptitudeProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update practice progress and accuracy for an aptitude topic."""
    topic = db.query(AptitudeTopic).filter(AptitudeTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Aptitude topic not found")

    prog = (
        db.query(UserAptitudeProgress)
        .filter(UserAptitudeProgress.user_id == current_user.id, UserAptitudeProgress.topic_id == topic_id)
        .first()
    )
    if not prog:
        prog = UserAptitudeProgress(
            user_id=current_user.id,
            topic_id=topic_id,
            completed_questions=0,
            accuracy_percentage=0.0,
        )
        db.add(prog)

    if progress_in.completed_questions is not None:
        prog.completed_questions = min(progress_in.completed_questions, topic.total_suggested_questions)
    if progress_in.accuracy_percentage is not None:
        prog.accuracy_percentage = progress_in.accuracy_percentage
    if progress_in.notes is not None:
        prog.notes = progress_in.notes

    db.commit()
    db.refresh(prog)

    return AptitudeTopicItem(
        id=topic.id,
        category=topic.category,
        topic_name=topic.topic_name,
        formula_summary=topic.formula_summary,
        total_suggested_questions=topic.total_suggested_questions,
        completed_questions=prog.completed_questions,
        accuracy_percentage=prog.accuracy_percentage,
        notes=prog.notes,
    )
