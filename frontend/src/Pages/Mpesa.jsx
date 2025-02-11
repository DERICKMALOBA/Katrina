import  { useState } from "react";

const MpesaPayment = ({ onPaymentSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleMpesaPayment = () => {
    alert(`M-Pesa payment request sent to ${phoneNumber}`);
    onPaymentSuccess();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="M-Pesa Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleMpesaPayment}>Pay with M-Pesa</button>
    </div>
  );
};

export default MpesaPayment;