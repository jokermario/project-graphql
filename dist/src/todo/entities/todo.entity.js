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
exports.Todo = void 0;
const graphql_1 = require("@nestjs/graphql");
let Todo = exports.Todo = class Todo {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Todo.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'The title of the todo' }),
    __metadata("design:type", String)
], Todo.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
        description: 'What the todo is all about',
    }),
    __metadata("design:type", String)
], Todo.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
        description: 'Used to determine if a todo has been achieved or not',
    }),
    __metadata("design:type", Boolean)
], Todo.prototype, "completed", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Todo.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Todo.prototype, "updatedAt", void 0);
exports.Todo = Todo = __decorate([
    (0, graphql_1.ObjectType)()
], Todo);
//# sourceMappingURL=todo.entity.js.map