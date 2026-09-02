# TodoOut


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**title** | **str** |  | 
**description** | **str** |  | [optional] 
**completed** | **bool** |  | 
**owner_id** | **str** |  | 
**created_at** | **datetime** |  | 
**updated_at** | **datetime** |  | 

## Example

```python
from todo_api_client.models.todo_out import TodoOut

# TODO update the JSON string below
json = "{}"
# create an instance of TodoOut from a JSON string
todo_out_instance = TodoOut.from_json(json)
# print the JSON string representation of the object
print(TodoOut.to_json())

# convert the object into a dict
todo_out_dict = todo_out_instance.to_dict()
# create an instance of TodoOut from a dict
todo_out_from_dict = TodoOut.from_dict(todo_out_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


