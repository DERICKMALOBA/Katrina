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
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1 className="text-3xl text-center font-semibold my-7 text-green-800">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="email"
            onChange={handleChange}
          />

           {/* Phone Number Input */}
           <input
            type="text"
            placeholder="Enter your phone number"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="phone"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Create a password"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="password"
            onChange={handleChange}
          />
         
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <Link to="/sign-in">
            <span className="text-green-600 hover:text-green-800 cursor-pointer">
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
