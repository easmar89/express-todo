const { dbQuery } = require('./db-query');

module.exports = class PgPersistence {
  _partitionTodoLists(todoLists) {
    let undone = [];
    let done = [];

    todoLists.forEach((todoList) => {
      if (this.isDoneTodoList(todoList)) {
        done.push(todoList);
      } else {
        undone.push(todoList);
      }
    });

    return undone.concat(done);
  }

  isDoneTodoList(todoList) {
    return (
      todoList.todos.length > 0 && todoList.todos.every((todo) => todo.done)
    );
  }

  async sortedTodoLists() {
    const ALL_TODOLISTS = 'SELECT * FROM todolists ORDER BY lower(title) ASC';
    const FIND_TODOS = 'SELECT * FROM todos WHERE todolist_id = $1';

    let result = await dbQuery(ALL_TODOLISTS);
    let todoLists = result.rows;

    for (let index = 0; index < todoLists.length; ++index) {
      let todoList = todoLists[index];
      let todos = await dbQuery(FIND_TODOS, todoList.id);
      todoList.todos = todos.rows;
    }

    return this._partitionTodoLists(todoLists);
  }
};
