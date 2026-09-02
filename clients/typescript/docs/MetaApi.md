# MetaApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**healthHealthGet**](#healthhealthget) | **GET** /health | Health check|

# **healthHealthGet**
> { [key: string]: any | null; } healthHealthGet()


### Example

```typescript
import {
    MetaApi,
    Configuration
} from 'todo-api-client';

const configuration = new Configuration();
const apiInstance = new MetaApi(configuration);

const { status, data } = await apiInstance.healthHealthGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: any | null; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

