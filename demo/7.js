'use strict'

const { createServer, request } = require('http')
const { createReadStream } = require('fs')
const { pipeline, finished } = require('stream')

const server = createServer(function (req, res) {
  console.log('>> request')
  print(req, res).catch(function (err) {
    if (err) {
      res.statusCode = 500
      res.end(err.message)
    }
  })
})

async function print (req, res) {
  req.setEncoding('utf8')
  let total = 0
  for await (let chunk of req) {
    total += chunk.length
  }

  res.end(`>> received ${total} characters!`)
}

server.listen(0, function () {
  console.log('>> listening')
  const duplex = request({
    port: server.address().port,
    method: 'POST'
  })

  pipeline(createReadStream(__filename), duplex, function (err) {
    if (err) {
      console.log(err)
    }
  })

  duplex.on('response', function (res) {
    res.pipe(process.stdout)
    finished(res, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('')
      server.close()
    })
  })
})
