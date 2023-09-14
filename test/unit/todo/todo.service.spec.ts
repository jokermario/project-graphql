import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../../../src/todo/todo.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { Todo } from '../../../src/todo/entities/todo.entity';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTodoInput } from '../../../src/todo/dto/create-todo.input';
import { Prisma } from '@prisma/client';
import * as sanitizeHtml from 'sanitize-html';
import { UpdateTodoInput } from '../../../src/todo/dto/update-todo.input';
import { TodoSearchInput } from '../../../src/todo/dto/todo-search.input';

// Start describing the test suite for the TodoService
describe('TodoService', () => {
  let todoService: TodoService;
  let prismaService: PrismaService;

  // Execute this block of code before each test
  beforeEach(async () => {
    // Create a testing module with mocked providers
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: {
            // Mock PrismaService methods for testing
            todo: {
              create: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    // Get instances of TodoService and PrismaService
    todoService = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // Start testing the 'TodoService' class itself
  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  // Describe the 'Create Todo' functionality
  describe('Create Todo', () => {
    // Test scenario: Creating a new todo
    describe('when the create function is called', () => {
      it('should create a new todo', async () => {
        // Arrange
        const createTodoInput: CreateTodoInput = {
          title: 'New Todo',
          description: 'Description of the new todo',
        };
        const createdTodo: Todo = {
          id: 1,
          title: createTodoInput.title,
          description: createTodoInput.description,
          completed: false,
          createdAt: new Date('Tue Sep 21 2021 16:16:50 GMT-0400 (Eastern Daylight Time)'),
          updatedAt: new Date('Tue Sep 21 2021 16:16:50 GMT-0400 (Eastern Daylight Time)'),
        };
        prismaService.todo.create = jest.fn().mockResolvedValue(createdTodo);

        // Act
        const result = await todoService.createTodo(createTodoInput);

        // Assert
        expect(result).toEqual(createdTodo);
      });
    });

    // Test scenario: Creating a todo with a duplicate title
    describe('when a todo with a title already exists', () => {
      it('should throw ConflictException', async () => {
        // Arrange
        const createTodoInput = {
          title: 'New Todo',
          description: 'Test Description',
        };
        prismaService.todo.create = jest.fn().mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('A todo with that title already exists', {
            batchRequestIdx: 0,
            clientVersion: '',
            meta: undefined,
            code: 'P2002',
          }),
        );

        // Act & Assert
        await expect(todoService.createTodo(createTodoInput)).rejects.toThrowError(ConflictException);
      });
    });

    // Test scenario: Creating a todo and an unexpected error occurs
    describe('when an unexpected error occurs', () => {
      it('should throw InternalServerErrorException', async () => {
        // Arrange
        const createTodoInput = {
          title: 'New Todo',
          description: 'Test Description',
        };

        prismaService.todo.create = jest
          .fn()
          .mockRejectedValue(new InternalServerErrorException('An unexpected error has occurred'));

        // Act & Assert
        try {
          await todoService.createTodo(createTodoInput);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toBe(`An unexpected error has occurred`);
        }
      });
    });

    // Test scenario: Creating a todo with title and description sanitization
    describe('when title and description are supplied', () => {
      it('should sanitize the title and description before creating a new todo', async () => {
        // Arrange
        const createTodoInput: CreateTodoInput = {
          title: 'Test <script>alert("Hello")</script>',
          description: '<b>Some description</b>',
        };

        const expectedSanitizedTitle = sanitizeHtml(createTodoInput.title, todoService.sanitizeOptions);
        const expectedSanitizedDescription = sanitizeHtml(createTodoInput.description, todoService.sanitizeOptions);

        const expectedTodo = {
          id: 1,
          title: expectedSanitizedTitle,
          description: expectedSanitizedDescription,
          completed: false,
          createdAt: new Date('Tue Sep 21 2021 16:16:50 GMT-0400 (Eastern Daylight Time)'),
          updatedAt: new Date('Tue Sep 21 2021 16:16:50 GMT-0400 (Eastern Daylight Time)'),
        };

        // Mock PrismaService.create to return expectedTodo
        prismaService.todo.create = jest.fn().mockResolvedValue(expectedTodo);

        // Act
        const result = await todoService.createTodo(createTodoInput);

        // Assert
        expect(result).toEqual(expectedTodo);
      });
    });
  });

  // Start describing the 'Find Todo By ID' test suite
  describe('Find Todo By ID', () => {
    // Test scenario: Finding a todo by ID when it exists
    describe('when findTodoByID is called', () => {
      it('should return a todo if found', async () => {
        // Arrange
        const todo: Todo = {
          id: 1,
          title: 'Test Todo',
          completed: false,
          createdAt: undefined,
          description: '',
          updatedAt: undefined,
        };

        // Mock PrismaService.create to return expectedTodo
        prismaService.todo.findUniqueOrThrow = jest.fn().mockResolvedValue(todo);

        // Act
        const result = await todoService.findTodoById(1);

        //Assert
        expect(result).toEqual(todo);
      });
    });

    // Test scenario: Finding a todo by ID when it doesn't exist
    describe('when a todo id is not found', () => {
      it('should throw NotFoundException', async () => {
        prismaService.todo.findUniqueOrThrow = jest.fn().mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('The todo does not exists', {
            batchRequestIdx: 0,
            clientVersion: '',
            meta: undefined,
            code: 'P2025',
          }),
        );

        //Act and Assert
        await expect(todoService.findTodoById(1)).rejects.toThrowError(NotFoundException);
      });
    });
  });

  // Start describing the 'Find All Todos' test suite
  describe('Find All Todos', () => {
    // Test scenario: Finding all todos when they exist
    describe('when findAllTodos is called', () => {
      it('should return an array of 5 todo items by default', async () => {
        // Arrange
        const mockTodoItems: Todo[] = [
          {
            id: 1,
            title: 'Test Todo 1',
            completed: false,
            createdAt: undefined,
            description: '',
            updatedAt: undefined,
          },
          {
            id: 2,
            title: 'Test Todo 2',
            completed: false,
            createdAt: undefined,
            description: '',
            updatedAt: undefined,
          },
          {
            id: 3,
            title: 'Test Todo 3',
            completed: false,
            createdAt: undefined,
            description: '',
            updatedAt: undefined,
          },
          {
            id: 4,
            title: 'Test Todo 4',
            completed: false,
            createdAt: undefined,
            description: '',
            updatedAt: undefined,
          },
          {
            id: 5,
            title: 'Test Todo 5',
            completed: false,
            createdAt: undefined,
            description: '',
            updatedAt: undefined,
          },
        ];

        // Mock PrismaService.findMany to return mockTodoItems
        prismaService.todo.findMany = jest.fn().mockResolvedValue(mockTodoItems);

        // Act
        const result = await todoService.findAllTodos();

        // Assert
        expect(result).toEqual(mockTodoItems);
        // Also, verify that PrismaService.findMany was called with correct parameters
        expect(prismaService.todo.findMany).toHaveBeenCalledWith({
          take: 5, // Limit to 5 items
          where: {}, // No specific conditions
          orderBy: { id: 'asc' }, // Order by ID in ascending order
        });
      });
    });

    // Test scenario: Finding all todos when no todos exist
    describe('when findAllTodos is called and no todos exist', () => {
      it('should return an empty array', async () => {
        // Arrange: Mock PrismaService.findMany to return an empty array
        prismaService.todo.findMany = jest.fn().mockResolvedValue([]);
        // Act
        const result = await todoService.findAllTodos();
        // Assert
        expect(result).toEqual([]);
      });
    });
  });

  // Start describing the 'Update Todo By ID' test suite
  describe('Update Todo By ID', () => {
    // Test scenario: Updating a todo by ID
    describe('when updateTodoByID is called', () => {
      it('should update the todo and return', async () => {
        // Arrange: Define todoId, updateTodoInput, and updatedTodo
        const todoId = 1;
        const updateTodoInput: UpdateTodoInput = {
          id: 1,
          title: 'test title',
          description: 'description',
          updatedAt: new Date(),
        };
        const updatedTodo: Todo = {
          id: 1,
          title: 'Test Todo 1',
          completed: false,
          createdAt: undefined,
          description: updateTodoInput.description,
          updatedAt: updateTodoInput.updatedAt,
        };

        // Mock the PrismaService methods
        prismaService.todo.update = jest.fn().mockResolvedValue(updatedTodo);

        const result = await todoService.updateTodoById(todoId, updateTodoInput);

        // Act: Call the method to update the todo by ID
        expect(result).toEqual(updatedTodo);
        // Also, verify that PrismaService.update was called with correct parameters
        expect(prismaService.todo.update).toHaveBeenCalledWith({
          where: { id: todoId }, // Update the todo with the specified ID
          data: expect.any(Object), // Expecting some data to update with
        });
      });
    });

    // Test scenario: Updating a todo by ID with a non-existent id
    describe('when updateTodoById is called with a non-existent id', () => {
      it('should throw NotFoundException', async () => {
        // Arrange: Define todoId and updateTodoInput
        const todoId = 1;
        const updateTodoInput: UpdateTodoInput = {
          id: 1,
          title: 'test title',
          description: 'description',
          updatedAt: new Date(),
        };

        // Mock the PrismaService methods to throw a Prisma.PrismaClientKnownRequestError
        prismaService.todo.update = jest.fn().mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('Cannot update todo', {
            batchRequestIdx: 0,
            clientVersion: '',
            meta: undefined,
            code: 'P2025',
          }),
        );

        // Act & Assert: Check if the NotFoundException is thrown when updating a non-existent todo
        await expect(todoService.updateTodoById(todoId, updateTodoInput)).rejects.toThrowError(NotFoundException);
      });
    });

    // Test scenario: Sanitizing inputs when updating a todo
    describe('when updating todo', () => {
      it('should sanitize the inputs', async () => {
        // Arrange: Define todoId and updateTodoInput with unsafe HTML
        const todoId = 1;
        const updateTodoInput: UpdateTodoInput = {
          id: 1,
          title: '<script>alert("XSS Attack!");</script>',
          description: '<p>Unsafe HTML</p>',
          completed: true,
          updatedAt: new Date(),
        };

        // Define the expected sanitized title and description
        const expectedSanitizedTitle = sanitizeHtml(updateTodoInput.title, todoService.sanitizeOptions);
        const expectedSanitizedDescription = sanitizeHtml(updateTodoInput.description, todoService.sanitizeOptions);
        // Mock the PrismaService methods
        prismaService.todo.update = jest.fn().mockResolvedValue({} as Todo);

        // Act: Call the method to update a todo
        await todoService.updateTodoById(todoId, updateTodoInput);

        // Assert: Verify that PrismaService.update was called with sanitized inputs
        expect(prismaService.todo.update).toHaveBeenCalledWith({
          where: { id: todoId },
          data: {
            title: expectedSanitizedTitle,
            description: expectedSanitizedDescription,
            completed: updateTodoInput.completed,
            updatedAt: updateTodoInput.updatedAt,
          },
        });
      });
    });
  });

  // Test scenario: Removing a todo by ID
  describe('Delete Todo By ID', () => {
    // Test scenario: Removing an existing todo by ID
    describe('when removeTodoById is called', () => {
      it('should remove a todo item by ID', async () => {
        // Arrange: Define todoId and mockDeletedTodo
        const todoId = 1;
        const mockDeletedTodo = {
          id: todoId,
          title: 'Test Todo',
          completed: false,
        };

        // Mock the PrismaService methods
        prismaService.todo.delete = jest.fn().mockResolvedValue(mockDeletedTodo);

        // Act: Call the method to remove the todo by ID
        const result = await todoService.removeTodoById(todoId);

        // Assert: Check if the result matches mockDeletedTodo
        expect(result).toEqual(mockDeletedTodo);
        // Also, verify that PrismaService.delete was called with correct parameters
        expect(prismaService.todo.delete).toHaveBeenCalledWith({
          where: { id: todoId },
        });
      });
    });

    // Test scenario: Removing a non-existent todo by ID
    describe('when removeTodoById is called with a non-existence id', () => {
      it('should throw NotFoundException', async () => {
        // Arrange: Define todoId
        const todoId = 1;

        // Mock the PrismaService methods to throw a Prisma.PrismaClientKnownRequestError
        prismaService.todo.delete = jest.fn().mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('Cannot delete todo', {
            batchRequestIdx: 0,
            clientVersion: '',
            meta: undefined,
            code: 'P2025',
          }),
        );

        // Act and Assert
        try {
          await todoService.removeTodoById(todoId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe(`The todo with id: ${todoId} cannot be deleted because does not exist`);
        }
      });
    });
  });

  // Test scenario: Searching todos by title or description
  describe('Search Todos By Title Or Description', () => {
    // Test scenario: Searching with a valid searchInput
    describe('when searchTodoByTitleOrDescription is called with a searchInput', () => {
      it('should return the todos that match the title or description', async () => {
        // Arrange: Define searchInput and expectedResults
        const searchInput: TodoSearchInput = {
          title: 'Sample Title',
          description: 'Sample Description',
        };

        const expectedResults: Todo[] = [
          {
            id: 1,
            title: 'Sample Title',
            description: 'Testing',
            completed: false,
            createdAt: undefined,
            updatedAt: undefined,
          },
          {
            id: 2,
            title: 'Testing',
            description: 'Sample Description',
            completed: false,
            createdAt: undefined,
            updatedAt: undefined,
          },
        ];

        // Mock PrismaService.findMany to return expectedResults
        prismaService.todo.findMany = jest.fn().mockResolvedValue(expectedResults);

        // Act: Call the method to search todos by title or description
        const result = await todoService.searchTodosByTitleOrDescription(searchInput);

        // Assert: Check if the result matches expectedResults
        expect(result).toEqual(expectedResults);
        // Also, verify that PrismaService.findMany was called with correct parameters
        expect(prismaService.todo.findMany).toHaveBeenCalledWith({
          where: {
            OR: [{ title: { search: expect.any(String) } }, { description: { search: expect.any(String) } }],
          },
        });
      });
    });

    // Test scenario: Searching with a non-existent searchInput
    describe('when searchTodoByTitleOrDescription is called with a non-existent searchInput', () => {
      it('should return an empty todo array', async () => {
        // Arrange: Define searchInput for a non-existent todo
        const searchInput: TodoSearchInput = {
          title: 'Non-existing Title',
          description: 'Non-existing Description',
        };

        // Mock PrismaService.findMany to return an empty array
        prismaService.todo.findMany = jest.fn().mockResolvedValue([]);

        // Act: Call the method to search with non-existent searchInput
        const result = await todoService.searchTodosByTitleOrDescription(searchInput);

        // Assert: Check if the result is an empty array
        expect(result).toEqual([]);
        // Also, verify that PrismaService.findMany was called with correct parameters
        expect(prismaService.todo.findMany).toHaveBeenCalledWith({
          where: {
            OR: [{ title: { search: expect.any(String) } }, { description: { search: expect.any(String) } }],
          },
        });
      });
    });
  });
});
