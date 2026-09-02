# SignInResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**access_token** | **string** | Firebase ID token echoed back for the client | [default to undefined]
**token_type** | **string** |  | [optional] [default to 'bearer']
**user** | [**UserOut**](UserOut.md) |  | [default to undefined]

## Example

```typescript
import { SignInResponse } from 'todo-api-client';

const instance: SignInResponse = {
    access_token,
    token_type,
    user,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
