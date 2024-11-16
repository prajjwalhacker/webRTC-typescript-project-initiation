const express = require('express');
const dotenv = require('dotenv');

const app = express();

dotenv.config();


app.get('/', () => {
    console.log('typescipt server with exporess');
})

app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
})