import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSelector } from 'react-redux';
function ResetPassword() {
  var [loading,setLoading]=useState(false); 
  const [newpassword,setNewpassword]=useState({});
  const [confirmpassword,setConfirmpassword]=useState({});
  const navigate = useNavigate();
  var user = useSelector((state) => state.auth.user);
  const handlenew = (e) => {
       setNewpassword(e.target.value);
  };
  const handleconfirm = (e) => {
    setConfirmpassword(e.target.value);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
  var email=user.forgotpasswordemail;
    var form={Newpassword:newpassword,confirm:confirmpassword,Email:email};
   
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
        const res = await fetch('/api/auth/passwordreset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        // Check if the response is valid and contains token and role
        if (data.Message!=1){
            throw new Error(data.message || 'Invalid response from server');
        }
        else{
 setLoading(false);
       toast.success('Password have been changed successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { backgroundColor: 'green', color: 'white' }
        });
            navigate('/sign-in'); 
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