def _create(client, auth_header, title="My todo", description=None):
    body = {"title": title}
    if description is not None:
        body["description"] = description
    return client.post("/api/v1/todos", json=body, headers=auth_header)


def test_create_todo(client, fake_auth, auth_header):
    resp = _create(client, auth_header, title="Buy milk", description="2%")
    assert resp.status_code == 201
    body = resp.json()
    assert body["title"] == "Buy milk"
    assert body["description"] == "2%"
    assert body["completed"] is False
    assert body["owner_id"] == "user-123"


def test_create_todo_requires_auth(client, fake_auth):
    resp = client.post("/api/v1/todos", json={"title": "x"})
    assert resp.status_code == 401


def test_create_todo_validation(client, fake_auth, auth_header):
    resp = client.post("/api/v1/todos", json={"title": ""}, headers=auth_header)
    assert resp.status_code == 422


def test_list_todos_empty(client, fake_auth, auth_header):
    resp = client.get("/api/v1/todos", headers=auth_header)
    assert resp.status_code == 200
    assert resp.json() == []


def test_list_todos_only_owned(client, fake_auth, auth_header, other_header):
    _create(client, auth_header, title="mine")
    resp = client.get("/api/v1/todos", headers=other_header)
    assert resp.status_code == 200
    assert resp.json() == []

    mine = client.get("/api/v1/todos", headers=auth_header)
    assert len(mine.json()) == 1


def test_get_todo(client, fake_auth, auth_header):
    created = _create(client, auth_header).json()
    resp = client.get(f"/api/v1/todos/{created['id']}", headers=auth_header)
    assert resp.status_code == 200
    assert resp.json()["id"] == created["id"]


def test_get_todo_404_when_missing(client, fake_auth, auth_header):
    resp = client.get("/api/v1/todos/999", headers=auth_header)
    assert resp.status_code == 404


def test_get_todo_other_users_404(client, fake_auth, auth_header, other_header):
    created = _create(client, auth_header).json()
    resp = client.get(f"/api/v1/todos/{created['id']}", headers=other_header)
    assert resp.status_code == 404


def test_update_todo(client, fake_auth, auth_header):
    created = _create(client, auth_header).json()
    resp = client.put(
        f"/api/v1/todos/{created['id']}",
        json={"title": "Updated", "completed": True},
        headers=auth_header,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["title"] == "Updated"
    assert body["completed"] is True


def test_update_todo_404(client, fake_auth, auth_header):
    resp = client.put("/api/v1/todos/999", json={"title": "nope"}, headers=auth_header)
    assert resp.status_code == 404


def test_update_todo_other_users_404(client, fake_auth, auth_header, other_header):
    created = _create(client, auth_header).json()
    resp = client.put(
        f"/api/v1/todos/{created['id']}",
        json={"title": "hijack"},
        headers=other_header,
    )
    assert resp.status_code == 404


def test_delete_todo(client, fake_auth, auth_header):
    created = _create(client, auth_header).json()
    resp = client.delete(f"/api/v1/todos/{created['id']}", headers=auth_header)
    assert resp.status_code == 204
    gone = client.get(f"/api/v1/todos/{created['id']}", headers=auth_header)
    assert gone.status_code == 404


def test_delete_todo_404(client, fake_auth, auth_header):
    resp = client.delete("/api/v1/todos/999", headers=auth_header)
    assert resp.status_code == 404
