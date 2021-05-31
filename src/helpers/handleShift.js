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

import nextUntil from "./nextUntil";
import prevUntil from "./prevUntil";

export default function handleShift($, $el, instance) {
  const self = instance;
  const prevUntilNextUntil = {
    prev: self.options.prev,
    next: self.options.next
  };
  let $itemsCheckboxes;

  if (!self.options.usePrevUntilNextUntilForSync) {
    // checkbox
    $itemsCheckboxes = $(self.options.checkboxes);
  } else {
    // synced item
    $itemsCheckboxes = $(self.options.sync);
    prevUntilNextUntil.prev = prevUntil;
    prevUntilNextUntil.next = nextUntil;
  }

  if (
    $itemsCheckboxes.filter(`.${self.options.checkedClassName}`).length <= 1
  ) {
    return;
  }

  const selected = $el.hasClass(self.options.checkedClassName);
  const itemsSelected = self.selectedMap.values();
  if (selected && self.selectedMap.length > 1) {
    // `$prevSelected` is always a checkbox here if `self.options.usePrevUntilNextUntilForSync` is false.
    const $prevSelected = !self.options.usePrevUntilNextUntilForSync
      ? ($el.is(self.options.sync)
          ? ($el = self.options.checkboxResolve($el, self)) && void 0
          : void 0) || itemsSelected[itemsSelected.length - 2].$el
      : self.options.itemResolve(
          itemsSelected[itemsSelected.length - 2].$el,
          self
        );

    const prevIndex = $itemsCheckboxes.index($prevSelected),
      itemIndex = $itemsCheckboxes.index($el);

    let toCall;
    let goingForwardFrom$el;
    if (prevIndex > itemIndex) {
      goingForwardFrom$el = true;
      toCall = "next";
    } else {
      goingForwardFrom$el = false;
      toCall = "prev";
    }

    prevUntilNextUntil[toCall]($el, $prevSelected, $itemsCheckboxes, self).each(
      function() {
        const $this = $(this);
        self.toggle($, $this, true);
        if ($this.is(self.options.checkboxes)) {
          self.toggle($, self.options.itemResolve($this, self), true);
        } else {
          self.toggle($, self.options.checkboxResolve($this, self), true);
        }
      }
    );

    let fromIndex;
    if (goingForwardFrom$el) {
      let indexOfNext = $itemsCheckboxes.index($el) + 1;
      let $next = $itemsCheckboxes.eq(indexOfNext);
      while ($next.length && indexOfNext <= $itemsCheckboxes.length - 1) {
        if ($next.hasClass(self.options.checkedClassName)) {
          indexOfNext = $itemsCheckboxes.index($next) + 1;
          $next = $itemsCheckboxes.eq(indexOfNext);
        } else {
          break;
        }
      }
      fromIndex = indexOfNext - 1;
    } else {
      let indexOfPrev = $itemsCheckboxes.index($el) - 1;
      let $prev = $itemsCheckboxes.eq(indexOfPrev);
      while ($prev.length && indexOfPrev >= 0) {
        if ($prev.hasClass(self.options.checkedClassName)) {
          indexOfPrev = $itemsCheckboxes.index($prev) - 1;
          $prev = $itemsCheckboxes.eq(indexOfPrev);
        } else {
          break;
        }
      }
      fromIndex = indexOfPrev + 1;
    }
    self.selectedRanges.unshift({ from: fromIndex, to: itemIndex });
  } else {
    $el.is(self.options.sync)
      ? ($el = self.options.checkboxResolve($el, self)) && void 0
      : void 0;
    if (
      self.options.usePrevUntilNextUntilForSync &&
      $el.is(self.options.checkboxes)
    ) {
      $el = self.options.itemResolve($el, self);
    }
    const index = $itemsCheckboxes.index($el);
    for (let i = 0; i < self.selectedRanges.length; i++) {
      const range = self.selectedRanges[i];
      const from = range.from;
      const to = range.to;
      if ((index >= from && index <= to) || (index >= to && index <= from)) {
        // `index` is within range, uncheck all from `index` to `to`.
        let $toDeselect;
        if (to > index) {
          $toDeselect = $itemsCheckboxes.slice(index + 1, to + 1);
        } else {
          $toDeselect = $itemsCheckboxes.slice(to, index);
        }
        $toDeselect.each(function() {
          const $this = $(this);
          self.toggle($, $this, false);
          if ($this.is(self.options.checkboxes)) {
            self.toggle($, self.options.itemResolve($this, self), false);
          } else {
            self.toggle($, self.options.checkboxResolve($this, self), false);
          }
        });
        break;
      }
    }
  }
}
