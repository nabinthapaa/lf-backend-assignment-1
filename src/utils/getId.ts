import todos from "../data/todos";

export function getTodoId(): number {
  return todos[todos.length - 1].id + 1;
}
