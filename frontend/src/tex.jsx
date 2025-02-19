 const fetchFilteredProducts = async () => {
    try {
        let apiUrl = "/api/products/productslist";
        const queryParams = new URLSearchParams();

        if (discount) {
            apiUrl = "/api/products/discount";
            queryParams.append("discount", discount);
        } else if (size) {
            apiUrl = "/api/products/size";
            queryParams.append("size", size);
        } else if (rating) {
            apiUrl = "/api/products/rating";
        } else if (priceRange.min || priceRange.max) {
            apiUrl = "/api/products/price"; // Use price filtering route
            if (priceRange.min) queryParams.append("minPrice", priceRange.min);
            if (priceRange.max) queryParams.append("maxPrice", priceRange.max);
        } else if (sortBy) {
            apiUrl = "/api/products/pricedescasce";
            queryParams.append("sortBy", sortBy);
        }

        const fullUrl = `${apiUrl}?${queryParams.toString()}`;
        console.log("Fetching:", fullUrl);
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

// Fetch products when triggerSearch changes
useEffect(() => {
    if (triggerSearch) {
        fetchFilteredProducts();
        setTriggerSearch(false); // Reset trigger
    }
}, [triggerSearch]);






















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
                deliveryData.cities[selectedCounty]?.map(
                  (city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  )
                )}
            </select>
          </div>

          {/* Display Delivery Fee */}
          <div className="mt-4">
            <label className="text-gray-700 font-semibold">
              Delivery Fee:
            </label>
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
              {deliveryData.deliveryVehicles &&
              deliveryData.deliveryVehicles.length > 0 ? (
                deliveryData.deliveryVehicles.map((vehicle, index) => (
                  <option key={index} value={vehicle}>
                    {vehicle}
                  </option>
                ))
              ) : (
                <option value="">No vehicles available</option>
              )}
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

    {/* Payment Details */}
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
</div>