# TodoUpdate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **str** |  | [optional] 
**description** | **str** |  | [optional] 
**completed** | **bool** |  | [optional] 

## Example

```python
from todo_api_client.models.todo_update import TodoUpdate

# TODO update the JSON string below
json = "{}"
# create an instance of TodoUpdate from a JSON string
todo_update_instance = TodoUpdate.from_json(json)
# print the JSON string representation of the object
print(TodoUpdate.to_json())

# convert the object into a dict
todo_update_dict = todo_update_instance.to_dict()
# create an instance of TodoUpdate from a dict
todo_update_from_dict = TodoUpdate.from_dict(todo_update_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


