const fetch = require('node-fetch');

const allowCors = (fn) => async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=86400');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

module.exports = allowCors((_, res) => {
  const { BUTTONDOWN_API_KEY = '' } = process.env;

  const options = {
    headers: {
      Authorization: `Token ${BUTTONDOWN_API_KEY}`,
    },
  };

  fetch(`https://api.buttondown.email/v1/subscribers`, options)
    .then((response) => response.json())
    .then(({ count = '' }) => {
      res.json({ total: count });
    })
    .catch((error) => {
      res.json({ total: 0, message: 'Error occuried while fetching the subscribers count.', error });
    });
});
