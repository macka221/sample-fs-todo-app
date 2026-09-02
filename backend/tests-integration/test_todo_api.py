"""Integration tests that exercise the full stack through the generated Python client.

These require a running API + Postgres and a real Firebase ID token. They skip
gracefully when the token isn't provided so CI/offline environments don't fail.

Getting an ID token: mint one with the Firebase Admin SDK using your service
account (see README), then export it:

    export FIREBASE_ID_TOKEN="<your-id-token>"
    export API_BASE_URL="http://localhost:8000/api/v1"
"""
from __future__ import annotations

import os

import pytest

from todo_api_client import ApiClient, Configuration
from todo_api_client.api.auth_api import AuthApi
from todo_api_client.api.todos_api import TodosApi
from todo_api_client.models.sign_in_request import SignInRequest
from todo_api_client.models.todo_create import TodoCreate
from todo_api_client.models.todo_update import TodoUpdate

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000/api/v1")
FIREBASE_ID_TOKEN = os.getenv("FIREBASE_ID_TOKEN", "")

requires_token = pytest.mark.skipif(
    not FIREBASE_ID_TOKEN,
    reason="FIREBASE_ID_TOKEN not set; cannot run authenticated integration tests",
)


@pytest.fixture()
def api():
    if not FIREBASE_ID_TOKEN:
        pytest.skip("FIREBASE_ID_TOKEN not set")
    config = Configuration(host=API_BASE_URL, access_token=FIREBASE_ID_TOKEN)
    with ApiClient(config) as client:
        yield client


@requires_token
def test_signin_round_trip(api):
    auth = AuthApi(api)
    resp = auth.signin_api_v1_auth_signin_post(SignInRequest(id_token=FIREBASE_ID_TOKEN))
    assert resp.user.id is not None


@requires_token
def test_todo_crud_lifecycle(api):
    todos = TodosApi(api)
    created = todos.create_new_todo_api_v1_todos_post(TodoCreate(title="integration todo"))
    todo_id = created.id
    assert created.title == "integration todo"
    assert created.completed is False

    fetched = todos.read_todo_api_v1_todos_todo_id_get(todo_id)
    assert fetched.id == todo_id

    updated = todos.update_existing_todo_api_v1_todos_todo_id_put(
        todo_id, TodoUpdate(title="updated todo", completed=True)
    )
    assert updated.title == "updated todo"
    assert updated.completed is True

    listed = todos.read_all_todos_api_v1_todos_get()
    assert any(t.id == todo_id for t in listed)

    todos.delete_existing_todo_api_v1_todos_todo_id_delete(todo_id)
    listed_after = todos.read_all_todos_api_v1_todos_get()
    assert all(t.id != todo_id for t in listed_after)
