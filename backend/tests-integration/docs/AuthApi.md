# todo_api_client.AuthApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**read_current_user_api_v1_auth_users_me_get**](AuthApi.md#read_current_user_api_v1_auth_users_me_get) | **GET** /api/v1/auth/users/me | Get the current authenticated user
[**signin_api_v1_auth_signin_post**](AuthApi.md#signin_api_v1_auth_signin_post) | **POST** /api/v1/auth/signin | Authenticate with a Firebase ID token


# **read_current_user_api_v1_auth_users_me_get**
> UserOut read_current_user_api_v1_auth_users_me_get()

Get the current authenticated user

Returns the profile of the user identified by the Bearer token.

### Example

* Bearer (JWT) Authentication (bearerAuth):

```python
import todo_api_client
from todo_api_client.models.user_out import UserOut
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
    api_instance = todo_api_client.AuthApi(api_client)

    try:
        # Get the current authenticated user
        api_response = api_instance.read_current_user_api_v1_auth_users_me_get()
        print("The response of AuthApi->read_current_user_api_v1_auth_users_me_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthApi->read_current_user_api_v1_auth_users_me_get: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**UserOut**](UserOut.md)

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

# **signin_api_v1_auth_signin_post**
> SignInResponse signin_api_v1_auth_signin_post(sign_in_request)

Authenticate with a Firebase ID token

Exchanges a Firebase ID token (minted by the client's Firebase SDK) for a local user record. The user is created on first sign-in. Returns the same token to be sent as `Authorization: Bearer <token>` on all protected routes.

### Example


```python
import todo_api_client
from todo_api_client.models.sign_in_request import SignInRequest
from todo_api_client.models.sign_in_response import SignInResponse
from todo_api_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = todo_api_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with todo_api_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = todo_api_client.AuthApi(api_client)
    sign_in_request = todo_api_client.SignInRequest() # SignInRequest | 

    try:
        # Authenticate with a Firebase ID token
        api_response = api_instance.signin_api_v1_auth_signin_post(sign_in_request)
        print("The response of AuthApi->signin_api_v1_auth_signin_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthApi->signin_api_v1_auth_signin_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sign_in_request** | [**SignInRequest**](SignInRequest.md)|  | 

### Return type

[**SignInResponse**](SignInResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

