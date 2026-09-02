# TodoCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **str** |  | 
**description** | **str** |  | [optional] 

## Example

```python
from todo_api_client.models.todo_create import TodoCreate

# TODO update the JSON string below
json = "{}"
# create an instance of TodoCreate from a JSON string
todo_create_instance = TodoCreate.from_json(json)
# print the JSON string representation of the object
print(TodoCreate.to_json())

# convert the object into a dict
todo_create_dict = todo_create_instance.to_dict()
# create an instance of TodoCreate from a dict
todo_create_from_dict = TodoCreate.from_dict(todo_create_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


