# SignInResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**access_token** | **str** | Firebase ID token echoed back for the client | 
**token_type** | **str** |  | [optional] [default to 'bearer']
**user** | [**UserOut**](UserOut.md) |  | 

## Example

```python
from todo_api_client.models.sign_in_response import SignInResponse

# TODO update the JSON string below
json = "{}"
# create an instance of SignInResponse from a JSON string
sign_in_response_instance = SignInResponse.from_json(json)
# print the JSON string representation of the object
print(SignInResponse.to_json())

# convert the object into a dict
sign_in_response_dict = sign_in_response_instance.to_dict()
# create an instance of SignInResponse from a dict
sign_in_response_from_dict = SignInResponse.from_dict(sign_in_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


