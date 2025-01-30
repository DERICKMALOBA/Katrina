import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import SignIn from "./Pages/SingIn";
import SignUp from "./Pages/SingUp";
import Header from "./components/Header";
import Nav from "./components/Navbar";
import Home from "./Pages/home";
import ProductList from "./Pages/ProductsListing";
import ProductInfo from "./Pages/Productdetails";
import ProductForm from "./Pages/submit";
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
        <Route path="/productdet/:name/:description/:price" element={<ProductInfo/>}/>
        <Route path='/productform' element={<ProductForm/>}/>
      </Routes>
    </Router>
    )
}

export default App
