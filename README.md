# fbot

A simple Facebook messenger bot. Records chat history (not message contents) and provides useful functionality such as returning user statistics. Built using Node, Facebook-chat-api, Node-canvas, and a ChartJS wrapper for Node-canvas.

## Commands
* `$` || `$help` responds with message describing all commands available to users, and corresponding examples.
* `$stats <target>` responds with individual user statistics. Dataset includes messages sent and reactions (sent and received).
* `$stats <target> draw` responds with group chart, or individual user chart if valid target is provided.

## Features
__Current Features:__
* Accept commands using `$<command> [target] [options]`.
* Record thread history (since bot invitation), then process each message and update data model. Process occurs on startup, on each bot command.
* Return user statistics.
* Return server rendered chart image of group statistics.

__Planned Features:__
* Return server rendered chart of specific statistics and individual user data sets.
* Reminder function that will send a message containing a reminder to chat on time condition. The reminder is written by the user who sets the command.

## Example graph 
Below shows user's total share of messages in group chat and the exact timestamp of the chart creation. Invoked by using `$stats draw`. The graph will be improved upon to make information more concise and visually appealing.
![Example Graph](https://i.imgur.com/5OzVv6S.png)
