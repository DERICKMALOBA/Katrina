const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
router.get('/totalorders', (req, res) => {
  const query = 'SELECT*FROM orders';
  db.query(query,async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    const total = results.length;
       console.log(total);
    res.json({Totalorders:total});
  });
});
router.get('/weekorders', (req, res) => {
    const query = 'SELECT*FROM orders';
    db.query(query,async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
        const l = results.length;
            var j=0;
            var sat=0;
            var sun=0;
            var mon=0;
            var tue=0;
            var wed=0;
            var thur=0;
            var fri=0;
            var af=JSON.parse(JSON.stringify(results));
            for(j;j<l;j++)
                {
                  if(af[j].day==0)
                  {
                    sun=sun+1;
                  }
                  if(af[j].day==1)
                    {
                      mon=mon+1;
                    }
                    if(af[j].day==2)
                      {
                        tue=tue+1;
                      }  
                      if(af[j].day==3)
                        {
                          wed=wed+1;
                        }
                        if(af[j].day==4)
                          {
                            thur=thur+1;
                          } 
                          if(af[j].day==5)
                            {
                              fri=fri+1;
                            } 
                            if(af[j].day==6)
                              {
                                sat=sat+1;
                              }  
                }
          console.log(sat);
          res.json({Sun:sun,Mon:mon,Tue:tue,Wed:wed,Thur:thur,Fri:fri,Sat:sat});
    });
  });
  router.get('/orderstatus', (req, res) => {
    const query = 'SELECT*FROM orders';
    db.query(query,async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
        const l = results.length;
            var j=0;
            var pend=0;
            var deli=0;
            var decl=0;
            var shipp=0;
            var af=JSON.parse(JSON.stringify(results));
            for(j;j<l;j++)
                {
                  if(af[j].status=="Pending")
                  {
                    pend=pend+1;
                  }
                  if(af[j].status=="Shipping")
                    {
                      shipp=shipp+1;
                    }
                    if(af[j].status=="Delivered")
                      {
                        deli=deli+1;
                      }  
                      if(af[j].status=="Declined")
                        {
                          decl=decl+1;
                        }
                }
          console.log(deli);
          res.json({Pend:pend,Shipp:shipp,Deli:deli,Decl:decl});
    });
  });
module.exports = router;