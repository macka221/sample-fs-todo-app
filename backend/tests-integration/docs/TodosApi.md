# todo_api_client.TodosApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_new_todo_api_v1_todos_post**](TodosApi.md#create_new_todo_api_v1_todos_post) | **POST** /api/v1/todos | Create a todo
[**delete_existing_todo_api_v1_todos_todo_id_delete**](TodosApi.md#delete_existing_todo_api_v1_todos_todo_id_delete) | **DELETE** /api/v1/todos/{todo_id} | Delete a todo by id
[**read_all_todos_api_v1_todos_get**](TodosApi.md#read_all_todos_api_v1_todos_get) | **GET** /api/v1/todos | List all todos
[**read_todo_api_v1_todos_todo_id_get**](TodosApi.md#read_todo_api_v1_todos_todo_id_get) | **GET** /api/v1/todos/{todo_id} | Get a todo by id
[**update_existing_todo_api_v1_todos_todo_id_put**](TodosApi.md#update_existing_todo_api_v1_todos_todo_id_put) | **PUT** /api/v1/todos/{todo_id} | Update a todo by id


# **create_new_todo_api_v1_todos_post**
> TodoOut create_new_todo_api_v1_todos_post(todo_create)

Create a todo

Creates a new todo belonging to the authenticated user.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import todo_api_client
from todo_api_client.models.todo_create import TodoCreate
from todo_api_client.models.todo_out import TodoOut
from todo_api_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = todo_api_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = todo_api_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with todo_api_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = todo_api_client.TodosApi(api_client)
    todo_create = todo_api_client.TodoCreate() # TodoCreate | 

    try:
        # Create a todo
        api_response = api_instance.create_new_todo_api_v1_todos_post(todo_create)
        print("The response of TodosApi->create_new_todo_api_v1_todos_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TodosApi->create_new_todo_api_v1_todos_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **todo_create** | [**TodoCreate**](TodoCreate.md)|  | 

### Return type

[**TodoOut**](TodoOut.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_existing_todo_api_v1_todos_todo_id_delete**
> delete_existing_todo_api_v1_todos_todo_id_delete(todo_id)

Delete a todo by id

Deletes a todo. Returns 204 on success, 404 if not found.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import todo_api_client
from todo_api_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = todo_api_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = todo_api_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with todo_api_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = todo_api_client.TodosApi(api_client)
    todo_id = 56 # int | 

    try:
        # Delete a todo by id
        api_instance.delete_existing_todo_api_v1_todos_todo_id_delete(todo_id)
    except Exception as e:
        print("Exception when calling TodosApi->delete_existing_todo_api_v1_todos_todo_id_delete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **todo_id** | **int**|  | 

### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **read_all_todos_api_v1_todos_get**
> List[TodoOut] read_all_todos_api_v1_todos_get()

List all todos

Returns every todo owned by the authenticated user.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import todo_api_client
from todo_api_client.models.todo_out import TodoOut
from todo_api_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = todo_api_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = todo_api_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with todo_api_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = todo_api_client.TodosApi(api_client)

    try:
        # List all todos
        api_response = api_instance.read_all_todos_api_v1_todos_get()
        print("The response of TodosApi->read_all_todos_api_v1_todos_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TodosApi->read_all_todos_api_v1_todos_get: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[TodoOut]**](TodoOut.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **read_todo_api_v1_todos_todo_id_get**
> TodoOut read_todo_api_v1_todos_todo_id_get(todo_id)

Get a todo by id

Returns a single todo if it exists and belongs to the user, else 404.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import todo_api_client
from todo_api_client.models.todo_out import TodoOut
from todo_api_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = todo_api_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = todo_api_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with todo_api_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = todo_api_client.TodosApi(api_client)
    todo_id = 56 # int | 

    try:
        # Get a todo by id
        api_response = api_instance.read_todo_api_v1_todos_todo_id_get(todo_id)
        print("The response of TodosApi->read_todo_api_v1_todos_todo_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TodosApi->read_todo_api_v1_todos_todo_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **todo_id** | **int**|  | 

### Return type

[**TodoOut**](TodoOut.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_existing_todo_api_v1_todos_todo_id_put**
> TodoOut update_existing_todo_api_v1_todos_todo_id_put(todo_id, todo_update)

Update a todo by id

Updates the fields of a todo. Only non-null fields are changed; passing null leaves a field unchanged.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import todo_api_client
from todo_api_client.models.todo_out import TodoOut
from todo_api_client.models.todo_update import TodoUpdate
from todo_api_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = todo_api_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerAuth
configuration = todo_api_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with todo_api_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = todo_api_client.TodosApi(api_client)
    todo_id = 56 # int | 
    todo_update = todo_api_client.TodoUpdate() # TodoUpdate | 

    try:
        # Update a todo by id
        api_response = api_instance.update_existing_todo_api_v1_todos_todo_id_put(todo_id, todo_update)
        print("The response of TodosApi->update_existing_todo_api_v1_todos_todo_id_put:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TodosApi->update_existing_todo_api_v1_todos_todo_id_put: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **todo_id** | **int**|  | 
 **todo_update** | [**TodoUpdate**](TodoUpdate.md)|  | 

### Return type

[**TodoOut**](TodoOut.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

