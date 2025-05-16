import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, X, Plus } from "lucide-react";
import { CheckCircle, Clock, DollarSign, Tag } from "lucide-react";
import { toast } from "react-toastify";
import StatCard from "../SharedComponent/StatCard";
import "react-toastify/dist/ReactToastify.css";



const OfferDetails = () => {
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [offerStats, setOfferStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    expiredOffers: 0,
    totalDiscount: 0,
  });


  const fetchOfferStats = async () => {
    try {
      const response = await fetch("/api/offers/offer-stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch offer stats`);
      }

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format");
      }

      setOfferStats({
        totalOffers: data.totalOffers || 0,
        activeOffers: data.activeOffers || 0,
        expiredOffers: data.expiredOffers || 0,
        totalDiscount: data.totalDiscount || 0,
      });
    } catch (error) {
      console.error("Error fetching offer stats:", error);
    }
  };

  useEffect(() => {
    fetchOfferStats();
  }, []);


  const [displayedOffers, setDisplayedOffers] = useState(
    filteredOffers.slice(0, 10)
  ); // Initially, show 10 offers
  const [showAll, setShowAll] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [newOffer, setNewOffer] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    discount: "",
    offerdescription:"",
    validFrom: "",
    validTo: "",
    imageUrls: [],
  });
  const [editOffer, setEditOffer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
    formData.append("stock", newOffer.stock);
    formData.append("category", newOffer.category);
    formData.append("offerdescription", newOffer.offerdescription);
    formData.append("validFrom", newOffer.validFrom);
    formData.append("validTo", newOffer.validTo);

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
          stock: "",
          category: "",
          discount: "",
          validFrom: "",
          validTo: "",
          offerdescription:"",
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
      {/* Stat Cards */}
      <motion.div
        className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8" // Separate div for Stat Cards
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Offers"
            icon={Tag}
            value={offerStats.totalOffers}
            color="#6366F1"
          />
          <StatCard
            name="Active Offers"
            icon={CheckCircle}
            value={offerStats.activeOffers}
            color="#10B981"
          />
          <StatCard
            name="Expired Offers"
            icon={Clock}
            value={offerStats.expiredOffers}
            color="#F59E0B"
          />
          <StatCard
            name="Total Discount"
            icon={DollarSign}
            value={offerStats.totalDiscount}
            color="#EF4444"
          />
        </motion.div>
      </motion.div>

      {/* Offer List */}
      <motion.div
        className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8" // Separate div for Offer List
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
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
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-5">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">
                  stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">
                  Offer Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">
                  Status
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium  text-orange-800 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {displayedOffers.map((offer) => {
                // Calculate Status
                const currentDate = new Date();
                const validFrom = new Date(offer.validFrom);
                const validTo = new Date(offer.validTo);
                const isActive =
                  currentDate >= validFrom && currentDate <= validTo;
                const statusText = isActive? "Active" : "Expired";
                const statusColor = isActive ? "bg-green-500" : "bg-red-500";

                return (
                  <tr key={offer.id}>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {offer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      Ksh {offer.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {offer.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {offer.stock}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {offer.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {offer.discount}%
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-300">
                      {offer.offerdescription}
                    </td>

                    {/* Status Column with Dynamic Colors */}
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-semibold ${statusColor}`}
                      >
                        {statusText}
                      </span>
                    </td>

                    {/* Actions */}
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
                );
              })}
            </tbody>

            {/* Show More/Less Button */}
            <div className="mt-4 items-center">
              <button
                onClick={handleShowAll}
                className="text-primaryGreen font-bold hover:text-indigo-400"
              >
                {showAll ? "Show Less" : "Show All Offers"}
              </button>
            </div>
          </table>
        </div>
      </motion.div>
      {/* Edit Offer Form Modal */}

      {editOffer && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  items-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="fixed top-1/10 left-1/4 w-1/2 h-1/2 bg-gray-800 p-4 rounded-xl shadow-lg mt-10  max-w-md flex flex-col"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {/* Fixed header section */}
            <div className="flex justify-between items-center w-full mb-4">
              <h3 className="text-2xl text-white font-semibold">Edit</h3>
              <button
                onClick={() => setEditOffer(null)}
                className="text-white hover:text-gray-500"
              >
                <X size={24} /> {/* Adjusted size */}
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editOffer.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-white">Description</label>
                <textarea
                  name="description"
                  value={editOffer.description}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-white">stock</label>
                <input
                  type="number"
                  name="stock"
                  value={editOffer.stock}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>
               <select
                name="category"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={editOffer.category}
              >
                <option value="">Select Category</option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>1.Outfits</b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Boys Outfits</b>
                </option>
                <option value='{"super":"Outfits","subcat":"Boys Outfits","cat":"boys trouser set"}'>
                  Boys touser sets
                </option>
                <option value='{"super":"Outfits","subcat":"Boys Outfits","cat":"boys short set"}'>
                  Boys short sets
                </option>
                <option value='{"super":"Outfits","subcat":"Boys Outfits","cat":"boys trouser"}'>
                  Boys trouser
                </option>
                <option value='{"super":"Outfits","subcat":"Boys Outfits","cat":"boys tshirts"}'>
                  Boys tshirts
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Girls Outfits</b>
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"girls trouser set"}'>
                  Girls trouser set
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"girls short set"}'>
                  Girls short set
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"skirt set"}'>
                  Skirt set
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"dressers"}'>
                  Dressers
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"fanay wear"}'>
                  Fanay wear
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"girls trouser"}'>
                  Girls trouser
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"tops"}'>
                  Tops
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"leggings"}'>
                  Leggings
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Swimming wear </b>
                </option>
                <option value='{"super":"Outfits","subcat":"Boys costumes","cat":"boys costumes"}'>
                  Boys costumes
                </option>
                <option value='{"super":"Outfits","subcat":"Girls costumes","cat":"girls costumes"}'>
                  Girls costumes
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Inner wears </b>
                </option>
                <option value='{"super":"Outfits","subcat":"Inner Wears","cat":"vests"}'>
                  Vests
                </option>
                <option value='{"super":"Outfits","subcat":"Inner Wears","cat":"boxers"}'>
                  Boxers
                </option>
                <option value='{"super":"Outfits","subcat":"Inner Wears","cat":"panties"}'>
                  Panties
                </option>
                <option value='{"super":"Outfits","subcat":"Inner Wears","cat":"boob tops"}'>
                  Boob tops
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>2.Bags </b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>School bags</b>
                </option>
                <option value='{"super":"Bags","subcat":"School bags","cat":"3 in 1 trolley bag"}'>
                  3 in 1 Trolley bag
                </option>
                <option value='{"super":"Bags","subcat":"School bags","cat":"3 in 1 back pack"}'>
                  3 in 1 Back pack
                </option>
                <option value='{"super":"Bags","subcat":"School bags","cat":"2 in 1 back pack"}'>
                  2 in 1 Back pack
                </option>
                <option value="single back pack">Sinle Back pack</option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Travelling bags</b>
                </option>
                <option value='{"super":"Bags","subcat":"Travelling bags","cat":"3 in 1 suitcase"}'>
                  3 in suitcase
                </option>
                <option value='{"super":"Bags","subcat":"Travelling bags","cat":"single suitcase"}'>
                  Single suitcase
                </option>
                <option value='{"super":"Bags","subcat":"Travelling bags","cat":"2 in 1 back pack"}'>
                  2 in 1 Back pack
                </option>
                <option value='{"super":"Bags","subcat":"Travelling bags","cat":"single back pack"}'>
                  Single Back pack
                </option>
                <br />
                <option
                  value='{"super":"Bags","subcat":" ","cat":"girls handbags"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  Girls handbags
                </option>
                <option
                  value='{"super":"Bags","subcat":" ","cat":"monkey bags"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  Monkey bags
                </option>
                <option
                  value='{"super":"Bags","subcat":" ","cat":"lunch bags"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  Lunch bags
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>3.Shoes</b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Boys shoes</b>
                </option>
                <option value='{"super":"Shoes","subcat":"Boys shoes","cat":"boys sneakers"}'>
                  Boys sneakers
                </option>
                <option value='{"super":"Shoes","subcat":"Boys shoes","cat":"converse"}'>
                  Converse
                </option>
                <option value='{"super":"Shoes","subcat":"Boys shoes","cat":"boys open shoes"}'>
                  Boys open shoes
                </option>
                <option value='{"super":"Shoes","subcat":"Boys shoes","cat":"boys school shoes"}'>
                  Boys school shoes
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Girls shoes</b>
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"girls sneakers"}'>
                  Girls sneakers
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"doll"}'>
                  Doll shoes
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"heels"}'>
                  Heels
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"girls open shoes"}'>
                  Girls open shoes
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"girls open shoes"}'>
                  Girls school shoes
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>4.Kid's hygiene</b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Perfumes</b>
                </option>
                <option value='{"super":"Kids hygiene","subcat":"Perfumes","cat":"boys scents"}'>
                  Boys scents
                </option>
                <option value='{"super":"Kids hygiene","subcat":"Perfumes","cat":""girls scents"}'>
                  Girls scents
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Body mists</b>
                </option>
                <option value='{"super":"Kids hygiene","subcat":"Body mists","cat":"boys scents"}'>
                  Boys scents
                </option>
                <option value='{"super":"Kids hygiene","subcat":"Body mists","cat":"girls scents"}'>
                  Girls scents
                </option>
                <option
                  value='{"super":"Kids hygiene","subcat":" ","cat":"body wash"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  <b>Body wash</b>
                </option>
                <option
                  value='{"super":"Kids hygiene","subcat":" ","cat":"lotions"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  <b>Lotions</b>
                </option>
                <option
                  value='{"super":"Kids hygiene","subcat":" ","cat":"make up kit"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  <b>Make up kit</b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>5.Kid's accessories</b>
                </option>
                <option value='{"super":"Kids accessories","subcat":" ","cat":"wathes"}'>
                  Watches
                </option>
                <option value='{"super":"Kids accessories","subcat":" ","cat":"hair accessories"}'>
                  Hair accessories
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>6.Others</b>
                </option>
                <option value='{"super":"Others","subcat":" ","cat":"pencil poaches"}'>
                  Pencil poaches
                </option>
                <option value='{"super":"Others","subcat":" ","cat":"cosplay costumes"}'>
                  cosplay costumes
                </option>
                <option value='{"super":"Others","subcat":" ","cat":"raincoats"}'>
                  Raincoats
                </option>
                <option value='{"super":"Others","subcat":" ","cat":"swimming bags"}'>
                  Swimming bags
                </option>
              </select>
              <div>
                <label className="text-white">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editOffer.price}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="text-white">Offer Description</label>
                <input
                  type="text"
                  name="offerdescription"
                  placeholder="i.e buy one get one free or two in one"
                  value={editOffer.offerdescription}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-white">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={editOffer.discount}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-white">Valid From</label>
                <input
                  type="date"
                  name="validFrom"
                  value={editOffer.validFrom}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-white">Valid To</label>
                <input
                  type="date"
                  name="validTo"
                  value={editOffer.validTo}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-white">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full p-2 bg-gray-700 text-white rounded mt-1"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditOffer(null)}
                  className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {showAddForm && (
        <motion.div
        className="fixed top-3/4 left-1/4 w-1/2 h-1/2 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"

          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-md" // Reduced width
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-white">Add Offer</h3>{" "}
              {/* Reduced font size */}
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white hover:text-gray-500"
              >
                <X size={20} /> {/* Reduced icon size */}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {" "}
              {/* Reduce space between inputs */}
              <div>
                <label className="text-white text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newOffer.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-gray-800 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="text-white text-sm">Description</label>
                <textarea
                  name="description"
                  value={newOffer.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-gray-800 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="text-white">stock</label>
                <input
                  type="number"
                  name="stock"
                  value={newOffer.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-white">Offer Description</label>
                <input
                  type="text"
                  name="offerdescription"
                  placeholder="i.e buy one get one free or two in one"
                  value={newOffer.offerdescription}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-800 bg-gray-200 rounded-lg mt-1"
                />
              </div>
                <select
                name="category"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newOffer.category}
              >
                <option value="">Select Category</option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>1.Outfits</b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Boys Outfits</b>
                </option>
                <option value='{"super":"Outfits","subcat":"Boys Outfits","cat":"boys trouser set"}'>
                  Boys touser sets
                </option>
                <option value='{"super":"Outfits","subcat":"Boys Outfits","cat":"boys short set"}'>
                  Boys short sets
                </option>
                <option value='{"super":"Outfits","subcat":"Boys Outfits","cat":"boys trouser"}'>
                  Boys trouser
                </option>
                <option value='{"super":"Outfits","subcat":"Boys Outfits","cat":"boys tshirts"}'>
                  Boys tshirts
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Girls Outfits</b>
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"girls trouser set"}'>
                  Girls trouser set
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"girls short set"}'>
                  Girls short set
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"skirt set"}'>
                  Skirt set
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"dressers"}'>
                  Dressers
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"fanay wear"}'>
                  Fanay wear
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"girls trouser"}'>
                  Girls trouser
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"tops"}'>
                  Tops
                </option>
                <option value='{"super":"Outfits","subcat":"Girls Outfits","cat":"leggings"}'>
                  Leggings
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Swimming wear </b>
                </option>
                <option value='{"super":"Outfits","subcat":"Boys costumes","cat":"boys costumes"}'>
                  Boys costumes
                </option>
                <option value='{"super":"Outfits","subcat":"Girls costumes","cat":"girls costumes"}'>
                  Girls costumes
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Inner wears </b>
                </option>
                <option value='{"super":"Outfits","subcat":"Inner Wears","cat":"vests"}'>
                  Vests
                </option>
                <option value='{"super":"Outfits","subcat":"Inner Wears","cat":"boxers"}'>
                  Boxers
                </option>
                <option value='{"super":"Outfits","subcat":"Inner Wears","cat":"panties"}'>
                  Panties
                </option>
                <option value='{"super":"Outfits","subcat":"Inner Wears","cat":"boob tops"}'>
                  Boob tops
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>2.Bags </b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>School bags</b>
                </option>
                <option value='{"super":"Bags","subcat":"School bags","cat":"3 in 1 trolley bag"}'>
                  3 in 1 Trolley bag
                </option>
                <option value='{"super":"Bags","subcat":"School bags","cat":"3 in 1 back pack"}'>
                  3 in 1 Back pack
                </option>
                <option value='{"super":"Bags","subcat":"School bags","cat":"2 in 1 back pack"}'>
                  2 in 1 Back pack
                </option>
                <option value="single back pack">Sinle Back pack</option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Travelling bags</b>
                </option>
                <option value='{"super":"Bags","subcat":"Travelling bags","cat":"3 in 1 suitcase"}'>
                  3 in suitcase
                </option>
                <option value='{"super":"Bags","subcat":"Travelling bags","cat":"single suitcase"}'>
                  Single suitcase
                </option>
                <option value='{"super":"Bags","subcat":"Travelling bags","cat":"2 in 1 back pack"}'>
                  2 in 1 Back pack
                </option>
                <option value='{"super":"Bags","subcat":"Travelling bags","cat":"single back pack"}'>
                  Single Back pack
                </option>
                <br />
                <option
                  value='{"super":"Bags","subcat":" ","cat":"girls handbags"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  Girls handbags
                </option>
                <option
                  value='{"super":"Bags","subcat":" ","cat":"monkey bags"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  Monkey bags
                </option>
                <option
                  value='{"super":"Bags","subcat":" ","cat":"lunch bags"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  Lunch bags
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>3.Shoes</b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Boys shoes</b>
                </option>
                <option value='{"super":"Shoes","subcat":"Boys shoes","cat":"boys sneakers"}'>
                  Boys sneakers
                </option>
                <option value='{"super":"Shoes","subcat":"Boys shoes","cat":"converse"}'>
                  Converse
                </option>
                <option value='{"super":"Shoes","subcat":"Boys shoes","cat":"boys open shoes"}'>
                  Boys open shoes
                </option>
                <option value='{"super":"Shoes","subcat":"Boys shoes","cat":"boys school shoes"}'>
                  Boys school shoes
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Girls shoes</b>
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"girls sneakers"}'>
                  Girls sneakers
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"doll"}'>
                  Doll shoes
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"heels"}'>
                  Heels
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"girls open shoes"}'>
                  Girls open shoes
                </option>
                <option value='{"super":"Shoes","subcat":"Girls shoes","cat":"girls open shoes"}'>
                  Girls school shoes
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>4.Kid's hygiene</b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Perfumes</b>
                </option>
                <option value='{"super":"Kids hygiene","subcat":"Perfumes","cat":"boys scents"}'>
                  Boys scents
                </option>
                <option value='{"super":"Kids hygiene","subcat":"Perfumes","cat":""girls scents"}'>
                  Girls scents
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "cyan", fontWeight: "bold" }}
                >
                  <b>Body mists</b>
                </option>
                <option value='{"super":"Kids hygiene","subcat":"Body mists","cat":"boys scents"}'>
                  Boys scents
                </option>
                <option value='{"super":"Kids hygiene","subcat":"Body mists","cat":"girls scents"}'>
                  Girls scents
                </option>
                <option
                  value='{"super":"Kids hygiene","subcat":" ","cat":"body wash"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  <b>Body wash</b>
                </option>
                <option
                  value='{"super":"Kids hygiene","subcat":" ","cat":"lotions"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  <b>Lotions</b>
                </option>
                <option
                  value='{"super":"Kids hygiene","subcat":" ","cat":"make up kit"}'
                  style={{ color: "cyan", fontWeight: "300" }}
                >
                  <b>Make up kit</b>
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>5.Kid's accessories</b>
                </option>
                <option value='{"super":"Kids accessories","subcat":" ","cat":"wathes"}'>
                  Watches
                </option>
                <option value='{"super":"Kids accessories","subcat":" ","cat":"hair accessories"}'>
                  Hair accessories
                </option>
                <option
                  value=""
                  disabled
                  style={{ color: "orange", fontWeight: "bold" }}
                >
                  <b>6.Others</b>
                </option>
                <option value='{"super":"Others","subcat":" ","cat":"pencil poaches"}'>
                  Pencil poaches
                </option>
                <option value='{"super":"Others","subcat":" ","cat":"cosplay costumes"}'>
                  cosplay costumes
                </option>
                <option value='{"super":"Others","subcat":" ","cat":"raincoats"}'>
                  Raincoats
                </option>
                <option value='{"super":"Others","subcat":" ","cat":"swimming bags"}'>
                  Swimming bags
                </option>
              </select>
              <div>
                <label className="text-white text-sm">Price</label>
                <input
                  type="number"
                  name="price"
                  value={newOffer.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-gray-800 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="text-white text-sm">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={newOffer.discount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-gray-800 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="text-white text-sm">Valid From</label>
                <input
                  type="date"
                  name="validFrom"
                  value={newOffer.validFrom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-gray-800 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="text-white text-sm">Valid To</label>
                <input
                  type="date"
                  name="validTo"
                  value={newOffer.validTo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-gray-800 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="text-white text-sm">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full px-3 py-1.5 bg-gray-700 text-white rounded-md"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-1.5 rounded-md text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-1.5 rounded-md text-sm"
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
