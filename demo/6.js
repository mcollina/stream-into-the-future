const { createReadStream } = require('fs')
const { Readable } = require('stream')

async function run () {
  const rs = createReadStream(__filename)
  rs.setEncoding('utf8')

  for await (let chunk of rs) {
    console.log(chunk)
  }
}

run()
