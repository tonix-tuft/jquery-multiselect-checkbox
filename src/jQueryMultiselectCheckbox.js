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

import ImmutableLinkedOrderedMap from "immutable-linked-ordered-map";
import checkUncheck from "./helpers/checkUncheck";
import emptyArrayIfNull from "./helpers/emptyArrayIfNull";
import checkForCheckboxAll from "./helpers/checkForCheckboxAll";
import handleShift from "./helpers/handleShift";
import setSelectedUniqueKey from "./helpers/setSelectedUniqueKey";
import extendMap from "./helpers/extendMap";

// eslint-disable-next-line no-unused-vars
export default ($, window, document) =>
  // eslint-disable-next-line @typescript-eslint/class-name-casing
  class jQueryMultiselectCheckbox {
    constructor(element, options) {
      this.$el = $(element);
      this.options = options;
      this.selectedMap = extendMap(
        new ImmutableLinkedOrderedMap({
          mode: ImmutableLinkedOrderedMap.MODE.LIGHTWEIGHT
        })
      );
      this.selectedRanges = [];
      this.$lastSelected = void 0;
      this.$beforeLastSelected = void 0;
      this.init();
    }

    init() {
      this.options.checkboxes = emptyArrayIfNull(this.options.checkboxes);
      this.options.sync = emptyArrayIfNull(this.options.sync);
      this.initListeners();
      this.initState();
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

    initState() {
      if (this.$el.prop("checked")) {
        this.checkAll();
      } else {
        const $checkboxes = $(this.options.checkboxes);
        const $checked = $checkboxes.filter(":checked");
        if ($checkboxes.length === $checked.length) {
          this.checkAll();
        } else if ($checked.length) {
          $checked.each(function() {
            $(this).click();
          });
        }
      }
    }

    uncheckAll() {
      checkUncheck(this.$el, false, this);
    }

    checkAll() {
      checkUncheck(this.$el, true, this);
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
        : this.options.checkboxResolve($this, this);
      const $item = $this.is(this.options.sync)
        ? $this
        : this.options.itemResolve($this, this);
      const targetCheck = $target.is(this.options.checkboxes);
      if (targetCheck) {
        this.options.targetCheckStopPropagation(e, this);
      }
      const toToggle =
        targetCheck || isCtrl || isShift || this.options.syncEvenWithoutCtrl;
      if (toToggle) {
        this.toggle($, $checkbox, void 0);
        this.toggle($, $item, void 0, isShift);
      }
      checkForCheckboxAll($, toToggle, this);
    }

    // eslint-disable-next-line no-unused-vars
    onChangeCheckboxSelectAll($this, e) {
      const checked = $this.prop("checked");
      const self = this;
      $(this.options.checkboxes).each(function() {
        self.toggle($, $(this), checked);
      });
      $(this.options.sync).each(function() {
        self.toggle($, $(this), checked);
      });

      if (!checked) {
        this.selectedMap = extendMap(this.selectedMap.empty());
        this.selectedRanges = [];
        this.options.onAllUnchecked(this.selectedMap);
      } else {
        this.options.onAllChecked(this.selectedMap);
      }
    }

    toggle($, $el, force, isShift) {
      if ($el.hasClass(this.options.checkedClassName)) {
        if (force !== true) {
          $el.removeClass(this.options.checkedClassName);
          if ($el.is(this.options.checkboxes)) {
            $el.prop("checked", false);
            const checkedKey = $el.data(
              this.options.checkedKeyDataAttributeName
            );
            if (this.selectedMap.get(checkedKey)) {
              this.selectedMap = extendMap(this.selectedMap.unset(checkedKey));
            }
          }
        }
      } else {
        if (force === true || typeof force === "undefined") {
          $el.addClass(this.options.checkedClassName);
          if ($el.is(this.options.checkboxes)) {
            $el.prop("checked", true);
            setSelectedUniqueKey($el, this);
          }
          this.$beforeLastSelected = this.$lastSelected;
          this.$lastSelected = $el;
        }
      }

      if (
        isShift &&
        (($el.is(this.options.checkboxes) &&
          this.options.handleShiftForCheckbox) ||
          (!$el.is(this.options.checkboxes) &&
            !this.options.handleShiftForCheckbox))
      ) {
        handleShift($, $el, this);
      }
    }
  };
