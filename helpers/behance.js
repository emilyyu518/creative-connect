const request = require('request');
const qs = require('querystring');

const searchBehance = (query, callback) => {
  const options = {
    method: 'GET',
    url: 'https://api.behance.net/v2/projects',
    qs: {
      client_id: process.env.BEHANCE_API_KEY,
      q: query
    }
  }
  request(options, callback);
};

module.exports.searchBehance = searchBehance;