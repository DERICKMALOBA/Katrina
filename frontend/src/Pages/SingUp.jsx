import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
      else{
        setSuccess(data.message);
      }
      setLoading(false);
      setError(null);
      setSuccess(success.message);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    finally{
      setLoading(false);
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

           {/* Phone Number Input */}
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
            <span className="text-blue-600 hover:text-blue-100 cursor-pointer">
              Sign In
            </span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
        {success && <p className="text-green-500 mt-5">{success}</p>}
      </div>
    </div>
  );
}

export default SignUp;
