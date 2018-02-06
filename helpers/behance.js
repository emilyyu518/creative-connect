const request = require('request');
const config = require('../config');

const searchBehance = (query, callback) => {
  const options = {
    method: 'GET',
    url: 'https://api.behance.net/v2/projects',
    data: {
      client_id: config.BEHANCE_API_KEY,
      q: query
    }
  }
  request(options, callback);
};

module.exports.searchBehance = searchBehance;