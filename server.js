const app=require('./app')
const path=require('path')
const http = require('http')
const dotenv=require('dotenv')
const mongoose=require('mongoose')

dotenv.config({ path: 'config.env' })
const server=http.createServer(app)
const port=process.env.PORT
const DB=process.env.DB



mongoose.connect(DB).then(con=>console.log('Connetion established successfully right now !'))
.catch(con=>console.log('Error occured during connection !'))

server.listen(port,()=>{
    if(process.env.NODE_ENV==='development')
    {
        console.log(`Server is running on port ${port} in development mode.`)
    }else{console.log(`Server is running on port ${port} in production mode.`)}
})
