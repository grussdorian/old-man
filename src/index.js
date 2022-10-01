const express = require('express')
const app = express()
const port = 8085 || process.env.PORT
app.listen(8085)

app.use('', (req, res) => {
  console.log('got a request')
  console.log(req)

  res.status(200).send("Okay")
})