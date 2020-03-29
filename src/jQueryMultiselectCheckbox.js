/*
 * Copyright (c) 2020 Anton Bagdatyev (Tonix)
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

import ImmutableLinkedOrderedMap from "immutable-linked-ordered-map";
import checkUncheck from "./helpers/checkUncheck";
import emptyArrayIfNull from "./helpers/emptyArrayIfNull";
import checkForCheckboxAll from "./helpers/checkForCheckboxAll";
import toggle from "./helpers/toggle";

// eslint-disable-next-line no-unused-vars
export default ($, window, document) =>
  // eslint-disable-next-line @typescript-eslint/class-name-casing
  class jQueryMultiselectCheckbox {
    constructor(element, options) {
      this.$el = $(element);
      this.options = options;
      this.selectedMap = new ImmutableLinkedOrderedMap({
        mode: ImmutableLinkedOrderedMap.MODE.LIGHTWEIGHT
      });
      this.selectedRanges = [];
      this.$lastSelected = void 0;
      this.$beforeLastSelected = void 0;
      this.init();
    }

    init() {
      this.options.checkboxes = emptyArrayIfNull(this.options.checkboxes);
      this.options.sync = emptyArrayIfNull(this.options.sync);
      this.initListeners();
    }

    initListeners() {
      const self = this;

      this.selectCheckboxListenerFn = function(e) {
        self.selectCheckboxListener($(this), e);
      };

      this.$el.on("change", function(e) {
        return self.onChangeCheckboxSelectAll($(this), e);
      });
      if (this.options.eventsElement) {
        if (this.options.checkboxes) {
          $(this.options.eventsElement).on(
            "click",
            this.options.checkboxes,
            this.selectCheckboxListenerFn
          );
        }
        if (this.options.sync) {
          $(this.options.eventsElement).on(
            this.options.syncEvent,
            this.options.sync,
            this.selectCheckboxListenerFn
          );
        }
      } else {
        if (this.options.checkboxes) {
          $(this.options.checkboxes).on("click", this.selectCheckboxListenerFn);
        }
        if (this.options.sync) {
          $(this.options.sync).on(
            this.options.syncEvent,
            this.selectCheckboxListenerFn
          );
        }
      }

      $(document).on("mousedown", this.options.sync, function(e) {
        if (e.shiftKey) {
          e.preventDefault();
        }
      });
    }

    uncheckAll() {
      checkUncheck(this.$el, false);
    }

    checkAll() {
      checkUncheck(this.$el, true);
    }

    destroy() {
      this.$el.off("change");
      if (this.options.eventsElement) {
        if (this.options.checkboxes) {
          $(this.options.eventsElement).off(
            "click",
            this.options.checkboxes,
            this.selectCheckboxListenerFn
          );
        }
        if (this.options.sync) {
          $(this.options.eventsElement).off(
            this.options.syncEvent,
            this.options.sync,
            this.selectCheckboxListenerFn
          );
        }
      } else {
        if (this.options.checkboxes) {
          $(this.options.checkboxes).off(
            "click",
            this.selectCheckboxListenerFn
          );
        }
        if (this.options.sync) {
          $(this.options.sync).off(
            this.options.syncEvent,
            this.selectCheckboxListenerFn
          );
        }
      }
    }

    selectCheckboxListener($this, e) {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const $target = $(e.target);
      const $checkbox = $this.is(this.options.checkboxes)
        ? $this
        : this.options.checkboxResolve.call(this, $this);
      const $item = $this.is(this.options.sync)
        ? $this
        : this.options.itemResolve.call(this, $this);
      const targetCheck = $target.is(this.options.checkboxes);
      if (targetCheck) {
        this.options.targetCheckStopPropagation(e);
      }
      const toToggle =
        targetCheck || isCtrl || isShift || this.options.syncEvenWithoutCtrl;
      if (toToggle) {
        toggle.call(this, $, $checkbox, void 0);
        toggle.call(this, $, $item, void 0, isShift);
      }
      checkForCheckboxAll.call(this, $, toToggle);
    }

    // eslint-disable-next-line no-unused-vars
    onChangeCheckboxSelectAll($this, e) {
      const checked = $this.prop("checked");
      const self = this;
      $(this.options.checkboxes).each(function() {
        toggle.call(self, $, $(this), checked);
      });
      $(this.options.sync).each(function() {
        toggle.call(self, $, $(this), checked);
      });

      if (!checked) {
        this.selectedMap = this.selectedMap.empty();
        this.selectedRanges = [];
        this.options.onAllUnchecked();
      } else {
        this.options.onAllChecked();
      }
    }
  };
