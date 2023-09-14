"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const todo_service_1 = require("./todo.service");
const todo_entity_1 = require("./entities/todo.entity");
const create_todo_input_1 = require("./dto/create-todo.input");
const update_todo_input_1 = require("./dto/update-todo.input");
const todo_search_input_1 = require("./dto/todo-search.input");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/guards/auth.guard");
let TodoResolver = exports.TodoResolver = class TodoResolver {
    constructor(todoService) {
        this.todoService = todoService;
    }
    createTodo(createTodoInput) {
        return this.todoService.createTodo(createTodoInput);
    }
    async findAllTodos(cursor, take) {
        return this.todoService.findAllTodos(cursor, take);
    }
    async findTodoById(id) {
        return this.todoService.findTodoById(id);
    }
    async updateTodoById(updateTodoInput) {
        return this.todoService.updateTodoById(updateTodoInput.id, updateTodoInput);
    }
    async removeTodoById(id) {
        return this.todoService.removeTodoById(id);
    }
    async searchTodosByTitleOrDescription(input) {
        return this.todoService.searchTodosByTitleOrDescription(input);
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => todo_entity_1.Todo, { name: 'createTodo' }),
    __param(0, (0, graphql_1.Args)('createTodoInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_todo_input_1.CreateTodoInput]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "createTodo", null);
__decorate([
    (0, graphql_1.Query)(() => [todo_entity_1.Todo], { name: 'findAllTodoItems' }),
    __param(0, (0, graphql_1.Args)('cursor', { type: () => graphql_1.Int, nullable: true })),
    __param(1, (0, graphql_1.Args)('take', { type: () => graphql_1.Int, defaultValue: 5 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "findAllTodos", null);
__decorate([
    (0, graphql_1.Query)(() => todo_entity_1.Todo, { name: 'findTodoById' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "findTodoById", null);
__decorate([
    (0, graphql_1.Mutation)(() => todo_entity_1.Todo, { name: 'updateTodo' }),
    __param(0, (0, graphql_1.Args)('updateTodoInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_todo_input_1.UpdateTodoInput]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "updateTodoById", null);
__decorate([
    (0, graphql_1.Mutation)(() => todo_entity_1.Todo, { name: 'deleteTodoById' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "removeTodoById", null);
__decorate([
    (0, graphql_1.Query)(() => [todo_entity_1.Todo], {
        nullable: 'items',
        name: 'searchTodosByTitleOrDescription',
    }),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [todo_search_input_1.TodoSearchInput]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "searchTodosByTitleOrDescription", null);
exports.TodoResolver = TodoResolver = __decorate([
    (0, graphql_1.Resolver)(() => todo_entity_1.Todo),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [todo_service_1.TodoService])
], TodoResolver);
//# sourceMappingURL=todo.resolver.js.map