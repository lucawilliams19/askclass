const path = require('path')

// Import express to implement a router
const express = require('express')

// Import the colors to change the console log colors
const colors = require('colors')

// Import the env file config to set out configurating of the server
const dotenv = require('dotenv').config()

// Import the error handler middleware
const { errorHandler } = require('./middleware/errorMiddleware')

// Import the databse connection url
const connectDB = require('./config/db')

// Use the .env file to set the port for server
const port = process.env.PORT || 5000

// Connect the server to the MongoDB through the url
connectDB()

// Create a server with express
const app = express()

// Have the server use the express json rather than default
app.use(express.json())

// Have the server use custome urlencoding rather than default
app.use(express.urlencoded({ extended: false }))



// Server connects to the internal items api and uses it to speak to front end
app.use('/api/items', require('./routes/itemRoutes'))

// Server connects to the internal items api and uses it to speak to front end
app.use('/api/users', require('./routes/userRoutes'))


// Server connects to the internal items api and uses it to speak to front end
app.use('/api/files', require('./routes/fileRoutes'))

if ( process.env.NODE_ENV === 'production' ) {
 app.use( express.static( path.join( __dirname, '../frontend/build' ) ) )
 
 app.get( '*', ( req, res ) => {
  res.sendFile( path.resolve( __dirname, '../', 'frontend', 'build', 'index.html'))})
} else {
  app.get('/', (req,res) => res.send('Please set to production'))
}

// Replace the standard error system for the server with a middlware error handler
app.use(errorHandler)

// Have the server listen to the port and console log if anything goes wrong
app.listen(port, () => console.log(`Server started on port ${port}`))
