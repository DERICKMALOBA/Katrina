import { useState, useEffect } from "react";

const useFetchDeliveryData = () => {
  const [deliveryData, setDeliveryData] = useState({
    counties: [],
    cities: {},
    deliveryFees: {},
    cityVehicles: {},
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
        const cityVehiclesMap = {};

        data.forEach((item) => {
          countiesSet.add(item.county_name);
          if (!citiesMap[item.county_name]) {
            citiesMap[item.county_name] = [];
          }
          citiesMap[item.county_name].push(item.city_name);
          deliveryFeesMap[item.city_name] = item.delivery_fee;
          cityVehiclesMap[item.city_name] = item.delivery_vehicle || ""; // Store vehicles
        });

        setDeliveryData({
          counties: Array.from(countiesSet),
          cities: citiesMap,
          deliveryFees: deliveryFeesMap,
          cityVehicles: cityVehiclesMap,
          loading: false,
          error: null,
        });
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

const EditDeliveryFee = () => {
  const [county, setCounty] = useState("");
  const [cityFees, setCityFees] = useState({});
  const [cityVehicles, setCityVehicles] = useState({});
  const deliveryData = useFetchDeliveryData();

  useEffect(() => {
    if (county) {
      const newCityFees = {};
      const newCityVehicles = {};
      (deliveryData.cities[county] || []).forEach((city) => {
        newCityFees[city] = deliveryData.deliveryFees[city] || "";
        newCityVehicles[city] = deliveryData.cityVehicles[city] || "";
      });
      setCityFees(newCityFees);
      setCityVehicles(newCityVehicles);
    } else {
      setCityFees({});
      setCityVehicles({});
    }
  }, [county, deliveryData]);

  const handleFeeChange = (city, newFee) => {
    if (isNaN(newFee) || newFee < 0) return;
    setCityFees({ ...cityFees, [city]: newFee });
  };

  const handleVehicleChange = (city, newVehicle) => {
    setCityVehicles({ ...cityVehicles, [city]: newVehicle });
  };

  const getVehicleDisplayValue = (vehicle) => {
    if (!vehicle || vehicle === '[]') return '';
    return vehicle.replace(/["\\]/g, '').trim();
  };

  const handleUpdateData = async () => {
    try {
      const response = await fetch("/api/delivery/update-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ county, cityFees, cityVehicles }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Delivery data updated successfully!");
      } else {
        alert("Error updating data: " + data.message);
      }
    } catch (error) {
      alert("Error updating data");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-[#1f2121] w-full text-white">
      <h1 className="text-2xl font-bold text-center mb-8">Edit Delivery Data</h1>
      <div className="mb-6">
        <label htmlFor="county-select" className="block mb-2 font-medium">
          Select County:
        </label>
        <select
          id="county-select"
          value={county}
          onChange={(e) => setCounty(e.target.value)}
          className="border border-gray-500 p-2 rounded-md w-full md:w-1/3 bg-gray-800 text-white"
        >
          <option value="">Select a county</option>
          {deliveryData.counties.map((countyItem, index) => (
            <option key={index} value={countyItem} className="bg-gray-800">
              {countyItem}
            </option>
          ))}
        </select>
      </div>
      
      {county && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-700">
            Cities in {county}
          </h2>
          <div className="space-y-6">
            {Object.keys(cityFees).map((city, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-medium">City:</label>
                    <div className="p-2 bg-gray-800 rounded">{city}</div>
                  </div>
                  <div>
                    <label htmlFor={`fee-${index}`} className="block mb-2 font-medium">
                      Delivery Fee:
                    </label>
                    <input
                      id={`fee-${index}`}
                      type="number"
                      value={cityFees[city]}
                      onChange={(e) => handleFeeChange(city, e.target.value)}
                      className="border border-gray-600 p-2 rounded-md w-full bg-gray-800"
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`vehicle-${index}`} className="block mb-2 font-medium">
                      Vehicles:
                    </label>
                    <input
                      id={`vehicle-${index}`}
                      type="text"
                      value={getVehicleDisplayValue(cityVehicles[city])}
                      onChange={(e) => handleVehicleChange(city, e.target.value)}
                      className="border border-gray-600 p-2 rounded-md w-full bg-gray-800"
                      placeholder="e.g., North Rift, Kangaroo shuttle"
                    />
                    {!getVehicleDisplayValue(cityVehicles[city]) && (
                      <p className="text-gray-400 text-sm mt-1">
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpdateData}
            className="mt-6 bg-[#307bb5] text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
          >
            Update Data
          </button>
        </div>
      )}
    </div>
  );
};

export default EditDeliveryFee;