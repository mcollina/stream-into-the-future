'use strict'

const { Readable, pipeline } = require('stream')
const { promisify } = require('util')
const sleep = promisify(setTimeout)

async function * generate () {
  yield 'hello'
  await sleep(1000)
  yield 'Node.tlv!'
  await sleep(1000)
  yield 'I\'m Matteo from Italy'
  await sleep(1000)
  yield 'and'
  await sleep(1000)
  yield 'there are no zombies here'
  await sleep(1000)
}

async function * newlines (stream) {
  for await (let chunk of stream) {
    yield chunk
    yield '\n'
  }
}

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

pipeline(generate, newlines, upperCase, counter, process.stdout, function (err) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
