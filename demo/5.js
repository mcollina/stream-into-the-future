'use strict'

const { promisify } = require('util')
const sleep = promisify(setTimeout)
const { Readable } = require('stream')

async function * generate () {
  for (let i = 1; i < 1025; i++) {
    yield i
  }
}

async function run () {
  const rs = Readable.from(generate())

  for await (let chunk of rs) {
    await sleep(100)
    console.log(chunk)
  }
}

run()
