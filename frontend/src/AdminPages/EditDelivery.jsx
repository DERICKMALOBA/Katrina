import { useState, useEffect } from "react";

// Custom hook to fetch delivery data
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

        setDeliveryData({
          counties: Array.from(countiesSet),
          cities: citiesMap,
          deliveryFees: deliveryFeesMap,
          deliveryVehicles: deliveryVehiclesMap,
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

const EditDelivery = () => {
  const [vehicle, setVehicle] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [cityDeliveryFee, setCityDeliveryFee] = useState("");
  const [cities, setCities] = useState([]); // Dynamic cities list
  const [error, setError] = useState("");

  // Fetch delivery data using the custom hook
  const deliveryData = useFetchDeliveryData();

  useEffect(() => {
    if (county) {
      setCities(deliveryData.cities[county] || []);
    } else {
      setCities([]); // Ensure cities is empty if no county is selected
    }
  }, [county, deliveryData]);

  const handleCityDeliveryFeeChange = (cityName, newFee) => {
    if (isNaN(newFee) || newFee < 0) {
      setError("Delivery fee must be a positive number");
      return;
    }
    setError("");
    const updatedCities = cities.map((ct) =>
      ct.name === cityName ? { ...ct, deliveryFee: Number(newFee) } : ct
    );
    setCities(updatedCities);
  };

  const handleCityAdd = () => {
    if (city && cityDeliveryFee) {
      if (isNaN(cityDeliveryFee) || cityDeliveryFee < 0) {
        setError("Delivery fee must be a positive number");
        return;
      }
      setError("");
      const newCity = {
        name: city,
        deliveryFee: Number(cityDeliveryFee),
        vehicles: [],
      };
      setCities([...cities, newCity]);
      setCity("");
      setCityDeliveryFee("");
    } else {
      setError("Please fill in both city name and delivery fee");
    }
  };

  const handleCityDelete = (cityName) => {
    const updatedCities = cities.filter((city) => city.name !== cityName);
    setCities(updatedCities);
  };

  const handleVehicleDelete = (cityName, vehicleName) => {
    const updatedCities = cities.map((city) =>
      city.name === cityName
        ? {
            ...city,
            vehicles: city.vehicles.filter((veh) => veh !== vehicleName),
          }
        : city
    );
    setCities(updatedCities);
  };

  const handleVehicleAddToCity = (cityName) => {
    if (vehicle) {
      const updatedCities = cities.map((city) =>
        city.name === cityName
          ? { ...city, vehicles: [...city.vehicles, vehicle] }
          : city
      );
      setCities(updatedCities);
      setVehicle("");
    } else {
      setError("Please enter a vehicle name");
    }
  };

  const handleUpdateSettings = async () => {
    const updatedSettings = {
      counties: [
        {
          name: county,
          cities,
        },
      ],
    };

    try {
      const response = await fetch("/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Settings updated successfully!");
      } else {
        alert("Error updating settings: " + data.message);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Error updating settings");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Admin Settings</h1>

      {/* County Selection Section */}
      {deliveryData.counties && deliveryData.counties.length > 0 && (
        <select
          value={county}
          onChange={(e) => setCounty(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-1/3"
        >
          <option value="">Select a county</option>
          {deliveryData.counties.map((countyItem, index) => (
            <option key={index} value={countyItem}>
              {countyItem}
            </option>
          ))}
        </select>
      )}

      {/* Cities Section */}
      {county && deliveryData.cities[county] && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Cities in {county}</h2>

          {/* Add City Section */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mr-4"
              placeholder="Enter city name"
            />
            <input
              type="number"
              value={cityDeliveryFee}
              onChange={(e) => setCityDeliveryFee(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mr-4"
              placeholder="Enter delivery fee"
            />
            <button
              onClick={handleCityAdd}
              className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
            >
              Add City
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* List of Cities */}
          <ul className="list-disc pl-6">
            {cities.map((ct, index) => (
              <li key={index} className="mb-4 flex items-center">
                <span>
                  {ct.name} - KSh{ct.deliveryFee}
                </span>
                <input
                  type="number"
                  value={ct.city}
                  onChange={(e) =>
                    handleCityDeliveryFeeChange(ct.name, e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-md ml-4 w-32"
                />
                <button
                  onClick={() => handleCityDelete(ct.name)}
                  className="ml-4 text-red-500 hover:underline"
                >
                  Delete City
                </button>

                {/* Vehicle Management for this City */}
                <div className="ml-6">
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md mr-4"
                    placeholder="Enter vehicle name"
                  />
                  <button
                    onClick={() => handleVehicleAddToCity(ct.name)}
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                  >
                    Add Vehicle
                  </button>

                  {/* List of Vehicles for this City */}
                  <ul className="list-disc pl-6 mt-2">
                    {(ct.vehicles || []).map((veh, idx) => (
                      <li key={idx} className="mb-2">
                        {veh}
                        <button
                          onClick={() => handleVehicleDelete(ct.name, veh)}
                          className="ml-4 text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpdateSettings}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Update Settings
      </button>
    </div>
  );
};

export default EditDelivery;
