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
exports.UpdateTodoInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let UpdateTodoInput = exports.UpdateTodoInput = class UpdateTodoInput {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], UpdateTodoInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, description: 'The title of the todo' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'The title of the todo cannot be empty' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9\s]+$/, {
        message: 'Only alphanumeric characters and whitespaces are allowed for the Title field',
    }),
    __metadata("design:type", String)
], UpdateTodoInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
        description: 'What the todo is all about',
    }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9\s\-_.,;:!?(){}[\]@#$^&+=<>]*$/, {
        message: 'Description contains unsafe special characters',
    }),
    __metadata("design:type", String)
], UpdateTodoInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
        description: 'Used to determine if a todo has been achieved or not.',
    }),
    __metadata("design:type", Boolean)
], UpdateTodoInput.prototype, "completed", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], UpdateTodoInput.prototype, "updatedAt", void 0);
exports.UpdateTodoInput = UpdateTodoInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateTodoInput);
//# sourceMappingURL=update-todo.input.js.map