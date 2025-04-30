import { Link } from "react-router-dom";

const CategoriesSidebar = () => {
  const categories = [
    "Outfits",
    "Bags",
    "Shoes",
    "Kids Hygiene",
    "Kids Accessories",
    "Others"
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-bold text-lg text-purple-800">Categories</h3>
      </div>
      <div className="p-2">
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <Link
                to={`/category/${category}`}
                className="block px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-800 transition"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t">
        <button className="w-full py-2 bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 transition">
          View All
        </button>
      </div>
    </div>
  );
};

export default CategoriesSidebar;