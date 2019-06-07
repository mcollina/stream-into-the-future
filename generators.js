const { promisify } = require('util')
const sleep = promisify(setTimeout)

async function * generate () {
  await sleep(10)
  yield 'hello'
  await sleep(10)
  yield ' '
  await sleep(10)
  yield 'world'
}

async function consume (iterator) {
  let strings = ''

  for await (let chunk of iterator) {
    strings += chunk
  }

  return strings
}

// output "hello world"
consume(generate()).then(console.log)
