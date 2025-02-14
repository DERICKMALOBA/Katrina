import { useState, useEffect } from "react";
import CreditCardPayment from "./card";
import MpesaPayment from "./Mpesa";
import { useSelector } from "react-redux";

const CheckoutPage = () => {
  const totalPrice = useSelector((state) => state.cart.totalPrice);
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

  const handleCountyChange = (event) => {
    const selectedCounty = event.target.value;
    setSelectedCounty(selectedCounty);
    setSelectedCity(""); // Reset city when county changes

    setFormData((prevData) => ({
      ...prevData,
      county: selectedCounty,
      city: "",
      deliveryFee: "",
      deliveryVehicle: "",
    }));
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);

    const fee = deliveryData.deliveryFees[selectedCity] || "N/A";
    setFormData((prevData) => ({
      ...prevData,
      city: selectedCity,
      deliveryFee: fee,
    }));

    // Debugging: log the delivery vehicles for the selected city
    console.log(
      "Delivery Vehicles for Selected City:",
      deliveryData.deliveryVehicles[selectedCity]
    );
  };

  const handlePaymentMethodChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: value,
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

  const useFetchDeliveryData = () => {
    const [deliveryData, setDeliveryData] = useState({
      counties: [],
      cities: {},
      deliveryFees: {},
      deliveryVehicles: {},
      loading: true,
      error: null,
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/delivery/all");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();

          const countiesSet = new Set();
          const citiesMap = {};
          const deliveryFeesMap = {};
          const deliveryVehiclesMap = {};

          data.forEach((item) => {
            countiesSet.add(item.county_name);

            if (!citiesMap[item.county_name]) {
              citiesMap[item.county_name] = [];
            }
            citiesMap[item.county_name].push(item.city_name);

            deliveryFeesMap[item.city_name] = item.delivery_fee;

            try {
              deliveryVehiclesMap[item.city_name] = JSON.parse(
                item.delivery_vehicle || "[]"
              );
            } catch (error) {
              console.error(
                `Error parsing delivery_vehicle for ${item.city_name}:`,
                error
              );
              deliveryVehiclesMap[item.city_name] = [];
            }
          });
          console.log("Fetched Delivery Vehicles:", deliveryVehiclesMap);

          setDeliveryData({
            counties: Array.from(countiesSet),
            cities: citiesMap,
            deliveryFees: deliveryFeesMap,
            deliveryVehicles: deliveryVehiclesMap,
            loading: false,
            error: null,
          });
          console.log(
            "Delivery Vehicles for Selected City:",
            deliveryData.deliveryVehicles[selectedCity]
          );
        } catch (error) {
          setDeliveryData((prevState) => ({
            ...prevState,
            loading: false,
            error: error.message,
          }));
        }
      };

      fetchData();
    }, []);

    return deliveryData;
  };

  const deliveryData = useFetchDeliveryData();
  const handleVehicleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      deliveryVehicle: event.target.value, // Update delivery vehicle in the form data
    }));
  };

  return (
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md space-y-6 relative">
    <div className="flex">
      <div className="w-3/4 pr-6 space-y-6">
        {/* Customer Details */}
        <div className={`p-4 border rounded-lg ${customerDetailsCleared ? "bg-green-100" : "bg-white"}`}>
          <h1 className="text-xl font-semibold text-gray-800">Customer Details</h1>
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
                {/* County Dropdown */}
                <select
                  className="p-2 border rounded w-full"
                  value={selectedCounty}
                  onChange={handleCountyChange}
                  required
                >
                  <option value="">Select a County</option>
                  {deliveryData.counties.map((county, index) => (
                    <option key={index} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
  
                {/* City Dropdown (Disabled until a county is selected) */}
                <select
                  className="p-2 border rounded w-full"
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedCounty}
                  required
                >
                  <option value="">Select a City</option>
                  {selectedCounty &&
                    deliveryData.cities[selectedCounty]?.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
  
              {/* Display Delivery Fee */}
              <div className="mt-4">
                <label className="text-gray-700 font-semibold">Delivery Fee:</label>
                <input
                  className="p-2 border rounded w-full bg-gray-100"
                  type="text"
                  value={formData.deliveryFee || ""}
                  readOnly
                />
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
          <div className={`p-4 border rounded-lg ${deliveryDetailsCleared ? "bg-green-100" : "bg-white"}`}>
            <h1 className="text-xl font-semibold text-gray-800">Delivery Details</h1>
            {!deliveryDetailsCleared ? (
              <div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="p-2">
                    <label className="block font-semibold text-gray-700">Delivery Vehicle</label>
  
                    <div className="mt-4">
                      <label className="text-gray-700 font-semibold">City:</label>
                      <input
                        className="p-2 border rounded w-full bg-gray-100"
                        type="text"
                        value={selectedCity || ""} // Display the selected city
                        readOnly
                      />
                    </div>
                    <select
                      className="p-2 border rounded w-full mt-4"
                      value={formData.deliveryVehicle}
                      onChange={handleVehicleChange}
                      required
                      disabled={!selectedCity} // Disable vehicle dropdown if no city is selected
                    >
                      <option value="">Select a vehicle</option>
                      {Array.isArray(deliveryData.deliveryVehicles[selectedCity])
                        ? deliveryData.deliveryVehicles[selectedCity].map((vehicle, index) => (
                            <option key={index} value={vehicle}>
                              {vehicle?.replace(/["\\]/g, "").trim() || ""}
                            </option>
                          ))
                        : typeof deliveryData.deliveryVehicles[selectedCity] === "string"
                        ? deliveryData.deliveryVehicles[selectedCity]
                            .split(",")
                            .map((vehicle, index) => (
                              <option key={index} value={vehicle.trim()}>
                                {vehicle.trim()}
                              </option>
                            ))
                        : []}
                    </select>
                  </div>
                </div>
  
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
  
  {deliveryDetailsCleared && (
          <div
            className={`p-4 border rounded-lg ${
              paymentCleared ? "bg-green-100" : "bg-white"
            }`}
          >
            <h1 className="text-xl font-semibold text-gray-800">
              Payment Details
            </h1>
            {!paymentCleared ? (
              <div className="space-y-4">
                <select
                  className="p-2 border rounded w-full"
                  value={formData.paymentMethod}
                  onChange={handlePaymentMethodChange}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="mpesa">Mpesa</option>
                </select>
                {formData.paymentMethod === "credit_card" && (
                  <CreditCardPayment />
                )}
                {formData.paymentMethod === "mpesa" && <MpesaPayment />}
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
                  ✔ <span className="ml-2">Payment Details</span>
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
    
      </div>
      <div className="w-1/4">
        {/* Order Summary */}
        <div className="p-4 border rounded-lg bg-white shadow-md">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <div className="space-y-2 mt-4">
            <p>Total Price: KSh {totalPrice}</p>
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
              onClick={handleSubmit}
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  
  
  
  
  
  );
};

export default CheckoutPage;
