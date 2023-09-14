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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const sanitizeHtml = require("sanitize-html");
const client_1 = require("@prisma/client");
let TodoService = exports.TodoService = class TodoService {
    constructor(prisma) {
        this.prisma = prisma;
        this.sanitizeOptions = {
            allowedTags: ['b', 'i', 'em', 'strong', 'u'],
            allowedAttributes: {},
        };
    }
    async createTodo(createTodoInput) {
        try {
            return await this.prisma.todo.create({
                data: {
                    title: sanitizeHtml(createTodoInput.title, this.sanitizeOptions),
                    description: sanitizeHtml(createTodoInput.description, this.sanitizeOptions),
                },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new common_1.ConflictException('A todo with that title already exists');
                }
                throw new common_1.InternalServerErrorException(`An unexpected error has occurred: The error is: ${e.message}`);
            }
        }
    }
    async findAllTodos(cursor, take = 5) {
        const where = cursor ? { id: { gt: cursor } } : {};
        return this.prisma.todo.findMany({
            take,
            where,
            orderBy: {
                id: 'asc',
            },
        });
    }
    async findTodoById(id) {
        try {
            return await this.prisma.todo.findUniqueOrThrow({
                where: {
                    id: id,
                },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new common_1.NotFoundException(`The todo with id: ${id} does not exist`);
                }
                throw new Error(`An unexpected error has occurred: The error is: ${e.message}`);
            }
        }
    }
    async updateTodoById(id, updateTodoInput) {
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
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new common_1.NotFoundException(`The todo with id: ${id} cannot be updated because does not exist`);
                }
                throw new Error(`An unexpected error has occurred: The error is: ${e.message}`);
            }
        }
    }
    async removeTodoById(id) {
        try {
            return await this.prisma.todo.delete({
                where: {
                    id: id,
                },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new common_1.NotFoundException(`The todo with id: ${id} cannot be deleted because does not exist`);
                }
                throw new Error(`An unexpected error has occurred: The error is: ${e.message}`);
            }
        }
    }
    async searchTodosByTitleOrDescription(searchInput) {
        const sanitizedTitle = sanitizeHtml(searchInput.title || '', this.sanitizeOptions);
        const sanitizedDescription = sanitizeHtml(searchInput.description || '', this.sanitizeOptions);
        const sanitizedTitleForSearch = sanitizedTitle.replace(/[\s\n\t]/g, '_');
        const sanitizedDescriptionForSearch = sanitizedDescription.replace(/[\s\n\t]/g, '_');
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
        }
        catch (e) {
            throw new common_1.BadRequestException('The search syntax is invalid');
        }
    }
};
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TodoService);
//# sourceMappingURL=todo.service.js.map