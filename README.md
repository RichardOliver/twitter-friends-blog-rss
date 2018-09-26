# Twitter Blog Feeds

A command line tool to generate an OPML file of your twitter friends blog feeds

The tool loops through all the accounts that are being followed, checking of their profiles for a URL.
Each of these URLs are checked for RSS or atom feeds and those feeds are collated into an OPML file.

## Installation
`npm install twitter-friends-blog-rss`

## Quick Start
The script requires you to set up the following four environment variables:

```
  TWITTER_CONSUMER_KEY
  TWITTER_CONSUMER_SECRET
  TWITTER_ACCESS_TOKEN_KEY
  TWITTER_ACCESS_TOKEN_SECRET
```

These variables need to be populated with your twitter access tokens.
To get your access tokens you'll need a [Twitter Developer account] (https://developer.twitter.com/en/dashboard)
Then to access your keys set up an app in [Twitter Apps] (https://apps.twitter.com/) 

Once the script is installed and the environment variables have been set up 
you simply need to run `twitterBlogFeeds` from the command line.
