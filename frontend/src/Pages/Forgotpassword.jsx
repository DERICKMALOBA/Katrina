import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ForgotPassword() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false); 
  const handleChange = (e) => {
   setFormData(e.target.value);
  };
   const form={Email:formData};
  const handleSubmit = async (e) => {
    e.preventDefault();
  setLoading(true);
    try {
        const res = await fetch('/api/auth/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });
        const data=await res.json();
        if(data.message==1)
        {
            setLoading(false);
        toast.success('Email sent successful!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { backgroundColor: 'green', color: 'white' }
        });
    }
    if(data.message==0)
    { setLoading(false);
        toast.error('Failed to sent email', {
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
    } catch (error) {
        console.error(error.message);
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
          Reset your password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            id="email"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-400 transition duration-300"
          >
            {loading?'Sending email...':'Send'}
          </button>
        </form>        
      </div>
    </div>
  );
}

export default ForgotPassword;