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

const url = `http://${domain(env)}/newCodeVerySecret`;

const curlServer = vals =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(vals),
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
