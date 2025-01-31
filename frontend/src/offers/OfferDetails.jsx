

const OfferDetails = ({ offer }) => {
  return (
    <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'>
      <h3 className='text-xl font-semibold text-gray-100 mb-4'>Offer Details</h3>
      <p className='text-gray-300 mb-2'>Name: {offer.name}</p>
      <p className='text-gray-300 mb-2'>Description: {offer.description}</p>
      <p className='text-gray-300 mb-2'>Discount: {offer.discount}</p>
      <p className='text-gray-300 mb-2'>Valid From: {offer.validFrom}</p>
      <p className='text-gray-300 mb-2'>Valid To: {offer.validTo}</p>
      <p className='text-gray-300'>Status: {offer.status}</p>
    </div>
  );
};

// Dummy data for demonstration
const sampleOffer = {
  name: "Winter Sale",
  description: "Get up to 50% off on selected items during our Winter Sale!",
  discount: "50%",
  validFrom: "2025-01-15",
  validTo: "2025-02-15",
  status: "Active",
};

// Usage example
const ExampleUsage = () => {
  return <OfferDetails offer={sampleOffer} />;
};

export default ExampleUsage;
