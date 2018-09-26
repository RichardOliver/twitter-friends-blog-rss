# Twitter Blog Feeds

A command line tool to generate an [OPML](https://en.wikipedia.org/wiki/OPML) file of your twitter friends blog feeds

The tool loops through all the accounts that are being followed, checking their profiles for a URL. 
Each of these URLs are checked for RSS or atom feeds and those feeds are collated into an OPML file.

Note: Whilst OMPL is quite an old format modern RSS readers should still be able to import these files.

## Installation
`npm install twitter-friends-blog-rss`

## Quick Start
The script requires you to set up the following four operating system environment variables:

```
  TWITTER_CONSUMER_KEY
  TWITTER_CONSUMER_SECRET
  TWITTER_ACCESS_TOKEN_KEY
  TWITTER_ACCESS_TOKEN_SECRET
```

These variables need to be populated with your twitter access tokens. 
To get your access tokens you'll need to get a [Twitter Developer account](https://developer.twitter.com/en/dashboard)
Then to access your keys set up an app in [Twitter Apps](https://apps.twitter.com/) 

(Note: This application uses twitter's User based authentication.)

Once the script is installed and the environment variables have been set up 
you simply need to run `twitterBlogFeeds` from the command line.

## Usage 
```
twitterBlogFeeds [options] <file>

Produces an OPML file of all your twitter friend's blog rss feeds

Options:

  -n, --screen-name [value]  twitter screen name (handle) (default: rolivercoffee)
  -v, --verbose              verbose logging
  -h, --help                 output usage information
  ```

  As a minimum you must supply a file name preferably with an `.opml` extension.  
  whilst it's not required it's probably useful to provide a screen-name too!
  
  Note: the screen-name option is your twitter handle (without the leading `@` character)

 #### Basic example:
  `twitterBlogFeeds -n rolivercoffee MyTwitterFriendsBlogFeeds.opml` 
  This command will retrieve all the rss feeds for all the accounts with urls & rss feeds that @rolivercoffee is following and store the rss feeds in the `MyTwitterFriendsBlogFeeds.opml` file.


 #### Verbose logging example:.
  `twitterBlogFeeds -v -n rolivercoffee MyTwitterFriendsBlogFeeds.opml` 
The `-v` or `--verbose` command allows you to _see_ what the program is _up to_.  
This is helpful because it can often take quite some time to run through all the accounts.

  
 #### Help example:
  `twitterBlogFeeds --help` 
The `-h` or `--help` allows you to see a list of the command line options.
