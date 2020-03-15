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

import setSelectedUniqueId from "./setSelectedUniqueId";
import handleShift from "./handleShift";

export default function toggle($, $el, force, isShift) {
  if ($el.hasClass(this.options.checkedClassName)) {
    if (force !== true) {
      $el.removeClass(this.options.checkedClassName);
      if ($el.is(this.options.checkboxes)) {
        $el.prop("checked", false);
        const itemId = $el.data(this.options.checkedIdDataAttributeName);
        if (this.selectedMap.get(itemId)) {
          this.selectedMap = this.selectedMap.unset(itemId);
        }
      }
    }
  } else {
    if (force === true || typeof force === "undefined") {
      $el.addClass(this.options.checkedClassName);
      if ($el.is(this.options.checkboxes)) {
        $el.prop("checked", true);
        setSelectedUniqueId.call(this, $el);
      }
      this.$beforeLastSelected = this.$lastSelected;
      this.$lastSelected = $el;
    }
  }

  if (
    isShift &&
    (($el.is(this.options.checkboxes) && this.options.handleShiftForCheckbox) ||
      (!$el.is(this.options.checkboxes) &&
        !this.options.handleShiftForCheckbox))
  ) {
    handleShift.call(this, $, $el);
  }
}
