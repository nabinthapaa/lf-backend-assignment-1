# Introduction

This project provide a simple set of routes for creating, reading, updating and deleting todos.

## Table of Contents

- [LF-backend-assignment-1](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Todo Structure](#todo-structure)
  - [Routes](#routes)
  - [Response](#response)
  - [Setup/Installation](#setupinstallation)
  - [Docker](#docker)
  - [Examples commands using Curl](#examples-commands-using-curl)

## Todo structure

```ts
  {
    id: number,
    task: string,
    createdAt: Date,
    isCompleted: boolean,
    completedAt: Date
  }
```

## Routes

### Base route

```bash
http://localhost:8000/todos
```

### Methods

1. `GET` request to the above route to `get all todos`

   ```json
   /** returns */
   [Todo]
   ```

1. `POST` request to above link to `create a todo`

1. `PUT` request to the base link with id param
   ```bash
   http://localhost:8000/todos/:id
   ```
   1. Body contains following:
      1. To `Update Status`
         ```json
         {
           "isCompleted": true /** <boolean> */
         }
         ```
      1. To `Update Todo`
         ```json
         {
           "task": "Update task" /** <string> */
         }
         ```
1. `DELETE` request with `id` to `delete a todo`
   ```bash
   http://localhost:8000/todos/:id
   ```

## Response

1. `GET` Request: Array of [Todo](#todo-structure)
1. `POST` Request: Returns
   ```ts
   {
     "message": string,
     "data": Todo | null
   };
   ```
1. `PUT` Request: Returns
   ```ts
   {
     "message": string,
     "data": Todo | null
   };
   ```
1. `DELETE` Request: Returns
   ```ts
   {
     "message": string,
     "data": Todo | null
   };
   ```

## Setup/Installation

1. Clone the repository
   ```bash
   git clone https://github.com/nabinthapaa/lf-backend-assignment-1
   cd lf-backend-assignment-1
   ```
1. Install the dependencies
   ```bash
   npm install
   ```
1. Run in development mode
   ```bash
   npm run dev
   ```

## Docker

This project is also setup for usage with docker

### Steps

1. Get docker image from
   ```bash
   docker pull s0skai/lf-backend-todo:latest
   ```
1. Run docker image with port mapped to 8000
   ```bash
   docker run -p 8000:8000 s0skai/lf-backend-todo:latest
   ```
1. Run docker image with port mapped to 8000 and remove image after usage
   ```bash
   docker run --rm -p 8000:8000 s0skai/lf-backend-todo:latest
   ```
1. Run docker image with port mapped to 8000 and in development mode
   ```bash
   docker run -p 8000:8000 -v $(pwd):/code s0skai/lf-backend-todo:latest
   ```

## Examples commands using curl

1. `Get` all Todos

   ```bash
   curl -X GET "http://localhost:8000/todos"
   ```

1. `Create` a Todo

   ```bash
   curl -X POST "http://localhost:8000/todos"\
    -H "Content-Type:application/json"\
     -d '{"task": "New Task"}'
   ```

1. `Update` a Todo task <br>
   `Note: change id in url`

   ```bash
   curl -X PUT "http://localhost:8000/todos/:id?update=status" \
     -H "Content-Type: application/json" \
     -d '{"task": "Updated Task"}'
   ```

1. `Update` a Todo Status <br>
   `Note: change id in url`

   ```bash
   curl -X PUT "http://localhost:8000/todos/:id?update=status" \
     -H "Content-Type: application/json" \
     -d '{"isCompleted": true}'

   ```

1. `Delete` a Todo <br>
   `Note: Change id in url`
   ```bash
   curl -X DELETE "http://localhost:8000/todos/:id"
   ```
