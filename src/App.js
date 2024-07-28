import { TodoListModel } from './model/TodoListModel.js';
import { TodoItemModel } from './model/TodoItemModel.js';
import { element, render } from './view/html-util.js';

export class App {
  #todoListModel = new TodoListModel();

  mount() {
    const formElement = document.querySelector('#js-form');
    const inputElement = document.querySelector('#js-form-input');
    const containerElement = document.querySelector('#js-todo-list');
    const todoItemCountElement = document.querySelector('#js-todo-count');
    const doneItemCountElement = document.querySelector('#js-done-count');
    const undoItemCountElement = document.querySelector('#js-undo-count');
    this.#todoListModel.onChange(() => {
      const todoListElement = element`<ul></ul>`;
      const todoItems = this.#todoListModel.getTodoItems();
      todoItems.forEach((item) => {
        const todoItemElement = item.completed
          ? element`<li><input type="checkbox" class="checkbox" checked>
                  <s>${item.title}</s>
                  <button class="edit">編集</button>
                  <button class="delete">削除</button>
              </li>`
          : element`<li><input type="checkbox" class="checkbox">
                  ${item.title}
                  <button class="edit">編集</button>
                  <button class="delete">削除</button>
              </li>`;
        const inputCheckboxElement = todoItemElement.querySelector('.checkbox');
        inputCheckboxElement.addEventListener('change', () => {
          this.#todoListModel.updateTodo({
            id: item.id,
            completed: !item.completed,
          });
        });
        const editButtonElement = todoItemElement.querySelector('.edit');
        editButtonElement.addEventListener('click', () => {
          const editFormElement = element`<form class="edit-form">
                      <input type="text" class="edit-input" value="${item.title}">
                      <button type="submit">保存</button>
                    </form>`;
          todoItemElement.innerHTML = '';
          todoItemElement.appendChild(editFormElement);

          editFormElement.addEventListener('submit', (event) => {
            event.preventDefault();
            const inputElement = editFormElement.querySelector('.edit-input');
            this.#todoListModel.editTodo({
              id: item.id,
              title: inputElement.value,
            });
          });
        });
        const deleteButtonElement = todoItemElement.querySelector('.delete');
        deleteButtonElement.addEventListener('click', () => {
          this.#todoListModel.deleteTodo({
            id: item.id,
          });
        });
        todoListElement.appendChild(todoItemElement);
      });
      render(todoListElement, containerElement);
      todoItemCountElement.textContent = `全てのタスク: ${this.#todoListModel.getTotalCount()}`;
      doneItemCountElement.textContent = `完了済み: ${this.#todoListModel.getDoneTotalCount()}`;
      undoItemCountElement.textContent = `未完了: ${this.#todoListModel.getUndoTotalCount()}`;
    });
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#todoListModel.addTodo(
        new TodoItemModel({
          title: inputElement.value,
          completed: false,
        })
      );
      inputElement.value = '';
    });
  }
}
