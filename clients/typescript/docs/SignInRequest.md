# SignInRequest

Body for /auth/signin: a Firebase ID token minted by the client.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id_token** | **string** | Firebase ID token from the client\&#39;s auth SDK | [default to undefined]

## Example

```typescript
import { SignInRequest } from 'todo-api-client';

const instance: SignInRequest = {
    id_token,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
