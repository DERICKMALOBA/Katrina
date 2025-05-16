import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');


  
var dat={Email:email}
  const handleEmailSubmit = async(e) => {

    e.preventDefault();
    if (email) {
          const res = await fetch('/api/users/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dat),
        });
        const data = await res.json();
        if(data.Message==0)
        {     
      alert(`Successfully subscribed with email: ${email}`);
      setEmail('');
        }
        else
        {
          alert(`You have already subcribed`);
      setEmail('');
        }
      }
    else
    {
      alert("Kindly enter email in order to subscribe");
    }
  };



  return (
    <footer className="bg-gray-700 text-white py-12 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* First Row: Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand and Help Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Katrina Kid's Closet</h2>
            <h3 className="font-semibold">Need Help?</h3>
            <ul className="mt-2 space-y-2">
              <li>
               
              </li>
              <li><a href="/contact" className="hover:text-green-400">Contact Us</a></li>
              <li><a href="/help-center" className="hover:text-green-400">Help Center</a></li>
            </ul>
          </div>

          {/* Email Subscription Section */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-sm mb-4">Stay updated with the latest news, offers, and discounts</p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col md:flex-row items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-black p-2 rounded-lg w-full md:w-64"
                required
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Subscribe
              </button>
            </form>
          </div>

          {/* Useful Links Section */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-green-400">About Us</a></li>
              <li><a href="/faq" className="hover:text-green-400">FAQ</a></li>
              <li><a href="/terms" className="hover:text-green-400">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-green-400">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Second Row: Social Media Section */}
        <div className="mt-8 text-center">
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <div className="flex justify-center gap-6 text-2xl">
            <a href="#" className="hover:text-blue-400"><FaFacebook size={40} /></a>
            <a href="#" className="hover:text-red-400"><FaInstagram size={40} /></a>
            <a href="#" className="hover:text-green-400"><FaWhatsapp size={40} /></a>
            <a href="#" className="hover:text-gray-400"><FaTiktok size={40} /></a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-sm mt-8">
          <p>&copy; {new Date().getFullYear()} Katrina Kid's Closet. All rights reserved.</p>
        </div>
      </div>

    
    </footer>
  );
}

export default Footer;