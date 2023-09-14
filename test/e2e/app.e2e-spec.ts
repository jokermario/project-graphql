import request from 'supertest-graphql';
import { gql } from 'graphql-tag';
import { Todo } from '@prisma/client';
import { todoStub } from '../stubs/todo.stub';
import { E2eTestManager } from '../config/e2e-test-manager';

describe('Todo', () => {
  const e2eTestManager = new E2eTestManager();

  beforeAll(async () => {
    await e2eTestManager.beforeAll();
  });

  afterAll(async () => {
    await e2eTestManager.afterAll();
  });

  let createdTodo: Todo;
  let todoList: Todo;
  let deletedTodo: Todo;

  describe('given that a todo does not already exist', () => {
    describe('when a createTodo mutation is executed', () => {
      // Execute this code before running the tests
      beforeAll(async () => {
        // Send a request to create a new todo
        const response = await request<{ createTodo: Todo }>(e2eTestManager.httpServer)
          .set('Authorization', `Bearer ${e2eTestManager.getAccessToken()}`)
          .mutate(
            gql`
              mutation CreateTodo($input: CreateTodoInput!) {
                createTodo(createTodoInput: $input) {
                  id
                  title
                  description
                }
              }
            `,
          )
          .variables({
            input: {
              title: todoStub.title,
              description: 'example',
            },
          })
          .expectNoErrors();

        // Store the created todo for use in the tests
        createdTodo = response.data.createTodo;
      });

      // Test: Response should match the newly created todo
      test('response should match the newly created Todo', () => {
        expect(createdTodo).toMatchObject({
          title: todoStub.title,
          description: 'example',
        });
      });

      // Test: The new todo should be created and retrievable
      test('the new todo should be created and retrievable', async () => {
        const todo = await e2eTestManager.getCollection(createdTodo.id);
        expect(todo).toBeDefined();
      });
    });

    describe('when an updateTodo mutation is executed', () => {
      // Execute this code before running the test
      beforeAll(async () => {
        // Send a request to update the todo
        const response = await request<{ updateTodo: Todo }>(e2eTestManager.httpServer)
          .set('Authorization', `Bearer ${e2eTestManager.getAccessToken()}`)
          .mutate(
            gql`
              mutation UpdateTodo($input: UpdateTodoInput!) {
                updateTodo(updateTodoInput: $input) {
                  id
                  createdAt
                  updatedAt
                  title
                  description
                }
              }
            `,
          )
          .variables({
            input: {
              id: createdTodo.id,
              title: 'f',
              description: 'Its about to go down',
              completed: true,
              updatedAt: '2019-12-03T09:54:33Z',
            },
          })
          .expectNoErrors();

        // Store the updated todo for use in the test
        createdTodo = response.data.updateTodo;
      });

      // Test: Response should match the updated todo
      test('response should match the updated Todo', () => {
        expect(createdTodo).toMatchObject({
          title: 'f',
          description: 'Its about to go down',
        });
      });
    });

    describe('when a findTodoById query is executed', () => {
      // Execute this code before running the test
      beforeAll(async () => {
        // Send a request to find a todo by ID
        const response = await request<{ findTodoById: Todo }>(e2eTestManager.httpServer)
          .set('Authorization', `Bearer ${e2eTestManager.getAccessToken()}`)
          .mutate(
            gql`
              query findOne($id: Int!) {
                findTodoById(id: $id) {
                  id
                  title
                  description
                  completed
                }
              }
            `,
          )
          .variables({
            id: createdTodo.id,
          })
          .expectNoErrors();

        // Store the retrieved todo for use in the test
        createdTodo = response.data.findTodoById;
      });

      // Test: Response should match the updated todo
      test('response should match the retrieved Todo', () => {
        expect(createdTodo).toMatchObject({
          title: 'f',
          description: 'Its about to go down',
        });
      });

      // Test: The retrieved todo should exist
      test('then the retrieved todo should exist', async () => {
        const todo = await e2eTestManager.getCollection(createdTodo.id);
        expect(todo).toBeDefined();
      });
    });

    describe('when a findAllTodoItemsWithPagination query is executed', () => {
      // Execute this code before running the test
      beforeAll(async () => {
        // Send a request to find all todo items with pagination
        const response = await request<{ findAllTodoItems: Todo }>(e2eTestManager.httpServer)
          .set('Authorization', `Bearer ${e2eTestManager.getAccessToken()}`)
          .mutate(
            gql`
              query findAllTodoItemsWithPagination($cursor: Int, $take: Int) {
                findAllTodoItems(cursor: $cursor, take: $take) {
                  id
                  title
                  description
                }
              }
            `,
          )
          .variables({
            cursor: 1,
            take: 2,
          })
          .expectNoErrors();

        // Store the retrieved list of todo items for use in the test
        todoList = response.data.findAllTodoItems;
      });

      // Test: Response should match the expected data structure
      test('response should match expected data structure', () => {
        // Output the retrieved todo list for debugging purposes
        console.log(todoList);

        // Assert that the response matches the expected data structure
        expect(todoList).toEqual([
          {
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
          },
          {
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
          },
        ]);
      });
    });

    describe('when a searchTodosByTitleOrDescription query is executed', () => {
      // Execute this code before running the test
      beforeAll(async () => {
        // Send a request to search for todos by title or description
        const response = await request<{
          searchTodosByTitleOrDescription: Todo;
        }>(e2eTestManager.httpServer)
          .set('Authorization', `Bearer ${e2eTestManager.getAccessToken()}`)
          .mutate(
            gql`
              query searchTodos($input: TodoSearchInput!) {
                searchTodosByTitleOrDescription(input: $input) {
                  id
                  title
                  description
                }
              }
            `,
          )
          .variables({
            input: {
              title: 'Buy a car',
              description: 'Its about to go down',
            },
          })
          .expectNoErrors();

        // Store the retrieved list of todos for use in the test
        todoList = response.data.searchTodosByTitleOrDescription;
      });

      // Test: The response should match the expected data structure
      test('the response should match expected data structure', () => {
        // Output the retrieved todo list for debugging purposes
        console.log(todoList);

        // Assert that the response matches the expected data structure
        expect(todoList).toEqual([
          {
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
          },
          {
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
          },
        ]);
      });
    });

    describe('when a deleteTodoById mutation is executed', () => {
      // Execute this code before running the test
      beforeAll(async () => {
        // Send a request to delete a todo by ID
        const response = await request<{ deleteTodoById: Todo }>(e2eTestManager.httpServer)
          .set('Authorization', `Bearer ${e2eTestManager.getAccessToken()}`)
          .mutate(
            gql`
              mutation RemoveTodo($input: Int!) {
                deleteTodoById(id: $input) {
                  id
                }
              }
            `,
          )
          .variables({
            input: createdTodo.id,
          })
          .expectNoErrors();

        // Store the deleted todo for use in the test
        deletedTodo = response.data.deleteTodoById;
      });

      // Test: The response should match the ID of the deleted todo
      test('response should match the ID of the deleted todo', () => {
        // Assert that the response matches the ID of the deleted todo
        expect(deletedTodo).toMatchObject({
          id: createdTodo.id,
        });
      });
    });
  });
});
