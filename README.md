### [Apimdb](https://github.com/warren-bank/crx-Apimdb/tree/webmonkey-userscript/es5)

[Userscript](https://github.com/warren-bank/crx-Apimdb/raw/webmonkey-userscript/es5/webmonkey-userscript/Apimdb.user.js) for [apimdb.net](https://v2.apimdb.net/) to run in both:
* the [WebMonkey](https://github.com/warren-bank/Android-WebMonkey) application for Android
* the [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) web browser extension for Chrome/Chromium

Its purpose is to:
* redirect API responses to a preferred video host
  - the user can configure an ordered list of substrings to match against URLs in the API response
  - the page redirects to the first matching URL
  - the page does nothing if there are no matches
* the default list of substrings are configured to only redirect to the video hosts:
  1. [VOE](https://voe.sx/)
     - format: HLS and MP4
     - protection: none
     - userscript: [crx-VOE](https://github.com/warren-bank/crx-VOE/tree/webmonkey-userscript/es5) redirects videos to an external player
  2. [DoodStream](https://doodstream.com/)
     - format: MP4
     - protection: none
     - userscript: [crx-DoodStream](https://github.com/warren-bank/crx-DoodStream/tree/webmonkey-userscript/es5) redirects videos to an external player
  3. [MixDrop](https://mixdrop.co/)
     - format: MP4
     - protection: `Referer` header
     - userscript: [crx-MixDrop](https://github.com/warren-bank/crx-MixDrop/tree/webmonkey-userscript/es5) redirects videos to an external player
  4. [Vidcloud](https://vidembed.io/)
     - format: MP4
     - protection: none
     - userscript: [crx-Vidcloud](https://github.com/warren-bank/crx-Vidcloud/tree/webmonkey-userscript/es5) redirects videos to an external player

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
