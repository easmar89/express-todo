const SeedData = require('./seed-data');
const deepCopy = require('./deep-copy');
const { sortTodoLists, sortTodos } = require('./sort');

module.exports = class SessionPersistence {
  constructor(session) {
    this._todoLists = session.todoLists || deepCopy(SeedData);
    session.todoLists = this._todoLists;
  }

  loadTodo(todoListId, todoId) {
    let todo = this._findTodo(todoListId, todoId);
    return deepCopy(todo);
  }

  loadTodoList(todoListId) {
    let todoList = this._findTodoList(todoListId);
    return deepCopy(todoList);
  }

  isDoneTodoList(todoList) {
    return (
      todoList.todos.length > 0 && todoList.todos.every((todo) => todo.done)
    );
  }

  hasUndoneTodos(todoList) {
    return todoList.todos.some((todo) => !todo.done);
  }

  sortedTodos(todoList) {
    let todos = todoList.todos;
    let undone = todos.filter((todo) => !todo.done);
    let done = todos.filter((todo) => todo.done);

    return deepCopy(sortTodos(undone, done));
  }

  //Return the list of todo lists sorted by completion status and title (case-insensitive).
  sortedTodoLists() {
    let todoLists = deepCopy(this._todoLists);
    let undone = todoLists.filter((todoList) => !this.isDoneTodoList(todoList));
    let done = todoLists.filter((todoList) => this.isDoneTodoList(todoList));
    return sortTodoLists(undone, done);
  }

  toggleDoneTodo(todoListId, todoId) {
    let todo = this._findTodo(todoListId, todoId);
    if (!todo) return false;

    todo.done = !todo.done;
    return true;
  }

  _findTodoList(todoListId) {
    return this._todoLists.find((todoList) => todoList.id === todoListId);
  }

  _findTodo(todoListId, todoId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return undefined;

    return todoList.todos.find((todo) => todo.id === todoId);
  }

  deleteTodo(todoListId, todoId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    let todoIndex = todoList.todos.findIndex((todo) => todo.id === todoId);
    if (todoIndex === -1) return false;

    todoList.todos.splice(todoIndex, 1);
    return true;
  }
};