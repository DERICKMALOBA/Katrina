import { useState } from "react";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "tops",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    try {
      const response = await fetch("/api/items/itemssubmit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Product Description" value={product.description} onChange={handleChange} className="w-full p-2 border rounded" required></textarea>
        <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="stock" placeholder="Stock" value={product.stock} onChange={handleChange} className="w-full p-2 border rounded" required />
        <select name="category" value={product.category} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="tops">Tops</option>
          <option value="bottoms">Bottoms</option>
          <option value="sportswear">Sportswear</option>
        </select>
        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Submit</button>
      </form>
    </div>
  );
};

export default ProductForm;
