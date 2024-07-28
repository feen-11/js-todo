import { render } from './view/html-util.js';
import { TodoListView } from './view/TodoListView.js';
import { TodoItemModel } from './model/TodoItemModel.js';
import { TodoListModel } from './model/TodoListModel.js';

export class App {
  #todoListView = new TodoListView();
  #todoListModel = new TodoListModel([]);

  handleAdd(title) {
    this.#todoListModel.addTodo(new TodoItemModel({ title, completed: false }));
  }

  handleUpdate({ id, completed, title }) {
    if (title !== undefined) {
      this.#todoListModel.editTodo({ id, title });
    } else {
      this.#todoListModel.updateTodo({ id, completed });
    }
  }

  handleDelete({ id }) {
    this.#todoListModel.deleteTodo({ id });
  }

  mount() {
    const formElement = document.querySelector('#js-form');
    const inputElement = document.querySelector('#js-form-input');
    const todoItemCountElement = document.querySelector('#js-todo-count');
    const doneItemCountElement = document.querySelector('#js-done-count');
    const undoItemCountElement = document.querySelector('#js-undo-count');
    const containerElement = document.querySelector('#js-todo-list');
    this.#todoListModel.onChange(() => {
      const todoItems = this.#todoListModel.getTodoItems();
      const todoListElement = this.#todoListView.createElement(todoItems, {
        onUpdateTodo: ({ id, completed }) => {
          this.handleUpdate({ id, completed });
        },
        onDeleteTodo: ({ id }) => {
          this.handleDelete({ id });
        },
        onEditTodo: ({ id, title }) => {
          this.handleUpdate({ id, title });
        },
      });
      render(todoListElement, containerElement);
      todoItemCountElement.textContent = `全てのタスク: ${this.#todoListModel.getTotalCount()}`;
      doneItemCountElement.textContent = `完了済み: ${this.#todoListModel.getDoneTotalCount()}`;
      undoItemCountElement.textContent = `未完了: ${this.#todoListModel.getUndoTotalCount()}`;
    });

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleAdd(inputElement.value);
      inputElement.value = '';
    });
  }
}
