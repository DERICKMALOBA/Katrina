import { Link, useNavigate,useLocation} from 'react-router-dom';
import { useState,useEffect,useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/AuthSlice';

function SignUp() {
  const location = useLocation();
  const initialPage = useRef(location.pathname);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  useEffect(() => {
    if (success) {
      navigate(initialPage.current); 
    }
  }, [success, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if(res.ok)
      {
        setSuccess(true);
      }
      const data = await res.json();
      console.log(data);  // Check the structure of the response data
  
      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }
  
      // Dispatch user data to Redux store
      dispatch(setUser({ name: data.Name, email: data.Email, phone: data.Phone,role:data.Role}));
      var em=data.Email;
        localStorage.setItem("email",em)
      navigate('/sign-in');
      setLoading(false);
      setError(null);
     console.log(error)
      toast.success('Registration successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { backgroundColor: 'green', color: 'white' }
      });
  
    } catch (error) {
      setLoading(false);
      setError(error.message);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
  };
  
  

  return (
    <div
      style={{
        backgroundImage: `url('/agriculture-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'whitesmoke',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1 className="text-3xl text-center font-bold my-7 text-blue-800">
          Katrina Children Closets
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="name"
            name="name"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="email"
            name="email"
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Enter your phone number"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="phone"
            name="phone"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Create a password"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="password"
            name="pass"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-100"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-blue-600">Already have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-600 hover:text-blue-400 cursor-pointer">
              Sign In
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
