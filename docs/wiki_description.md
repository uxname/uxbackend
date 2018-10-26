[Go to wiki main page](wiki_index.md)
***

# Project structure

 Object                                    | Type          | Description  
-------------------------------------------|---------------|--------------
 config/**config_example.js**              | **File**      | Example of `config/config.js`  
 database/**datamodel.graphql**            | **File**      | Database structure in GraphQL schema format  
 database/**prisma.yml**                   | **File**      | Config for Prisma  
 docs/**swagger.yml**                      | **File**      | [Swagger](https://swagger.io) config  
 docs/**redoc-static.html**                | **File**      | Auto-generated REST API documentation by [ReDoc-cli](https://github.com/Rebilly/ReDoc/blob/master/cli/README.md)  
 database/**seed.graphql**                 | **File**      | Initial data for empty database (ex.: first user - admin, test products in catalog, etc...)   
 generated/**prisma-client**               | **Directory** | Auto-generated GraphQL [client](https://www.prisma.io/docs/prisma-client) for database
 **helper**                                | **Directory** | Any tools and helper classes
 **resolver**                              | **Directory** | GraphQL resolvers (modules, that implements public GraphQL API)
 **router**                                | **Directory** | REST API routers (modules, that implements public REST API)
 **service**                               | **Directory** | Modules works with database and implements business logic
 **template**                              | **Directory** | Template files for email and other things 
 **.env_example**                          | **File**      | Example of `.env` file, contains environments variables for Docker container 
 **.dockerignore**                         | **File**      | Docker ignore file (describes which files should not get inside Docker container)  
 **docker-compose.yml**                    | **File**      | Docker compose file for production launch  
 **docker_compose_dev.yml**                | **File**      | Docker compose file for development launch  
 **Dockerfile**                            | **File**      | [Dockerfile](https://docs.docker.com/engine/reference/builder)  
 **schema.graphql**                        | **File**      | GraphQL schema for public API  
 **server.js**                             | **File**      | Describes basic server launch functions
 **app.js**                                | **File**      | Describes public api structure and partially business logic (ex.: data access permissions)   

# NPM scripts

 Command                | Environment     | Description
 -----------------------|-----------------|--------------
 **start**              | **Production**  | Start server (for Docker)
 **dev-start-app**      | Development     | Start server for dev.
 **dev-prisma-deploy**  | Development     | Deploy database structure to Prisma and generate API documentation 
 **dev-prisma-deploy-f**| Development     | Execute `dev-prisma-deploy` command but with `force` flag
 **dev-prisma-reset**   | Development     | Drop database
 **dev-prisma-seed**    | Development     | Put initial data to database (from `seed.graphql`) 
 **dev-clear**          | Development     | Delete all data (All storage folders, Docker containers)
 **dev-start**          | Development     | Start Docker development environment containers 
 **dev-stop**           | Development     | Stop Docker development environment containers
 **dev-generate-docs**  | Development     | Generate API docs
 **prod-build**         | **Production**  | Build Docker container of app 
 **prod-up**            | **Production**  | Update & start Docker container of app
 **prod-start**         | **Production**  | Start Docker container of app
 **prod-full-restart**  | **Production**  | Stop Docker container, rebuild/update it and start again
 **prod-clear**         | **Production**  | Delete all data (All storage folders, Docker containers)
 **prod-logs**          | **Production**  | Show logs output of app's container
 **prod-stop**          | **Production**  | Stop Docker app container of app

# Dependencies description

* **agenda** - Job manager
* **agendash** - Web interface for Agenda, by default available at `/jobs_dashboard` endpoint
* **argon2** - Hashing algorithm
* **dataloader** - Server-side in-memory data cache implementation
* **express-rate-limit** - Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.
* **graphql-cost-analysis** - A GraphQL request cost analyzer. This can be used to protect GraphQL servers against DoS attacks, compute the data consumption per user and limit it.
* **graphql-import** - Import & export definitions in GraphQL SDL (Schema Definition Language)
* **graphql-shield** - A GraphQL tool to ease the creation of permission layer
* **graphql-yoga** - Main GraphQL server
* **prisma-client-lib** - This package includes all dependencies besides `graphql` needed in order to run Prisma client in JavaScript, TypeScript and Flow.
