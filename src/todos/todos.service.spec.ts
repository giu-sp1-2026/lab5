import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Todo } from './models/todos.schema';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;
  let todoModel: {
    find: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };

  beforeEach(async () => {
    todoModel = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: getModelToken(Todo.name), useValue: todoModel },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns todos from the model', async () => {
    const todos = [{ title: 'Test', done: false }];
    const query = { exec: jest.fn().mockResolvedValue(todos) };
    todoModel.find.mockReturnValue(query);

    await expect(service.getAll()).resolves.toEqual(todos);
    expect(todoModel.find).toHaveBeenCalledWith();
  });

  it('looks up a todo by its MongoDB id', async () => {
    const todo = { title: 'Test', done: false };
    const query = { exec: jest.fn().mockResolvedValue(todo) };
    todoModel.findById.mockReturnValue(query);

    await expect(service.getOne('507f1f77bcf86cd799439011')).resolves.toEqual(
      todo,
    );
    expect(todoModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });

  it('creates a todo with the model', async () => {
    const todo = { title: 'Test', done: false };
    todoModel.create.mockResolvedValue(todo);

    await expect(service.create(todo)).resolves.toEqual(todo);
    expect(todoModel.create).toHaveBeenCalledWith(todo);
  });

  it('updates a todo with validation enabled', async () => {
    const todo = { title: 'Updated', done: true };
    const query = { exec: jest.fn().mockResolvedValue(todo) };
    todoModel.findByIdAndUpdate.mockReturnValue(query);

    await expect(
      service.update('507f1f77bcf86cd799439011', todo),
    ).resolves.toEqual(todo);
    expect(todoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      todo,
      { new: true, runValidators: true },
    );
  });

  it('reports when a todo to delete does not exist', async () => {
    const query = { exec: jest.fn().mockResolvedValue(null) };
    todoModel.findByIdAndDelete.mockReturnValue(query);

    await expect(service.delete('507f1f77bcf86cd799439011')).resolves.toEqual({
      message: 'Todo not found',
    });
  });
});
