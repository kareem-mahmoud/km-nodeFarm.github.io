// internal modules
const fs = require('fs');
const http = require('http');
const url = require('url');

// own modules
const replaceTemplate = require('./modules/replaceTemplate');


// 3rd party modules
const slugify = require('slugify');


//////////////////////////////////////////////////////////////////////////
// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// const textOut = `\nThis is what we know: \n\n${textIn}. \n\n${Date()} \n`;

// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File is written');

// const textInNew = fs.readFileSync('./txt/output.txt', 'utf-8');
// console.log(textInNew);


////////////////////////////////////////////////////////////////////////
// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('error is happen.');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log('Your file has been written.');
//             });
//         });
//     });
    
// });

// console.log('Reading data in background');



///////////////////////////////////////////////////////////////////////
//  SERVER
const port = 8888;
const localhost = '127.0.0.1';



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map( el => slugify(el.productName, {lower: true}));


const server = http.createServer( (req, res) => {
    // console.log(dataObj);
    // console.log(req.url);
    // console.log(url.parse(req.url, true));

    const { query, pathname } = url.parse(req.url, true);
    
    // overview
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { "content-type": "text/html" });

        const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace("{%PRODUCTCARDS%}", cardsHtml); 
        res.end(output);

    // product
    } else if (pathname === '/product') {
        res.writeHead(200, { "content-type": "text/html" });

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API 
    } else if (pathname === '/api') {
        res.writeHead(200, {"content-type": "application/json"});
        res.end(data);
     
    // not found 
    } else {
        res.writeHead(404, {'content-type': 'text/html'});
        res.end("<h1>This Page Not Found!</h1>");
    }
    
});

server.listen(port, localhost, () => {
    console.log(`Listening to the current port: ${port}`);
});

