# Color Picker API



## Endpoints

### Base URL

//Add base URL here once deployed

### GET all projects

`GET /api/v1/projects`

| Status  | Response |
| ------------- | ------------- |
| 200 (success)  | an array of all projects  |
| 500 (internal error)  | error message  |

A successful response will return an array of `project` objects. Each `project` is comprised of:

| Name  | Data Type |
| ------------- | ------------- |
| id  | number  |
| name  | string  |

Example Response: 

```json
  [
    {
      "id": 1,
      "name": "Master Bedroom"
    }, 
    {
      "id": 2,
      "name": "Kitchen"
    }
  ]
  ```



### GET all palettes

`GET /api/v1/palettes`

| Status  | Response |
| ------------- | ------------- |
| 200 (success)  | an array of all palettes  |
| 500 (internal error)  | error message  |

A successful response will return an array of `palette` objects. Each `palette` is comprised of:

| Name  | Data Type |
| ------------- | ------------- |
| id  | number  |
| project_id  | number  |
| palette_name  | string  |
| color_1 | string  |
| color_2 | string  |
| color_3 | string  |
| color_4 | string  |
| color_5 | string  |


Example Response: 
```json
[
  {
    "id": 1,
    "project_id": 1,
    "palette_name": "accent wall",
    "color_1": "#58e714",
    "color_2": "#528a1a",
    "color_3": "#071723",
    "color_4": "#8400f1",
    "color_5": "#4d07e6"
  },
   {
    "id": 2,
    "project_id": 1,
    "palette_name": "remaining walls",
    "color_1": "#9bdb2e",
    "color_2": "#a1b307",
    "color_3": "#492c29",
    "color_4": "#18aa5a",
    "color_5": "#ee051c"
  },
   {
    "id": 3,
    "project_id": 2,
    "palette_name": "kitchen colors",
    "color_1": "#58e714",
    "color_2": "#a1b307",
    "color_3": "#8400f1",
    "color_4": "#4d07e6",
    "color_5": "#ee051c"
  },
]
```


### GET a specific project by name

`GET /api/v1/projects/:name`


| Status  | Response |
| ------------- | ------------- |
| 200 (success)  | the associated project object  |
| 404 (error)  | a message that there is no matching project with that name  |

Example response: 

```json 
    {
      "id": 1,
      "name": "Master Bedroom"
   }
```



### GET a specific palette by name

`GET /api/v1/palette/:palette_name`


| Status  | Response |
| ------------- | ------------- |
| 200 (success)  | the associated palette object  |
| 404 (error)  | A message indicating there is not a palette with a corresponding name  |

Example response:

```json 
  {
    "id": 3,
    "project_id": 2,
    "palette_name": "kitchen colors",
    "color_1": "#58e714",
    "color_2": "#a1b307",
    "color_3": "#8400f1",
    "color_4": "#4d07e6",
    "color_5": "#ee051c"
  }
```

### POST a new project

`POST /api/v1/projects`

#### Required Parameters

| Name  | Data Type | 
| ------------- | ------------- |
| name  | string  | 



| Status  | Response |
| ------------- | ------------- |
| 201 (success)  | the ID of the newly added project |
| 422 (unprocessable)  | 'Expected format { name: <string> }, missing name!' |

Example response: 

```json 
  {
    "id": 4
  }
```

### POST a new palette

`POST /api/v1/palettes`

#### Required Parameters

| Name  | Data Type | 
| ------------- | ------------- |
| name  | string  | 
| color_1  | string  |
| color_2  | string  |
| color_3  | string  |
| color_4  | string  |
| color_5  | string  |


| Status  | Response |
| ------------- | ------------- |
| 201 (success)  | the ID of the newly added palette |
| 422 (unprocessable)  | A message indicating which required parameter is missing from the request |


### DELETE an existing project

`DELETE /api/v1/projects/:name`


| Status  | Response |
| ------------- | ------------- |
| 201 (success)  | 'Successfully deleted' |


### PATCH an existing project

`PATCH /api/v1/projects/:name`

#### Required Parameters

| Name  | Data Type | 
| ------------- | ------------- |
| name  | string  | 


| Status  | Response |
| ------------- | ------------- |
| 202 (success)  | 'Project name successfully updated' |
| 404(error)  | message indicating that matching project could not be found to update |

### PATCH an existing palette

`PATCH /api/v1/projects/:palette_name`

#### Required Parameters

1 of the following:

| Name  | Data Type | 
| ------------- | ------------- |
| palette_name  | string  | 
| color_1  | string  | 
| color_2  | string  | 
| color_3  | string  | 
| color_4  | string  | 
| color_5  | string  | 


| Status  | Response |
| ------------- | ------------- |
| 202 (success)  | 'Palette successfully updated' |
| 404(error)  | message indicating that matching palette could not be found to update |


