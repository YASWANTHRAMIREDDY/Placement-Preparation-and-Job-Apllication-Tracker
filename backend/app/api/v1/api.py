from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    applications,
    prep_dsa,
    prep_sql,
    prep_aptitude,
    prep_core,
    dashboard,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profile"])
api_router.include_router(applications.router, prefix="/applications", tags=["Job Applications"])
api_router.include_router(prep_dsa.router, prefix="/prep/dsa", tags=["Placement Prep - DSA"])
api_router.include_router(prep_sql.router, prefix="/prep/sql", tags=["Placement Prep - SQL"])
api_router.include_router(prep_aptitude.router, prefix="/prep/aptitude", tags=["Placement Prep - Aptitude"])
api_router.include_router(prep_core.router, prefix="/prep/core", tags=["Placement Prep - Core CS Subjects"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard & Analytics"])
