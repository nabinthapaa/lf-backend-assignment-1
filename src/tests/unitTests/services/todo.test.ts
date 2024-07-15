import Sinon from "sinon";
import * as TodoModel from "../../../models/Todo.model";
import * as TodoService from "../../../services/todo.services";
import * as utils from "../../../utils/getUUID";
import { ITodo } from "../../../interface/todo";
import expect from "expect";
import { BaseError, EncryptionError } from "../../../errors";

describe("Todo service unit test suite", () => {
  const todo: Pick<ITodo, "task"> = {
    task: "Get task done",
  };
  const fullTodo: ITodo = {
    task: "task to completed",
    id: "ce980d1c-de63-4e19-844a-1bb050cb3bf3",
    user: "93a210b2-1dea-49f5-a8d5-3febde425795",
    createdAt: new Date("2024-07-15T15:36:34Z"),
    isCompleted: false,
    completedAt: null,
  };
  let getTodosStub: Sinon.SinonStub,
    createTodoStub: Sinon.SinonStub,
    updateTodoTaskStub: Sinon.SinonStub,
    updateTodoStatusStub: Sinon.SinonStub,
    deleteTodoStub: Sinon.SinonStub,
    getUUIDStub: Sinon.SinonStub;
  describe("Todo:Service => Get Users todo", () => {
    beforeEach(() => {
      getTodosStub = Sinon.stub(TodoModel, "getTodos");
      createTodoStub = Sinon.stub(TodoModel, "createTodo");
    });

    afterEach(() => {
      getTodosStub.restore();
      createTodoStub.restore();
    });

    it("Should return empty when no todo found", async () => {
      getTodosStub.resolves([]);
      const id = "2b5c9d37-4f4c-4b52-945e-b63c90e68a21";
      await expect(TodoService.getTodos(id)).resolves.toStrictEqual([]);
    });
    it("Should throw error when no user id provided", async () => {
      //@ts-ignore
      await expect(TodoService.getTodos()).rejects.toThrow(
        new EncryptionError(`No user id provided`),
      );
    });
    it("Should return todos array", async () => {
      getTodosStub.resolves([fullTodo]);
      const id = "93a210b2-1dea-49f5-a8d5-3febde425795";
      await expect(TodoService.getTodos(id)).resolves.toStrictEqual([fullTodo]);
    });
  });

  describe("Todo:Service => CreateTodo", () => {
    beforeEach(() => {
      getUUIDStub = Sinon.stub(utils, "getUUID");
      getTodosStub = Sinon.stub(TodoModel, "getTodos");
      createTodoStub = Sinon.stub(TodoModel, "createTodo");
    });

    afterEach(() => {
      getUUIDStub.restore();
      getTodosStub.restore();
      createTodoStub.restore();
    });

    it("Should throw error when no task is provided", async () => {
      //@ts-ignore
      expect(TodoService.createTodo()).rejects.toThrow(
        new EncryptionError("No task provided"),
      );
    });

    it("Should throw error when no user is provided", async () => {
      //@ts-ignore
      expect(TodoService.createTodo("to do")).rejects.toThrow(
        new EncryptionError("No User information provided"),
      );
    });
    it("Should throw error when failed to create todo ", () => {
      createTodoStub.resolves(undefined);
      const id = "d0f2612a-9507-424b-9ba0-1366b79d6b29",
        userId = "67a0a420-1a9c-43ea-8e10-0a5a3068c0c9";
      expect(TodoService.createTodo(id, userId)).rejects.toThrow(
        new BaseError("Failed to create a todo"),
      );
    });
    it("Should return newly created todo", () => {
      createTodoStub.resolves(fullTodo);
      const id = "d0f2612a-9507-424b-9ba0-1366b79d6b29",
        userId = "67a0a420-1a9c-43ea-8e10-0a5a3068c0c9";
      expect(TodoService.createTodo(id, userId)).resolves.toStrictEqual(
        fullTodo,
      );
    });
  });

  describe("Todo:Service => updateTodo", () => {
    beforeEach(() => {
      createTodoStub = Sinon.stub(TodoModel, "createTodo");
      updateTodoTaskStub = Sinon.stub(TodoModel, "updateTodo");
      updateTodoStatusStub = Sinon.stub(TodoModel, "updateTodoStatus");
    });
    afterEach(() => {
      updateTodoTaskStub.restore();
      updateTodoStatusStub.restore();
      createTodoStub.restore();
    });

    it("Should throw error when failed to update todo", async () => {
      updateTodoTaskStub.resolves(undefined);
      updateTodoStatusStub.resolves(undefined);
      const id = "c579d4a7-ebe3-419b-a58e-797f1c9754ba",
        userId = "3392006c-49ec-407b-a38b-8d74ad0cd4b8",
        task = "todo task";
      await expect(
        TodoService.updateTodo(id, "status", userId, task, true),
      ).rejects.toThrow(new BaseError("Failed to update todo"));
      await expect(
        TodoService.updateTodo(id, "task", userId, task),
      ).rejects.toThrow(new BaseError("Failed to update todo"));
    });
    it("Should update todo status", async () => {
      const updatedTask = { ...fullTodo, isCompleted: true };
      updateTodoTaskStub.resolves(undefined);
      updateTodoStatusStub.resolves(updatedTask);
      const id = "c579d4a7-ebe3-419b-a58e-797f1c9754ba",
        userId = "3392006c-49ec-407b-a38b-8d74ad0cd4b8",
        task = "todo task";
      await expect(
        TodoService.updateTodo(id, "status", userId, task, true),
      ).resolves.toStrictEqual(updatedTask);
      expect(updateTodoTaskStub.callCount).toBe(0);
    });
    it("Should update todo task", async () => {
      const updatedTask = { ...fullTodo, task: "updated todo task" };
      updateTodoTaskStub.resolves(updatedTask);
      updateTodoStatusStub.resolves(undefined);
      const id = "c579d4a7-ebe3-419b-a58e-797f1c9754ba",
        userId = "3392006c-49ec-407b-a38b-8d74ad0cd4b8",
        task = "updated todo task";
      await expect(
        TodoService.updateTodo(id, "task", userId, task),
      ).resolves.toStrictEqual(updatedTask);
      expect(updateTodoStatusStub.callCount).toBe(0);
    });
  });

  describe("Todo:Service => deleteTodo", () => {
    beforeEach(() => {
      deleteTodoStub = Sinon.stub(TodoModel, "deleteTodo");
    });
    afterEach(() => {
      deleteTodoStub.restore();
    });

    it("Should return error when failed to delete todo", async () => {
      deleteTodoStub.resolves(undefined);
      const id = "0d0e7858-b85a-4062-9cda-bf2721b50421",
        userId = "0adec251-d548-42d1-a4c2-6778f559f3bc";
      await expect(TodoService.deleteTodo(id, userId)).rejects.toThrow(
        new BaseError("Failed to delete todo"),
      );
    });
    it("Should return deleted todo", async () => {
      deleteTodoStub.resolves(fullTodo);
      const id = "0d0e7858-b85a-4062-9cda-bf2721b50421",
        userId = "0adec251-d548-42d1-a4c2-6778f559f3bc";
      await expect(TodoService.deleteTodo(id, userId)).resolves.toStrictEqual(
        fullTodo,
      );
    });
  });
});
