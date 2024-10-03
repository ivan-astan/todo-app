import { v1 } from "uuid";
import { TodoListStateType, actions, todoListReducer } from "./todolistReducer";
import { TodoListType } from "../App";

const todoListId_1 = v1();
const todoListId_2 = v1();

const getInitialState = (): TodoListStateType => ({
  todoLists: [{ id: todoListId_1, filter: "all", title: "TODO" }],
  tasks: {
    [todoListId_1]: [{ id: v1(), title: "HTML", isDone: true }],
    [todoListId_2]: [{ id: v1(), title: "HTML", isDone: true }],
  },
  isFetching: false,
  isAuth: false
});

test("adds todoList", () => {
  const initialState = getInitialState();

  const newState = todoListReducer(
    initialState,
    actions.addTodoListAC("TO BUY")
  );

  expect(newState.todoLists.length).toBe(2);
  expect(newState.todoLists[0].title).toBe("TO BUY");
  expect(Object.keys(newState.tasks).length).toBe(3);
});

test("removes todoList", () => {
  const initialState = getInitialState();

  const newState = todoListReducer(
    initialState,
    actions.removeTodolistAC(todoListId_1)
  );

  expect(newState.todoLists.length).toBe(0);
});

test("add task to todoList", () => {
  const initialState = getInitialState();

  const newState = todoListReducer(
    initialState,
    actions.addTaskAC(todoListId_1, "REACT")
  );

  expect(newState.tasks[todoListId_1][0].title).toBe("REACT");
  expect(newState.tasks[todoListId_1][0].isDone).toBe(false);
  expect(newState.tasks[todoListId_1][1].title).toBe("HTML");
});

test("remove task from todoList", () => {
  const initialState = getInitialState();

  const newState = todoListReducer(
    initialState,
    actions.removeTaskAC(todoListId_1, initialState.tasks[todoListId_1][0].id)
  );
  expect(newState.tasks[todoListId_1].length).toBe(0);
});
test("changes task title in todoList", () => {
  const initialState = getInitialState();

  const newState = todoListReducer(
    initialState,
    actions.changeTaskTitleAC(
      todoListId_1,
      initialState.tasks[todoListId_1][0].id,
      "CSS"
    )
  );
  expect(newState.tasks[todoListId_1][0].title).toBe("CSS");
  expect(newState.tasks[todoListId_1][0].isDone).toBe(true);
});
test("changes task checked in todoList", () => {
  const initialState = getInitialState();

  const newState = todoListReducer(
    initialState,
    actions.changeCheckedTaskAC(
      todoListId_1,
      initialState.tasks[todoListId_1][0].id,
      false
    )
  );
  expect(newState.tasks[todoListId_1][0].title).toBe("HTML");
  expect(newState.tasks[todoListId_1][0].isDone).toBe(false);
});
test("changes todolist title", () => {
  const initialState = getInitialState();

  const newState = todoListReducer(
    initialState,
    actions.changeTodoListTitleAC(todoListId_1, "TO LEARN")
  );
  expect(
    newState.todoLists.find((tl: TodoListType) => tl.id === todoListId_1)?.title
  ).toBe("TO LEARN");
  expect(newState.tasks[todoListId_1][0].isDone).toBe(true);
});
test("updates todolist filter", () => {
  const initialState = getInitialState();

  const newState = todoListReducer(
    initialState,
    actions.updateTodolistFilterAC("completed", todoListId_1)
  );
  expect(
    newState.todoLists.find((tl: TodoListType) => tl.id === todoListId_1)
      ?.filter
  ).toBe("completed");
  expect(newState.tasks[todoListId_1][0].isDone).toBe(true);
});
