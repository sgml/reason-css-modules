# reason-css-modules

This project aims to be a toolset for automatic Reason type generation for CSS-Modules.

## Development

```
yarn install

# Build reason code
yarn run bs:build

# Watch build reason code
yarn run bs:watch
```

**Testing the webpack loader**

```
# Either use the run-loader for quickly running the loader
node run-loader.js

# Or wind up the example
yarn run example:webpack
```

After running webpack, a newly generated file is stored in `example/style.re`.
