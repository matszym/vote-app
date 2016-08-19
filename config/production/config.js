module.exports = {
  port: process.env.PORT,
  domain: 'voting-app-matszym.herokuapp.com',
  mongo: process.env.MONGODB_URI,
  twitter: {
    consumerKey: process.env.VOTE_APP_TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.VOTE_APP_TWITTER_SECRET_KEY,
    callbackURL: 'https://' + 'voting-app-matszym.herokuapp.com/auth/twitter/callback'
  },
  sessionSecret: process.env.SESSION_SECRET
}