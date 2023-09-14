import { Test, TestingModule } from '@nestjs/testing';
import { TodoResolver } from '../../../src/todo/todo.resolver';
import { TodoService } from '../../../src/todo/todo.service';
import { CreateTodoInput } from '../../../src/todo/dto/create-todo.input';
import { UpdateTodoInput } from '../../../src/todo/dto/update-todo.input';
import { TodoSearchInput } from '../../../src/todo/dto/todo-search.input';
import { Todo } from '../../../src/todo/entities/todo.entity';

describe('TodoResolver', () => {
  let todoResolver: TodoResolver;
  let todoService: TodoService;

  const mockTodo: Todo = {
    id: 1,
    title: 'New Todo',
    description: 'Description of the new todo',
    completed: false,
    createdAt: new Date('Tue Sep 21 2021 16:16:50 GMT-0400 (Eastern Daylight Time)'),
    updatedAt: new Date('Tue Sep 21 2021 16:16:50 GMT-0400 (Eastern Daylight Time)'),
  };

  const mockTodoService = {
    createTodo: jest.fn().mockResolvedValueOnce(mockTodo),
    findAllTodos: jest.fn().mockResolvedValueOnce([mockTodo]),
    findTodoById: jest.fn().mockResolvedValueOnce(mockTodo),
    updateTodoById: jest.fn(),
    removeTodoById: jest.fn().mockResolvedValueOnce(mockTodo),
    searchTodosByTitleOrDescription: jest.fn().mockResolvedValueOnce(mockTodo),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoResolver,
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    todoResolver = module.get<TodoResolver>(TodoResolver);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoResolver).toBeDefined();
  });

  describe('when createTodo is called', () => {
    it('should create a new Todo', async () => {
      const todo: CreateTodoInput = {
        title: 'New Todo 10',
        description: 'Description of the new todo 10',
      };

      mockTodoService.createTodo = jest.fn().mockResolvedValueOnce(mockTodo);

      const result = await todoResolver.createTodo(todo);

      expect(todoService.createTodo).toHaveBeenCalled();
      expect(result).toEqual(mockTodo);
      expect(result).toEqual(expect.objectContaining(mockTodo));
    });
  });

  describe('when findAllTodos is called', () => {
    it('should return all todos', async () => {
      const result = await todoResolver.findAllTodos();

      expect(todoService.findAllTodos).toHaveBeenCalled();
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('when findTodoById is called', () => {
    it('should return a todo by ID', async () => {
      const result = await todoResolver.findTodoById(mockTodo.id);

      expect(todoService.findTodoById).toHaveBeenCalled();
      expect(result).toEqual(mockTodo);
    });
  });

  describe('when updateTodoById is called', () => {
    it('should update todo by its ID', async () => {
      const updatedTodo = {
        ...mockTodo,
        title: 'Updated Title',
      };

      const updateTodo: UpdateTodoInput = {
        id: 1,
        title: 'test title',
        description: 'description',
        updatedAt: new Date(),
      };

      mockTodoService.updateTodoById = jest.fn().mockResolvedValueOnce(updatedTodo);

      const result = await todoService.updateTodoById(mockTodo.id, updateTodo);

      expect(todoService.updateTodoById).toHaveBeenCalled();
      expect(result).toEqual(updatedTodo);
    });
  });

  describe('when removeTodoById is called', () => {
    it('should delete a book by ID', async () => {
      const result = await todoService.removeTodoById(mockTodo.id);

      expect(todoService.removeTodoById).toHaveBeenCalled();
      expect(result).toEqual(mockTodo);
    });
  });

  describe('when searchTodosByTitleOrDescription is called', () => {
    it('should search the todos by title or description', async () => {
      const searchInput: TodoSearchInput = {
        title: 'Sample Title',
        description: 'Sample Description',
      };

      const result = await todoService.searchTodosByTitleOrDescription(searchInput);

      expect(todoService.searchTodosByTitleOrDescription).toHaveBeenCalled();
      expect(result).toEqual(mockTodo);
    });
  });
});
