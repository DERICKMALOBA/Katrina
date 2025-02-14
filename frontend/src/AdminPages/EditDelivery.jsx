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
  // const cleanedText = cityVehicles[city]?.replace(/["\\]/g, '').trim() || "";

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8 text-primaryOrange">Edit Delivery Data</h1>
      <select
        value={county}
        onChange={(e) => setCounty(e.target.value)}
        className="border border-gray-300 p-2 rounded-md w-1/3"
      >
        <option value="">Select a county</option>
        {deliveryData.counties.map((countyItem, index) => (
          <option key={index} value={countyItem}>{countyItem}</option>
        ))}
      </select>
      {county && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Cities in {county}</h2>
          {Object.keys(cityFees).map((city, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center mb-2">
                <span className="w-1/3 text-white">{city}</span>
                <input
                  type="number"
                  value={cityFees[city]}
                  onChange={(e) => handleFeeChange(city, e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-1/3"
                />
              </div>
              <div className="flex items-center mb-4">
                <span className="w-1/3 text-white">Vehicles</span>
                <input
                  type="text"
                  value={cityVehicles[city]?.replace(/["\\]/g, '').trim() || ""} 

                  onChange={(e) => handleVehicleChange(city, e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-1/3"
                  placeholder="e.g., Bikes, Vans"
                />
              </div>
            </div>
          ))}
          <button
            onClick={handleUpdateData}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Update Data
          </button>
        </div>
      )}
    </div>
  );
};

export default EditDeliveryFee;
