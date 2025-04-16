
import fs from 'fs'

//const {readFile,writeFile} = fs.promises;

export default function eventLoop(){
    console.log('event loop => start');
    
    setTimeout(()=>{
        console.log('setTimeout callback');
        
    },0)

    // setInterval(() => {
    //     console.log('setInterval callback');
        
    // }, 2);

    setImmediate(()=>{
        console.log('setImmediate callback');
    })

    Promise.resolve().then(()=>{
        console.log('Promises callback');
    })

    process.nextTick(()=>{
        console.log('Process.next callback');
    })

    fs.readFile('input.txt',(err,data)=>{
        if(err){
            console.log(err);
            return err
        }
        else{
            console.log(data.toString());
            
        }
    })
    fs.writeFile('output.txt','Hi its new file',(err)=>{
        if(err){
            console.log(err);
            return err;
        }
        else{
            console.log('File is written successfully !');
            
        }
    })
console.log('End here');

}
// eventLoop()