import bodyParser from 'body-parser'
import express, { Request, Response} from 'express'

const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (req,res)=> {
    res.send("Hello world")
})

app.listen(port, ()=>{
    console.log(`Starting app on port: ${port}`)
})