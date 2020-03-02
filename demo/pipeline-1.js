'use strict'

const { createReadStream } = require('fs')
const { Readable, pipeline } = require('stream')

const rs = createReadStream(__filename)
rs.setEncoding('utf8')

async function * upperCase (stream) {
  for await (let chunk of stream) {
    yield chunk.toUpperCase()
  }
}

async function * counter (stream) {
  let count = 0

  for await (let chunk of stream) {
    count += chunk.length
    yield chunk
  }

  yield `\n`
  yield `>> there were ${count} chars\n`
}

pipeline(rs, upperCase, counter, process.stdout, function (err) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
