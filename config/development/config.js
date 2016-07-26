module.exports = {
  port: 9000,
  mongo: 'mongodb://localhost/vote_app',
  twitter: {
    consumerKey: process.env.VOTE_APP_TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.VOTE_APP_TWITTER_CONSUMER_SECRET
  }
}