from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from collections import defaultdict

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.preparation import DSAProblem, UserDSAProgress
from app.schemas.preparation import DSAProblemItem, DSAProgressUpdate, DSATopicGroup

router = APIRouter()


@router.get("/", response_model=List[DSATopicGroup])
def get_dsa_problems(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    difficulty: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
) -> Any:
    """Retrieve all DSA problems grouped by topic with current user's progress."""
    all_problems = db.query(DSAProblem).order_by(DSAProblem.topic, DSAProblem.id).all()
    user_progress_map = {
        p.problem_id: p
        for p in db.query(UserDSAProgress).filter(UserDSAProgress.user_id == current_user.id).all()
    }

    grouped = defaultdict(list)
    for prob in all_problems:
        prog = user_progress_map.get(prob.id)
        current_status = prog.status if prog else "Todo"
        needs_rev = prog.needs_revision if prog else False
        notes = prog.notes if prog else None
        solution_code = prog.solution_code if prog else None

        if difficulty and difficulty != "All" and prob.difficulty != difficulty:
            continue
        if status_filter and status_filter != "All" and current_status != status_filter:
            continue

        item = DSAProblemItem(
            id=prob.id,
            title=prob.title,
            topic=prob.topic,
            difficulty=prob.difficulty,
            pattern=prob.pattern,
            leetcode_url=prob.leetcode_url,
            gfg_url=prob.gfg_url,
            description=prob.description,
            status=current_status,
            needs_revision=needs_rev,
            notes=notes,
            solution_code=solution_code,
        )
        grouped[prob.topic].append(item)

    response = []
    for topic_name, problems in grouped.items():
        solved_count = sum(1 for p in problems if p.status == "Solved")
        response.append(
            DSATopicGroup(
                topic=topic_name,
                total_problems=len(problems),
                solved_problems=solved_count,
                problems=problems,
            )
        )
    return response


@router.put("/problems/{problem_id}/progress", response_model=DSAProblemItem)
def update_dsa_progress(
    problem_id: int,
    progress_in: DSAProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update or toggle status/revision/notes for a specific DSA problem."""
    problem = db.query(DSAProblem).filter(DSAProblem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="DSA problem not found")

    prog = (
        db.query(UserDSAProgress)
        .filter(UserDSAProgress.user_id == current_user.id, UserDSAProgress.problem_id == problem_id)
        .first()
    )
    if not prog:
        prog = UserDSAProgress(
            user_id=current_user.id,
            problem_id=problem_id,
            status="Todo",
            needs_revision=False,
        )
        db.add(prog)

    if progress_in.status is not None:
        prog.status = progress_in.status
    if progress_in.needs_revision is not None:
        prog.needs_revision = progress_in.needs_revision
    if progress_in.notes is not None:
        prog.notes = progress_in.notes
    if progress_in.solution_code is not None:
        prog.solution_code = progress_in.solution_code

    db.commit()
    db.refresh(prog)

    return DSAProblemItem(
        id=problem.id,
        title=problem.title,
        topic=problem.topic,
        difficulty=problem.difficulty,
        pattern=problem.pattern,
        leetcode_url=problem.leetcode_url,
        gfg_url=problem.gfg_url,
        description=problem.description,
        status=prog.status,
        needs_revision=prog.needs_revision,
        notes=prog.notes,
        solution_code=prog.solution_code,
    )
