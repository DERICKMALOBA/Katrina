import { useState } from "react";

const CreditCardPayment = ({ onPaymentSuccess }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  // Luhn Algorithm for Card Number Validation
  const isValidCardNumber = (number) => {
    const digits = number.replace(/\D/g, "").split("").reverse().map(Number);
    if (digits.length !== 16) return false;

    const sum = digits.reduce((acc, digit, index) => {
      if (index % 2 !== 0) {
        const doubled = digit * 2;
        return acc + (doubled > 9 ? doubled - 9 : doubled);
      }
      return acc + digit;
    }, 0);

    return sum % 10 === 0;
  };

  // Check if the expiry date is valid
  const isValidExpiryDate = (month, year) => {
    if (!month || !year) return false;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based

    // Ensure month is between 1 and 12
    if (month < 1 || month > 12) return false;

    // Ensure year is within a reasonable range
    if (year < currentYear || year > currentYear + 10) return false;

    // Ensure the card is not expired
    return year > currentYear || (year === currentYear && month >= currentMonth);
  };

  // Validate CVV
  const isValidCVV = (cvv, cardNumber) => {
    const sanitizedCvv = cvv.replace(/\D/g, ""); // Ensure only digits
    if (!sanitizedCvv) return false;

    // Standard cards like Visa/MasterCard require 3-digit CVV
    // American Express (starting with 34 or 37) requires 4-digit CVV
    if (cardNumber.startsWith("34") || cardNumber.startsWith("37")) {
      return sanitizedCvv.length === 4;
    }
    return sanitizedCvv.length === 3;
  };

  const handleCardPayment = (e) => {
    e.preventDefault();

    const parsedMonth = parseInt(expiryMonth, 10);
    const parsedYear = parseInt(expiryYear, 10);

    if (!isValidCardNumber(cardNumber)) {
      setError("Invalid card number");
      return;
    }

    if (!isValidExpiryDate(parsedMonth, parsedYear)) {
      setError("Invalid expiry date");
      return;
    }

    if (!isValidCVV(cvv, cardNumber)) {
      setError("Invalid CVV");
      return;
    }

    setError("");
    alert("Payment Successful");
    onPaymentSuccess();
  };

  return (
    <form onSubmit={handleCardPayment} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <label className="block text-gray-700 font-semibold mb-2">Card Number</label>
      <input
        type="text"
        placeholder="Enter 16-digit Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength="16"
      />

      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-2">Expiry Month</label>
          <select
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {String(i + 1).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-2">Expiry Year</label>
          <select
            value={expiryYear}
            onChange={(e) => setExpiryYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">YY</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear();
              return (
                <option key={year + i} value={year + i}>
                  {year + i}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-2">CVV</label>
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="4"
          />
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md mt-4 hover:bg-blue-600 transition duration-300"
      >
        Pay
      </button>
    </form>
  );
};

export default CreditCardPayment;
