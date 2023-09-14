import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from './entities/todo.entity';
import * as sanitizeHtml from 'sanitize-html';
import { TodoSearchInput } from './dto/todo-search.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // Sanitization options to prevent HTML and script injection
  public readonly sanitizeOptions = {
    allowedTags: ['b', 'i', 'em', 'strong', 'u'],
    allowedAttributes: {},
  };

  /**
   * Create a new todo item.
   * @param createTodoInput - The input data for creating a todo.
   * @returns The created todo.
   * @throws ConflictException if a todo with the same title already exists.
   */
  async createTodo(createTodoInput: CreateTodoInput): Promise<Todo> {
    try {
      return await this.prisma.todo.create({
        data: {
          title: sanitizeHtml(createTodoInput.title, this.sanitizeOptions),
          description: sanitizeHtml(createTodoInput.description, this.sanitizeOptions),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violation
        if (e.code === 'P2002') {
          throw new ConflictException('A todo with that title already exists');
        }
        throw new InternalServerErrorException(`An unexpected error has occurred: The error is: ${e.message}`);
      }
    }
  }

  /**
   * Retrieve a list of todo items.
   * @param cursor - The cursor ID for pagination. Retrieve todos with IDs greater than the cursor.
   * @param take - The maximum number of todo items to retrieve. Default is 5.
   * @returns A list of todo items.
   */
  async findAllTodos(cursor?: number, take = 5): Promise<Todo[]> {
    // Determine the 'where' condition based on the cursor parameter
    const where = cursor ? { id: { gt: cursor } } : {};

    // Retrieve todo items using Prisma client
    return this.prisma.todo.findMany({
      // Limit the number of retrieved todo items
      take,
      // Apply the 'where' condition
      where,
      // Order the results by ID in ascending order
      orderBy: {
        id: 'asc',
      },
    });
  }

  /**
   * Retrieve a single todo item by ID.
   * @param id - The ID of the todo item.
   * @returns The requested todo item.
   * @throws NotFoundException if the todo item with the given ID does not exist.
   */
  async findTodoById(id: number): Promise<Todo | null> {
    try {
      return await this.prisma.todo.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle not found error
        if (e.code === 'P2025') {
          throw new NotFoundException(`The todo with id: ${id} does not exist`);
        }
        throw new Error(`An unexpected error has occurred: The error is: ${e.message}`);
      }
    }
  }

  /**
   * Update a todo item.
   * @param id - The ID of the todo item to update.
   * @param updateTodoInput - The updated data for the todo item.
   * @returns The updated todo item.
   */
  async updateTodoById(id: number, updateTodoInput: UpdateTodoInput): Promise<Todo> {
    const dataToUpdate = {
      title: sanitizeHtml(updateTodoInput.title, this.sanitizeOptions),
      description: sanitizeHtml(updateTodoInput.description, this.sanitizeOptions),
      completed: updateTodoInput.completed,
      updatedAt: updateTodoInput.updatedAt,
    };

    try {
      return await this.prisma.todo.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle not found error
        if (e.code === 'P2025') {
          throw new NotFoundException(`The todo with id: ${id} cannot be updated because does not exist`);
        }
        throw new Error(`An unexpected error has occurred: The error is: ${e.message}`);
      }
    }
  }

  /**
   * Remove a todo item by ID.
   * @param id - The ID of the todo item to remove.
   * @returns The removed todo item.
   */
  async removeTodoById(id: number): Promise<Todo> {
    try {
      return await this.prisma.todo.delete({
        where: {
          id: id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle not found error
        if (e.code === 'P2025') {
          throw new NotFoundException(`The todo with id: ${id} cannot be deleted because does not exist`);
        }
        throw new Error(`An unexpected error has occurred: The error is: ${e.message}`);
      }
    }
  }

  /**
   * Search for todo items by title or description.
   * @param searchInput - The search criteria.
   * @returns A list of todo items matching the search criteria.
   */
  async searchTodosByTitleOrDescription(searchInput: TodoSearchInput): Promise<Todo[]> {
    // Sanitize the search input
    const sanitizedTitle = sanitizeHtml(searchInput.title || '', this.sanitizeOptions);
    const sanitizedDescription = sanitizeHtml(searchInput.description || '', this.sanitizeOptions);

    // Replace whitespace characters with underscores in the search input.
    // This was done because as at the time of writing this code, Prisma full-text feature only supported
    // searching with single tokens.
    const sanitizedTitleForSearch = sanitizedTitle.replace(/[\s\n\t]/g, '_');
    const sanitizedDescriptionForSearch = sanitizedDescription.replace(/[\s\n\t]/g, '_');

    // Removing punctuation as they would break the Prisma search engine
    const removedPuncFromTitle = sanitizedTitleForSearch.replace(/[.,\/#!$%\^&\*;:{}=\-`~()]/g, '');
    const removedPuncFromDesc = sanitizedDescriptionForSearch.replace(/[.,\/#!$%\^&\*;:{}=\-`~()]/g, '');

    try {
      return await this.prisma.todo.findMany({
        where: {
          OR: [
            { title: { search: removedPuncFromTitle.trim() } },
            { description: { search: removedPuncFromDesc.trim() } },
          ],
        },
      });
    } catch (e) {
      throw new BadRequestException('The search syntax is invalid');
    }
  }
}
