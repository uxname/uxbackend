[Go to wiki main page](wiki_index.md)
***

# Development launch
1. `git clone ...`
2. `yarn install`
3. Create `./config/config.js` file with config or copy `./config/config_example.js` or create placeholder like:
```js
module.exports = require('./config_example');
```
4. Copy `.env_example` to `.env` file 
5. `yarn dev-start`
6. `yarn dev-start-app`

# Production launch
1. `git clone ...`
2. Create `./config/config.js` file with config
3. Change `PRISMA_ENDPOINT` variable in `.env` file to `http://prisma:4466`
4. `yarn prod-build`
5. `yarn prod-up`
