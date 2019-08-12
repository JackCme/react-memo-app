export { App } from './App'
export { Home } from './Home'
//이거 때문에 주말을 날렸다...
//Login 에서 connect 된 Login이 export default로 되어있어서 mapDispatchToProps가 제대로 안되고 있었다 젠장...
//default 를 import 한 후에 그걸 export 시켜야 하는데....
import Login from './Login'
export { Login }

import Register from './Register'
export { Register }