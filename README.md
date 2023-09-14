## Test Docs

### Introduction

This test was completed using Javascript in conjunction with the
NodeJS, NestJS framework, GraphQL and Prisma. PostgresDB was used to persist data.<br>

### General Comment<br>
All functionality works as expected. The bonus features **Pagination**, **Authentication and Authorization** were implemented. A cursor pagination was implemented as it is the industry standard of implementing pagination as opposed to the offset pagination. For Authentication JWT was implemented.<br><br>
For the Search API a **Full-Text** search was implemented as it is a more ideal way of searching a document. Also **unit, integration and end-to-end tests** were written.

**Mitigated Security Concerns**<br>
1. The application was built to be resistant to xss attacks.

**Note:**
1. The authentication credentials are email: `favour@test.com`, password: `testing`
2. The application uses 2 postgres databases. The Test DB and Production DB. If you run this application using the docker the databases get created automatically.
3. You can login to PG Admin packaged with the application with **Username:** `admin@admin.com` and **Password:** `admin`. This can be accessed at `http://localhost:8080/`. Connection credentials for server are **Host:** `internal-prod-db`, **Port:** `5432`, **Username:** `admin`, **Password:** `admin`.
4. GraphQL playground is available at `http://localhost:3000/graphql`. This was intentionally left ON to make testing the API super stress-free.

### Requirement
- Docker 20.10.11 or higher [(Click here to download)](https://docs.docker.com/engine/install/)

### Build/Run/Test instruction

Unzip the source code and keep the folder in a directory of your choice.<br><br>
Test source code locations
1. The unit tests are located at `./test/unit`
2. The integration tests are located at `./test/integration`
3. The end-to-end tests are located at `./test/e2e`

### Prerequisites
Verify your docker installation, by running the following command on your terminal. It should return the docker version.
 ```bash
  $ docker -v
 ```
### Build and Run

1. Open your terminal and change directory(cd) to the folder that holds the source code. ![alt text](fig1.png)
2. Run the following commands<br>
    ```bash
    $ docker-compose up --build
   ```
Your application should now be running and can be accessed at `http://localhost:3000/graphql`.

### Testing
**Note:**<br>
Before continuing, go to the `/.env` file at the root of the project and change the `DATABASE_URL` environment variable to `postgresql://admin:admin@localhost:5432/earnipay_todo`<br><br>
After modifying the DATABASE_URL environment variable, run the following commands
```bash
$ npm install
```
then
```bash
$ npm run build
```


Then you can proceed to run any of the following commands
1. For Unit Testing
   ```bash
   $ npm run test
   ```
2. For Integration Testing
   ```bash
   $ npm run test:int
   ```
3. For End-To-End Testing<br>

   ```bash
   $ npx prisma migrate reset --force
   ```
   then
   ```bash
   $ npm run test:e2e
   ```

### Endpoint Documentation
The Documentation for the graphQL endpoints can be found here
[Postman Documentation for Test](https://documenter.getpostman.com/view/9467922/2s9XxySEAE)

The postman collection can be found ([The Postman Collection](Test_GraphQL.postman_collection.json)) `./Earnipay_Test_GraphQL.postman_collection.json`<br><br>
After importing the postman collection create a global variable with name `access_token`.

Why testing on Postman if you encounter a user not found error, run the command
```bash
npx prisma migrate reset --force
```

The Introspection Schema can be found at `./introspectionSchema.json`

A minimalistic documentation fo the graphQL endpoint can also be found locally at `./public/index.html/`