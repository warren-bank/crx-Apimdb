### [Apimdb](https://github.com/warren-bank/crx-Apimdb/tree/webmonkey-userscript/es5)

[Userscript](https://github.com/warren-bank/crx-Apimdb/raw/webmonkey-userscript/es5/webmonkey-userscript/Apimdb.user.js) for [apimdb.net](https://v2.apimdb.net/) to run in both:
* the [WebMonkey](https://github.com/warren-bank/Android-WebMonkey) application for Android
* the [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) web browser extension for Chrome/Chromium

Its purpose is to:
* redirect API responses to a preferred video host
  - the user can configure an ordered list of substrings to match against URLs in the API response
  - the page redirects to the first matching URL
  - the page does nothing if there are no matches
* the default list of substrings are configured to only redirect to the video host: [VOE](https://voe.sx/)
  - HLS is available to stream
  - MP4 is available to download
  - [VOE](https://github.com/warren-bank/crx-VOE/tree/webmonkey-userscript/es5) userscript redirects these videos to an external player

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
