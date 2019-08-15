//이거 때문에 주말을 날렸다...
//connect된 모듈들은 default export 를 import 해서 export 해야 하는데
//{ } 로 바로 export를 해버려서 connect 되지 않은 순수 클래스 모듈이 export 됬었다.. 
import App from './App'
export { App }

import Home from './Home'
export { Home }

import Login from './Login'
export { Login }

import Register from './Register'
export { Register }

import Wall from './Wall'
export { Wall }