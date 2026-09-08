from __future__ import annotations

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.crud import (
    create_todo,
    delete_todo,
    get_todo,
    list_todos,
    update_todo,
)
from app.database import get_db
from app.models import User
from app.schemas import TodoCreate, TodoOut, TodoUpdate

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/todos", tags=["todos"])


@router.post(
    "",
    response_model=TodoOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a todo",
    description="Creates a new todo belonging to the authenticated user.",
)
def create_new_todo(
    payload: TodoCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    todo = create_todo(db, current_user.id, payload.title, payload.description)
    logger.info("User %s created todo %s: %r", current_user.id, todo.id, todo.title)
    return TodoOut.model_validate(todo)


@router.get(
    "",
    response_model=list[TodoOut],
    summary="List all todos",
    description="Returns every todo owned by the authenticated user.",
)
def read_all_todos(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return [TodoOut.model_validate(t) for t in list_todos(db, current_user.id)]


@router.get(
    "/{todo_id}",
    response_model=TodoOut,
    summary="Get a todo by id",
    description="Returns a single todo if it exists and belongs to the user, else 404.",
)
def read_todo(
    todo_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    todo = get_todo(db, current_user.id, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return TodoOut.model_validate(todo)


@router.put(
    "/{todo_id}",
    response_model=TodoOut,
    summary="Update a todo by id",
    description="Updates the fields of a todo. Only non-null fields are changed; "
    "passing null leaves a field unchanged.",
)
def update_existing_todo(
    todo_id: int,
    payload: TodoUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    todo = get_todo(db, current_user.id, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    updated = update_todo(
        db,
        todo,
        title=payload.title,
        description=payload.description,
        completed=payload.completed,
    )
    logger.info("User %s updated todo %s", current_user.id, todo.id)
    return TodoOut.model_validate(updated)


@router.delete(
    "/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a todo by id",
    description="Deletes a todo. Returns 204 on success, 404 if not found.",
)
def delete_existing_todo(
    todo_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    todo = get_todo(db, current_user.id, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    delete_todo(db, todo)
    logger.info("User %s deleted todo %s", current_user.id, todo_id)
