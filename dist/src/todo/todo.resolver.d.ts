import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { TodoSearchInput } from './dto/todo-search.input';
export declare class TodoResolver {
    private readonly todoService;
    constructor(todoService: TodoService);
    createTodo(createTodoInput: CreateTodoInput): Promise<Todo>;
    findAllTodos(cursor?: number, take?: number): Promise<Todo[]>;
    findTodoById(id: number): Promise<Todo | null>;
    updateTodoById(updateTodoInput: UpdateTodoInput): Promise<Todo>;
    removeTodoById(id: number): Promise<Todo>;
    searchTodosByTitleOrDescription(input: TodoSearchInput): Promise<Todo[]>;
}
