const jwt = require('jsonwebtoken');
const KEY = require('./server.config');

const secret = KEY.secretOfKey;
const withAuth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;
  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }
    req.email = decoded.email;
    return next();
  });
};
module.exports = withAuth;