# Rabbit Hole
### Brendan Berkman and Kevin King
### Spring 2022

## Video Example

https://user-images.githubusercontent.com/41310726/167762572-bb734e97-0ac4-4cf8-9659-86baf1aad1bd.mov

## Description

We developed a web application that allows users to go down a "rabbit hole" of information on a selected topic. When the user makes a search request, they will be provided with an Article Synopsis that details a little bit about their search term and two additional topics to click on for their corresponding synopses. The suggestions allow users to continue to explore new topics and information without end!

## MediaWiki Action API 

This API takes your search term and provides suggestions on additional topics to cater to a user's curiosity. 

## OpenAI API

The OpenAI API uses the search topic and returns a synopsis detailing important information on that term. 

## OpenAI API Key

Because OpenAI requires a review process for web applications using their API, the site is not currently approved for deployment. 

In the meantime, please visit the following URL to obtain an OpenAI API key, so you can run the program on your own: https://openai.com/api/.

From there, clone the `wiki-app` repository and plug in your API key within the quotation marks on line 8 of `App.js`. 

## Instructions to run

In your command-line window, type the following: 

```bash
npm start
```
