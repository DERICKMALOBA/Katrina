import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductInfo() {
  const { name, description, price, image1 } = useParams();
  const image =JSON.parse(decodeURIComponent(image1));
 console.log(name);
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Slider className="mb-6">
        {image.map((img, index) => (
          <div key={index}>
            <img src={img} alt={name} className="w-full h-80 object-cover rounded-lg" />
          </div>
        ))}
      </Slider>
      <h1 className="text-2xl font-bold mb-2">{decodeURIComponent(name)}</h1>
      <p className="text-gray-600 mb-4">{decodeURIComponent(description)}</p>
      <p className="text-xl font-semibold text-blue-600 mb-4">Kshs.{decodeURIComponent(price)}</p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full">
        Add to Cart
      </button>
    </div>
  );
}