// ==UserScript==
// @name         Apimdb
// @description  Rewrite API response as a listing of all available video hosts.
// @version      2.0.0
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

// ----------------------------------------------------------------------------- helpers

var cancel_event = function(event){
  event.stopPropagation();event.stopImmediatePropagation();event.preventDefault();event.returnValue=false;
}

// ----------------------------------------------------------------------------- URL redirect

var redirect_to_url = function(url, current_window_only) {
  if (!url) return

  if (typeof GM_loadUrl === 'function') {
    if (typeof GM_resolveUrl === 'function')
      url = GM_resolveUrl(url, unsafeWindow.location.href) || url

    GM_loadUrl(url, 'Referer', unsafeWindow.location.href)
  }
  else {
    try {
      if (current_window_only) throw ''

      unsafeWindow.top.location = url
    }
    catch(e) {
      unsafeWindow.window.location = url
    }
  }
}

// ----------------------------------------------------------------------------- rewrite page content

var rewrite_api_dom = function(hosts) {
  var use_iframe, html, $iframe, $select

  use_iframe = (typeof GM_loadUrl !== 'function')

  html = []
  html.push('<style>')
  html.push('  select                  {display: inline-block}')
  html.push('  select + select         {margin-left: 1em}')
  html.push('  select, select > option {text-transform: capitalize}')
  html.push('</style>')
  html.push('<div>')
  if (hosts.iframe_player_page.length)
    html.push('<select id="iframe_player_page"></select>')
  if (hosts.video_host_redirect_page.length)
    html.push('<select id="video_host_redirect_page"></select>')
  html.push('</div>')
  if (use_iframe)
    html.push('<div><iframe src="about:blank" width="100%" height="600" scrolling="no" frameborder="0" src="" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></div>')

  unsafeWindow.document.close()
  unsafeWindow.document.open()
  unsafeWindow.document.write(html.join("\n"))
  unsafeWindow.document.close()
  html = null

  if (use_iframe)
    $iframe = unsafeWindow.document.querySelector('iframe')

  if (hosts.iframe_player_page.length) {
    $select = unsafeWindow.document.querySelector('select#iframe_player_page')

    populate_select_options($select, 'Play from Video Host:', hosts.iframe_player_page)
    attach_select_listener($select, $iframe)
  }

  if (hosts.video_host_redirect_page.length) {
    $select = unsafeWindow.document.querySelector('select#video_host_redirect_page')

    populate_select_options($select, 'Download from Video Host:', hosts.video_host_redirect_page)
    attach_select_listener($select, $iframe)
  }
}

var populate_select_options = function($select, title, hosts) {
  var html

  html = []
  html.push('<option value="">' + title + '</option>')
  for (var i=0; i < hosts.length; i++) {
    html.push('<option value="' + hosts[i].url + '">' + hosts[i].name + '</option>')
  }
  $select.innerHTML = html.join("\n")
}

var attach_select_listener = function($select, $iframe) {
  $select.addEventListener('change', function(event){
    cancel_event(event)
    var video_host_url = $select.value

    if ($iframe)
      $iframe.setAttribute('src', video_host_url)
    else
      redirect_to_url(video_host_url)
  })
}

// ----------------------------------------------------------------------------- process page types

var process_api_response_page = function() {
  var matches

  var hosts = {
    "iframe_player_page":       [],
    "video_host_redirect_page": []
  }

  matches = unsafeWindow.document.querySelectorAll('.servers-list > .server[data-src]')
  matches = Array.prototype.slice.call(matches, 0)
  matches = matches.map(function(el){
    var name, url

    name = (el.innerText || el.innerHTML).trim().toLowerCase()
    url  = el.getAttribute('data-src')
    return {name:name, url:url}
  })
  hosts.iframe_player_page = matches

  matches = unsafeWindow.document.querySelectorAll('.download-list > .download-link > a[href]')
  matches = Array.prototype.slice.call(matches, 0)
  matches = matches.map(function(el){
    var name, url

    name = (el.innerText || el.innerHTML).trim().toLowerCase()
    url  = el.getAttribute('href')
    return {name:name, url:url}
  })
  hosts.video_host_redirect_page = matches

  if (hosts.iframe_player_page.length || hosts.video_host_redirect_page.length)
    rewrite_api_dom(hosts)
}

var process_iframe_player_page = function() {
  var el, url

  el = unsafeWindow.document.querySelector('iframe[allowfullscreen][src]')
  if (!el) return

  url = el.getAttribute('src')
  redirect_to_url(url, true)
}

var process_video_host_redirect_page = function() {
  var el, url

  el = unsafeWindow.document.querySelector('a[href]')
  if (!el) return

  url = el.getAttribute('href')
  redirect_to_url(url, true)
}

// ----------------------------------------------------------------------------- bootstrap

var is_api_response_page        = (unsafeWindow.location.pathname.indexOf('/e/')         === 0)
var is_iframe_player_page       = (unsafeWindow.location.pathname.indexOf('/playS/')     === 0)
var is_video_host_redirect_page = (unsafeWindow.location.pathname.indexOf('/downloadS/') === 0)

var init = function() {
  if (is_api_response_page)
    return process_api_response_page()

  if (is_iframe_player_page)
    return process_iframe_player_page()

  if (is_video_host_redirect_page)
    return process_video_host_redirect_page()
}

init()

// -----------------------------------------------------------------------------
