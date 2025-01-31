import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash, X } from "lucide-react";

const initialOffers = [
  {
    id: 1,
    name: "New Year Sale",
    description: "Up to 50% off on selected items",
    discount: "50%",
    validFrom: "2025-01-01",
    validTo: "2025-01-31",
    status: "Active",
  },
  {
    id: 2,
    name: "Valentine's Day Special",
    description: "Buy one get one free",
    discount: "50%",
    validFrom: "2025-02-10",
    validTo: "2025-02-14",
    status: "Upcoming",
  },
];

const OffersTable = () => {
  const [offers, setOffers] = useState(initialOffers);
  const [editOffer, setEditOffer] = useState(null);

  const handleDelete = (id) => {
    setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
  };

  const handleEdit = (offer) => {
    setEditOffer(offer);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setOffers((prevOffers) =>
      prevOffers.map((o) => (o.id === editOffer.id ? editOffer : o))
    );
    setEditOffer(null);
  };
console.log(offers.name)
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Offers Table</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {['Name', 'Description', 'Discount', 'Valid From', 'Valid To', 'Status', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {offers.map((offer) => (
              <motion.tr key={offer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 whitespace-nowrap">{offer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{offer.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{offer.discount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{offer.validFrom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{offer.validTo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{offer.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2" onClick={() => handleEdit(offer)}>
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(offer.id)}>
                    <Trash size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {editOffer && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Edit Offer</h2>
              <button onClick={() => setEditOffer(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {['name', 'description', 'discount', 'validFrom', 'validTo'].map((field) => (
                <input
                  key={field}
                  type={field.includes('valid') ? 'date' : 'text'}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  value={editOffer[field]}
                  onChange={(e) => setEditOffer({ ...editOffer, [field]: e.target.value })}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required
                />
              ))}
              <select
                className="w-full p-2 rounded bg-gray-800 text-white"
                value={editOffer.status}
                onChange={(e) => setEditOffer({ ...editOffer, status: e.target.value })}
                required
              >
                {['Active', 'Upcoming', 'Expired'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="flex justify-between">
                <button type="button" className="bg-red-500 px-4 py-2 rounded text-white" onClick={() => setEditOffer(null)}>
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 px-4 py-2 rounded text-white">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OffersTable;