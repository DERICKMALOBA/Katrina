import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../Redux/UserSlice';

function ResetPassword() {
 useSelector((state) => state.user);
  const [loading,setLoading]=useState(false); 
  const [newpassword,setNewpassword]=useState({});
  const [confirmpassword,setConfirmpassword]=useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlenew = (e) => {
       setNewpassword(e.target.value);
  };
  const handleconfirm = (e) => {
    setConfirmpassword(e.target.value);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    setLoading(true);
    const  form={new:newpassword,confirm:confirmpassword}
    if(newpassword!=confirmpassword)
    {
        toast.error("Kindly ensure that new password and Confirm password match", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { backgroundColor: 'red', color: 'white' }
        });
       return;  
    }
    try {
        const res = await fetch('/api/auth/resetpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setLoading(false);
        // Check if the response is valid and contains token and role
        if (!data.success || !data.user || !data.user.token || !data.user.role) {
            throw new Error(data.message || 'Invalid response from server');
        }

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
        <h1 className="text-2xl text-center font-bold text-blue-800 my-7">
          Changing Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="New password"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="email"
            onChange={handlenew}
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="password"
            onChange={handleconfirm}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-400 transition duration-300"
          >
            {loading ? 'Resetting...' : 'Reset'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;