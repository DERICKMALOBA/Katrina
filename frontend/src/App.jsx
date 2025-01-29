import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import SignIn from "./Pages/SingIn";
import SignUp from "./Pages/SingUp";
import Header from "./components/Header";
import Nav from "./components/Navbar";
import Home from "./Pages/home";
import ProductList from "./Pages/ProductsListing";
function App() {
  return (
    <Router>
      <Header/>
      <Nav/>
      <Routes>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/product' element={<ProductList/>}/>
      </Routes>
    </Router>
  )
}

export default App
