const express=require('express');
const axios=require('axios');
const cheerio=require('cheerio');
const { prependTo } = require('cheerio/lib/api/manipulation');
const app=express();
const PORT=process.env.PORT || 4000;

const newspapers=[
    {
    name: 'guradian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base:""
},
{
    name:'telegraph',
    address:'https://www.telegraphindia.com/topic/global-warming',
    base:"https://www.telegraphindia.com"
},
{
    name:'timesofindia',
    address:'https://timesofindia.indiatimes.com/topic/climate-change/news',
    base:"https://timesofindia.indiatimes.com"
},

]

const articles=[];
newspapers.forEach(newspaper=>{
    axios.get(newspaper.address)
    .then((response)=>{
     const html=response.data;
     const $=cheerio.load(html)
     $('a:contains("climate")',html).each(function(){
         const title=$(this).text()
         const url=$(this).attr('href')
         articles.push({
             title,
             url:newspaper.base+url,
             source:newspaper.name
         })
     })
     
    })
    .catch((err)=>{console.log(err)})
})
app.get('/',(req,res)=>{
   res.json("hello");
    //res.send("hello");
})
app.get('/news',(req,res)=>{
    res.json(articles)
   
})
app.get('/newsapi',(req,res)=>{
    

var options = {
  method: 'GET',
  url: 'https://bing-news-search1.p.rapidapi.com/news',
  params: {safeSearch: 'Off', textFormat: 'Raw'},
  headers: {
    'x-bingapis-sdk': 'true',
    'x-rapidapi-host': 'bing-news-search1.p.rapidapi.com',
    'x-rapidapi-key': '034d333c60msh3be117efca9c3a3p145cacjsnc975a2c875a2'
  }
};

axios.request(options).then(function (response) {
	res.json(response.data);
}).catch(function (error) {
	console.error(error);
});
   
})

app.get('/news/:newspaperid',async (req,res)=>{
    const specficarticles=[];
  const   newspaperid=req.params.newspaperid;
  const newspaper=newspapers.filter(newspaper=>newspaper.name==newspaperid)[0]
  const newspaperaddress=newspaper.address;
  axios.get(newspaperaddress)
  .then((response)=>{
   const html=response.data;
   const $=cheerio.load(html)
   $('a:contains("climate")',html).each(function(){
       const title=$(this).text()
       const url=$(this).attr('href')
       specficarticles.push({
           title,
           url:newspaper.base+url,
           source:newspaper.name
       })
   })
   res.json(specficarticles);
   
  })
  .catch((err)=>{console.log(err)})
})

app.listen(PORT,()=>{console.log("server start")});
