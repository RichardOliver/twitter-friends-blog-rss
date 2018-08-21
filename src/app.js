import Twitter from 'twitter';
import Finder from 'find-rss';

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var urls = [];
var params = {
                screen_name: '',
                cursor: -1,
                count: 20,
                skip_status: true,
                include_user_entities: true,
             };

client.get('friends/list', params, function(error, users, response) {
  if (!error) {
    users.users.forEach(function(user){
        slimUser = (({ screen_name, url }) => ({ screen_name, url }))(user)
        console.log(slimUser);
    });
  }
  else { console.log(error); }
});