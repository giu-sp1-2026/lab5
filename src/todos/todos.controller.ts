import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './models/todos.schema';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getAll() {
    return this.todosService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.todosService.getOne(id);
  }

  @Post()
  create(@Body() todo: Partial<Todo>) {
    return this.todosService.create(todo);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() todo: Partial<Todo>) {
    return this.todosService.update(id, todo);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todosService.delete(id);
  }
}
