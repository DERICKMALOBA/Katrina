import { Link,useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState,useRef,useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Redux/AuthSlice';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../Redux/UserSlice';

function SignIn() {
  const location = useLocation();
  const initialPage = useRef(location.pathname);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({});
 useSelector((state) => state.user);
  const [loading,setLoading]=useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    dispatch(signInStart());
    setLoading(true);
    try {
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
    if(res.ok)
    {
       setSuccess(true);
    }
    
        const data = await res.json();
        setLoading(false);
        // Check if the response is valid and contains token and role
        if (!data.success || !data.user || !data.user.token || !data.user.role) {
            throw new Error(data.message || 'Invalid response from server');
        }
        dispatch(setUser({ name: data.Name, email: data.Email, phone: data.Phone,role:data.Role }));
       var em=data.Email;
        localStorage.setItem("email",em)
        // Store token and role in localStorage
        localStorage.setItem('accessToken', data.user.token);
        localStorage.setItem('userRole', data.user.role);

        console.log('Access Token:', data.user.token);
        console.log('User Role:', data.user.role);

        dispatch(signInSuccess(data.user));

        toast.success('Sign-in successful!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { backgroundColor: 'green', color: 'white' }
        });

        // Navigate based on the user role
        if (data.user.role === 'admin') {
            navigate('/overview'); // Admin Dashboard
        } else {
            navigate('/'); // Home page for normal users
        }
    } catch (error) {
        dispatch(signInFailure(error.message));
        console.error(error.message);
        setLoading(false);
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
        backgroundImage: `url('/image2.jpg')`,
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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1 className="text-4xl text-center font-bold text-blue-800 my-7">
          Katrina Children Closets
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="password"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-400 transition duration-300"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-blue-700">Don’t have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              Create an Account
            </span><br/><br/>
          </Link>
          <Link to="/forgot">
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              Forgot Password
            </span>
          </Link>
        </div>
        
      </div>
    </div>
  );
}

export default SignIn;