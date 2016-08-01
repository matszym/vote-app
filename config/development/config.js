module.exports = {
  port: 9000,
  mongo: 'mongodb://localhost/vote_app',
  twitter: {
    consumerKey: process.env.VOTE_APP_TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.VOTE_APP_TWITTER_SECRET_KEY,
    callbackURL: 'http://127.0.0.1:9000/auth/twitter/callback'
  },
  sessionSecret: 'Unsecure localhost secret'
}