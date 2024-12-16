/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Selected } from './types/Selected';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('Unable to load todos');
  const [isError, setIsError] = useState(false);
  const [selected, setSelected] = useState(Selected.All);

  const todosToShow = todos.filter(todo => {
    switch (selected) {
      case Selected.Active:
        return !todo.completed;
      case Selected.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodos = todos.filter(todo => todo.completed === false);
  const completedTodos = todos.filter(todo => todo.completed === true);

  const showError = (message: string) => {
    setIsError(true);
    setErrorMessage(message);

    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed === true),
            })}
            data-cy="ToggleAllButton"
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todosToShow.map(todo => {
            return (
              <div
                data-cy="Todo"
                className={classNames('todo', { completed: todo.completed })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selected === Selected.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setSelected(Selected.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selected === Selected.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setSelected(Selected.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selected === Selected.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setSelected(Selected.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsError(false)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
