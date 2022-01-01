// ==UserScript==
// @name         Apimdb
// @description  Redirect API responses to a preferred video host.
// @version      1.0.0
// @match        *://apimdb.net/e/movie/*
// @match        *://*.apimdb.net/e/movie/*
// @match        *://apimdb.net/e/tv/*
// @match        *://*.apimdb.net/e/tv/*
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

  "preferred_video_hosts": [
    "/downloadS/voe/",
    "/playS/voe/"
  ]
}

// -----------------------------------------------------------------------------

var should_redirect = function() {
  var is_top = (unsafeWindow.window === unsafeWindow.top)

  return is_top || user_options.redirect_embedded_iframes
}

var init = function() {
  var urls = []
  var matches, fav, url

  matches = unsafeWindow.document.querySelectorAll('a[href^="/downloadS/"]')
  matches = Array.prototype.slice.call(matches, 0)
  matches = matches.map(function(el){return el.getAttribute('href')})
  urls    = urls.concat(matches)

  matches = unsafeWindow.document.querySelectorAll('div.server[data-src^="/playS/"]')
  matches = Array.prototype.slice.call(matches, 0)
  matches = matches.map(function(el){return el.getAttribute('data-src')})
  urls    = urls.concat(matches)

  for (var i1=0; i1 < user_options.preferred_video_hosts.length; i1++) {
    fav = user_options.preferred_video_hosts[i1]

    for (var i2=0; i2 < urls.length; i2++) {
      url = urls[i2]

      if (url.indexOf(fav) !== -1) {
        unsafeWindow.window.location = url
        return
      }
    }
  }
}

if (should_redirect())
  init()

// -----------------------------------------------------------------------------
