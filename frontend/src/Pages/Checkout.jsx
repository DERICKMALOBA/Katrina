import { useState } from "react";
import { useForm } from "react-hook-form";

const counties = {
  "Nairobi": ["Nairobi City"],
  "Kiambu": ["Thika", "Ruiru", "Kiambu Town"],
  "Mombasa": ["Mombasa City", "Nyali", "Likoni"],
};

export default function CheckoutForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [selectedCounty, setSelectedCounty] = useState("");

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Checkout Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("fullName", { required: "Full name is required" })}
          className="w-full p-2 border rounded"
          placeholder="Full Name"
        />
        {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}

        <input
          {...register("email", { required: "Email is required" })}
          className="w-full p-2 border rounded"
          placeholder="Email"
          type="email"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          {...register("phone", { required: "Phone number is required" })}
          className="w-full p-2 border rounded"
          placeholder="Phone Number"
          type="tel"
        />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

        <input
          {...register("additionalPhone")}
          className="w-full p-2 border rounded"
          placeholder="Additional Phone Number (Optional)"
          type="tel"
        />

        <input
          {...register("address", { required: "Address is required" })}
          className="w-full p-2 border rounded"
          placeholder="Physical Address"
        />
        {errors.address && <p className="text-red-500">{errors.address.message}</p>}

        <select
          {...register("county", { required: "County is required" })}
          className="w-full p-2 border rounded"
          onChange={(e) => setSelectedCounty(e.target.value)}
        >
          <option value="">Select County</option>
          {Object.keys(counties).map((county) => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>
        {errors.county && <p className="text-red-500">{errors.county.message}</p>}

        <select
          {...register("city", { required: "City is required" })}
          className="w-full p-2 border rounded"
          disabled={!selectedCounty}
        >
          <option value="">Select City/Town</option>
          {selectedCounty &&
            counties[selectedCounty]?.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
        </select>
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
