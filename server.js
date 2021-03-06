var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser'); 
var config = {
    user: 'ronyjoe98',
    databse: 'ronyjoe98',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
var pool = new Pool(config);
var articles = {
    'article-one' : {
    title: 'Article One | Rony',
    heading: 'Article One',
    date: 'Feb 17, 2018',
    content:`<p>
                This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
            </p>
            <p>
                This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
            </p>
            <p>
                This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
            </p>`}
,
    'article-two' : { title: 'Article One | Rony',
    heading: 'Article Two',
    date: 'Feb 17, 2018',
    content:`<p>
                This is the content for my second Article.
            </p>`}
            
,
    'article-three' : { title: 'Article One | Rony',
    heading: 'Article Three',
    date: 'Feb 17, 2018',
    content:`<p>
                This is the content for my Third Article.
            </p>`
}
    
};

function createTemplate(data){
    var title=data.title;
    var heading= data.heading;
    var date=data.date;
    var content=data.content;
    var htmlTemplate = `<html>
    <head>
        <title>${title}</title>
        <meta name="viewport" width="device-width, initial-scale=1" />
        <link href="/ui/style.css" rel="stylesheet" />
        
    </head>
    <body>
    <div class="container">
        <div>
            <a href="/">Home</a>
        </div>
        <hr/>
        <h3>${heading}</h3>
        <div>
            ${date.toDateString()}
        </div>
        <div>
           ${content}
        </div>
    </div>
</body>
</html>`;
return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var counter = 0;
app.get('/counter',function(req,res){
    counter = counter + 1;
    res.send(counter.toString());
});
var names = [];
app.get('/submit-name',function(req,res){
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName',function(req,res){
  
   pool.query("SELECT * FROM article WHERE TITLE='" + req.params.articleName + "'",function(err,result){
       if(err)
       {
            res.status(500).send(err.toString());
       }else
       {
           if(result.rows.length === 0)
           {
               res.status(404).send('Article not Found');
           }else
           {
               var articleData=result.rows[0];
              res.send(createTemplate(articleData)); 
           }
           
       }
       
   });
   
});
function hash(input,salt){
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ['pbkdf2','10000',salt,hashed.toString('hex')].join('$');
}
app.post('/create-user',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES($1,$2)',[username,dbString],function(err,result){
        
        if(err)
       {
            res.status(500).send(err.toString());
       }else
       {
           res.send('User Successfully Created'+ username);
          
}});
});

app.get('/hash/:input',function(req,res){
    var hashedString = hash(req.params.input,'this-is-ma=string');
    res.send(hashedString);
});
app.get('/article-two',function(req,res){
    res.send("Article two requested and will be served here");
});

app.get('/article-three',function(req,res){
    res.send("Article three requested and will be served here");
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
