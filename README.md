# 설명
- Reactjs, Mongodb 와 Expressjs 프레임워크로 만들어진 심플 메모 웹앱입니다.
- [@velopert](https://github.com/velopert)님의 코드랩 강좌를 19년 8월 기준 최신버전의 의존 모듈로 사용될 수 있게끔 재구현 한것입니다 :)
## 사용법
1. 해당 레포지토리를 클론 합니다
2. 터미널에 다음과 같이 입력합니다:
```
$ npm install
$ npm run start:dev
```
3. http://localhost:4000으로 브라우저를 엽니다.
4. `./src/server`폴더에 반영된 수정사항은 nodemon에 의해 새로고침 없이 자동으로 적용됩니다.
5. `http://localhost:4000`에서 이루어지는 모든 웹 요청들은 express 백본 서버로 설정된 `http://localhost:3000`주소로 전달이 될겁니다.
6. Mongodb가 설치되어있어야 하며 서버가 구동되고 있어야 작동합니다.

# What is this?
- A simple memo app based on Reactjs, Mongodb and Expressjs
- Codelab from [@velopert](https://github.com/velopert) refined to use Webpack 4 and Babel 7
## Usage
1. Clone this repository.
2. In shell, terminal, cmd or whatever, run:
```
$ npm install
$ npm run start:dev
```
3. Open browser to http://localhost:4000
4. Any changes made in `./src/server` will reload automatically and applied to `http://localhost:3000`.
5. All request made to `http://localhost:4000` will be redirected to `http://localhost:3000` where express backbone server is set.
6. Must have mongodb installed and server running.