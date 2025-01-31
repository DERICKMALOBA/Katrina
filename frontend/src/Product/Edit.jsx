import { motion } from "framer-motion";
import { Edit, Search, Trash2, X, Plus } from "lucide-react";
import { useState } from "react";

const PRODUCT_DATA = [
  { id: 1, name: "party dresses", category: "Dresses", descption:"quality iko best" , price: 59.99, stock: 143, sales: 1200 },
	{ id: 2, name: "jeans", category: "Everyday Wear", descption:"quality iko best" , price: 39.99, stock: 89, sales: 800 },
	{ id: 3, name: "T-shart", category: "Tops ", descption:"quality iko best" , price: 199.99, stock: 56, sales: 650 },
	{ id: 4, name: "Yoga Mat", category: "special Ocation wear", descption:"quality iko best" , price: 29.99, stock: 210, sales: 950 },
	{ id: 5, name: "dress", category: "Casuals",descption:"quality iko best" , price: 79.99, stock: 78, sales: 720 },
];

const EditProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(PRODUCT_DATA);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrls: [],
  });

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProducts(
      PRODUCT_DATA.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      )
    );
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const imageUrls = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageUrls.push(reader.result);
        if (imageUrls.length === files.length) {
          setNewProduct((prev) => ({ ...prev, imageUrls }));
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleDelete = (id) => {
    setFilteredProducts(
      filteredProducts.filter((product) => product.id !== id)
    );
  };

  const handleEdit = (product) => {
    setEditProduct({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFilteredProducts(
      filteredProducts.map((p) => (p.id === editProduct.id ? editProduct : p))
    );
    setEditProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = filteredProducts.length + 1;
    setFilteredProducts([...filteredProducts, { id: newId, ...newProduct }]);
    setShowAddForm(false);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      imageUrls: "",
    });
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Descption
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.descption}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  ksh {product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
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
        </table>
      </div>
      {editProduct && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
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
    <option value="Special Occasion Wear">Special Occasion Wear</option>
    <option value="Everyday Wear">Everyday Wear</option>
    <option value="Casuals">Casuals</option>
  </select>
  <input
    type="file"
    multiple
    className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
    onChange={handleImageUpload}
  />
  <input
    name="imageUrl"
    placeholder="Image URL"
    className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
    onChange={handleEditChange}
    value={editProduct.imageUrl}
  />
  <button type="submit" className="w-full bg-blue-500 px-4 py-2 text-white rounded">
    Save
  </button>
</form>

          </motion.div>
        </motion.div>
      )}
      {showAddForm && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
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
                <option value="Special Occasion Wear">
                  Special Occasion Wear
                </option>
                <option value="Everyday Wear">Everyday Wear</option>
                <option value="Casuals">Casuals</option>
              </select>

              <input
                type="file"
                multiple
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleImageUpload}
              />
              <input
                name="imageUrl"
                placeholder="Image URL"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newProduct.imageUrl}
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

export default EditProduct;
