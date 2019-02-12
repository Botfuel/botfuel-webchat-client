/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */

// @win window reference
// @fn function reference
function DOMLoaded(win, fn) {
  let done = false;
  let top = true;

  const doc = win.document;
  const root = doc.documentElement;
  const modern = doc.addEventListener;

  const add = modern ? 'addEventListener' : 'attachEvent';
  const rem = modern ? 'removeEventListener' : 'detachEvent';
  const pre = modern ? '' : 'on';

  const init = (e) => {
    if (e.type === 'readystatechange' && doc.readyState !== 'complete') return;
    // assign event to relevant node
    (e.type === 'load' ? win : doc)[rem](pre + e.type, init, false);
    if (!done) {
      done = true;
      fn.call(win, e.type || e);
    }
  };

  const poll = () => {
    try {
      root.doScroll('left');
    } catch (e) {
      setTimeout(poll, 50);
      return;
    }
    init('poll');
  };

  if (doc.readyState === 'complete') {
    fn.call(win, 'lazy');
  } else {
    if (!modern && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (e) { /* eslint-disable-line */ }
      if (top) poll();
    }
    doc[add](`${pre}DOMContentLoaded`, init, false);
    doc[add](`${pre}readystatechange`, init, false);
    win[add](`${pre}load`, init, false);
  }
}

module.exports = DOMLoaded;
