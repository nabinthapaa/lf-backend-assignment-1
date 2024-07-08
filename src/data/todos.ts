import { ITodo } from "../interface/todo";

const todos: ITodo[] = [
  {
    id: 1,
    task: "Get job done",
    isCompleted: false,
    createdAt: new Date(),
    completedAt: null,
  },
];

export default todos;
