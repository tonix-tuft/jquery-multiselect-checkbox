/*
 * Copyright (c) 2020 Anton Bagdatyev (Tonix-Tuft)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import $ from "jquery";
import jQueryMultiselectCheckbox from "./jQueryMultiselectCheckbox";
import defaultOptions from "./defaultOptions";

/**
 * @typeof {string}
 */
const JQUERY_PLUGIN_NAMESPACE = "multiselectCheckbox";

/**
 * @typeof {Object}
 */
const globalObject =
  typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : this;

/**
 * @typeof {jQuery|undefined}
 */
const package$ = ($ && $.fn && $) || void 0;

/**
 * @typeof {jQuery|undefined}
 */
const globalObject$ =
  (globalObject &&
    ((globalObject.$ && globalObject.$.fn && globalObject.$) ||
      (globalObject.jQuery &&
        globalObject.jQuery.fn &&
        globalObject.jQuery))) ||
  void 0;

/**
 * Initializes the plugin.
 *
 * @param {jQuery} $ jQuery object.
 * @return {undefined}
 */
export default function initPlugin($) {
  const anotherPlugin = $.fn.multiselectCheckbox;
  $.fn.multiselectCheckbox = function multiselectCheckbox(option, ...args) {
    let result;
    this.each((_, element) => {
      const $element = $(element);
      const isDestroy = option === "destroy";
      let plugin = $element.data(JQUERY_PLUGIN_NAMESPACE);

      if (!plugin) {
        if (isDestroy) {
          return;
        }

        const options = $.extend(
          {},
          defaultOptions,
          $element.data(),
          $.isPlainObject(option) && option
        );

        plugin = new jQueryMultiselectCheckbox(
          element,
          options,
          globalObject,
          globalObject.document
        );
        $element.data(JQUERY_PLUGIN_NAMESPACE, plugin);
      }

      if (typeof option === "string") {
        const fn = plugin[option];

        if (typeof fn === "function") {
          result = fn.apply(plugin, args);

          if (result === plugin) {
            result = void 0;
          }

          if (isDestroy) {
            $element.removeData(JQUERY_PLUGIN_NAMESPACE);
          }
        }
      }
    });
    return typeof result !== "undefined" ? result : this;
  };
  $.fn.multiselectCheckbox.Constructor = jQueryMultiselectCheckbox;
  $.fn.multiselectCheckbox.setDefaults = function setDefaults(options) {
    $.extend(defaultOptions, $.isPlainObject(options) && options);
  };
  $.fn.multiselectCheckbox.noConflict = function noConflict() {
    $.fn.multiselectCheckbox = anotherPlugin;
    return $.fn.multiselectCheckbox;
  };
}

(function() {
  package$ && initPlugin(package$);
  if (globalObject$ && globalObject$ !== package$) {
    initPlugin(globalObject$);
  }
})();
