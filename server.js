import http from 'http'
import eventLoop from './index.js';

const port = 8088;
const server = http.createServer((req,res)=>{
    const {url,method}=req;
    if(url==='/eventloop' && method==='GET'){
        eventLoop()
    }
    res.write('Server running here')
    res.end();
})
server.listen(port,()=>{
    console.log('Server running on port',port);
})