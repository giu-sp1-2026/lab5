import { Injectable } from '@nestjs/common';

@Injectable()
export class TodosService {
  private todos = [];
  private id = 1;

  getAll() {
    return this.todos;
  }

  getOne(id: number) {
    return this.todos.find((todo) => todo.id === id);
  }

  create(todo: any) {
    const newTodo = {
      id: this.id++,
      title: todo.title || 'Untitled',
      done: todo.done || false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(id: number, updatedTodo: any) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.title = updatedTodo.title ?? todo.title;
      todo.done = updatedTodo.done ?? todo.done;
    }
    return todo;
  }

  delete(id: number) {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      return { message: 'Todo deleted' };
    }
    return { message: 'Todo not found' };
  }
}
