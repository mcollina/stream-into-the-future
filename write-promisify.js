"use strict";

const stream = require("stream");
const { Readable, once } = stream;
const { promisify } = require('util');
const finished = promisify(stream.finished);

async function run(origin, dest) {
  try {
    const write = buildWrite(dest);
    for await (let chunk of origin) {
      await write(chunk);
    }
    await finished(dest);
  } catch (err) {
    origin.destroy(err);
    dest.destroy(err);
  }
}

function buildWrite(stream) {
  // This is a good way of wrapping stream.write into a Promise.
  // We are waiting for a drain event to resolve, and we are wrapping
  // the error event. A consumer should probably use finished to
  // know if the stream has completed.
  const streamError = null;
  stream.on("error", function(err) {
    streamError = err;
  });

  return write;

  function write(chunk) {
    if (streamError) {
      return Promise.reject(streamError);
    }

    const res = stream.write(chunk);

    if (res) {
      return Promise.resolve();
    }

    return once(stream, 'drain');
  }
}

// startup and run the pipeline
const origin = Readable.from((async function * () {
  yield "hello"
  yield " world"
})());
run(origin, process.stdout).catch(console.log);
