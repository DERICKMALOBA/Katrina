import { Link } from "react-router-dom";

const GenderOutfits = () => {
  const outfits = [
    {
      id: "boys",
      title: "Boys Outfits",
      image: "/images/boys-outfits.jpg",
      link: "/subcategories/boys/Outfits" // Corrected to point to boys outfits route
    },
    {
      id: "girls",
      title: "Girls Outfits",
      image: "/images/girls-outfits.jpg",
      link: "/subcategories/girls/Outfits" // Corrected to point to girls outfits route
    }
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {outfits.map((outfit) => (
        <Link
          key={outfit.id}
          to={outfit.link}
          className="group relative flex-1 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 flex items-end p-4">
            <h3 className="text-white text-xl font-bold group-hover:underline">
              {outfit.title}
            </h3>
          </div>
          <img
            src={outfit.image}
            alt={outfit.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      ))}
    </div>
  );
};

export default GenderOutfits;
