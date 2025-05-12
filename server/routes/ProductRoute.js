const express = require("express");
const db = require("../config/db.js");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { count } = require("console");

// Set up static file serving
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define where the files will be saved on the server
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Define the file name to be saved
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to prevent conflicts
  },
});

const upload = multer({ storage: storage });

// Handle Multiple Image Uploads and Store in MySQL
router.post("/add-product", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const { description, name, price, stock, category, discount } = req.body;

  // Create an array of filenames for uploaded images
  // const fileNames = req.files.map((file) => file.filename);


  var categorisation=JSON.parse(category);
  const fileNames = req.files.map((file) => file.filename);

  // Create a SQL query to insert product details and image filenames into the database
  const query ="INSERT INTO products (description, name, price, stock, category,super,subcat,discount, image) VALUES(?,?,?,?,?,?,?,?,?)";
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
    // Return the inserted product ID and success message
    res.status(201).json({
      message: "Product added successfully!",
      productId: results.insertId,
    });
  });
});

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
    const { description, name, price, stock, category,discount } = req.body;
    const fileNames = req.files.map((file) => file.filename);
    // Create a SQL query to insert product details and image filenames into the database
    const query = "INSERT INTO products (description, name, price, stock, category,super,subcat,discount, image) VALUES(?,?,?,?,?,?,?,?,?)";
    const values = [description, name, price, stock,categorisation.cat,categorisation.super,categorisation.subcat,discount, JSON.stringify(fileNames)];
    const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

    return {
      ...product,
      imageUrls: fullImageUrls,
    };
  });
};// Edit Product Route
router.put("/edit-product/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category, discount, image } =
    req.body;
    var categorisation=JSON.parse(category);
    console.log("edit"+categorisation);
  const query = `UPDATE products SET name=?, description=?, price=?, stock=?, category=?,super=?,subcat=?,discount=?, image=? WHERE id=?`;

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
    if (results.length >= 1) {
      let totalDiscountAmount = 0;
      const productsWithDiscount = results.map((product) => {
        let imageUrls = [];
        try {
          if (product.image) {
            const parsedImage = JSON.parse(product.image);
            imageUrls = Array.isArray(parsedImage)
              ? parsedImage
              : [parsedImage];
          }
        } catch (parseError) {
          console.error("Error parsing product image data:", parseError);
          imageUrls = [];
        }
        const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

        // Calculate discount
        const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
        const originalPrice = parseFloat(product.price) || 0;
        const discountAmount = (discountPercentage / 100) * originalPrice;
        const discountedPrice = originalPrice - discountAmount;

        totalDiscountAmount += discountAmount;

        return {
          ...product,
          originalPrice: originalPrice.toFixed(2), // Keep original price
          discountedPrice: discountedPrice.toFixed(2), // Show price after discount
          discountAmount: discountAmount.toFixed(2), // Show how much was discounted
          imageUrls: fullImageUrls,
        };
      });

      return res.json({
        products: productsWithDiscount,
        totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
      });
    }

    let totalDiscountAmount = 0;

    const productsWithDiscount = results.map((product) => {
      let imageUrls = [];

      // Safe Image Parsing
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

      // Calculate discount
      const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
      const originalPrice = parseFloat(product.price) || 0;
      const discountAmount = (discountPercentage / 100) * originalPrice;
      const discountedPrice = originalPrice - discountAmount;

      totalDiscountAmount += discountAmount;

      return {
        ...product,
        originalPrice: originalPrice.toFixed(2), // Keep original price
        discountedPrice: discountedPrice.toFixed(2), // Show price after discount
        discountAmount: discountAmount.toFixed(2), // Show how much was discounted
        imageUrls: fullImageUrls,
      };
    });

    return res.json({
      products: productsWithDiscount,
      totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
      page,
      limit,
    });
  });
});

// Delete Product Route
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

router.get("/products/count", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM products"; // Query to count products

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching product count:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Send back the count as JSON
    res.status(200).json({ count: result[0].count });
    console.log(count);
  });
});

// Fetch All Products Route
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


//FETCH OFFERS 
// Fetch All Products on Offer Route
router.get("/offers", (req, res) => {
    const query = "SELECT * FROM products WHERE offer = 1"; // Filter products where offer = 1
  
    db.query(query, (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          offer: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ offer: [], totalDiscountAmount: "0.00" });
    });
  });

router.get("/productscategory", (req, res) => {
  const query = "SELECT*FROM products";
  db.query(query, async (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    const l = results.length;
    var j = 0;
    var outfits = 0;
    var bags = 0;
    var shoes = 0;
    var hygiene = 0;
    var accessories = 0;
    var others = 0;
    var af = JSON.parse(JSON.stringify(results));
    for (j; j < l; j++) {
      if (
        af[j].category == "boys trouser set" ||
        af[j].category == "boys shot set" ||
        af[j].category == "boys trouser" ||
        af[j].category == "boys tshirts" ||
        af[j].category == "girls trouser set" ||
        af[j].category == "girls short set" ||
        af[j].category == "skirt set" ||
        af[j].category == "dressers" ||
        af[j].category == "fanay wear" ||
        af[j].category == "tops" ||
        af[j].category == "leggings" ||
        af[j].category == "boys costumes" ||
        af[j].category == "girls costumes" ||
        af[j].category == "vests" ||
        af[j].category == "boxers" ||
        af[j].category == "panties" ||
        af[j].category == "boob tops"
      ) {
        outfits = outfits + 1;
      }
      if (
        af[j].category == "3 in 1 trolley bag" ||
        af[j].category == "3 in 1 back pack" ||
        af[j].category == "2 in 1 back pack" ||
        af[j].category == "single back pack" ||
        af[j].category == "3 in 1 suitcase" ||
        af[j].category == "single suitcase" ||
        af[j].category == "girls handbags" ||
        af[j].category == "monkey bags" ||
        af[j].category == "lunch bags"
      ) {
        bags = bags + 1;
      }
      if (
        af[j].category == "boys sneakers" ||
        af[j].category == "converse" ||
        af[j].category == "boys open shoes" ||
        af[j].category == "boys school shoes" ||
        af[j].category == "girls sneakers" ||
        af[j].category == "doll" ||
        af[j].category == "heels" ||
        af[j].category == "girls open shoes" ||
        af[j].category == "girls school shoes"
      ) {
        shoes = shoes + 1;
      }
      if (
        af[j].category == "boys scents" ||
        af[j].category == "girls scents" ||
        af[j].category == "body wash" ||
        af[j].category == "lotions" ||
        af[j].category == "make up kit"
      ) {
        hygiene = hygiene + 1;
      }
      if (af[j].category == "watches" || af[j].category == "hair accessories") {
        accessories = accessories + 1;
      }
      if (
        af[j].category == "pencil poaches" ||
        af[j].category == "cosplay costumes" ||
        af[j].category == "raincoats" ||
        af[j].category == "swimming bags"
      ) {
        others = others + 1;
      }
    }
    console.log(bags);
    res.json({
      Outfits: outfits,
      Bags: bags,
      Shoes: shoes,
      Hygiene: hygiene,
      Accessories: accessories,
      Others: others,
    });
  });
});

router.get("/subcategories/:sub", (req, res) => {
  const { sub } = req.params;
  console.log(sub);
  if (sub == "Boys Outfits") {
    const query = `SELECT * FROM products WHERE category=? OR category=? OR category=? OR category=?`;
    db.query(
      query,
      ["boys trouser set", "boys short set", "boys trouser", "boys tshirts"],
      (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        if (results.length >= 1) {
          let totalDiscountAmount = 0;
          console.log(results);
          const productsWithDiscount = results.map((product) => {
            let imageUrls = [];

            try {
              if (product.image) {
                const parsedImage = JSON.parse(product.image);
                // Ensure imageUrls is always an array
                imageUrls = Array.isArray(parsedImage)
                  ? parsedImage
                  : [parsedImage];
              }
            } catch (parseError) {
              console.error("Error parsing product image data:", parseError);
              imageUrls = [];
            }

            const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

            // Calculate discount
            const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
            const originalPrice = parseFloat(product.price) || 0;
            const discountAmount = (discountPercentage / 100) * originalPrice;
            const discountedPrice = originalPrice - discountAmount;

            totalDiscountAmount += discountAmount;

            return {
              ...product,
              originalPrice: originalPrice.toFixed(2), // Keep original price
              discountedPrice: discountedPrice.toFixed(2), // Show price after discount
              discountAmount: discountAmount.toFixed(2), // Show how much was discounted
              imageUrls: fullImageUrls,
            };
          });

          return res.json({
            sub: productsWithDiscount,
            totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
          });
        }

        res.json({ sub: [], totalDiscountAmount: "0.00" });
      }
    );
  }
  if (sub == "Girls Outfits") {
    const query = `SELECT * FROM products WHERE category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=?`;
    db.query(
      query,
      [
        "girls trouser set",
        "girls short set",
        "skirt set",
        "dressers",
        "fanay wear",
        "girls trouser",
        "tops",
        "leggings",
      ],
      (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        if (results.length >= 1) {
          let totalDiscountAmount = 0;
          console.log(results);
          const productsWithDiscount = results.map((product) => {
            let imageUrls = [];

            try {
              if (product.image) {
                const parsedImage = JSON.parse(product.image);
                // Ensure imageUrls is always an array
                imageUrls = Array.isArray(parsedImage)
                  ? parsedImage
                  : [parsedImage];
              }
            } catch (parseError) {
              console.error("Error parsing product image data:", parseError);
              imageUrls = [];
            }

            const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

            // Calculate discount
            const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
            const originalPrice = parseFloat(product.price) || 0;
            const discountAmount = (discountPercentage / 100) * originalPrice;
            const discountedPrice = originalPrice - discountAmount;

            totalDiscountAmount += discountAmount;

            return {
              ...product,
              originalPrice: originalPrice.toFixed(2), // Keep original price
              discountedPrice: discountedPrice.toFixed(2), // Show price after discount
              discountAmount: discountAmount.toFixed(2), // Show how much was discounted
              imageUrls: fullImageUrls,
            };
          });

          return res.json({
            sub: productsWithDiscount,
            totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
          });
        }

        res.json({ sub: [], totalDiscountAmount: "0.00" });
      }
    );
  }
  if (sub == "Swimming Wear") {
    const query = `SELECT * FROM products WHERE category=? OR category=?`;
    db.query(query, ["boys costumes", "girls costumes"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Inner Wears") {
    const query = `SELECT * FROM products WHERE category=? OR category=? OR category=? OR category=?`;
    db.query(
      query,
      ["vests", "boxers", "panties", "boob tops"],
      (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        if (results.length >= 1) {
          let totalDiscountAmount = 0;
          console.log(results);
          const productsWithDiscount = results.map((product) => {
            let imageUrls = [];

            try {
              if (product.image) {
                const parsedImage = JSON.parse(product.image);
                // Ensure imageUrls is always an array
                imageUrls = Array.isArray(parsedImage)
                  ? parsedImage
                  : [parsedImage];
              }
            } catch (parseError) {
              console.error("Error parsing product image data:", parseError);
              imageUrls = [];
            }

            const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

            // Calculate discount
            const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
            const originalPrice = parseFloat(product.price) || 0;
            const discountAmount = (discountPercentage / 100) * originalPrice;
            const discountedPrice = originalPrice - discountAmount;

            totalDiscountAmount += discountAmount;

            return {
              ...product,
              originalPrice: originalPrice.toFixed(2), // Keep original price
              discountedPrice: discountedPrice.toFixed(2), // Show price after discount
              discountAmount: discountAmount.toFixed(2), // Show how much was discounted
              imageUrls: fullImageUrls,
            };
          });

          return res.json({
            sub: productsWithDiscount,
            totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
          });
        }

        res.json({ sub: [], totalDiscountAmount: "0.00" });
      }
    );
  }
  if (sub == "School Bags") {
    const query = `SELECT * FROM products WHERE category=? OR category=? OR category=? OR category=?`;
    db.query(
      query,
      [
        "3 in 1 trolley bag",
        "3 in 1 back pack",
        "2 in 1 back pack",
        "single back pack",
      ],
      (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        if (results.length >= 1) {
          let totalDiscountAmount = 0;
          console.log(results);
          const productsWithDiscount = results.map((product) => {
            let imageUrls = [];

            try {
              if (product.image) {
                const parsedImage = JSON.parse(product.image);
                // Ensure imageUrls is always an array
                imageUrls = Array.isArray(parsedImage)
                  ? parsedImage
                  : [parsedImage];
              }
            } catch (parseError) {
              console.error("Error parsing product image data:", parseError);
              imageUrls = [];
            }

            const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

            // Calculate discount
            const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
            const originalPrice = parseFloat(product.price) || 0;
            const discountAmount = (discountPercentage / 100) * originalPrice;
            const discountedPrice = originalPrice - discountAmount;

            totalDiscountAmount += discountAmount;

            return {
              ...product,
              originalPrice: originalPrice.toFixed(2), // Keep original price
              discountedPrice: discountedPrice.toFixed(2), // Show price after discount
              discountAmount: discountAmount.toFixed(2), // Show how much was discounted
              imageUrls: fullImageUrls,
            };
          });

          return res.json({
            sub: productsWithDiscount,
            totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
          });
        }

        res.json({ sub: [], totalDiscountAmount: "0.00" });
      }
    );
  }
  if (sub == "Travelling Bags") {
    const query = `SELECT * FROM products WHERE category=? OR category=?`;
    db.query(query, ["3 in 1 suitcase", "single suitcase"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Girls Handbags") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls handbags"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Monkey Bags") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["monkey bags"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Lunch Bags") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["lunch bags"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Boys' Shoes") {
    const query = `SELECT * FROM products WHERE category=? OR category=? OR category=? OR category=?`;
    db.query(
      query,
      ["boys sneakers", "converse", "boys open shoes", "boys school shoes"],
      (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        if (results.length >= 1) {
          let totalDiscountAmount = 0;
          console.log(results);
          const productsWithDiscount = results.map((product) => {
            let imageUrls = [];

            try {
              if (product.image) {
                const parsedImage = JSON.parse(product.image);
                // Ensure imageUrls is always an array
                imageUrls = Array.isArray(parsedImage)
                  ? parsedImage
                  : [parsedImage];
              }
            } catch (parseError) {
              console.error("Error parsing product image data:", parseError);
              imageUrls = [];
            }

            const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

            // Calculate discount
            const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
            const originalPrice = parseFloat(product.price) || 0;
            const discountAmount = (discountPercentage / 100) * originalPrice;
            const discountedPrice = originalPrice - discountAmount;

            totalDiscountAmount += discountAmount;

            return {
              ...product,
              originalPrice: originalPrice.toFixed(2), // Keep original price
              discountedPrice: discountedPrice.toFixed(2), // Show price after discount
              discountAmount: discountAmount.toFixed(2), // Show how much was discounted
              imageUrls: fullImageUrls,
            };
          });

          return res.json({
            sub: productsWithDiscount,
            totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
          });
        }

        res.json({ sub: [], totalDiscountAmount: "0.00" });
      }
    );
  }
  if (sub == "Girls' Shoes") {
    const query = `SELECT * FROM products WHERE category=? OR category=? OR category=? OR category=?`;
    db.query(
      query,
      [
        "girls sneakers",
        "doll",
        "heels",
        "girls open shoes",
        "girls school shoes",
      ],
      (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        if (results.length >= 1) {
          let totalDiscountAmount = 0;
          console.log(results);
          const productsWithDiscount = results.map((product) => {
            let imageUrls = [];

            try {
              if (product.image) {
                const parsedImage = JSON.parse(product.image);
                // Ensure imageUrls is always an array
                imageUrls = Array.isArray(parsedImage)
                  ? parsedImage
                  : [parsedImage];
              }
            } catch (parseError) {
              console.error("Error parsing product image data:", parseError);
              imageUrls = [];
            }

            const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

            // Calculate discount
            const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
            const originalPrice = parseFloat(product.price) || 0;
            const discountAmount = (discountPercentage / 100) * originalPrice;
            const discountedPrice = originalPrice - discountAmount;

            totalDiscountAmount += discountAmount;

            return {
              ...product,
              originalPrice: originalPrice.toFixed(2), // Keep original price
              discountedPrice: discountedPrice.toFixed(2), // Show price after discount
              discountAmount: discountAmount.toFixed(2), // Show how much was discounted
              imageUrls: fullImageUrls,
            };
          });

          return res.json({
            sub: productsWithDiscount,
            totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
          });
        }

        res.json({ sub: [], totalDiscountAmount: "0.00" });
      }
    );
  }
  if (sub == "Perfumes") {
    const query = `SELECT * FROM products WHERE category=? OR category=?`;
    db.query(query, ["boys scents", "girls scents"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Body Mists") {
    const query = `SELECT * FROM products WHERE category=? OR category=?`;
    db.query(query, ["boys scents", "girls scents"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Body Wash") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["body wash"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Lotions") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["lotions"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Make Up Kit") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["make up kit"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Watches") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["wathes"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Hair Accessories") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["hair accessories"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Pencil Pouches") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["pencil poaches"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Cosplay Costumes") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["cosplay costumes"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Raincoats") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["raincoats"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
  if (sub == "Swimming Bags") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["swimming bags"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          sub: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ sub: [], totalDiscountAmount: "0.00" });
    });
  }
});
router.get("/itemslist/:item", (req, res) => {
  const { item } = req.params;
  console.log(item);
  if (item == "Boys Trouser sets") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys trouser set"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boys Short sets") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys short set"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boys Trousers") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys trouser"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "T-Shirts") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys tshirts"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Girls Trouser sets") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls trouser set"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Girls Short sets") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls short set"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Skirt set") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["skirt set"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Dresses") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["dressers"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Fanay wear") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["fanay wear"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Girls Trousers") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls trouser"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Tops") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["tops"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Leggings") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["leggings"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boys Costumes") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys costumes"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Girls Costumes") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls costumes"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Vests") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["vests"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boxers") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boxers"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Panties") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["panties"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boob Tops") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boob tops"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "3 in 1 Trolley Bag") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["3 in 1 trolley bag"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "3 in 1 Backpack") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["3 in 1 back pack"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "2 in 1 Backpack") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["2 in 1 back pack"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Single Backpack") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["single back pack"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "3 in 1 Suitcase") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["3 in 1 suitcase"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Single Suitcase") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["single suitcase"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boys Sneakers") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys sneakers"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Converse") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["converse"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boys Open Shoes") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys open shoes"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boys School Shoes") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys school shoes"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Girls Sneakers") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls sneakers"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Doll Shoes") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["doll"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Heels") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["heels"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Girls Open Shoes") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls open shoes"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Girls School Shoes") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls school shoes"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boys Scents") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys scents"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Girls Scents") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls scents"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Boys Scents") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["boys scents"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
  if (item == "Girls Scents") {
    const query = `SELECT * FROM products WHERE category=?`;
    db.query(query, ["girls scents"], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (results.length >= 1) {
        let totalDiscountAmount = 0;
        console.log(results);
        const productsWithDiscount = results.map((product) => {
          let imageUrls = [];

          try {
            if (product.image) {
              const parsedImage = JSON.parse(product.image);
              // Ensure imageUrls is always an array
              imageUrls = Array.isArray(parsedImage)
                ? parsedImage
                : [parsedImage];
            }
          } catch (parseError) {
            console.error("Error parsing product image data:", parseError);
            imageUrls = [];
          }

          const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

          // Calculate discount
          const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
          const originalPrice = parseFloat(product.price) || 0;
          const discountAmount = (discountPercentage / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;

          totalDiscountAmount += discountAmount;

          return {
            ...product,
            originalPrice: originalPrice.toFixed(2), // Keep original price
            discountedPrice: discountedPrice.toFixed(2), // Show price after discount
            discountAmount: discountAmount.toFixed(2), // Show how much was discounted
            imageUrls: fullImageUrls,
          };
        });

        return res.json({
          item: productsWithDiscount,
          totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
        });
      }

      res.json({ item: [], totalDiscountAmount: "0.00" });
    });
  }
});
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
      return res
        .status(500)
        .json({ message: "Error fetching products", error: err });
    }

    const processedProducts = results.map((product) => {
      let imageUrls = [];

      try {
        if (product.image) {
          const parsedImage = JSON.parse(product.image);
          // Ensure imageUrls is always an array
          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
        }
      } catch (parseError) {
        console.error("Error parsing product image data:", parseError);
        imageUrls = [];
      }

      const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

      return {
        ...product,
        imageUrls: fullImageUrls,
      };
    });

    res.json(processedProducts);
  });
});

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
      return res
        .status(500)
        .json({ message: "Error fetching products", error: err });
    }

    const processedProducts = results.map((product) => {
      let imageUrls = [];

      try {
        if (product.image) {
          const parsedImage = JSON.parse(product.image);
          // Ensure imageUrls is always an array
          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
        }
      } catch (parseError) {
        console.error("Error parsing product image data:", parseError);
        imageUrls = [];
      }

      const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

      return {
        ...product,
        imageUrls: fullImageUrls,
      };
    });

    res.json(processedProducts);
  });
});

router.get("/price-asc", (req, res) => {
  const query = "SELECT * FROM products ORDER BY price ASC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const processedProducts = processProducts(results);
    res.json(processedProducts);
  });
});

// Route for fetching products sorted by price (descending)
router.get("/price-desc", (req, res) => {
  const query = "SELECT * FROM products ORDER BY price DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const processedProducts = processProducts(results);
    res.json(processedProducts);
  });
});

// Route for fetching products sorted by rating (highest first)
router.get("/rating", (req, res) => {
  const query = "SELECT * FROM products ORDER BY ratings DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ message: "Error fetching products", error: err });
    }

    const processedProducts = processProducts(results);
    res.json(processedProducts);
  });
});

// Route for fetching newest products (by created_at)
router.get("/newest", (req, res) => {
  const query = "SELECT * FROM products ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ message: "Error fetching products", error: err });
    }

    const processedProducts = processProducts(results);
    res.json(processedProducts);
  });
});

router.get("/size", (req, res) => {
  const { size } = req.query; // Get the size from query parameters

  if (!size) {
    return res.status(400).json({ message: "Size parameter is required" });
  }

  const query = "SELECT * FROM products WHERE size = ?";

  db.query(query, [size], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ message: "Error fetching products", error: err });
    }

    // Process images (if stored as JSON in DB)
    const processedProducts = results.map((product) => {
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

      return {
        ...product,
        imageUrls: imageUrls.map((image) => `/uploads/${image}`),
      };
    });

    res.json(processedProducts);
  });
});

router.post("/product/:id/review", async (req, res) => {
  const { id } = req.params; // product_id from URL
  const { ratings, reviews } = req.body; // Extract ratings and reviews from the request body

  // Validate input
  if (typeof ratings !== "number" || typeof reviews !== "string") {
    return res
      .status(400)
      .json({
        message:
          "Invalid input: ratings must be a number and reviews must be a string",
      });
  }

  if (ratings < 1 || ratings > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    // Check if the product exists
    const [product] = await db
      .promise()
      .query("SELECT id FROM products WHERE id = ?", [id]);
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Insert the review into the reviews table
    await db
      .promise()
      .query(
        "INSERT INTO reviews (product_id, ratings, reviews) VALUES (?, ?, ?)",
        [id, ratings, reviews]
      );

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});





//search
router.get('/search', (req, res) => {
  const { name, category, subcategory } = req.query;

  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  // Add conditions based on provided query parameters
  if (name) {
      sql += ' AND LOWER(category) LIKE ?'; // Search in the `category` column (product name) for partial matches
      params.push(`%${name.toLowerCase()}%`);
  }
  if (category) {
      sql += ' AND LOWER(super) LIKE ?'; // Search in the `super` column (main category) for partial matches
      params.push(`%${category.toLowerCase()}%`);
  }
  if (subcategory) {
      sql += ' AND LOWER(subcat) LIKE ?'; // Search in the `subcat` column (subcategory) for partial matches
      params.push(`%${subcategory.toLowerCase()}%`);
  }

  // Execute the query using the `db` object
  db.query(sql, params, (err, results) =>  {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    if (results.length >= 1) {
      let totalDiscountAmount = 0;
      console.log(results);
      const productsWithDiscount = results.map((product) => {
        let imageUrls = [];
        try {
          if (product.image) {
            const parsedImage = JSON.parse(product.image);
            // Ensure imageUrls is always an array
            imageUrls = Array.isArray(parsedImage)
              ? parsedImage
              : [parsedImage];
          }
        } catch (parseError) {
          console.error("Error parsing product image data:", parseError);
          imageUrls = [];
        }

        const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

        // Calculate discount
        const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
        const originalPrice = parseFloat(product.price) || 0;
        const discountAmount = (discountPercentage / 100) * originalPrice;
        const discountedPrice = originalPrice - discountAmount;

        totalDiscountAmount += discountAmount;

        return {
          ...product,
          originalPrice: originalPrice.toFixed(2), // Keep original price
          discountedPrice: discountedPrice.toFixed(2), // Show price after discount
          discountAmount: discountAmount.toFixed(2), // Show how much was discounted
          imageUrls: fullImageUrls,
        };
      });

      return res.json({
        product: productsWithDiscount,
        totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
      });
    }

    res.json({ product: [], totalDiscountAmount: "0.00" });
  });

});
  router.get("/super/:sup", (req, res) => {
    const { sup } = req.params;
    console.log(sup);
      const query = `SELECT * FROM products WHERE super=?`;
      db.query(
        query,
        sup,
        (err, results) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          if (results.length >= 1) {
            let totalDiscountAmount = 0;
            console.log(results);
            const productsWithDiscount = results.map((product) => {
              let imageUrls = [];
  
              try {
                if (product.image) {
                  const parsedImage = JSON.parse(product.image);
                  // Ensure imageUrls is always an array
                  imageUrls = Array.isArray(parsedImage)
                    ? parsedImage
                    : [parsedImage];
                }
              } catch (parseError) {
                console.error("Error parsing product image data:", parseError);
                imageUrls = [];
              }
  
              const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);
  
              // Calculate discount
              const discountPercentage = parseFloat(product.discount) || 0; // Default to 0 if no discount
              const originalPrice = parseFloat(product.price) || 0;
              const discountAmount = (discountPercentage / 100) * originalPrice;
              const discountedPrice = originalPrice - discountAmount;
  
              totalDiscountAmount += discountAmount;
  
              return {
                ...product,
                originalPrice: originalPrice.toFixed(2), // Keep original price
                discountedPrice: discountedPrice.toFixed(2), // Show price after discount
                discountAmount: discountAmount.toFixed(2), // Show how much was discounted
                imageUrls: fullImageUrls,
              };
            });
  
            return res.json({
              super: productsWithDiscount,
              totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
            });
          }
  
          res.json({ super: [], totalDiscountAmount: "0.00" });
        }
      );
    });

module.exports = router;
router.post("/reviewssubmit/:id", (req, res) => {
  var {id}=req.params
 var {ratings,reviews,name}=req.body;
 const q="INSERT INTO reviews (name,productid,ratings,reviews) VALUES(?,?,?,?)";
 db.query(q,[name,id,ratings,reviews],async(err,results)=>{
  if(err)
  {
    res.json({Message:"database error"});
  }
  console.log("reviews of the product submitted by  "+name);
 })
});
router.get("/reviewsget/:id", (req, res) => {
  var {id}=req.params;
 const q="SELECT*FROM reviews WHERE productid=?";
 db.query(q,id,async(err,results)=>{
  if(err)
  {
    res.json({Message:"database error"});
  }
  console.log(results);
  res.json(results);
 })
});
