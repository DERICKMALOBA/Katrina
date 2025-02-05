import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, X, Plus } from "lucide-react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState(
    filteredProducts.slice(0, 10)
  ); // Initially, show 10 products
  const [showAll, setShowAll] = useState(false);

  // Set initial state for products
  const [searchTerm, setSearchTerm] = useState(""); // Set initial search term
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    discount: "",
    imageUrls: [],
  }); // Set initial state for a new product
  const [editProduct, setEditProduct] = useState(null); // State for editing a product
  const [showAddForm, setShowAddForm] = useState(false); // Show add form
 


  // Fetch products function
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products/products");
      const data = await response.json();
      if (response.ok) {
        setFilteredProducts(data.products);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProducts((prev) =>
      prev.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      )
    );
  };

  // Handle add product form display
  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    setNewProduct((prev) => ({
      ...prev,
      imageUrls: fileArray,
    }));
  };



  // const Edit = async () => {
  

  //   if (!editOffer) return;

  //   try {
  //     const response = await fetch(`/api/offers/edit-offer/${editOffer.id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(editOffer),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       toast.success("Offer updated successfully!");
  //       setFilteredOffers((prevOffers) =>
  //         prevOffers.map((offer) =>
  //           offer.id === editOffer.id ? { ...offer, ...editOffer } : offer
  //         )
  //       );
  //       setEditOffer(null); // Clear edit form
  //     } else {
  //       toast.error(data.error || "Failed to update offer.");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to update offer. Please try again.");
  //   }
  // };

  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/delete-product/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts(); // Refetch products after deletion
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Handle product edit (pre-fill the form)
  const handleEdit = (product) => {
    setEditProduct({ ...product });
  };

  // Handle product edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new product input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit for adding a new product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle image files
    const formData = new FormData();
    formData.append("description", newProduct.description);
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("category", newProduct.category);
    formData.append("discount", newProduct.discount);

    // Append each image file to the FormData object
    newProduct.imageUrls.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("/api/products/add-product", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Product added successfully!");
        setShowAddForm(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          discount: "0",
          category: "",
          image: [],
        });

        // Refetch the products after adding
        fetchProducts();
      } else {
        toast.error(data.error || "Failed to add product.");
      }
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
    }
  };

 
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editProduct) return;

    try {
      const response = await fetch(
        `/api/products/edit-product/${editProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editProduct),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Product updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Update the product list in the UI
        setFilteredProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editProduct.id
              ? { ...product, ...editProduct }
              : product
          )
        );

        setEditProduct(null); // Clear edit form
      } else {
        toast.error(data.error || "Failed to update product.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    if (showAll) {
      setDisplayedProducts(filteredProducts); // Show all products
    } else {
      setDisplayedProducts(filteredProducts.slice(0, 10)); // Show only first 10 products
    }
  }, [showAll, filteredProducts]);

  const handleShowAll = () => {
    setShowAll(!showAll); // Toggle between showing all or just 10 products
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
        <div className="relative flex gap-4 items-center">
          <button
            onClick={handleAddProduct}
            className="bg-primaryBlue hover:bg-blue-500 text-white font-medium rounded-lg px-10 py-2 flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <Plus size={35} /> Add a Product
          </button>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primaryOrange uppercase ">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  text-primaryOrange uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  text-primaryOrange uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  text-primaryOrange uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  text-primaryOrange uppercase">
                {" "}
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  text-primaryOrange uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  text-primaryOrange uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {displayedProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  ksh {product.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.discount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.stock}
                </td>

                <td className="px-6 py-4 text-sm flex items-center gap-4">
  <button
    onClick={() => handleEdit(product)}
    className="text-indigo-400 hover:text-indigo-300"
  >
    <Edit size={18} />
  </button>
  <button
    onClick={() => handleDelete(product.id)}
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
              {showAll ? "Show Less" : "Show All Products"}
            </button>
          </div>
        </table>
      </div>

      


      {/* Edit Product Form Modal */}
      {editProduct && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Edit Product</h3>
              <button
                onClick={() => setEditProduct(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <input
                name="name"
                placeholder="Product Name"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editProduct.name}
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editProduct.description}
              />
              <input
                name="price"
                type="number"
                placeholder="Price"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editProduct.price}
              />

              <input
                name="discount"
                type="number"
                placeholder="discount"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editProduct.discount}
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editProduct.stock}
              />
              <select
                name="category"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editProduct.category}
              >
                <option value="">Select Category</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dressers">Dressers</option>
                <option value="Outer Wear">Outer Wear</option>
                <option value="Sleep Wear">Sleep Wear</option>
                <option value="Under Wear">Under Wear</option>
                <option value="Foot Wear">Foot Wear</option>
                <option value="Accessories">Accessories</option>
                <option value="Special Occasions">Special Occasions</option>
                <option value="SportsWear">SportsWear</option>
                <option value="Everyday Wear">Everyday Wear</option>
                <option value="Casuals">Casuals</option>
              </select>
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleImageUpload}
              />

              <button
                type="submit"
                className="w-full bg-blue-500 px-4 py-2 text-white rounded"
              >
                Save
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Add Product Form Modal */}
      {showAddForm && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <motion.div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Add Product</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Product Name"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newProduct.name}
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newProduct.description}
              />
              <input
                name="price"
                type="number"
                placeholder="Price"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newProduct.price}
              />
              <input
                name="discount"
                type="number"
                placeholder="discount"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newProduct.discount}
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newProduct.stock}
              />
              <select
                name="category"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newProduct.category}
              >
                <option value="">Select Category</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dressers">Dressers</option>
                <option value="Outer Wear">Outer Wear</option>
                <option value="Sleep Wear">Sleep Wear</option>
                <option value="Under Wear">Under Wear</option>
                <option value="Foot Wear">Foot Wear</option>
                <option value="Accessories">Accessories</option>
                <option value="Special Occasions">Special Occasions</option>
                <option value="SportsWear">SportsWear</option>
                <option value="Everyday Wear">Everyday Wear</option>
                <option value="Casuals">Casuals</option>
              </select>

              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleImageUpload}
              />

              <button
                type="submit"
                className="w-full bg-blue-500 px-4 py-2 text-white rounded"
              >
                Add Product
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductDetails;
