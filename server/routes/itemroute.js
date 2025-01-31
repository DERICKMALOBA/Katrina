const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../frontend");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Handle Multiple Image Uploads and Store in MySQL
  router.post("/itemssubmit", upload.array("images", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const fileNames = req.files.map((file) => file.filename);
    /* var i=0;
    var a="NO";
    var c="NO";
    var d="NO";
    var e="NO";
    var f="NO";
    var g="NO";
    var h="NO";
    var sl="NO";
    var j="NO";
    for(i;i<fileNames.length;i++)
    {
    if(i==0)
    {
        a=fileNames[i];
    }
    if(i==1)
        {
            b=fileNames[i];
        }
        if(i==2)
            {
                c=fileNames[i];
            }   
            if(i==3)
                {
                    d=fileNames[i];
                } 
                if(i==4)
                    {
                        e=fileNames[i];
                    }
                    if(i==5)
                        {
                            f=fileNames[i];
                        }
                        if(i==6)
                            {
                                g=fileNames[i];
                            }
                            if(i==7)
                                {
                                    h=fileNames[i];
                                }
                                if(i==8)
                                    {
                                        sl=fileNames[i];
                                    }
                                    if(i==9)
                                        {
                                            j=fileNames[i];
                                        }
    }*/
      const {description,name,price,stock,category} = req.body;
      const fq=fileNames;
      console.log(description);
      console.log(name);
      console.log(price);
      console.log(stock);
      console.log(category);
      console.log(fq);
      var f=[description,name,price,stock,category,JSON.stringify(fq)]
    const query="INSERT INTO products (description,name,price,stock,category,image1) VALUES(?,?,?,?,?,?)";
    db.query(query,f,async (err,results)=>{
        if (err) {
            console.log(f);
            return res.status(500).json({ message: 'Database error', error: err });
          }
            res.json({
                message: 'File uploaded successfully!'
            });
    });
});
module.exports = router;
