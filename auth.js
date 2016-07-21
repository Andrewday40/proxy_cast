var secret = require('./config').secret;
function authorize(req, res, next){
  console.log(req.headers);
  if(req.headers.passphrase !== secret){
    res.status(403).json({
      msg: "You didn't say the magic word"
    });
  } else {
    next();
  }
}

module.exports = authorize;
