const express = require('express')
const app = express()
const port = process.env.PORT || 8085
app.listen(port)

app.get('/webhooks', (req, res) => {
  console.log('got a request')
  //console.log(req)
  res.status(200).send(req.query["hub.challenge"])
})