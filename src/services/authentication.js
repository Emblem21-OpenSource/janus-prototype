var TokenGenerator = require('janus-token');

var trainingData = [
  { input: { userAgent: 1,    language: 1, referer: 1, requestData: 0 }, output: { integrity: 1 } },
  { input: { userAgent: 0.5,  language: 1, referer: 1, requestData: 0 }, output: { integrity: 0.25 } },
  { input: { userAgent: 0.25, language: 1, referer: 1, requestData: 0 }, output: { integrity: 0.1 } },
  { input: { userAgent: 1,    language: 1, referer: 1, requestData: 0.02 }, output: { integrity: 0.9 } },
  { input: { userAgent: 1,    language: 1, referer: 1, requestData: 0.15 }, output: { integrity: 0.75 } },
  { input: { userAgent: 1,    language: 1, referer: 1, requestData: 0.29 }, output: { integrity: 0.25 } },
  { input: { userAgent: 0.5,  language: 1, referer: 1, requestData: 0.02 }, output: { integrity: 0.10 } },
  { input: { userAgent: 0.5,  language: 1, referer: 1, requestData: 0.15 }, output: { integrity: 0.05 } },
  { input: { userAgent: 0.5,  language: 1, referer: 1, requestData: 0.29 }, output: { integrity: 0.01 } },
  { input: { userAgent: 0.25, language: 1, referer: 1, requestData: 0.02 }, output: { integrity: 0.01 } },
  { input: { userAgent: 0.25, language: 1, referer: 1, requestData: 0.15 }, output: { integrity: 0.001 } },
  { input: { userAgent: 0.25, language: 1, referer: 1, requestData: 0.29 }, output: { integrity: 0.0001 } },
  { input: { userAgent: 1,    language: 0, referer: 1, requestData: 0 }, output: { integrity: 0.001 } },
  { input: { userAgent: 1,    language: 1, referer: 0, requestData: 0 }, output: { integrity: 0.001 } }
];

module.exports = new TokenGenerator(trainingData, Config.api.jwt.secret, Config.api.jwt.issuer, Config.api.jwt.audience);