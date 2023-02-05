const express = require('express')
require('dotenv').config()
const cors = require('cors');
const router = require('./router/index');
const server = express()
const cookieParser = require('cookie-parser')

const { Pool, Client } = require('pg')
const connectionCredits = {
    user: 'postgres',
    host: 'localhost',
    database: 'zbd-app',
    password: '1111',
    port: 5432
}


server.use(express.json());
server.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
server.use(cookieParser())
server.use('/api', router)
server.use((res) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
});
const run_Server = async () => {
    try {
        const connectDb = async () => {
            try {
                const client = new Client(connectionCredits)
                await client.connect()
                console.log('Database connected succesfully')
                await client.end()
            } catch (error) {
                console.log(error)
            }
        }
        connectDb()
        server.listen(process.env.SERVER_PORT, () => {
            console.log(`Server is listening at port ${process.env.SERVER_PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}
run_Server()