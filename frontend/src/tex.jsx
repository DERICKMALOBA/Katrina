import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SignUp() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
  
      if (!data.success) {
        setLoading(false);
        setError(data.message); // Display the error message from the server
        return;
      }
  
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
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
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1 className="text-3xl text-center font-semibold my-7">Sign up</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            id="email"
            onChange={handleChange}
          />
           <input
            type="number"
            placeholder="Enter your phone number"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="phone"
            name="phone"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            id="password"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
              Sign In
            </span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  );
}

export default SignUp;
