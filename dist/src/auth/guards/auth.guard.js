"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const jwt = require("jsonwebtoken");
const process = require("process");
let AuthGuard = exports.AuthGuard = class AuthGuard {
    async canActivate(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context).getContext();
        if (!ctx.headers.authorization) {
            return false;
        }
        ctx.user = await this.validateToken(ctx.headers.authorization);
        return true;
    }
    async validateToken(auth) {
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const token = auth.split(' ')[1];
        try {
            return await jwt.verify(token, process.env.EARNIPAY_JWT_SECRET_KEY);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)()
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map