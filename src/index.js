/*
 * Copyright (c) 2021 Anton Bagdatyev (Tonix)
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
import jQueryMultiselectCheckboxFactory from "./jQueryMultiselectCheckbox";
import defaultOptionsFactory from "./defaultOptions";

/**
 * @type {string}
 */
const JQUERY_PLUGIN_NAMESPACE = "multiselectCheckbox";

/**
 * @type {Object}
 */
const globalObject = typeof global !== "undefined" ? global : window;

/**
 * @type {jQuery|undefined}
 */
const package$ = ($ && $.fn && $) || void 0;

/**
 * @type {Function}
 */
const initPluginID = (() => {
  let nextInitPluginID = 0;
  return $ => {
    if (!$.fn.multiselectCheckboxInitPluginID) {
      nextInitPluginID++;
      $.fn.multiselectCheckboxInitPluginID = nextInitPluginID;
    }
    return $.fn.multiselectCheckboxInitPluginID;
  };
})();

/**
 * @type {Object}
 */
const pluginIDMap = {};

/**
 * Initializes the plugin.
 *
 * @param {jQuery} $ jQuery.
 * @return {undefined}
 */
export default function initPlugin($) {
  const anotherPlugin = $.fn.multiselectCheckbox;
  const anotherInitPluginID = $.fn.multiselectCheckboxInitPluginID;
  const pluginID = initPluginID($);
  pluginIDMap[pluginID] = pluginIDMap[pluginID]
    ? pluginIDMap[pluginID]
    : {
        defaultOptions: defaultOptionsFactory(
          $,
          globalObject,
          globalObject.document
        ),
        jQueryMultiselectCheckbox: jQueryMultiselectCheckboxFactory(
          $,
          globalObject,
          globalObject.document
        ),
      };
  const { defaultOptions, jQueryMultiselectCheckbox } = pluginIDMap[pluginID];
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

        plugin = new jQueryMultiselectCheckbox(element, options);
        $element.data(JQUERY_PLUGIN_NAMESPACE, plugin);
      }

      if (typeof option === "string") {
        const fn = plugin[option];
        if (typeof fn === "function") {
          result = fn.apply(plugin, args);

          if (result === plugin) {
            result = void 0;
          }
        }
        if (isDestroy) {
          $element.removeData(JQUERY_PLUGIN_NAMESPACE);
        }
      }
    });
    return typeof result !== "undefined" ? result : this;
  };
  $.fn.multiselectCheckbox.Constructor = jQueryMultiselectCheckbox;
  $.fn.multiselectCheckbox.setDefaults = function setDefaults(optionsFactory) {
    const options =
      typeof optionsFactory === "function"
        ? optionsFactory($, globalObject, globalObject.document)
        : optionsFactory;
    $.extend(defaultOptions, $.isPlainObject(options) && options);
  };
  $.fn.multiselectCheckbox.noConflict = function noConflict() {
    $.fn.multiselectCheckbox = anotherPlugin;
    $.fn.multiselectCheckboxInitPluginID = anotherInitPluginID;
    return $.fn.multiselectCheckbox;
  };
}

package$ && initPlugin(package$);
