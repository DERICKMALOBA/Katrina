const express = require('express');
const db = require('../config/db.js');
const router = express.Router();
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