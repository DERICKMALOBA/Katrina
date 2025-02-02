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

    const { description, name, price, stock, category } = req.body;
    // Create an array of filenames for uploaded images
    const fileNames = req.files.map((file) => file.filename);

    // Create a SQL query to insert product details and image filenames into the database
    const query = "INSERT INTO products (description, name, price, stock, category, image) VALUES(?,?,?,?,?,?)";
    const values = [description, name, price, stock, category, JSON.stringify(fileNames)];

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

// Edit Product Route
router.put('/edit-product/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category, image } = req.body;
    
    // Update product in the database
    const query = `UPDATE products SET name=?, description=?, price=?, stock=?, category=?, image=? WHERE id=?`;
    db.query(query, [name, description, price, stock, category, JSON.stringify(image), id], (err) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    });
});

router.get('/productslist', (req, res) => {
    const query = 'SELECT * FROM products';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (results.length >= 1) {
            const productsWithFullImageUrls = results.map((product) => {
                let imageUrls = [];

                try {
                    // Ensure image data is not null/undefined before parsing
                    if (product.image) {
                        // Try parsing the image field
                        const parsedImage = JSON.parse(product.image);
                        
                        // If parsed data is not an array, convert it to an array
                        imageUrls = Array.isArray(parsedImage) ? parsedImage : [parsedImage];
                    }
                } catch (parseError) {
                    console.error('Error parsing product image data:', parseError);
                    imageUrls = []; // Default to an empty array if parsing fails
                }

                // Construct full image URLs
                const fullImageUrls = imageUrls.map((image) => `/uploads/${image}`);

                return { ...product, imageUrls: fullImageUrls };
            });

            return res.json(productsWithFullImageUrls); // Return modified product list
        }

        res.json([]); // Return an empty array if no products found
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
    
    // console.log("GET /product/:id route hit"); // Check if this logs
    // console.log(`Fetching product with ID: ${id}`); // Check if ID logs

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

        // Debugging: Check if the image is stored correctly before parsing
      
        
        
        try {
            product.imageUrls = JSON.parse(product.image).map((img) => `/uploads/${img}`);
        } catch (parseError) {
            console.error("Error parsing image data:", parseError);
            return res.status(500).json({ error: "Invalid image format in database" });
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
      var top=0;
      var bot=0;
      var dre=0;
      var out=0;
      var sle=0;
      var und=0;
      var foo=0;
      var acc=0;
      var spe=0;
      var spo=0;
      var af=JSON.parse(JSON.stringify(results));
      for(j;j<l;j++)
          {
            if(af[j].category=="tops")
            {
              top=top+1;
            }
            if(af[j].category=="bottoms")
              {
                bot=bot+1;
              }
              if(af[j].category=="dressers")
                {
                  dre=dre+1;
                }  
                if(af[j].category=="outerwear")
                  {
                    out=out+1;
                  }
                  if(af[j].category=="sleepwear")
                    {
                      sle=sle+1;
                    } 
                    if(af[j].category=="underwear")
                      {
                        und=und+1;
                      } 
                      if(af[j].category=="footwear")
                        {
                          foo=foo+1;
                        }  
                        if(af[j].category=="accessories")
                          {
                            acc=acc+1;
                          } 
                          if(af[j].category=="special")
                            {
                              spe=spe+1;
                            }  
                            if(af[j].category=="sport")
                              {
                                spo=spo+1;
                              }  
          }
    console.log(top);
    res.json({Top:top,Bot:bot,Dre:dre,Out:out,Sle:sle,Und:und,Foo:foo,Acc:acc,Spe:spe,Spo:spo});
  });
  });
module.exports = router;
