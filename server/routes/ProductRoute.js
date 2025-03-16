const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { count } = require('console');

// Set up static file serving
const app = express();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define where the files will be saved on the server
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // Define the file name to be saved
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to prevent conflicts
    },
});

const upload = multer({ storage: storage });

// Handle Multiple Image Uploads and Store in MySQL
router.post('/add-product', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    const { description, name, price, stock, category,discount } = req.body;
    // Create an array of filenames for uploaded images
    const fileNames = req.files.map((file) => file.filename);

    // Create a SQL query to insert product details and image filenames into the database
    const query = "INSERT INTO products (description, name, price, stock, category,discount, image) VALUES(?,?,?,?,?,?,?)";
    const values = [description, name, price, stock, category,discount, JSON.stringify(fileNames)];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        // Return the inserted product ID and success message
        res.status(201).json({
            message: 'Product added successfully!',
            productId: results.insertId
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

        const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

        return {
            ...product,
            imageUrls: fullImageUrls,
        };
    });
};

// Edit Product Route
router.put('/edit-product/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category, discount, image } = req.body;

    const query = `UPDATE products SET name=?, description=?, price=?, stock=?, category=?, discount=?, image=? WHERE id=?`;
    
    db.query(query, [name, description, price, stock, category, discount, JSON.stringify(image), id], (err) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    });
});
router.get('/productslist', (req, res) => {
    let { page = 1, limit = 12 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const query = `SELECT * FROM products LIMIT ? OFFSET ?`;

    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.json({ products: [], totalDiscountAmount: "0.00", page, limit });

        }
        if (results.length >= 1) {
            let totalDiscountAmount = 0;
            const productsWithDiscount = results.map((product) => {
                let imageUrls = [];
                try {
                    if (product.image) {
                        const parsedImage = JSON.parse(product.image);
                        imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                    }
                } catch (parseError) {
                    console.error('Error parsing product image data:', parseError);
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
                console.error('Error parsing product image data:', parseError);
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
router.delete('/delete-product/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM products WHERE id = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    });
});


router.get('/product/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM products WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            console.warn(`Product with ID ${id} not found`);
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = results[0];

        try {
            const parsedImage = JSON.parse(product.image);
            product.imageUrls = Array.isArray(parsedImage) ? parsedImage.map((img) => `/uploads/${img}`) : [`/uploads/${parsedImage}`];
        } catch (parseError) {
            console.error("Error parsing image data:", parseError);
            product.imageUrls = [];
        }

        res.json(product);
    });
});




router.get('/products/count', (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM products'; // Query to count products
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching product count:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      // Send back the count as JSON
      res.status(200).json({ count: result[0].count });
      console.log(count)
    });
  });


// Fetch All Products Route
router.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ products: results });
    });
});
router.get('/productscategory', (req, res) => {
    const query = 'SELECT*FROM products';
    db.query(query,async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      const l=results.length;
      var j=0;
      var outfits=0;
      var bags=0;
      var shoes=0;
      var hygiene=0;
      var accessories=0;
      var others=0;
      var af=JSON.parse(JSON.stringify(results));
      for(j;j<l;j++)
          {
            if(af[j].category=="boys trouser set"||af[j].category=="boys shot set"||af[j].category=="boys trouser"||af[j].category=="boys tshirts"||af[j].category=="girls trouser set"||af[j].category=="girls short set"||af[j].category=="skirt set"||af[j].category=="dressers"||af[j].category=="fanay wear"||af[j].category=="tops"||af[j].category=="leggings"||af[j].category=="boys costumes"||af[j].category=="girls costumes"||af[j].category=="vests"||af[j].category=="boxers"||af[j].category=="panties"||af[j].category=="boob tops")
            {
              outfits=outfits+1;
            }
            if(af[j].category=="3 in 1 trolley bag"||af[j].category=="3 in 1 back pack"||af[j].category=="2 in 1 back pack"||af[j].category=="single back pack"||af[j].category=="3 in 1 suitcase"||af[j].category=="single suitcase"||af[j].category=="girls handbags"||af[j].category=="monkey bags"||af[j].category=="lunch bags")
              {
                bags=bags+1;
              }
              if(af[j].category=="boys sneakers"||af[j].category=="converse"||af[j].category=="boys open shoes"||af[j].category=="boys school shoes"||af[j].category=="girls sneakers"||af[j].category=="doll"||af[j].category=="heels"||af[j].category=="girls open shoes"||af[j].category=="girls school shoes")
                {
                  shoes=shoes+1;
                }  
                if(af[j].category=="boys scents"||af[j].category=="girls scents"||af[j].category=="body wash"||af[j].category=="lotions"||af[j].category=="make up kit")
                  {
                    hygiene=hygiene+1;
                  }
                  if(af[j].category=="watches"||af[j].category=="hair accessories")
                    {
                      accessories=accessories+1;
                    } 
                    if(af[j].category=="pencil poaches"||af[j].category=="cosplay costumes"||af[j].category=="raincoats"||af[j].category=="swimming bags")
                      {
                        others=others+1;
                      } 
          }
    console.log(bags);
    res.json({Outfits:outfits,Bags:bags,Shoes:shoes,Hygiene:hygiene,Accessories:accessories,Others:others});
  });
  });
  router.get('/tops', (req, res) => {
    var category="Tops";
    const query = 'SELECT * FROM products WHERE category=?';
    db.query(query,category,(err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      if (results.length >= 1) {
          let totalDiscountAmount = 0;

          const productsWithDiscount = results.map((product) => {
              let imageUrls = [];

              try {
                  if (product.image) {
                      const parsedImage = JSON.parse(product.image);
                      // Ensure imageUrls is always an array
                      imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                  }
              } catch (parseError) {
                  console.error('Error parsing product image data:', parseError);
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
              tops: productsWithDiscount,
              totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
          });
      }

      res.json({tops: [], totalDiscountAmount: "0.00" });
  });
});
router.get('/subcategories/:sub', (req, res) =>{
    const {sub} = req.params;
    console.log(sub);
    if(sub=="Boys Outfits"||sub=="Girls Outfits"||sub=="Swimming Wear"||sub=="Inner Wears")
    { const query = `SELECT * FROM products WHERE category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=? OR category=?`;
    db.query(query, ["boys trouser set","boys short set","boys trouser","boys tshirts","girls trouser set","girls short set","skirt set","dressers","fanay wear","girls trouser","tops","leggings","boys costumes","girls costumes","vests","boxers","panties","boob tops"], (err,results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length >= 1) {
            let totalDiscountAmount = 0;
             console.log(results)
            const productsWithDiscount = results.map((product) =>{
                let imageUrls = [];

                try {
                    if (product.image) {
                        const parsedImage = JSON.parse(product.image);
                        // Ensure imageUrls is always an array
                        imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                    }
                } catch (parseError) {
                    console.error('Error parsing product image data:', parseError);
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

        res.json({sub: [], totalDiscountAmount: "0.00" });
    });
}
});
router.get('/dressers', (req, res) => {
    var category="Dressers";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls = [];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                dressers: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({dressers: [], totalDiscountAmount: "0.00" });
      });
  });
  router.get('/outer', (req, res) => {
    var category="Outer Wear";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls = [];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                outer: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({outer: [], totalDiscountAmount: "0.00" });
      });
  });
  router.get('/sleep', (req, res) => {
    var category="Sleep Wear";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls = [];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                sleep: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({sleep: [], totalDiscountAmount: "0.00" });
      });
  });
  router.get('/under', (req, res) => {
    var category="Under Wear";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls = [];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                under: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({under: [], totalDiscountAmount: "0.00" });
      });
  });
  router.get('/foot', (req, res) => {
    var category="Foot Wear";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls = [];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                foot: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({foot: [], totalDiscountAmount: "0.00" });
      });
  });
  router.get('/accessories', (req, res) => {
    var category="Accessories";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls = [];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                accessories: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({accessories: [], totalDiscountAmount: "0.00" });
      });
  });
  router.get('/special', (req, res) => {
    var category="Special Occasions";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls = [];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                special: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({special: [], totalDiscountAmount: "0.00" });
      });
  });
  router.get('/sports', (req, res) => {
    var category="SportsWear";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls = [];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                sports: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({sports: [], totalDiscountAmount: "0.00" });
      });
  });
  router.get('/everyday', (req, res) => {
    var category="Everyday Wear";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls = [];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                everyday: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({everyday: [], totalDiscountAmount: "0.00" });
      });
  });
  router.get('/casuals', (req, res) => {
    var category="Casuals";
    const query = 'SELECT * FROM products WHERE category=?';
      db.query(query,category,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
  
          if (results.length >= 1) {
              let totalDiscountAmount = 0;
  
              const productsWithDiscount = results.map((product) => {
                  let imageUrls =[];
  
                  try {
                      if (product.image) {
                          const parsedImage = JSON.parse(product.image);
                          // Ensure imageUrls is always an array
                          imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                      }
                  } catch (parseError) {
                      console.error('Error parsing product image data:', parseError);
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
                casuals: productsWithDiscount,
                  totalDiscountAmount: totalDiscountAmount.toFixed(2), // Total discount for all products
              });
          }
  
          res.json({casuals: [], totalDiscountAmount: "0.00" });
      });
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
            return res.status(500).json({ message: "Error fetching products", error: err });
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
                console.error('Error parsing product image data:', parseError);
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
            return res.status(500).json({ message: "Error fetching products", error: err });
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
                console.error('Error parsing product image data:', parseError);
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
            return res.status(500).json({ message: "Error fetching products", error: err });
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
            return res.status(500).json({ message: "Error fetching products", error: err });
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
            return res.status(500).json({ message: "Error fetching products", error: err });
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
    const { id } = req.params;
    const { rating, review } = req.body;
  
    if (!rating || !review || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating or review" });
    }
  
    try {
      // Fetch the current reviews
      const [product] = await db.promise().query("SELECT reviews FROM products WHERE id = ?", [id]);
  
      if (!product.length) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      let existingReviews = product[0].reviews ? JSON.parse(product[0].reviews) : [];
  
      // Add new review
      const newReview = { rating, review, date: new Date().toISOString() };
      existingReviews.push(newReview);
  
      // Update the database
      await db.promise().query("UPDATE products SET reviews = ? WHERE id = ?", [JSON.stringify(existingReviews), id]);
  
      res.status(201).json({ message: "Review added successfully", reviews: existingReviews });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  







module.exports = router;