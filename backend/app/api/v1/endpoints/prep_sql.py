from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.preparation import SQLProblem, UserSQLProgress
from app.schemas.preparation import SQLProblemItem, SQLProgressUpdate

router = APIRouter()


@router.get("/", response_model=List[SQLProblemItem])
def get_sql_problems(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    difficulty: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
) -> Any:
    """Retrieve all SQL interview challenges with current user's progress."""
    all_problems = db.query(SQLProblem).order_by(SQLProblem.id).all()
    progress_map = {
        p.problem_id: p
        for p in db.query(UserSQLProgress).filter(UserSQLProgress.user_id == current_user.id).all()
    }

    result = []
    for prob in all_problems:
        prog = progress_map.get(prob.id)
        current_status = prog.status if prog else "Todo"
        user_query = prog.user_query if prog else None
        notes = prog.notes if prog else None

        if difficulty and difficulty != "All" and prob.difficulty != difficulty:
            continue
        if status_filter and status_filter != "All" and current_status != status_filter:
            continue

        result.append(
            SQLProblemItem(
                id=prob.id,
                title=prob.title,
                topic=prob.topic,
                difficulty=prob.difficulty,
                scenario=prob.scenario,
                expected_query=prob.expected_query,
                platform_url=prob.platform_url,
                status=current_status,
                user_query=user_query,
                notes=notes,
            )
        )
    return result


@router.put("/problems/{problem_id}/progress", response_model=SQLProblemItem)
def update_sql_progress(
    problem_id: int,
    progress_in: SQLProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update user's practice query and solved status for an SQL problem."""
    problem = db.query(SQLProblem).filter(SQLProblem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="SQL problem not found")

    prog = (
        db.query(UserSQLProgress)
        .filter(UserSQLProgress.user_id == current_user.id, UserSQLProgress.problem_id == problem_id)
        .first()
    )
    if not prog:
        prog = UserSQLProgress(
            user_id=current_user.id,
            problem_id=problem_id,
            status="Todo",
        )
        db.add(prog)

    if progress_in.status is not None:
        prog.status = progress_in.status
    if progress_in.user_query is not None:
        prog.user_query = progress_in.user_query
    if progress_in.notes is not None:
        prog.notes = progress_in.notes

    db.commit()
    db.refresh(prog)

    return SQLProblemItem(
        id=problem.id,
        title=problem.title,
        topic=problem.topic,
        difficulty=problem.difficulty,
        scenario=problem.scenario,
        expected_query=problem.expected_query,
        platform_url=problem.platform_url,
        status=prog.status,
        user_query=prog.user_query,
        notes=prog.notes,
    )
