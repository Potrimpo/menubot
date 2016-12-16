const fetch = require('node-fetch');

const env = process.argv[2],
      key = process.argv[3],
      password = process.argv[4];

const domain = env => {
  switch (env) {
    case 'dev':
      return 'menubot.ngrok.io';
    case 'prod':
      return 'suss.nz';
    default:
      return env;
  }
};

// url has to be https in order to work on server. Probably nginx filtering out non-https POSTs
const url = `https://${domain(env)}/newCodeVerySecret`;

const curlServer = body =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });

const postCode = (key, password) =>
  curlServer({key, password})
    .then(_ => {
      console.log("successful!");
      console.log(`code: ${key}-${password}`);
    })
    .catch(_ => console.error('failed to insert'));

postCode(key, password);
