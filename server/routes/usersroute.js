const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
router.get('/userslist', (req, res) => {
  const query = 'SELECT*FROM customers';
  db.query(query,async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length>=1) {
       res.send(results);
    }
  });
});
router.post('/deleteusers', (req, res) => {
  const {userid}=req.body;
    const query = 'DELETE FROM customers WHERE userid=?';
    const ui=userid;
    console.log(ui);
    db.query(query,ui,async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
  
      if (results.length>=1) {
          console.log(results);
         res.send(results);
      }
    });
  });
  router.get('/userstotal', (req, res) => {
      const query = 'SELECT*FROM customers';
      db.query(query,async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        const t = results.length;
        console.log(t);
        res.json({size:t});
      });
    });
    router.get('/newusers', (req, res) => {
        const m= new Date().getMonth() + 1; 
        const y = new Date().getFullYear();
        const nm=m-1;
        const dt=[m,y,nm,y];
        console.log(m);
        console.log(y);
        const query = 'SELECT*FROM customers WHERE (month=?&&year=?)||(month=?&&year=?)';
        db.query(query,dt,async (err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
          const nn = results.length;
          console.log(nn);
          res.json({new:nn});
        });
      });
      router.get('/usersgrowth', (req, res) => {
        const y = new Date().getFullYear();
        const query = 'SELECT*FROM customers WHERE year=?';
        db.query(query,y,async (err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
          const nn = results.length;
          var i=0;
          var jan=0;
          var feb=0;
          var mar=0;
          var apr=0;
          var may=0;
          var jun=0;
          var jul=0;
          var aug=0;
          var sep=0;
          var oct=0;
          var nov=0;
          var dec=0;
          var ar=JSON.parse(JSON.stringify(results));
          for(i;i<nn;i++)
          {
            if(ar[i].month==1)
            {
              jan=jan+1;
            }
            if(ar[i].month==2)
              {
                feb=feb+1;
              }
              if(ar[i].month==3)
                {
                  mar=mar+1;
                }  
                if(ar[i].month==4)
                  {
                    apr=apr+1;
                  }
                  if(ar[i].month==5)
                    {
                      may=may+1;
                    } 
                    if(ar[i].month==6)
                      {
                        jun=jun+1;
                      } 
                      if(ar[i].month==7)
                        {
                          jul=jul+1;
                        }
                        if(ar[i].month==8)
                          {
                            aug=aug+1;
                          }
                          if(ar[i].month==9)
                            {
                              sep=sep+1;
                            } 
                            if(ar[i].month==10)
                              {
                                oct=oct+1;
                              }  
                              if(ar[i].month==11)
                                {
                                  nov=nov+1;
                                }  
                                if(ar[i].month==12)
                                  {
                                    dec=dec+1;
                                  }                   
          }
          console.log("matei eng");
          console.log(jan);
          console.log(feb);
          res.json({Jan:jan,Feb:feb,Mar:mar,Apr:apr,May:may,Jun:jun,Jul:jul,Aug:aug,Sep:sep,Oct:oct,Nov:nov,Dec:dec});
        });
      });
module.exports = router;