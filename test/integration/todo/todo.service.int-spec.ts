import { Test } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { TodoService } from '../../../src/todo/todo.service';
import { CreateTodoInput } from '../../../src/todo/dto/create-todo.input';
import * as sanitizeHtml from 'sanitize-html';
import { UpdateTodoInput } from '../../../src/todo/dto/update-todo.input';
import { TodoSearchInput } from '../../../src/todo/dto/todo-search.input';

describe('TodoService Integration Tests', () => {
  let prismaService: PrismaService;
  let todoService: TodoService;

  let todoId: number;

  const todo: CreateTodoInput = {
    title: 'First Todo',
    description: 'First Todo no dey pain. lol',
  };

  const updateTodoInput: UpdateTodoInput = {
    id: todoId,
    title: 'test title',
    description: 'description',
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    todoService = moduleRef.get<TodoService>(TodoService);

    await prismaService.cleanDatabase();
  });

  // Describe the 'Create Todo' functionality
  describe('Create Todo Integration Tests', () => {
    // Test scenario: Creating a new todo
    describe('when createTodo is called', () => {
      it('should create a todo in the database', async () => {
        // Act
        const result = await todoService.createTodo(todo);
        todoId = result.id;
        // Assert
        expect(result.title).toEqual(todo.title);
        expect(result.description).toEqual(todo.description);

        // const todo = await prisma.todo.create({
        //   data: {
        //     title: `Create Todo Integration Test. Date: ${new Date().getTime()}`,
        //     description: 'Service list',
        //     completed: true,
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        //   },
        // });
        // todoId = todo.id;
      });
    });

    // Test scenario: Creating a todo with a duplicate title
    describe('when a todo with a title already exists', () => {
      it('should throw ConflictException', async () => {
        // Act and Assert
        await todoService
          .createTodo(todo)
          .then(() => expect(todo).toBeUndefined())
          .catch((e) => expect(e.status).toEqual(409));
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

        // Act and Assert
        const result = await todoService.createTodo(createTodoInput);
        expect(result.title).toEqual(expectedSanitizedTitle);
        expect(result.description).toEqual(expectedSanitizedDescription);
      });
    });
  });

  // Start describing the 'Find Todo By ID Integration Tests' test suite
  describe('Find Todo By ID Integration Tests', () => {
    // Test scenario: Finding a todo by ID when it exists
    describe('when findTodoByID is called', () => {
      it('should return a todo if found', async () => {
        // Act and Assert
        const result = await todoService.findTodoById(todoId);
        expect(result).toBeDefined();
      });
    });

    // Test scenario: Finding a todo by ID Integration Tests when it doesn't exist
    describe('when a todo id is not found', () => {
      it('should throw NotFoundException', async () => {
        // Act and Assert
        await todoService
          .findTodoById(10000000)
          .then(() => expect(todo).toBeUndefined())
          .catch((e) => expect(e.status).toEqual(404));
      });
    });
  });

  // Start describing the 'Find All Todos Integration Tests' test suite
  describe('Find All Todos Integration Tests', () => {
    // Test scenario: Finding all todos when they exist
    describe('when findAllTodos is called', () => {
      it('should return an array of todo items in the database', async () => {
        // Act and Assert
        const result = await todoService.findAllTodos();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
      });
    });

    describe('when findAllTodos is called and with cursor and take', () => {
      it('should return all todos adhering to cursor and take params', async () => {
        // Act and Assert
        const result = await todoService.findAllTodos(1, 2);
        expect(result).toHaveLength(2);
      });
    });

    describe('when findAllTodos is called and no todos exist', () => {
      it('should return an empty array', async () => {
        // Act and Assert
        await prismaService.cleanDatabase(); //cleaned the db so this test can pass
        const result = await todoService.findAllTodos();
        expect(result).toHaveLength(0);

        // re-seeding the database with a todo item
        const res = await todoService.createTodo(todo);
        todoId = res.id;
      });
    });
  });

  // Start describing the 'Update Todo By ID Integration Tests' test suite
  describe('Update Todo By ID Integration Tests', () => {
    // Test scenario: Updating a todo by ID
    describe('when updateTodoByID is called', () => {
      it('should update the todo and return', async () => {
        // Act and Assert
        const result = await todoService.updateTodoById(todoId, updateTodoInput);
        expect(result.title).toEqual(updateTodoInput.title);
        expect(result.description).toEqual(updateTodoInput.description);
      });
    });

    // Test scenario: Updating a todo by ID with a non-existent id
    describe('when updateTodoById is called with a non-existent id', () => {
      it('should throw NotFoundException', async () => {
        // Act and Assert
        await todoService
          .updateTodoById(1_000_000, updateTodoInput)
          .then(() => expect(todo).toBeUndefined())
          .catch((e) => expect(e.status).toEqual(404));
      });
    });

    // Test scenario: Sanitizing inputs when updating a todo
    describe('when updating todo', () => {
      it('should sanitize the inputs', async () => {
        // Arrange
        const updateTodoInput: UpdateTodoInput = {
          id: todoId,
          title: '<script>alert("XSS Attack!");</script>',
          description: '<p>Unsafe HTML</p>',
          completed: true,
          updatedAt: new Date(),
        };

        // Define the expected sanitized title and description
        const expectedSanitizedTitle = sanitizeHtml(updateTodoInput.title, todoService.sanitizeOptions);
        const expectedSanitizedDescription = sanitizeHtml(updateTodoInput.description, todoService.sanitizeOptions);

        // Act and Assert
        const result = await todoService.updateTodoById(todoId, updateTodoInput);
        expect(result.title).toEqual(expectedSanitizedTitle);
        expect(result.description).toEqual(expectedSanitizedDescription);
      });
    });
  });

  // Test scenario: Removing a todo by ID Integration Tests
  describe('Delete Todo By ID', () => {
    // Test scenario: Removing an existing todo by ID
    describe('when removeTodoById is called', () => {
      it('should remove a todo item by ID', async () => {
        // Act and Assert
        const result = await todoService.removeTodoById(todoId);
        expect(result.id).toEqual(todoId);
      });
    });

    // Test scenario: Removing a non-existent todo by ID
    describe('when removeTodoById is called with a non-existence id', () => {
      it('should throw NotFoundException', async () => {
        // Act and Assert
        await todoService
          .removeTodoById(1_000_000)
          .then(() => expect(todo).toBeUndefined())
          .catch((e) => expect(e.status).toEqual(404));
      });
    });
  });

  // Test scenario: Searching todos by title or description
  describe('Search Todos By Title Or Description', () => {
    // Test scenario: Searching with a valid searchInput
    describe('when searchTodoByTitleOrDescription is called with a searchInput', () => {
      it('should return the todos that match the title', async () => {
        // re-seeding the database with a todo item
        const res = await todoService.createTodo(todo);
        todoId = res.id;

        // Arrange: Define searchInput and expectedResults
        const searchInput: TodoSearchInput = {
          title: 'First Todo',
        };

        // Act: Call the method to search todos by title or description
        const result = await todoService.searchTodosByTitleOrDescription(searchInput);
        expect(result).toHaveLength(1);
        expect(result[0].title).toEqual('First Todo');
      });

      it('should return the todos that match the description', async () => {
        // Arrange: Define searchInput and expectedResults
        const searchInput: TodoSearchInput = {
          description: 'First Todo no dey pain. lol',
        };

        // Act and Assert
        const result = await todoService.searchTodosByTitleOrDescription(searchInput);
        expect(result).toHaveLength(1);
        expect(result[0].description).toEqual('First Todo no dey pain. lol');
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

        // Act and Assert
        const result = await todoService.searchTodosByTitleOrDescription(searchInput);
        expect(result).toHaveLength(0);
      });
    });
  });
});
