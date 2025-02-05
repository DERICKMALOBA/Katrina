import { CheckCircle, Clock, DollarSign, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "../SharedComponent/StatCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit, Trash, X } from "lucide-react";

const offerStats = {
  totalOffers: "150",
  activeOffers: "120",
  expiredOffers: "30",
  totalDiscount: "12,345",
};

const OffersPage = () => {
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [displayedOffers, setDisplayedOffers] = useState(filteredOffers.slice(0, 10));
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newOffer, setNewOffer] = useState({
    name: "",
    description: "",
    discount: "",
    validFrom: "", // Fixed typo here
    validTo: "",
    offer: "", // Changed from invalid "boolian" to appropriate field type
  });
  const [editOffer, setEditOffer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch offers function
  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers/offers");
      const data = await response.json();
      if (response.ok) {
        setFilteredOffers(data.offers);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOffers((prev) =>
      prev.filter(
        (offer) =>
          offer.name.toLowerCase().includes(term) || // Fixed typo (offer.title -> offer.name)
          offer.description.toLowerCase().includes(term)
      )
    );
  };

  const handleAddOffer = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) {
      return;
    }

    try {
      const response = await fetch(`/api/offers/delete-offer/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchOffers(); // Refetch offers after deletion
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Failed to delete offer. Please try again.");
    }
  };

  const handleEdit = (offer) => {
    setEditOffer({ ...offer });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/offers/add-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOffer),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Offer added successfully!");
        setShowAddForm(false);
        setNewOffer({
          name: "",
          description: "",
          discount: "",
          validFrom: "", // Fixed typo here
          validTo: "",
          offer: "",
        });

        fetchOffers(); // Refetch the offers after adding
      } else {
        toast.error(data.error || "Failed to add offer.");
      }
    } catch (error) {
      toast.error("Failed to add offer. Please try again.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editOffer) return;

    try {
      const response = await fetch(`/api/offers/edit-offer/${editOffer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editOffer),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Offer updated successfully!");
        setFilteredOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer.id === editOffer.id ? { ...offer, ...editOffer } : offer
          )
        );
        setEditOffer(null); // Clear edit form
      } else {
        toast.error(data.error || "Failed to update offer.");
      }
    } catch (error) {
      toast.error("Failed to update offer. Please try again.");
    }
  };

  useEffect(() => {
    if (showAll) {
      setDisplayedOffers(filteredOffers);
    } else {
      setDisplayedOffers(filteredOffers.slice(0, 10));
    }
  }, [showAll, filteredOffers]);

  const handleShowAll = () => {
    setShowAll(!showAll);  // Toggle between showing all or just 10 offers
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      

        {/* Edit Offer Modal */}
        {editOffer && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl text-gray-100">Edit Offer</h3>
                <button onClick={() => setEditOffer(null)} className="text-gray-500 hover:text-gray-400">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                {/* Form fields for Edit */}
                <div className="mt-4">
                  <label className="block text-gray-300">Title</label>
                  <input
                    type="text"
                    name="name"
                    value={editOffer.name}
                    onChange={handleEditChange}
                    className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-300">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={editOffer.description}
                    onChange={handleEditChange}
                    className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-300">Discount</label>
                  <input
                    type="number"
                    name="discount"
                    value={editOffer.discount}
                    onChange={handleEditChange}
                    className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-300">Valid From</label>
                  <input
                    type="date"
                    name="validFrom"
                    value={editOffer.validFrom}
                    onChange={handleEditChange}
                    className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-300">Valid To</label>
                  <input
                    type="date"
                    name="validTo"
                    value={editOffer.validTo}
                    onChange={handleEditChange}
                    className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Add Offer Button */}
        <button
          onClick={handleAddOffer}
          className="mb-4 py-2 px-4 bg-green-600 text-white rounded-md"
        >
          Add New Offer
        </button>

        {/* Offers Table */}
        <div className="overflow-hidden shadow-xl sm:rounded-lg bg-white">
          <input
            type="text"
            placeholder="Search offers..."
            className="p-2 border rounded-md mb-4"
            value={searchTerm}
            onChange={handleSearch}
          />
          {showAddForm && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Offer Name</label>
                <input
                  type="text"
                  name="name"
                  value={newOffer.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newOffer.description}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={newOffer.discount}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Valid From</label>
                <input
                  type="date"
                  name="validFrom"
                  value={newOffer.validFrom}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Valid To</label>
                <input
                  type="date"
                  name="validTo"
                  value={newOffer.validTo}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          )}

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Discount</th>
                <th className="px-4 py-2 border-b">Valid From</th>
                <th className="px-4 py-2 border-b">Valid To</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedOffers.map((offer) => (
                <tr key={offer.id}>
                  <td className="px-4 py-2 border-b">{offer.name}</td>
                  <td className="px-4 py-2 border-b">{offer.description}</td>
                  <td className="px-4 py-2 border-b">{offer.discount}%</td>
                  <td className="px-4 py-2 border-b">{offer.validFrom}</td>
                  <td className="px-4 py-2 border-b">{offer.validTo}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="text-blue-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-600 ml-2"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Show All / Show Less Button */}
          <button
            onClick={handleShowAll}
            className="mt-4 py-2 px-4 bg-gray-600 text-white rounded-md"
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default OffersPage;
\










  {/* Stat Cards */}
  <motion.div
  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <StatCard name="Total Offers" icon={Tag} value={offerStats.totalOffers} color="#6366F1" />
  <StatCard name="Active Offers" icon={CheckCircle} value={offerStats.activeOffers} color="#10B981" />
  <StatCard name="Expired Offers" icon={Clock} value={offerStats.expiredOffers} color="#F59E0B" />
  <StatCard name="Total Discount" icon={DollarSign} value={offerStats.totalDiscount} color="#EF4444" />
</motion.div>
















import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, X, Plus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfferDetails = () => {
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [displayedOffers, setDisplayedOffers] = useState(filteredOffers.slice(0, 10)); // Initially, show 10 offers
  const [showAll, setShowAll] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newOffer, setNewOffer] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    imageUrls: [],
  });
  const [editOffer, setEditOffer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers");
      const data = await response.json();
      if (response.ok) {
        setFilteredOffers(data.offers);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOffers((prev) =>
      prev.filter(
        (offer) =>
          offer.name.toLowerCase().includes(term) ||
          offer.category.toLowerCase().includes(term)
      )
    );
  };

  const handleAddOffer = () => {
    setShowAddForm(true);
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    setNewOffer((prev) => ({
      ...prev,
      imageUrls: fileArray,
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) {
      return;
    }

    try {
      const response = await fetch(`/api/offers/delete-offer/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchOffers(); // Refetch offers after deletion
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Failed to delete offer. Please try again.");
    }
  };

  const handleEdit = (offer) => {
    setEditOffer({ ...offer });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", newOffer.description);
    formData.append("name", newOffer.name);
    formData.append("price", newOffer.price);
    formData.append("discount", newOffer.discount);

    newOffer.imageUrls.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("/api/offers/add-offer", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Offer added successfully!");
        setShowAddForm(false);
        setNewOffer({
          name: "",
          description: "",
          price: "",
          discount: "",
          imageUrls: [],
        });

        fetchOffers();
      } else {
        toast.error(data.error || "Failed to add offer.");
      }
    } catch (error) {
      toast.error("Failed to add offer. Please try again.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editOffer) return;

    try {
      const response = await fetch(`/api/offers/edit-offer/${editOffer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editOffer),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Offer updated successfully!");
        setFilteredOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer.id === editOffer.id ? { ...offer, ...editOffer } : offer
          )
        );
        setEditOffer(null); // Clear edit form
      } else {
        toast.error(data.error || "Failed to update offer.");
      }
    } catch (error) {
      toast.error("Failed to update offer. Please try again.");
    }
  };

  useEffect(() => {
    if (showAll) {
      setDisplayedOffers(filteredOffers);
    } else {
      setDisplayedOffers(filteredOffers.slice(0, 10));
    }
  }, [showAll, filteredOffers]);

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Offer List</h2>
        <div className="relative flex gap-4 items-center">
          <button
            onClick={handleAddOffer}
            className="bg-primaryBlue hover:bg-blue-500 text-white font-medium rounded-lg px-10 py-2 flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <Plus size={35} /> Add an Offer
          </button>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search offers..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primaryOrange uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primaryOrange uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primaryOrange uppercase">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primaryOrange uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {displayedOffers.map((offer) => (
              <tr key={offer.id}>
                <td className="px-6 py-4 text-sm text-gray-300">{offer.name}</td>
                <td className="px-6 py-4 text-sm text-gray-300">Ksh {offer.price}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{offer.discount}%</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <div className="mt-4 items-center">
            <button
              onClick={handleShowAll}
              className="text-primaryGreen font-bold hover:text-indigo-400"
            >
              {showAll ? 'Show Less' : 'Show All Offers'}
            </button>
          </div>
        </table>
      </div>

      {/* Edit Offer Form Modal */}
      {editOffer && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-white">Edit Offer</h3>
              <button
                onClick={() => setEditOffer(null)}
                className="text-white hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editOffer.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="text-white">Description</label>
                <textarea
                  name="description"
                  value={editOffer.description}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="text-white">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editOffer.price}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="text-white">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={editOffer.discount}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg mt-2"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditOffer(null)}
                  className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Add New Offer Form Modal */}
      {showAddForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-white">Add Offer</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newOffer.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="text-white">Description</label>
                <textarea
                  name="description"
                  value={newOffer.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="text-white">Price</label>
                <input
                  type="number"
                  name="price"
                  value={newOffer.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="text-white">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={newOffer.discount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label className="text-white">Upload Images</label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  multiple
                  className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg mt-2"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg"
                >
                  Add Offer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OfferDetails;
