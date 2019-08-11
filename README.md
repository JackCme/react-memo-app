# What is this?
- A simple memo app based on Reactjs, Mongodb and Expressjs
- Codelab from [@velopert](https://github.com/velopert) refined to use Webpack 4 and Babel 7
## Usage
1. Clone this repository.
2. In shell, terminal, cmd or whatever, run:
```
npm run build && npm run start:dev
```
3. Open browser to http://localhost:4000
4. Any changes made in `./src/server` will reload automatically and applied to `http://localhost:3000`.
5. All request made to `http://localhost:4000` will be redirected to `http://localhost:3000` where express backbone server is set.