const express = require("express");
const db = require("../config/db.js");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Set up static file serving
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Helper function to process products
const processProducts = (products) => {
  return products.map((product) => {
    let imageUrls = [];

    try {
      if (product.image) {
        const parsedImage = JSON.parse(product.image);
        imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
      }
    } catch (parseError) {
      console.error("Error parsing product image data:", parseError);
      imageUrls = [];
    }

    const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

    // Calculate discount values
    const discountPercentage = parseFloat(product.discount) || 0;
    const originalPrice = parseFloat(product.price) || 0;
    const discountAmount = (discountPercentage / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;

    return {
      ...product,
      originalPrice: originalPrice.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      imageUrls: fullImageUrls,
    };
  });
};

// Add product
router.post("/add-product", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const { description, name, price, stock, category, discount } = req.body;
  const categorisation = JSON.parse(category);
  const fileNames = req.files.map((file) => file.filename);

  const query = "INSERT INTO products (description, name, price, stock, category, super, subcat, discount, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    description,
    name,
    price,
    stock,
    categorisation.cat,
    categorisation.super,
    categorisation.subcat,
    discount,
    JSON.stringify(fileNames),
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Product added successfully!",
      productId: results.insertId,
    });
  });
});

// Edit product
router.put("/edit-product/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category, discount, image } = req.body;
  const categorisation = JSON.parse(category);

  const query = `UPDATE products SET name=?, description=?, price=?, stock=?, category=?, super=?, subcat=?, discount=?, image=? WHERE id=?`;

  db.query(
    query,
    [
      name,
      description,
      price,
      stock,
      categorisation.cat,
      categorisation.super,
      categorisation.subcat,
      discount,
      JSON.stringify(image),
      id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Product updated successfully" });
    }
  );
});

// Get products list with pagination
router.get("/productslist", (req, res) => {
  let { page = 1, limit = 12 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const query = `SELECT * FROM products LIMIT ? OFFSET ?`;

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.json({
        products: [],
        totalDiscountAmount: "0.00",
        page,
        limit,
      });
    }

    const productsWithDiscount = processProducts(results);
    const totalDiscountAmount = productsWithDiscount.reduce((sum, product) => {
      return sum + parseFloat(product.discountAmount);
    }, 0);

    // Get reviews
    const q = "SELECT * FROM reviews";
    db.query(q, (err, result) => {
      if (err) {
        console.log(err + "error occurred while fetching reviews");
        return res.json({
          products: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2),
          page,
          limit,
          reviews: [],
        });
      }

      res.json({
        products: productsWithDiscount,
        totalDiscountAmount: totalDiscountAmount.toFixed(2),
        page,
        limit,
        reviews: result,
      });
    });
  });
});

// Delete product
router.delete("/delete-product/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM products WHERE id = ?`;
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  });
});

// Get single product
router.get("/product/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      console.warn(`Product with ID ${id} not found`);
      return res.status(404).json({ error: "Product not found" });
    }

    const product = results[0];
    try {
      const parsedImage = JSON.parse(product.image);
      product.imageUrls = Array.isArray(parsedImage)
        ? parsedImage.map((img) => `/uploads/${img}`)
        : [`/uploads/${parsedImage}`];
    } catch (parseError) {
      console.error("Error parsing image data:", parseError);
      product.imageUrls = [];
    }

    res.json(product);
  });
});

// Get products count
router.get("/products/count", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM products";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching product count:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ count: result[0].count });
  });
});

// Get all products
router.get("/products", (req, res) => {
  const query = "SELECT * FROM products";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ products: results });
  });
});

// Get offers
router.get("/offers", (req, res) => {
  const query = "SELECT * FROM products WHERE offer = 1";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length >= 1) {
      const productsWithDiscount = processProducts(results);
      const totalDiscountAmount = productsWithDiscount.reduce((sum, product) => {
        return sum + parseFloat(product.discountAmount);
      }, 0);

      return res.json({
        offer: productsWithDiscount,
        totalDiscountAmount: totalDiscountAmount.toFixed(2),
      });
    }

    res.json({ offer: [], totalDiscountAmount: "0.00" });
  });
});

// Get products by category
router.get("/productscategory", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const categoryCounts = {
      Outfits: 0,
      Bags: 0,
      Shoes: 0,
      Hygiene: 0,
      Accessories: 0,
      Others: 0
    };

    const outfitCategories = [
      "boys trouser set", "boys shot set", "boys trouser", "boys tshirts",
      "girls trouser set", "girls short set", "skirt set", "dressers",
      "fanay wear", "tops", "leggings", "boys costumes", "girls costumes",
      "vests", "boxers", "panties", "boob tops"
    ];

    const bagCategories = [
      "3 in 1 trolley bag", "3 in 1 back pack", "2 in 1 back pack",
      "single back pack", "3 in 1 suitcase", "single suitcase",
      "girls handbags", "monkey bags", "lunch bags"
    ];

    const shoeCategories = [
      "boys sneakers", "converse", "boys open shoes", "boys school shoes",
      "girls sneakers", "doll", "heels", "girls open shoes", "girls school shoes"
    ];

    const hygieneCategories = [
      "boys scents", "girls scents", "body wash", "lotions", "make up kit"
    ];

    const accessoryCategories = ["watches", "hair accessories"];

    const otherCategories = [
      "pencil poaches", "cosplay costumes", "raincoats", "swimming bags"
    ];

    results.forEach(product => {
      if (outfitCategories.includes(product.category)) {
        categoryCounts.Outfits++;
      } else if (bagCategories.includes(product.category)) {
        categoryCounts.Bags++;
      } else if (shoeCategories.includes(product.category)) {
        categoryCounts.Shoes++;
      } else if (hygieneCategories.includes(product.category)) {
        categoryCounts.Hygiene++;
      } else if (accessoryCategories.includes(product.category)) {
        categoryCounts.Accessories++;
      } else if (otherCategories.includes(product.category)) {
        categoryCounts.Others++;
      }
    });

    res.json(categoryCounts);
  });
});

// Get products by subcategory
router.get("/subcategories/:sub", (req, res) => {
  const { sub } = req.params;
  let query;
  let params = [];

  // Define subcategory mappings
  const subcategoryMappings = {
    "Boys Outfits": ["boys trouser set", "boys short set", "boys trouser", "boys tshirts"],
    "Girls Outfits": ["girls trouser set", "girls short set", "skirt set", "dressers", "fanay wear", "girls trouser", "tops", "leggings"],
    "Swimming Wear": ["boys costumes", "girls costumes"],
    "Inner Wears": ["vests", "boxers", "panties", "boob tops"],
    "School Bags": ["3 in 1 trolley bag", "3 in 1 back pack", "2 in 1 back pack", "single back pack"],
    "Travelling Bags": ["3 in 1 suitcase", "single suitcase"],
    "Girls Handbags": ["girls handbags"],
    "Monkey Bags": ["monkey bags"],
    "Lunch Bags": ["lunch bags"],
    "Boys' Shoes": ["boys sneakers", "converse", "boys open shoes", "boys school shoes"],
    "Girls' Shoes": ["girls sneakers", "doll", "heels", "girls open shoes", "girls school shoes"],
    "Perfumes": ["boys scents", "girls scents"],
    "Body Mists": ["boys scents", "girls scents"],
    "Body Wash": ["body wash"],
    "Lotions": ["lotions"],
    "Make Up Kit": ["make up kit"],
    "Watches": ["watches"],
    "Hair Accessories": ["hair accessories"],
    "Pencil Pouches": ["pencil poaches"],
    "Cosplay Costumes": ["cosplay costumes"],
    "Raincoats": ["raincoats"],
    "Swimming Bags": ["swimming bags"]
  };

  if (subcategoryMappings[sub]) {
    const placeholders = subcategoryMappings[sub].map(() => "?").join(",");
    query = `SELECT * FROM products WHERE category IN (${placeholders})`;
    params = subcategoryMappings[sub];
  } else {
    return res.json({ sub: [], totalDiscountAmount: "0.00" });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length >= 1) {
      const productsWithDiscount = processProducts(results);
      const totalDiscountAmount = productsWithDiscount.reduce((sum, product) => {
        return sum + parseFloat(product.discountAmount);
      }, 0);

      return res.json({
        sub: productsWithDiscount,
        totalDiscountAmount: totalDiscountAmount.toFixed(2),
      });
    }

    res.json({ sub: [], totalDiscountAmount: "0.00" });
  });
});

// Get products by specific item
router.get("/itemslist/:item", (req, res) => {
  const { item } = req.params;
  const query = `SELECT * FROM products WHERE category = ?`;

  db.query(query, [item], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length >= 1) {
      const productsWithDiscount = processProducts(results);
      const totalDiscountAmount = productsWithDiscount.reduce((sum, product) => {
        return sum + parseFloat(product.discountAmount);
      }, 0);

      return res.json({
        item: productsWithDiscount,
        totalDiscountAmount: totalDiscountAmount.toFixed(2),
      });
    }

    res.json({ item: [], totalDiscountAmount: "0.00" });
  });
});

// Get products by discount
router.get("/discount", (req, res) => {
  const { discount } = req.query;

  if (!discount || isNaN(discount)) {
    return res.status(400).json({ message: "Invalid discount value" });
  }

  const query = "SELECT * FROM products WHERE discount >= ?";
  const queryParams = [Number(discount)];

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching products", error: err });
    }
    res.json(processProducts(results));
  });
});

// Get products by price range
router.get("/price", (req, res) => {
  const { minPrice, maxPrice } = req.query;
  let query = "SELECT * FROM products WHERE 1=1";
  let queryParams = [];

  if (minPrice && maxPrice) {
    query += " AND price BETWEEN ? AND ?";
    queryParams.push(Number(minPrice), Number(maxPrice));
  } else if (minPrice) {
    query += " AND price >= ?";
    queryParams.push(Number(minPrice));
  } else if (maxPrice) {
    query += " AND price <= ?";
    queryParams.push(Number(maxPrice));
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching products", error: err });
    }
    res.json(processProducts(results));
  });
});

// Get products sorted by price (ascending)
router.get("/price-asc", (req, res) => {
  const query = "SELECT * FROM products ORDER BY price ASC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(processProducts(results));
  });
});

// Get products sorted by price (descending)
router.get("/price-desc", (req, res) => {
  const query = "SELECT * FROM products ORDER BY price DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(processProducts(results));
  });
});

// Get products sorted by rating
router.get("/rating", (req, res) => {
  const query = "SELECT * FROM products ORDER BY ratings DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching products", error: err });
    }
    res.json(processProducts(results));
  });
});

// Get newest products
router.get("/newest", (req, res) => {
  const query = "SELECT * FROM products ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching products", error: err });
    }
    res.json(processProducts(results));
  });
});

// Get products by size
router.get("/size", (req, res) => {
  const { size } = req.query;

  if (!size) {
    return res.status(400).json({ message: "Size parameter is required" });
  }

  const query = "SELECT * FROM products WHERE size = ?";

  db.query(query, [size], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching products", error: err });
    }
    res.json(processProducts(results));
  });
});

// Submit review
router.post("/product/:id/review", async (req, res) => {
  const { id } = req.params;
  const { ratings, reviews } = req.body;

  if (typeof ratings !== "number" || typeof reviews !== "string") {
    return res.status(400).json({
      message: "Invalid input: ratings must be a number and reviews must be a string"
    });
  }

  if (ratings < 1 || ratings > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const [product] = await db.promise().query("SELECT id FROM products WHERE id = ?", [id]);
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await db.promise().query(
      "INSERT INTO reviews (product_id, ratings, reviews) VALUES (?, ?, ?)",
      [id, ratings, reviews]
    );

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search products
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  let sql = 'SELECT * FROM products';
  const params = [];

  if (q) {
    sql += ' WHERE LOWER(name) LIKE ? OR LOWER(super) LIKE ? OR LOWER(subcat) LIKE ?';
    params.push(
      `%${q.toLowerCase()}%`,
      `%${q.toLowerCase()}%`,
      `%${q.toLowerCase()}%`
    );
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const productsWithDiscount = processProducts(results);
    const totalDiscountAmount = productsWithDiscount.reduce((sum, product) => {
      return sum + parseFloat(product.discountAmount);
    }, 0);

    res.json({
      product: productsWithDiscount,
      totalDiscountAmount: totalDiscountAmount.toFixed(2),
    });
  });
});

// Get products by super category
router.get("/super/:sup", (req, res) => {
  const { sup } = req.params;
  const query = `SELECT * FROM products WHERE super=?`;

  db.query(query, [sup], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const productsWithDiscount = processProducts(results);
    const totalDiscountAmount = productsWithDiscount.reduce((sum, product) => {
      return sum + parseFloat(product.discountAmount);
    }, 0);

    res.json({
      super: productsWithDiscount,
      totalDiscountAmount: totalDiscountAmount.toFixed(2),
    });
  });
});

// Submit review with name
router.post("/reviewssubmit/:id", (req, res) => {
  const { id } = req.params;
  const { ratings, reviews, name } = req.body;
  const q = "INSERT INTO reviews (name, productid, ratings, reviews) VALUES (?, ?, ?, ?)";
  
  db.query(q, [name, id, ratings, reviews], (err, results) => {
    if (err) {
      return res.json({ Message: "database error" });
    }
    console.log(`Review submitted by ${name}`);
    res.json({ message: "Review submitted successfully" });
  });
});

// Get reviews for a product
router.get("/reviewsget/:id", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM reviews WHERE productid = ?";
  
  db.query(q, [id], (err, results) => {
    if (err) {
      return res.json({ Message: "database error" });
    }
    res.json(results);
  });
});

// Filter products with multiple criteria
router.get("/filter", (req, res) => {
  const { discount, size, minPrice, maxPrice, sortBy } = req.query;

  let query = "SELECT * FROM products WHERE 1=1";
  let queryParams = [];
  let orderBy = "";

  if (discount && !isNaN(discount)) {
    query += " AND discount >= ?";
    queryParams.push(Number(discount));
  }

  if (size) {
    query += " AND size = ?";
    queryParams.push(size);
  }

  if (minPrice && maxPrice) {
    query += " AND price BETWEEN ? AND ?";
    queryParams.push(Number(minPrice), Number(maxPrice));
  } else if (minPrice) {
    query += " AND price >= ?";
    queryParams.push(Number(minPrice));
  } else if (maxPrice) {
    query += " AND price <= ?";
    queryParams.push(Number(maxPrice));
  }

  switch (sortBy) {
    case "newest":
      orderBy = " ORDER BY created_at DESC";
      break;
    case "low_to_high":
      orderBy = " ORDER BY price ASC";
      break;
    case "high_to_low":
      orderBy = " ORDER BY price DESC";
      break;
    case "rating":
      orderBy = " ORDER BY ratings DESC";
      break;
    default:
      orderBy = " ORDER BY created_at DESC";
  }

  db.query(query + orderBy, queryParams, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching products", error: err });
    }
    res.json({ products: processProducts(results) });
  });
});
// Get products by gender and subcategory
router.get("/subcategories/:gender/:category", (req, res) => {
  const genderKey = req.params.gender.toLowerCase();
  const categoryKey = req.params.category.toLowerCase();

  let query;
  let params = [];

  // Define gender and category mappings
  const categoryMappings = {
    boys: {
      outfits: ["boys trouser set", "boys short set", "boys trouser", "boys tshirts"]
    },
    girls: {
      outfits: [
        "girls trouser set",
        "girls short set",
        "skirt set",
        "dresses",
        "fancy wear",
        "girls trouser",
        "tops",
        "leggings"
      ]
    }
  };

  if (categoryMappings[genderKey] && categoryMappings[genderKey][categoryKey]) {
    const placeholders = categoryMappings[genderKey][categoryKey].map(() => "?").join(",");
    query = `SELECT * FROM products WHERE category IN (${placeholders})`;
    params = categoryMappings[genderKey][categoryKey];
  } else {
    return res.json({ sub: [], totalDiscountAmount: "0.00" });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length >= 1) {
      const productsWithDiscount = processProducts(results);
      const totalDiscountAmount = productsWithDiscount.reduce((sum, product) => {
        return sum + parseFloat(product.discountAmount);
      }, 0);

      return res.json({
        sub: productsWithDiscount,
        totalDiscountAmount: totalDiscountAmount.toFixed(2),
      });
    }

    res.json({ sub: [], totalDiscountAmount: "0.00" });
  });
});


module.exports = router;