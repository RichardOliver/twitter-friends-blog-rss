var Twitter = require('twitter');
var Finder = require('find-rss');

 const app = {
  _client: null,
  _screenName: "",
  _urls: [],

  init: function(screenName) {
    _client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    Finder.setOptions({
      favicon: false,
      getDetail: true
    });

    _screenName = screenName;
    this.getFriends(_screenName, "-1")
  },

  getFriends: function(screenName, cursor) {
    let params = {
      screen_name: screenName,
      cursor: cursor,
      count: 20,
      skip_status: true,
      include_user_entities: true,
    };

    _client.get('friends/list', params, this.processFriends.bind(this));
  },

  processFriends: function(error, results, response) {
    if (!error) {
      let that = this;
      results.users.forEach(function(user){
          //slimUser = (({ screen_name, url }) => ({ screen_name, url }))(user)
          //console.log(slimUser);
          if (user.url != null) {
            that.getFeeds(user.url);
          }
      });

      if (results.next_cursor_str !== "0"){
        this.getFriends(_screenName, results.next_cursor_str);
      }
    }
    else {
      console.log(error); 
    }

  },

  getFeeds: function(url) {
    Finder(url, this.processFeeds.bind(this));
  },

  processFeeds(error, response, body) {
    console.log("----------------------------");

    if (!error) {
      console.log(response);
    }
    else {
      console.log(error); 
    }
  }


};

app.init('rolivercoffee');