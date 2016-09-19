const crypto = require('crypto'),
  { FB_APP_SECRET, senderID } = require('../../envVariables');

function writeObjectToFile (obj) {
  let wstream = fs.createWriteStream('test/output.json');
  wstream.write(JSON.stringify(obj));
  wstream.on('finish', () => console.log('file is readable in output.json'));
  return wstream.end();
}

function hashMyMessage (dummyReq) {
  return crypto.createHmac('sha1', FB_APP_SECRET)
    .update(Buffer.from(JSON.stringify(dummyReq)))
    .digest('hex');
}

function dbQueryFactory (value) {
  return {
    product: [ { value, type: 'value', suggested: true } ]
  };
}

function requestMessageFactory (text) {
  return {
    object: 'page',
    entry: [
      { id: '1766837970261548',
        messaging: [
          {
            sender: { id: senderID },
            recipient: { id: '1766837970261548' },
            message: { text }
          }
        ]
      }
    ]
  };
}

function postBackFactory (payload) {
  return {
    object: 'page',
    entry: [
      { id: '1766837970261548',
        messaging: [
          {
            sender: { id: senderID },
            recipient: { id: '1766837970261548' },
            postback: { payload }
          }
        ]
      }
    ]
  };
}

module.exports = {
  writeObjectToFile,
  requestMessageFactory,
  postBackFactory,
  dbQueryFactory,
  hashMyMessage
};
