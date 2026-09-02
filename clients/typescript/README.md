## todo-api-client@0.1.0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install todo-api-client@0.1.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AuthApi* | [**readCurrentUserApiV1AuthUsersMeGet**](docs/AuthApi.md#readcurrentuserapiv1authusersmeget) | **GET** /api/v1/auth/users/me | Get the current authenticated user
*AuthApi* | [**signinApiV1AuthSigninPost**](docs/AuthApi.md#signinapiv1authsigninpost) | **POST** /api/v1/auth/signin | Authenticate with a Firebase ID token
*MetaApi* | [**healthHealthGet**](docs/MetaApi.md#healthhealthget) | **GET** /health | Health check
*TodosApi* | [**createNewTodoApiV1TodosPost**](docs/TodosApi.md#createnewtodoapiv1todospost) | **POST** /api/v1/todos | Create a todo
*TodosApi* | [**deleteExistingTodoApiV1TodosTodoIdDelete**](docs/TodosApi.md#deleteexistingtodoapiv1todostodoiddelete) | **DELETE** /api/v1/todos/{todo_id} | Delete a todo by id
*TodosApi* | [**readAllTodosApiV1TodosGet**](docs/TodosApi.md#readalltodosapiv1todosget) | **GET** /api/v1/todos | List all todos
*TodosApi* | [**readTodoApiV1TodosTodoIdGet**](docs/TodosApi.md#readtodoapiv1todostodoidget) | **GET** /api/v1/todos/{todo_id} | Get a todo by id
*TodosApi* | [**updateExistingTodoApiV1TodosTodoIdPut**](docs/TodosApi.md#updateexistingtodoapiv1todostodoidput) | **PUT** /api/v1/todos/{todo_id} | Update a todo by id


### Documentation For Models

 - [HTTPValidationError](docs/HTTPValidationError.md)
 - [LocationInner](docs/LocationInner.md)
 - [SignInRequest](docs/SignInRequest.md)
 - [SignInResponse](docs/SignInResponse.md)
 - [TodoCreate](docs/TodoCreate.md)
 - [TodoOut](docs/TodoOut.md)
 - [TodoUpdate](docs/TodoUpdate.md)
 - [UserOut](docs/UserOut.md)
 - [ValidationError](docs/ValidationError.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="bearerAuth"></a>
### bearerAuth

- **Type**: Bearer authentication (JWT)

