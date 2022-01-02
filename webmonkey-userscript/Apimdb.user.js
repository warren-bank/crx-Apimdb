// ==UserScript==
// @name         Apimdb
// @description  Redirect API responses to a preferred video host.
// @version      1.1.1
// @match        *://apimdb.net/*
// @match        *://*.apimdb.net/*
// @icon         https://v2.apimdb.net/static/home/images/favicon.png
// @run-at       document-end
// @grant        unsafeWindow
// @homepage     https://github.com/warren-bank/crx-Apimdb/tree/webmonkey-userscript/es5
// @supportURL   https://github.com/warren-bank/crx-Apimdb/issues
// @downloadURL  https://github.com/warren-bank/crx-Apimdb/raw/webmonkey-userscript/es5/webmonkey-userscript/Apimdb.user.js
// @updateURL    https://github.com/warren-bank/crx-Apimdb/raw/webmonkey-userscript/es5/webmonkey-userscript/Apimdb.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// ----------------------------------------------------------------------------- constants

var user_options = {
  "redirect_embedded_iframes": false,
  "redirect_countdown_secs":   5,

  "preferred_video_hosts": [
    "://voe.sx/",
    "/downloadS/voe/",
    "/playS/voe/"
  ]
}

// -----------------------------------------------------------------------------

var should_process_page = function() {
  var path         = unsafeWindow.location.pathname
  var path_allowed = new RegExp('^/(?:e/movie|e/tv|playS|downloadS)/')

  return path_allowed.test(path)
}

var should_process_window = function() {
  var is_top = (unsafeWindow.window === unsafeWindow.top)

  return is_top || user_options.redirect_embedded_iframes
}

var should_redirect = function() {
  return should_process_page() && should_process_window()
}

var process_redirect = function(url) {
  var time_remaining = user_options.redirect_countdown_secs
  var div, cancel_button, ticker, timer

  if (!time_remaining) {
    unsafeWindow.window.location = url
  }
  else {
    div = unsafeWindow.document.createElement('div')
    div.innerHTML = '<button>Cancel</button> page redirect in <span>' + time_remaining + '</span> seconds..'
    cancel_button = div.querySelector('button')
    ticker        = div.querySelector('span')

    cancel_button.addEventListener('click', function(e){
      clearInterval(timer)
      div.style.display = 'none'
    })

    timer = setInterval(
      function(){
        time_remaining--

        if (time_remaining > 0) {
          ticker.innerHTML = '' + time_remaining
        }
        else {
          clearInterval(timer)
          unsafeWindow.window.location = url
        }
      },
      1000
    )

    div.style.position        = 'absolute'
    div.style.top             = '0'
    div.style.right           = '0'
    div.style.padding         = '20px'
    div.style.backgroundColor = '#eee'
    div.style.color           = '#333'

    unsafeWindow.document.body.appendChild(div)
  }
}

var init = function() {
  var urls = []
  var matches, fav, url

  matches = unsafeWindow.document.querySelectorAll('a[href]')
  matches = Array.prototype.slice.call(matches, 0)
  matches = matches.map(function(el){return el.getAttribute('href')})
  urls    = urls.concat(matches)

  matches = unsafeWindow.document.querySelectorAll('div.server[data-src]')
  matches = Array.prototype.slice.call(matches, 0)
  matches = matches.map(function(el){return el.getAttribute('data-src')})
  urls    = urls.concat(matches)

  matches = unsafeWindow.document.querySelectorAll('iframe[allowfullscreen][src]')
  matches = Array.prototype.slice.call(matches, 0)
  matches = matches.map(function(el){return el.getAttribute('src')})
  urls    = urls.concat(matches)

  for (var i1=0; i1 < user_options.preferred_video_hosts.length; i1++) {
    fav = user_options.preferred_video_hosts[i1]

    for (var i2=0; i2 < urls.length; i2++) {
      url = urls[i2]

      if (url.indexOf(fav) !== -1) {
        process_redirect(url)
        return
      }
    }
  }
}

if (should_redirect())
  init()

// -----------------------------------------------------------------------------
