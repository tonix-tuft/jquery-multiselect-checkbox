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

import checkboxResolveFactory from "./defaults/checkboxResolve";
import itemResolve from "./defaults/itemResolve";
import targetCheckStopPropagation from "./defaults/targetCheckStopPropagation";
import nextUntilFlattenDOM from "./defaults/nextUntilFlattenDOM";
import prevUntilFlattenDOM from "./defaults/prevUntilFlattenDOM";

// eslint-disable-next-line no-unused-vars
export default ($, window, document) => ({
  checkboxes: null,
  sync: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAllChecked: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAllUnchecked: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onNotAllChecked: () => {},
  checkboxResolve: checkboxResolveFactory($),
  itemResolve: itemResolve,
  targetCheckStopPropagation: targetCheckStopPropagation,
  eventsElement: document,
  syncEvent: "click",
  handleShiftForCheckbox: false,
  usePrevUntilNextUntilForSync: true,
  next: nextUntilFlattenDOM,
  prev: prevUntilFlattenDOM,
  checkedClassName: "jquery-multi-select-checkbox-checked",
  checkedKeyDataAttributeName: "jquery-multi-select-checkbox-checked-key",
  keyDataAttributeName: "key"
});
