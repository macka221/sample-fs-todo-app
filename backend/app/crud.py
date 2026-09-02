from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Todo, User


def get_or_create_user(db: Session, user_id: str, email: str | None) -> User:
    user = db.get(User, user_id)
    if user is None:
        user = User(id=user_id, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def list_todos(db: Session, owner_id: str) -> list[Todo]:
    stmt = select(Todo).where(Todo.owner_id == owner_id).order_by(Todo.created_at)
    return list(db.scalars(stmt).all())


def get_todo(db: Session, owner_id: str, todo_id: int) -> Todo | None:
    return db.scalar(
        select(Todo).where(Todo.id == todo_id, Todo.owner_id == owner_id)
    )


def create_todo(db: Session, owner_id: str, title: str, description: str | None) -> Todo:
    todo = Todo(owner_id=owner_id, title=title, description=description)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def update_todo(
    db: Session,
    todo: Todo,
    *,
    title: str | None,
    description: str | None,
    completed: bool | None,
) -> Todo:
    if title is not None:
        todo.title = title
    if description is not None:
        todo.description = description
    if completed is not None:
        todo.completed = completed
    db.commit()
    db.refresh(todo)
    return todo


def delete_todo(db: Session, todo: Todo) -> None:
    db.delete(todo)
    db.commit()
