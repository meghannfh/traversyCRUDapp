const mongoose = require('mongoose')

const connectDB = async() => {
    //try/catch will catch errors for us in our try block
    try {
        //additional properties no longer needed
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB