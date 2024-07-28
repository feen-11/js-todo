import { EventEmitter } from '../EventEmitter.js';

export class TodoListModel extends EventEmitter {
  #items;

  constructor(items = []) {
    super();
    this.#items = items;
  }

  getTotalCount() {
    return this.#items.length;
  }
  getDoneTotalCount() {
    return this.#items.filter((item) => item.completed).length;
  }
  getUndoTotalCount() {
    return this.#items.filter((item) => !item.completed).length;
  }

  getTodoItems() {
    return this.#items;
  }

  onChange(listener) {
    this.addEventListener('change', listener);
  }

  emitChange() {
    this.emit('change');
  }

  addTodo(todoItem) {
    this.#items.push(todoItem);
    this.emitChange();
  }

  updateTodo({ id, completed }) {
    const todoItem = this.#items.find((todo) => todo.id === id);
    if (!todoItem) {
      return;
    }
    todoItem.completed = completed;
    this.emitChange();
  }
  deleteTodo({ id }) {
    const result = confirm('本当に削除してもよろしいですか？');
    if (result) {
      this.#items = this.#items.filter((todo) => {
        return todo.id !== id;
      });
      this.emitChange();
    } else {
      return;
    }
  }

  editTodo({ id, title }) {
    const todoItem = this.#items.find((item) => item.id === id);
    if (todoItem) {
      todoItem.updateTitle(title);
      this.emitChange();
    }
  }
}
