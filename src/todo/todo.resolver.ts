import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { TodoSearchInput } from './dto/todo-search.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver(() => Todo)
@UseGuards(AuthGuard)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  /**
   * Mutation to create a new todo item.
   * @param createTodoInput - The input data for creating a todo.
   * @returns A Promise that resolves to the found todo item
   */
  @Mutation(() => Todo, { name: 'createTodo' })
  createTodo(
    @Args('createTodoInput')
    createTodoInput: CreateTodoInput,
  ): Promise<Todo> {
    return this.todoService.createTodo(createTodoInput);
  }

  /**
   * Query to retrieve a list of all todo items.
   * @param cursor - The cursor ID for pagination. Retrieve todos with IDs greater than the cursor.
   * @param take - The maximum number of todo items to retrieve. Default is 5.
   * @returns A Promise that resolves to the found list of todo item.
   */
  @Query(() => [Todo], { name: 'findAllTodoItems' })
  async findAllTodos(
    @Args('cursor', { type: () => Int, nullable: true }) cursor?: number,
    @Args('take', { type: () => Int, defaultValue: 5 }) take?: number,
  ): Promise<Todo[]> {
    // Call the 'findAll' method of the todo service to retrieve todo items
    return this.todoService.findAllTodos(cursor, take);
  }

  /**
   * Query to retrieve a single todo item by its ID.
   * @param id - The ID of the todo item.
   * @returns A Promise that resolves to the found todo item or null if not found.
   */
  @Query(() => Todo, { name: 'findTodoById' })
  async findTodoById(@Args('id', { type: () => Int }) id: number): Promise<Todo | null> {
    return this.todoService.findTodoById(id);
  }

  /**
   * Mutation to update a todo item.
   * @param updateTodoInput - The updated data for the todo item.
   * @returns A Promise that resolves to the found todo item.
   */
  @Mutation(() => Todo, { name: 'updateTodo' })
  async updateTodoById(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput): Promise<Todo> {
    return this.todoService.updateTodoById(updateTodoInput.id, updateTodoInput);
  }

  /**
   * Mutation to delete a todo item by its ID.
   * @param id - The ID of the todo item to be deleted.
   * @returns A Promise that resolves to the found todo item.
   */
  @Mutation(() => Todo, { name: 'deleteTodoById' })
  async removeTodoById(@Args('id', { type: () => Int }) id: number): Promise<Todo> {
    return this.todoService.removeTodoById(id);
  }

  /**
   * Query to search for todo items by title or description.
   * @param input - The search criteria.
   * @returns A Promise that resolves to the found list of todo items matching the search criteria.
   */
  @Query(() => [Todo], {
    nullable: 'items',
    name: 'searchTodosByTitleOrDescription',
  })
  async searchTodosByTitleOrDescription(@Args('input') input: TodoSearchInput): Promise<Todo[]> {
    return this.todoService.searchTodosByTitleOrDescription(input);
  }
}
