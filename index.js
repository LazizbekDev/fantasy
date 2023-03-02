import express from "express";
import cors from "cors";
import { config } from "dotenv";
import dalle from "./routes/Dalle.js";
import axios from "axios";

config();

const app = express()
const PORT = process.env.PORT||5000


app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use('/api/generate', dalle)

app.get('/', (req, res) => {
    res.status(200).json({
        HOLATI: "A'LO"
    })
})

setInterval(async () => {
    const {data} = await axios.get(process.env.URL)
    console.log(data)
}, 1000 * 60)

app.listen(PORT, () => {
    console.log(`SERVER ${PORT}-PORTda`)
})
