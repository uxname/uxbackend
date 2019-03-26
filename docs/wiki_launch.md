[Go to wiki main page](wiki_index.md)
***

# Development launch
1. `git clone ...`
2. `yarn install`
3. Copy `.env_example` to `.env` file and `src/config/config_example.js` to `src/config/config.js`
4. `yarn dev:start`
5. `yarn dev:prisma-deploy`
6. `yarn dev:start-app`

# Production launch
1. `git clone ...`
2. `yarn prod:build`
3. `yarn prod:init`
4. Edit `config.js` and `.env` files
5. `yarn prod:up`
