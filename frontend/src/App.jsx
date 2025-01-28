import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import SignIn from "./Pages/SingIn";
import SignUp from "./Pages/SingUp";
import Header from "./components/Header";
import Nav from "./components/Navbar";
function App() {
  return (
    <Router>
      <Header/>
      <Nav/>
      <Routes>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
      </Routes>
    </Router>
  )
}

export default App
