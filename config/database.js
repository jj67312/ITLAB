const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/bitbotDB'

mongoose.connect(url, {
    useNewUrlParser : true,
    useUnifiedTopology: true
})

const con = mongoose.connection

con.on('open', ()=>{
    // console.log("Database connected");
})


