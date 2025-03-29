const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
router.get('/totalsales', (req, res) => {
  const query = 'SELECT*FROM sales';
  db.query(query,async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    const nn = results.length;
       console.log(nn);
    res.json({Totalsales:nn});
  });
});
router.get('/salesrevenue', (req, res) => {
  const query = 'SELECT*FROM sales';
  db.query(query,async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    const nn = results.length;
    var ar=JSON.parse(JSON.stringify(results));
    var i=0;
    var total=0
    for(i;i<nn;i++)
    {   
          total=parseFloat(total)+parseFloat((ar[i].amount));
    }
       console.log(total);
    res.json({Totalrevenue:total});
  });
});
router.get('/salesrevenueanalysis', (req, res) => {
  const lastyear = new Date().getFullYear()-1;
  console.log("lastyear :"+lastyear);
  const currentyear = new Date().getFullYear();
  console.log("currentyear:"+currentyear);
  const query = 'SELECT*FROM sales';
  db.query(query,async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    const nn = results.length;
    var ar=JSON.parse(JSON.stringify(results));
    var i=0;
    var total=0
    var lastyearsales=0;
    var currentyearsales=0;
    for(i;i<nn;i++)
    {   
      if(ar[i].year==lastyear)
      {
         lastyearsales=parseFloat(lastyearsales)+parseFloat(ar[i].amount);
      }
      if(ar[i].year==currentyear)
        {
           currentyearsales=parseFloat(currentyearsales)+parseFloat(ar[i].amount);
        }
    
    }
    console.log("Last: "+lastyearsales);
    console.log("Current:  "+currentyearsales);
    var deviation=parseFloat(currentyearsales)-(lastyearsales)
    console.log("Deviation is:  "+deviation);
    var percentage=(deviation*100)/lastyearsales;
    console.log("Deviation percentage:  "+percentage);
    res.json({Currentsales:currentyearsales,Deviation:percentage.toFixed(2)});
  });
});
router.get('/weeksales', (req, res) => {
        const y = new Date().getFullYear();
        const required=7;
        const day = new Date();
        const x=day.getDay();
        const query = 'SELECT*FROM sales';
        db.query(query,y,async (err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
          const nn = results.length;
          var ar=JSON.parse(JSON.stringify(results));
         /* var i=0;
          for(i;i<nn;i++)
          {
            if(ar[i].day==)
            {
                const comb=[required,x]
                const qd = 'UPDATE sales SET day=? WHERE day=?';
                db.query(qd,comb,async (err, results) => {
                  if (err) return res.status(500).json({ message: 'Database error', error: err });
                });
            }     
          }*/
          const qf = 'SELECT*FROM sales';
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
    });
    router.get('/category', (req, res) => {
        const query = 'SELECT*FROM sales';
        db.query(query,async (err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
          const l=results.length;
            var j=0;
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
      router.get('/salesgrowth', (req, res) => {
        const query = 'SELECT*FROM sales';
        db.query(query,async (err, results) => {
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
          res.json({Jan:jan,Feb:feb,Mar:mar,Apr:apr,May:may,Jun:jun,Jul:jul,Aug:aug,Sep:sep,Oct:oct,Nov:nov,Dec:dec});
        });
      });
module.exports = router;