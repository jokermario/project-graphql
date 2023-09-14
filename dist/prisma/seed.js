"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const process = require("process");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
const saltOrRounds = 10;
const password = 'testing';
(async () => {
    const hash = await bcrypt.hash(password, saltOrRounds);
    const todoData = [
        {
            title: `Take the car to the mechanic. Date: ${new Date().getTime()}`,
            description: 'Service list',
            completed: true,
            createdAt: new Date('Sat Aug 05 2023 16:16:50 GMT+0100 (West African Time)'),
            updatedAt: new Date('Sat Aug 05 2023 16:16:50 GMT+0100 (West African Time)'),
        },
        {
            title: `Go to the market. Date: ${new Date().getTime()}`,
            description: '',
            completed: false,
            createdAt: new Date('Sat Aug 05 2023 16:16:50 GMT+0100 (West African Time)'),
            updatedAt: new Date('Sat Aug 05 2023 16:16:50 GMT+0100 (West African Time)'),
        },
        {
            title: `Buy a Car. Date: ${new Date().getTime()}`,
            description: 'The make should be ...',
            completed: false,
            createdAt: new Date('Sat Aug 05 2023 16:16:50 GMT+0100 (West African Time)'),
            updatedAt: new Date('Sat Aug 05 2023 16:16:50 GMT+0100 (West African Time)'),
        },
    ];
    const userData = [
        {
            email: 'favour@test.com',
            password: hash,
        },
    ];
    async function main() {
        console.log(`Start todo seeding ...`);
        for (const t of todoData) {
            const todo = await prisma.todo.create({
                data: t,
            });
            console.log(`Created todo with id: ${todo.id}`);
        }
        console.log(`Start user seeding ...`);
        for (const u of userData) {
            const user = await prisma.user.create({
                data: u,
            });
            console.log(`Created user with id: ${user.id}`);
        }
        console.log(`Seeding finished.`);
    }
    main()
        .then(async () => {
        await prisma.$disconnect();
    })
        .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
})();
//# sourceMappingURL=seed.js.map