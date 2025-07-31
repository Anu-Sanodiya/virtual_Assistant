const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("db connectd ")
    } catch (err) {
        console.log(err)
        process.exit(1);
    }

}
module.exports= connectDB