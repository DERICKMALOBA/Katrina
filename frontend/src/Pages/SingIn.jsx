import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../Redux/User/UserSlice';

function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
  
    try {
       // Optional: Set loading state
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!res.ok) {
        throw new Error('user not found.');
      }
  
      const data = await res.json();
  
      if (!data.success || !data.user || !data.user.token) {
        throw new Error(data.message || 'Invalid response from server');
      }
  
      localStorage.setItem('accessToken', data.user.token); // Save token
      
console.log('Access Token:', data.user.token);
      dispatch(signInSuccess(data.user));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.error(error.message);
    } finally {
      
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
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1 className="text-4xl text-center font-bold text-green-800 my-7">
          🌾 AgriMarket Sign In
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
            className="w-full bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">Don’t have an account?</p>
          <Link to="/sign-up">
            <span className="text-green-600 font-medium hover:underline cursor-pointer">
              Create an Account
            </span>
          </Link>
        </div>
        {error && (
          <p className="text-red-600 text-center mt-5 font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default SignIn;
