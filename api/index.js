const path = require('path')
const express = require('express')
const app = express()
const compression = require('compression')

app.use(compression())
app.use(express.static(path.join(__dirname, '../public')))

app.route('/').get((req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.sendFile(path.join(__dirname, '../index.html'))
})

app.listen(1111)

module.exports = app;
