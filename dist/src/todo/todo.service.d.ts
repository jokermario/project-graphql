import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from './entities/todo.entity';
import { TodoSearchInput } from './dto/todo-search.input';
export declare class TodoService {
    private prisma;
    constructor(prisma: PrismaService);
    readonly sanitizeOptions: {
        allowedTags: string[];
        allowedAttributes: {};
    };
    createTodo(createTodoInput: CreateTodoInput): Promise<Todo>;
    findAllTodos(cursor?: number, take?: number): Promise<Todo[]>;
    findTodoById(id: number): Promise<Todo | null>;
    updateTodoById(id: number, updateTodoInput: UpdateTodoInput): Promise<Todo>;
    removeTodoById(id: number): Promise<Todo>;
    searchTodosByTitleOrDescription(searchInput: TodoSearchInput): Promise<Todo[]>;
}
