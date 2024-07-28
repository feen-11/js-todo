import { element } from './html-util.js';

export class TodoItemView {
  createElement(todoItem, { onUpdateTodo, onEditTodo, onDeleteTodo }) {
    const todoItemElement = todoItem.completed
      ? element`<li><input type="checkbox" class="checkbox" checked>
                                    <s>${todoItem.title}</s>
                                    <button class="edit">編集</button>
                                    <button class="delete">削除</button>
                                </li>`
      : element`<li><input type="checkbox" class="checkbox">
                                    ${todoItem.title}
                                    <button class="edit">編集</button>
                                    <button class="delete">削除</button>
                                </li>`;
    const inputCheckboxElement = todoItemElement.querySelector('.checkbox');
    inputCheckboxElement.addEventListener('change', () => {
      onUpdateTodo({
        id: todoItem.id,
        completed: !todoItem.completed,
      });
    });
    const editButtonElement = todoItemElement.querySelector('.edit');
    editButtonElement.addEventListener('click', () => {
      const editFormElement = element`<form class="edit-form">
                      <input type="text" class="edit-input" value="${todoItem.title}">
                      <button type="submit">保存</button>
                    </form>`;
      todoItemElement.innerHTML = '';
      todoItemElement.appendChild(editFormElement);

      editFormElement.addEventListener('submit', (event) => {
        event.preventDefault();
        const inputElement = editFormElement.querySelector('.edit-input');
        onEditTodo({
          id: todoItem.id,
          title: inputElement.value,
        });
      });
    });
    const deleteButtonElement = todoItemElement.querySelector('.delete');
    deleteButtonElement.addEventListener('click', () => {
      onDeleteTodo({
        id: todoItem.id,
      });
    });
    return todoItemElement;
  }
}
