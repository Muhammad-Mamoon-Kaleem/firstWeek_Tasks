import crypto from 'crypto'
import fs from 'fs'

const key = crypto.randomBytes(32)
const vector = crypto.randomBytes(16)

function encryptFile(inputFile,outputFile){
    const cipher = crypto.createCipheriv('AES-256-CBC',key,vector)
    
    const input = fs.createReadStream(inputFile)
    const output = fs.createWriteStream(outputFile)
    input.pipe(cipher).pipe(output)

    output.on('finish',()=>{
        console.log("Encryption complete");
        console.log('Key: ',key.toString('hex'));
        console.log('Vector: ',vector.toString('hex'));        
    })
}

function decryptFile(inputFile,outputFile){
    const decypher = crypto.createDecipheriv('AES-256-CBC',key,vector)
    
    const input = fs.createReadStream(inputFile)
    const output = fs.createWriteStream(outputFile)
    input.pipe(decypher).pipe(output)

    output.on('finish',()=>{
        console.log("Decryption complete", outputFile);
    })
}


encryptFile("input.txt", "encrypted.txt");

setTimeout(() => {
    decryptFile("encrypted.txt", "decrypted.txt");
}, 2000);