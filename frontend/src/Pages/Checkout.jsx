import { useState } from "react";
import { counties, towns } from "./Data";
import CreditCardPayment from "./card";
import MpesaPayment from "./Mpesa";

const CheckoutPage = () => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [customerDetailsCleared, setCustomerDetailsCleared] = useState(false);
  const [deliveryDetailsCleared, setDeliveryDetailsCleared] = useState(false);
  const [paymentCleared, setPaymentCleared] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    altPhoneNumber: "",
    address: "",
    county: "",
    city: "",
    deliveryVehicle: "",
    deliveryFee: "",
    paymentMethod: "",
    mpesaNumber: "",
  
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phoneNumber ||
      !formData.address ||
      !formData.county ||
      !formData.city ||
      !formData.deliveryVehicle ||
      !formData.deliveryFee ||
      !formData.paymentMethod 
    
    ) {
      alert("Please fill all required fields.");
      return;
    }

  


    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Order submitted:", data);
        alert("Order submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting order:", error);
      });
  };

 

  const handleCountyChange = (event) => {
    setSelectedCounty(event.target.value);
    setSelectedCity("");
    setFormData((prevData) => ({
      ...prevData,
      county: event.target.value,
    }));
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setFormData((prevData) => ({
      ...prevData,
      city: event.target.value,
    }));
  };

  const handlePaymentMethodChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: value,
    }));
  };

  return (
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md space-y-6 relative">
      <div className="flex">
        <div className="w-3/4 pr-6 space-y-6">
          {/* Customer Details */}
          <div
            className={`p-4 border rounded-lg ${
              customerDetailsCleared ? "bg-green-100" : "bg-white"
            }`}
          >
            <h1 className="text-xl font-semibold text-gray-800">
              Customer Details
            </h1>
            {!customerDetailsCleared ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="p-2 border rounded w-full"
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className="p-2 border rounded w-full"
                    type="text"
                    placeholder="Second Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="p-2 border rounded w-full"
                    type="text"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className="p-2 border rounded w-full"
                    type="text"
                    placeholder="Alternative Phone Number"
                    name="altPhoneNumber"
                    value={formData.altPhoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <input
                  className="p-2 border rounded w-full"
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="p-2 border rounded w-full"
                    value={selectedCounty}
                    onChange={handleCountyChange}
                    required
                  >
                    <option value="">Select a County</option>
                    {counties.map((county, index) => (
                      <option key={index} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-2 border rounded w-full"
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={!selectedCounty}
                    required
                  >
                    <option value="">Select a City</option>
                    {selectedCounty &&
                      towns[selectedCounty]?.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                    Cancel
                  </button>
                  <button
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    onClick={() => setCustomerDetailsCleared(true)}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-green-600 flex items-center">
                  ✔ <span className="ml-2">Customer Details</span>
                </h3>
                <button
                  className="text-primaryBlack hover:underline"
                  onClick={() => setCustomerDetailsCleared(false)}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Delivery Details */}
          {customerDetailsCleared && (
            <div
              className={`p-4 border rounded-lg ${
                deliveryDetailsCleared ? "bg-green-100" : "bg-white"
              }`}
            >
              <h1 className="text-xl font-semibold text-gray-800">
                Delivery Details
              </h1>
              {!deliveryDetailsCleared ? (
                <div className="space-y-4">
                  <select
                    className="p-2 border rounded w-full"
                    value={formData.deliveryVehicle}
                    onChange={handleInputChange}
                    name="deliveryVehicle"
                    required
                  >
                    <option value="">Select Delivery Vehicle</option>
                    <option value="bike">Bike</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                  </select>
                  <input
                    className="p-2 border rounded w-full"
                    type="text"
                    placeholder="Delivery Fee"
                    name="deliveryFee"
                    value={formData.deliveryFee}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="flex justify-end space-x-4 mt-4">
                    <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                      Cancel
                    </button>
                    <button
                      className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                      onClick={() => setDeliveryDetailsCleared(true)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center">
                    ✔ <span className="ml-2">Delivery Details</span>
                  </h3>
                  <button
                    className="text-primaryBlack hover:underline"
                    onClick={() => setDeliveryDetailsCleared(false)}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payment Methods */}
          {deliveryDetailsCleared && (
            <div
              className={`p-4 border rounded-lg ${
                paymentCleared ? "bg-green-100" : "bg-white"
              }`}
            >
              <h1 className="text-xl font-semibold text-gray-800">
                Payment Methods
              </h1>
              {!paymentCleared ? (
                <div className="space-y-4">
                  <label className="block">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={formData.paymentMethod === "mpesa"}
                      onChange={handlePaymentMethodChange}
                      className="mr-2"
                    />{" "}
                    M-Pesa Paybill
                  </label>
                  <label className="block">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={formData.paymentMethod === "credit"}
                      onChange={handlePaymentMethodChange}
                      className="mr-2"
                    />{" "}
                    Credit Card
                  </label>
                  {formData.paymentMethod === "mpesa" && (
                     <MpesaPayment/>
                  )}
                  {formData.paymentMethod === "credit" && (
                    <CreditCardPayment/>
                  )}

                  <div className="flex justify-end space-x-4 mt-4">
                    <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                      Cancel
                    </button>
                    <button
                      className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                      onClick={() => setPaymentCleared(true)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center">
                    ✔ <span className="ml-2">Payment Methods</span>
                  </h3>
                  <button
                    className="text-primaryBlack hover:underline"
                    onClick={() => setPaymentCleared(false)}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary (Right) */}
        <div className="w-1/4 p-4 absolute top-6 right-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <p>Items Total: $XX</p>
          <p>Delivery Fee: $XX</p>
          <p className="font-bold">Total: $XX</p>
          <button
            className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Confirm Order
          </button>
        </div>
      
      </div>
    </div>
  );
};

export default CheckoutPage;
