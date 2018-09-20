#!/usr/bin/env node
var program = require('commander');
const Twitter = require('twitter');
const Finder = require('find-rss');
const Builder = require('xmlbuilder');
const fs = require('fs');

 const app = {
  _client: null,
  _verboseLogging: true,

  init: function() {
    if (!process.env.TWITTER_CONSUMER_KEY 
        || !process.env.TWITTER_CONSUMER_SECRET
        || !process.env.TWITTER_ACCESS_TOKEN_KEY
        || !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
      
      
          console.log("Please setup an environment variables called:\nTWITTER_CONSUMER_KEY\nTWITTER_CONSUMER_SECRET\nTWITTER_ACCESS_TOKEN_KEY\nTWITTER_ACCESS_TOKEN_SECRET that holds your Twitter details");
          return;
    }

    let outputFile = "";
    program
    .name("twitterBlogFeeds")
    .description("Produces an OPML file of all your twitter friend's blog rss feeds" )
    .arguments('<file>')
    .option('-n, --screen-name [value]', 'twitter screen name (handle)', 'rolivercoffee')
    .option('-v, --verbose', 'verbose logging', false)
    .action(function (file) {
      outputFile = file;
    })
    .parse(process.argv);

    const screenName = program.screenName ? program.screenName : "rolivercoffee";
    if (screenName.charAt(0) === '@')  screenName = screenName.substring(1);

    if (!outputFile) {
      console.log();
      console.log("-".repeat(40));
      console.log("Please specify an output file name e.g. MyTwitterFriendsBlogFeeds.opml");
      console.log();
      program.help();
    }

    this._verboseLogging = program.verbose ? program.verbose : false;
    

    this.setup();

    this.buildOpml(screenName).then(opml => fs.writeFileSync(outputFile, opml, 'utf8'));
  },

  setup : function(){
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
  },

  buildOpml : async function(screenName) {
    const outlines = await this.getOutlines(screenName);

    var opml = Builder.create("opml", { encoding: 'utf-8' })
                      .att({"version":"1.0"})
                      .ele("head")
                        .ele("title", screenName + "'s Twitter friends")
                      .up().up()
                      .ele("body");

    outlines.forEach(outline => { 
                                  row = Builder.create('outline');
                                  Object.entries(outline).forEach(([key, value]) => { if (value) row.att(key,value) });
                                  opml.importDocument(row); 
                                }
                    );

    var file = opml.end({pretty: true});

    return file;
  },

  getOutlines: async function(screenName) {
    let allOutlines = [];
    let cursor;
    do{ 
      let batchOfFriends = await this.getAllFriendsChunked(screenName, cursor);
      cursor = batchOfFriends.cursor || "0";
      if (this._verboseLogging) console.log("fetched " + batchOfFriends.friends.length + " friend(s)");

      let batchOfFeeds = await this.getFeedsForFriends(batchOfFriends.friends);
      let batchOfOutlines = batchOfFeeds.reduce((acc, feed) => acc.concat(feed), [])
                                          .map(feed => this.mapFeedToOutline(feed))
                                          .filter(feed => feed);

      if (this._verboseLogging) console.log("fetched " + batchOfOutlines.length + " feed(s)");
      allOutlines.push.apply(allOutlines, batchOfOutlines);
    }  while (cursor !== "0");

    return allOutlines;
  },

  getAllFriendsChunked: async function(screenName, cursor) {
    let params = {
      screen_name: screenName,
      cursor: cursor,
      count: 200,
      skip_status: true,
      include_user_entities: true,
    };

    //try {
      let result = await _client.get('friends/list', params);
    //}
    //catch(error) {
    //  console.log(error);
    //}

    return { "friends" : result.users, "cursor": result.next_cursor_str };
  },

  // sleep: function sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // },

  getFeedsForFriends: async function(friends) {
    const feeds = await Promise.all(friends.filter(friend => friend.url)
                                           .map(friend => this.getFeedForFriend(friend)))
                               .then(f => results = f);

    return feeds.filter(feed => feed && feed.length > 0);
  },

  getFeedForFriend: async function(friend) {
     if (this._verboseLogging) process.stdout.write("finding feed for \x1b[33m" + friend.screen_name + "\x1b[0m at \x1b[33m" + friend.url + "\x1b[0m");
     try {
      let feeds = await Finder(friend.url)
      if (this._verboseLogging) process.stdout.write("\x1b[32m found " + (feeds ? feeds.length  : 0) + " feed(s) \x1b[0m\n");
      return feeds;
     }
     catch(error) {
      if (this._verboseLogging) process.stdout.write("\x1b[31m failed because:\x1b[0m\n " + error.message + "\n");
     }
  },

  mapFeedToOutline: function(feed) {
    const outline = {
      text: feed.title,
      description: feed.description,
      htmlUrl: feed.link,
      language: feed.language,
      title: feed.title,
      type: feed["#type"],
      version: feed["#version"],
      xmlUrl: feed.url || feed.xmlurl || feed.xmlUrl
    };

    return (outline.xmlUrl ? outline : null);
  }
};


app.init();
