'use strict'

const { Readable } = require('stream')

function * generate () {
  for (let i = 1; i < 1025; i++) {
    yield i
  }
}

const rs = Readable.from(generate())

rs.on('data', console.log)
