# TodosApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createNewTodoApiV1TodosPost**](#createnewtodoapiv1todospost) | **POST** /api/v1/todos | Create a todo|
|[**deleteExistingTodoApiV1TodosTodoIdDelete**](#deleteexistingtodoapiv1todostodoiddelete) | **DELETE** /api/v1/todos/{todo_id} | Delete a todo by id|
|[**readAllTodosApiV1TodosGet**](#readalltodosapiv1todosget) | **GET** /api/v1/todos | List all todos|
|[**readTodoApiV1TodosTodoIdGet**](#readtodoapiv1todostodoidget) | **GET** /api/v1/todos/{todo_id} | Get a todo by id|
|[**updateExistingTodoApiV1TodosTodoIdPut**](#updateexistingtodoapiv1todostodoidput) | **PUT** /api/v1/todos/{todo_id} | Update a todo by id|

# **createNewTodoApiV1TodosPost**
> TodoOut createNewTodoApiV1TodosPost(todoCreate)

Creates a new todo belonging to the authenticated user.

### Example

```typescript
import {
    TodosApi,
    Configuration,
    TodoCreate
} from 'todo-api-client';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todoCreate: TodoCreate; //

const { status, data } = await apiInstance.createNewTodoApiV1TodosPost(
    todoCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todoCreate** | **TodoCreate**|  | |


### Return type

**TodoOut**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteExistingTodoApiV1TodosTodoIdDelete**
> deleteExistingTodoApiV1TodosTodoIdDelete()

Deletes a todo. Returns 204 on success, 404 if not found.

### Example

```typescript
import {
    TodosApi,
    Configuration
} from 'todo-api-client';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todoId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteExistingTodoApiV1TodosTodoIdDelete(
    todoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todoId** | [**number**] |  | defaults to undefined|


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
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **readAllTodosApiV1TodosGet**
> Array<TodoOut> readAllTodosApiV1TodosGet()

Returns every todo owned by the authenticated user.

### Example

```typescript
import {
    TodosApi,
    Configuration
} from 'todo-api-client';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

const { status, data } = await apiInstance.readAllTodosApiV1TodosGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TodoOut>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **readTodoApiV1TodosTodoIdGet**
> TodoOut readTodoApiV1TodosTodoIdGet()

Returns a single todo if it exists and belongs to the user, else 404.

### Example

```typescript
import {
    TodosApi,
    Configuration
} from 'todo-api-client';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todoId: number; // (default to undefined)

const { status, data } = await apiInstance.readTodoApiV1TodosTodoIdGet(
    todoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todoId** | [**number**] |  | defaults to undefined|


### Return type

**TodoOut**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateExistingTodoApiV1TodosTodoIdPut**
> TodoOut updateExistingTodoApiV1TodosTodoIdPut(todoUpdate)

Updates the fields of a todo. Only non-null fields are changed; passing null leaves a field unchanged.

### Example

```typescript
import {
    TodosApi,
    Configuration,
    TodoUpdate
} from 'todo-api-client';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todoId: number; // (default to undefined)
let todoUpdate: TodoUpdate; //

const { status, data } = await apiInstance.updateExistingTodoApiV1TodosTodoIdPut(
    todoId,
    todoUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todoUpdate** | **TodoUpdate**|  | |
| **todoId** | [**number**] |  | defaults to undefined|


### Return type

**TodoOut**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

