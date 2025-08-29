const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const dbString = process.env.MONGO_URL || process.env.DB_STRING || process.env.DATABASE_URL

    if (!dbString) {
      console.error('ERROR: No MongoDB connection string found!')
      console.error('Please set MONGO_URL, DB_STRING, or DATABASE_URL environment variable')
      process.exit(1)
    }

    console.log('Connecting to MongoDB...')
    const conn = await mongoose.connect(dbString, {
      // useNewUrlParser: true,//THIS 4 ARE DEPRECATED
      // useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  }
}

module.exports = connectDB
