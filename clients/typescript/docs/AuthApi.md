# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**readCurrentUserApiV1AuthUsersMeGet**](#readcurrentuserapiv1authusersmeget) | **GET** /api/v1/auth/users/me | Get the current authenticated user|
|[**signinApiV1AuthSigninPost**](#signinapiv1authsigninpost) | **POST** /api/v1/auth/signin | Authenticate with a Firebase ID token|

# **readCurrentUserApiV1AuthUsersMeGet**
> UserOut readCurrentUserApiV1AuthUsersMeGet()

Returns the profile of the user identified by the Bearer token.

### Example

```typescript
import {
    AuthApi,
    Configuration
} from 'todo-api-client';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.readCurrentUserApiV1AuthUsersMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserOut**

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

# **signinApiV1AuthSigninPost**
> SignInResponse signinApiV1AuthSigninPost(signInRequest)

Exchanges a Firebase ID token (minted by the client\'s Firebase SDK) for a local user record. The user is created on first sign-in. Returns the same token to be sent as `Authorization: Bearer <token>` on all protected routes.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    SignInRequest
} from 'todo-api-client';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let signInRequest: SignInRequest; //

const { status, data } = await apiInstance.signinApiV1AuthSigninPost(
    signInRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signInRequest** | **SignInRequest**|  | |


### Return type

**SignInResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

