"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const path_1 = require("path");
const todo_module_1 = require("./todo/todo.module");
const prisma_service_1 = require("./prisma/prisma.service");
const user_module_1 = require("./user/user.module");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                debug: false,
                playground: true,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                context: ({ req }) => ({ headers: req.headers }),
                formatError: (error) => {
                    const graphQLFormattedError = {
                        extensions: {
                            originalError: error.extensions.originalError,
                        },
                        locations: error.locations,
                        message: error.message,
                        path: error.path,
                    };
                    return graphQLFormattedError;
                },
            }),
            todo_module_1.TodoModule,
            user_module_1.UserModule,
        ],
        controllers: [],
        providers: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map