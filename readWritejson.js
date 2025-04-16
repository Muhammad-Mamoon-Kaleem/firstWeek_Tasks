import fs from 'fs/promises'

async function readAndwritejson() {
    const data = [
        {
          "id": 1,
          "name": "Alice Johnson",
          "email": "alice.johnson@example.com",
          "age": 28,
          "isActive": true
        },
        {
          "id": 2,
          "name": "Bob Smith",
          "email": "bob.smith@example.com",
          "age": 34,
          "isActive": false
        },
        {
          "id": 3,
          "name": "Carol Lee",
          "email": "carol.lee@example.com",
          "age": 22,
          "isActive": true
        }
      ] ;
      await fs.writeFile('jsonData.js',JSON.stringify(data),(err)=>{
        if(err){
            console.log(err);
            return err;
        }
        console.log('File is written successfully');
        
      })
     const fileData = await fs.readFile('jsonData.js','utf-8')
     console.log("Data before parse is a string ",fileData);
     
     const parsedData = JSON.parse(fileData)
     console.log('Read data after parse is an array',parsedData);
     
}
readAndwritejson();