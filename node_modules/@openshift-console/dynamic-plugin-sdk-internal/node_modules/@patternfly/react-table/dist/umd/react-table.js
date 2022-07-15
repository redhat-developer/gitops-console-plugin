(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PatternFlyTable = {}, global.React, global.ReactDOM));
})(this, (function (exports, React, ReactDOM) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var React__namespace = /*#__PURE__*/_interopNamespace(React);
    var ReactDOM__namespace = /*#__PURE__*/_interopNamespace(ReactDOM);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest$2(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest$1(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    /** Joins args into a className string
     *
     * @param {any} args list of objects, string, or arrays to reduce
     */
    function css(...args) {
        // Adapted from https://github.com/JedWatson/classnames/blob/master/index.js
        const classes = [];
        const hasOwn = {}.hasOwnProperty;
        args.filter(Boolean).forEach((arg) => {
            const argType = typeof arg;
            if (argType === 'string' || argType === 'number') {
                classes.push(arg);
            }
            else if (Array.isArray(arg) && arg.length) {
                const inner = css(...arg);
                if (inner) {
                    classes.push(inner);
                }
            }
            else if (argType === 'object') {
                for (const key in arg) {
                    if (hasOwn.call(arg, key) && arg[key]) {
                        classes.push(key);
                    }
                }
            }
        });
        return classes.join(' ');
    }

    const KEY_CODES = { ARROW_UP: 38, ARROW_DOWN: 40, ESCAPE_KEY: 27, TAB: 9, ENTER: 13, SPACE: 32 };
    const KEYHANDLER_DIRECTION = { UP: 'up', DOWN: 'down', RIGHT: 'right', LEFT: 'left' };
    var ValidatedOptions;
    (function (ValidatedOptions) {
        ValidatedOptions["success"] = "success";
        ValidatedOptions["error"] = "error";
        ValidatedOptions["warning"] = "warning";
        ValidatedOptions["default"] = "default";
    })(ValidatedOptions || (ValidatedOptions = {}));
    const KeyTypes = {
        Tab: 'Tab',
        Space: ' ',
        Escape: 'Escape',
        Enter: 'Enter',
        ArrowUp: 'ArrowUp',
        ArrowDown: 'ArrowDown',
        ArrowLeft: 'ArrowLeft',
        ArrowRight: 'ArrowRight'
    };

    /*!
    * tabbable 5.1.4
    * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
    */
    var candidateSelectors = ['input', 'select', 'textarea', 'a[href]', 'button', '[tabindex]', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])', 'details>summary:first-of-type', 'details'];
    var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
    var matches = typeof Element === 'undefined' ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

    var getCandidates = function getCandidates(el, includeContainer, filter) {
      var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));

      if (includeContainer && matches.call(el, candidateSelector)) {
        candidates.unshift(el);
      }

      candidates = candidates.filter(filter);
      return candidates;
    };

    var isContentEditable = function isContentEditable(node) {
      return node.contentEditable === 'true';
    };

    var getTabindex = function getTabindex(node) {
      var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);

      if (!isNaN(tabindexAttr)) {
        return tabindexAttr;
      } // Browsers do not return `tabIndex` correctly for contentEditable nodes;
      // so if they don't have a tabindex attribute specifically set, assume it's 0.


      if (isContentEditable(node)) {
        return 0;
      } // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
      //  `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
      //  yet they are still part of the regular tab order; in FF, they get a default
      //  `tabIndex` of 0; since Chrome still puts those elements in the regular tab
      //  order, consider their tab index to be 0.


      if ((node.nodeName === 'AUDIO' || node.nodeName === 'VIDEO' || node.nodeName === 'DETAILS') && node.getAttribute('tabindex') === null) {
        return 0;
      }

      return node.tabIndex;
    };

    var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
      return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
    };

    var isInput = function isInput(node) {
      return node.tagName === 'INPUT';
    };

    var isHiddenInput = function isHiddenInput(node) {
      return isInput(node) && node.type === 'hidden';
    };

    var isDetailsWithSummary = function isDetailsWithSummary(node) {
      var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
        return child.tagName === 'SUMMARY';
      });
      return r;
    };

    var getCheckedRadio = function getCheckedRadio(nodes, form) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked && nodes[i].form === form) {
          return nodes[i];
        }
      }
    };

    var isTabbableRadio = function isTabbableRadio(node) {
      if (!node.name) {
        return true;
      }

      var radioScope = node.form || node.ownerDocument;
      var radioSet = radioScope.querySelectorAll('input[type="radio"][name="' + node.name + '"]');
      var checked = getCheckedRadio(radioSet, node.form);
      return !checked || checked === node;
    };

    var isRadio = function isRadio(node) {
      return isInput(node) && node.type === 'radio';
    };

    var isNonTabbableRadio = function isNonTabbableRadio(node) {
      return isRadio(node) && !isTabbableRadio(node);
    };

    var isHidden = function isHidden(node) {
      if (getComputedStyle(node).visibility === 'hidden') {
        return true;
      }

      var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
      var nodeUnderDetails = isDirectSummary ? node.parentElement : node;

      if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
        return true;
      }

      while (node) {
        if (getComputedStyle(node).display === 'none') {
          return true;
        }

        node = node.parentElement;
      }

      return false;
    };

    var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(node) {
      if (node.disabled || isHiddenInput(node) || isHidden(node) ||
      /* For a details element with a summary, the summary element gets the focused  */
      isDetailsWithSummary(node)) {
        return false;
      }

      return true;
    };

    var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(node) {
      if (!isNodeMatchingSelectorFocusable(node) || isNonTabbableRadio(node) || getTabindex(node) < 0) {
        return false;
      }

      return true;
    };

    var tabbable = function tabbable(el, options) {
      options = options || {};
      var regularTabbables = [];
      var orderedTabbables = [];
      var candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorTabbable);
      candidates.forEach(function (candidate, i) {
        var candidateTabindex = getTabindex(candidate);

        if (candidateTabindex === 0) {
          regularTabbables.push(candidate);
        } else {
          orderedTabbables.push({
            documentOrder: i,
            tabIndex: candidateTabindex,
            node: candidate
          });
        }
      });
      var tabbableNodes = orderedTabbables.sort(sortOrderedTabbables).map(function (a) {
        return a.node;
      }).concat(regularTabbables);
      return tabbableNodes;
    };

    var focusableCandidateSelector = /* #__PURE__ */candidateSelectors.concat('iframe').join(',');

    var isFocusable = function isFocusable(node) {
      if (!node) {
        throw new Error('No node provided');
      }

      if (matches.call(node, focusableCandidateSelector) === false) {
        return false;
      }

      return isNodeMatchingSelectorFocusable(node);
    };

    /*!
    * focus-trap 6.2.2
    * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
    */

    function _defineProperty$1(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty$1(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }

      return target;
    }

    var activeFocusDelay;

    var activeFocusTraps = function () {
      var trapQueue = [];
      return {
        activateTrap: function activateTrap(trap) {
          if (trapQueue.length > 0) {
            var activeTrap = trapQueue[trapQueue.length - 1];

            if (activeTrap !== trap) {
              activeTrap.pause();
            }
          }

          var trapIndex = trapQueue.indexOf(trap);

          if (trapIndex === -1) {
            trapQueue.push(trap);
          } else {
            // move this existing trap to the front of the queue
            trapQueue.splice(trapIndex, 1);
            trapQueue.push(trap);
          }
        },
        deactivateTrap: function deactivateTrap(trap) {
          var trapIndex = trapQueue.indexOf(trap);

          if (trapIndex !== -1) {
            trapQueue.splice(trapIndex, 1);
          }

          if (trapQueue.length > 0) {
            trapQueue[trapQueue.length - 1].unpause();
          }
        }
      };
    }();

    var isSelectableInput = function isSelectableInput(node) {
      return node.tagName && node.tagName.toLowerCase() === 'input' && typeof node.select === 'function';
    };

    var isEscapeEvent = function isEscapeEvent(e) {
      return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
    };

    var isTabEvent = function isTabEvent(e) {
      return e.key === 'Tab' || e.keyCode === 9;
    };

    var delay = function delay(fn) {
      return setTimeout(fn, 0);
    };

    var createFocusTrap = function createFocusTrap(elements, userOptions) {
      var doc = document;

      var config = _objectSpread2({
        returnFocusOnDeactivate: true,
        escapeDeactivates: true,
        delayInitialFocus: true
      }, userOptions);

      var state = {
        // @type {Array<HTMLElement>}
        containers: [],
        // list of objects identifying the first and last tabbable nodes in all containers/groups in
        //  the trap
        // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
        //  is active, but the trap should never get to a state where there isn't at least one group
        //  with at least one tabbable node in it (that would lead to an error condition that would
        //  result in an error being thrown)
        // @type {Array<{ firstTabbableNode: HTMLElement|null, lastTabbableNode: HTMLElement|null }>}
        tabbableGroups: [],
        nodeFocusedBeforeActivation: null,
        mostRecentlyFocusedNode: null,
        active: false,
        paused: false
      };
      var trap; // eslint-disable-line prefer-const -- some private functions reference it, and its methods reference private functions, so we must declare here and define later

      var containersContain = function containersContain(element) {
        return state.containers.some(function (container) {
          return container.contains(element);
        });
      };

      var getNodeForOption = function getNodeForOption(optionName) {
        var optionValue = config[optionName];

        if (!optionValue) {
          return null;
        }

        var node = optionValue;

        if (typeof optionValue === 'string') {
          node = doc.querySelector(optionValue);

          if (!node) {
            throw new Error("`".concat(optionName, "` refers to no known node"));
          }
        }

        if (typeof optionValue === 'function') {
          node = optionValue();

          if (!node) {
            throw new Error("`".concat(optionName, "` did not return a node"));
          }
        }

        return node;
      };

      var getInitialFocusNode = function getInitialFocusNode() {
        var node;

        if (getNodeForOption('initialFocus') !== null) {
          node = getNodeForOption('initialFocus');
        } else if (containersContain(doc.activeElement)) {
          node = doc.activeElement;
        } else {
          var firstTabbableGroup = state.tabbableGroups[0];
          var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;
          node = firstTabbableNode || getNodeForOption('fallbackFocus');
        }

        if (!node) {
          throw new Error('Your focus-trap needs to have at least one focusable element');
        }

        return node;
      };

      var updateTabbableNodes = function updateTabbableNodes() {
        state.tabbableGroups = state.containers.map(function (container) {
          var tabbableNodes = tabbable(container);

          if (tabbableNodes.length > 0) {
            return {
              firstTabbableNode: tabbableNodes[0],
              lastTabbableNode: tabbableNodes[tabbableNodes.length - 1]
            };
          }

          return undefined;
        }).filter(function (group) {
          return !!group;
        }); // remove groups with no tabbable nodes
        // throw if no groups have tabbable nodes and we don't have a fallback focus node either

        if (state.tabbableGroups.length <= 0 && !getNodeForOption('fallbackFocus')) {
          throw new Error('Your focus-trap must have at least one container with at least one tabbable node in it at all times');
        }
      };

      var tryFocus = function tryFocus(node) {
        if (node === doc.activeElement) {
          return;
        }

        if (!node || !node.focus) {
          tryFocus(getInitialFocusNode());
          return;
        }

        node.focus({
          preventScroll: !!config.preventScroll
        });
        state.mostRecentlyFocusedNode = node;

        if (isSelectableInput(node)) {
          node.select();
        }
      };

      var getReturnFocusNode = function getReturnFocusNode(previousActiveElement) {
        var node = getNodeForOption('setReturnFocus');
        return node ? node : previousActiveElement;
      }; // This needs to be done on mousedown and touchstart instead of click
      // so that it precedes the focus event.


      var checkPointerDown = function checkPointerDown(e) {
        if (containersContain(e.target)) {
          // allow the click since it ocurred inside the trap
          return;
        }

        if (config.clickOutsideDeactivates) {
          // immediately deactivate the trap
          trap.deactivate({
            // if, on deactivation, we should return focus to the node originally-focused
            //  when the trap was activated (or the configured `setReturnFocus` node),
            //  then assume it's also OK to return focus to the outside node that was
            //  just clicked, causing deactivation, as long as that node is focusable;
            //  if it isn't focusable, then return focus to the original node focused
            //  on activation (or the configured `setReturnFocus` node)
            // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
            //  which will result in the outside click setting focus to the node
            //  that was clicked, whether it's focusable or not; by setting
            //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
            //  on activation (or the configured `setReturnFocus` node)
            returnFocus: config.returnFocusOnDeactivate && !isFocusable(e.target)
          });
          return;
        } // This is needed for mobile devices.
        // (If we'll only let `click` events through,
        // then on mobile they will be blocked anyways if `touchstart` is blocked.)


        if (config.allowOutsideClick && (typeof config.allowOutsideClick === 'boolean' ? config.allowOutsideClick : config.allowOutsideClick(e))) {
          // allow the click outside the trap to take place
          return;
        } // otherwise, prevent the click


        e.preventDefault();
      }; // In case focus escapes the trap for some strange reason, pull it back in.


      var checkFocusIn = function checkFocusIn(e) {
        var targetContained = containersContain(e.target); // In Firefox when you Tab out of an iframe the Document is briefly focused.

        if (targetContained || e.target instanceof Document) {
          if (targetContained) {
            state.mostRecentlyFocusedNode = e.target;
          }
        } else {
          // escaped! pull it back in to where it just left
          e.stopImmediatePropagation();
          tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
        }
      }; // Hijack Tab events on the first and last focusable nodes of the trap,
      // in order to prevent focus from escaping. If it escapes for even a
      // moment it can end up scrolling the page and causing confusion so we
      // kind of need to capture the action at the keydown phase.


      var checkTab = function checkTab(e) {
        updateTabbableNodes();
        var destinationNode = null;

        if (state.tabbableGroups.length > 0) {
          if (e.shiftKey) {
            var startOfGroupIndex = state.tabbableGroups.findIndex(function (_ref) {
              var firstTabbableNode = _ref.firstTabbableNode;
              return e.target === firstTabbableNode;
            });

            if (startOfGroupIndex >= 0) {
              var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
              var destinationGroup = state.tabbableGroups[destinationGroupIndex];
              destinationNode = destinationGroup.lastTabbableNode;
            }
          } else {
            var lastOfGroupIndex = state.tabbableGroups.findIndex(function (_ref2) {
              var lastTabbableNode = _ref2.lastTabbableNode;
              return e.target === lastTabbableNode;
            });

            if (lastOfGroupIndex >= 0) {
              var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;

              var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
              destinationNode = _destinationGroup.firstTabbableNode;
            }
          }
        } else {
          destinationNode = getNodeForOption('fallbackFocus');
        }

        if (destinationNode) {
          e.preventDefault();
          tryFocus(destinationNode);
        }
      };

      var checkKey = function checkKey(e) {
        if (config.escapeDeactivates !== false && isEscapeEvent(e)) {
          e.preventDefault();
          trap.deactivate();
          return;
        }

        if (isTabEvent(e)) {
          checkTab(e);
          return;
        }
      };

      var checkClick = function checkClick(e) {
        if (config.clickOutsideDeactivates) {
          return;
        }

        if (containersContain(e.target)) {
          return;
        }

        if (config.allowOutsideClick && (typeof config.allowOutsideClick === 'boolean' ? config.allowOutsideClick : config.allowOutsideClick(e))) {
          return;
        }

        e.preventDefault();
        e.stopImmediatePropagation();
      }; //
      // EVENT LISTENERS
      //


      var addListeners = function addListeners() {
        if (!state.active) {
          return;
        } // There can be only one listening focus trap at a time


        activeFocusTraps.activateTrap(trap); // Delay ensures that the focused element doesn't capture the event
        // that caused the focus trap activation.

        activeFocusDelay = config.delayInitialFocus ? delay(function () {
          tryFocus(getInitialFocusNode());
        }) : tryFocus(getInitialFocusNode());
        doc.addEventListener('focusin', checkFocusIn, true);
        doc.addEventListener('mousedown', checkPointerDown, {
          capture: true,
          passive: false
        });
        doc.addEventListener('touchstart', checkPointerDown, {
          capture: true,
          passive: false
        });
        doc.addEventListener('click', checkClick, {
          capture: true,
          passive: false
        });
        doc.addEventListener('keydown', checkKey, {
          capture: true,
          passive: false
        });
        return trap;
      };

      var removeListeners = function removeListeners() {
        if (!state.active) {
          return;
        }

        doc.removeEventListener('focusin', checkFocusIn, true);
        doc.removeEventListener('mousedown', checkPointerDown, true);
        doc.removeEventListener('touchstart', checkPointerDown, true);
        doc.removeEventListener('click', checkClick, true);
        doc.removeEventListener('keydown', checkKey, true);
        return trap;
      }; //
      // TRAP DEFINITION
      //


      trap = {
        activate: function activate(activateOptions) {
          if (state.active) {
            return this;
          }

          updateTabbableNodes();
          state.active = true;
          state.paused = false;
          state.nodeFocusedBeforeActivation = doc.activeElement;
          var onActivate = activateOptions && activateOptions.onActivate ? activateOptions.onActivate : config.onActivate;

          if (onActivate) {
            onActivate();
          }

          addListeners();
          return this;
        },
        deactivate: function deactivate(deactivateOptions) {
          if (!state.active) {
            return this;
          }

          clearTimeout(activeFocusDelay);
          removeListeners();
          state.active = false;
          state.paused = false;
          activeFocusTraps.deactivateTrap(trap);
          var onDeactivate = deactivateOptions && deactivateOptions.onDeactivate !== undefined ? deactivateOptions.onDeactivate : config.onDeactivate;

          if (onDeactivate) {
            onDeactivate();
          }

          var returnFocus = deactivateOptions && deactivateOptions.returnFocus !== undefined ? deactivateOptions.returnFocus : config.returnFocusOnDeactivate;

          if (returnFocus) {
            delay(function () {
              tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
            });
          }

          return this;
        },
        pause: function pause() {
          if (state.paused || !state.active) {
            return this;
          }

          state.paused = true;
          removeListeners();
          return this;
        },
        unpause: function unpause() {
          if (!state.paused || !state.active) {
            return this;
          }

          state.paused = false;
          updateTabbableNodes();
          addListeners();
          return this;
        },
        updateContainerElements: function updateContainerElements(containerElements) {
          var elementsAsArray = [].concat(containerElements).filter(Boolean);
          state.containers = elementsAsArray.map(function (element) {
            return typeof element === 'string' ? doc.querySelector(element) : element;
          });

          if (state.active) {
            updateTabbableNodes();
          }

          return this;
        }
      }; // initialize container elements

      trap.updateContainerElements(elements);
      return trap;
    };

    class FocusTrap extends React__namespace.Component {
        constructor(props) {
            super(props);
            this.divRef = React__namespace.createRef();
            if (typeof document !== 'undefined') {
                this.previouslyFocusedElement = document.activeElement;
            }
        }
        componentDidMount() {
            // We need to hijack the returnFocusOnDeactivate option,
            // because React can move focus into the element before we arrived at
            // this lifecycle hook (e.g. with autoFocus inputs). So the component
            // captures the previouslyFocusedElement in componentWillMount,
            // then (optionally) returns focus to it in componentWillUnmount.
            this.focusTrap = createFocusTrap(this.divRef.current, Object.assign(Object.assign({}, this.props.focusTrapOptions), { returnFocusOnDeactivate: false }));
            if (this.props.active) {
                this.focusTrap.activate();
            }
            if (this.props.paused) {
                this.focusTrap.pause();
            }
        }
        componentDidUpdate(prevProps) {
            if (prevProps.active && !this.props.active) {
                this.focusTrap.deactivate();
            }
            else if (!prevProps.active && this.props.active) {
                this.focusTrap.activate();
            }
            if (prevProps.paused && !this.props.paused) {
                this.focusTrap.unpause();
            }
            else if (!prevProps.paused && this.props.paused) {
                this.focusTrap.pause();
            }
        }
        componentWillUnmount() {
            this.focusTrap.deactivate();
            if (this.props.focusTrapOptions.returnFocusOnDeactivate !== false &&
                this.previouslyFocusedElement &&
                this.previouslyFocusedElement.focus) {
                this.previouslyFocusedElement.focus({ preventScroll: this.props.preventScrollOnDeactivate });
            }
        }
        render() {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _a = this.props, { children, className, focusTrapOptions, active, paused, preventScrollOnDeactivate } = _a, rest = __rest$1(_a, ["children", "className", "focusTrapOptions", "active", "paused", "preventScrollOnDeactivate"]);
            return (React__namespace.createElement("div", Object.assign({ ref: this.divRef, className: className }, rest), children));
        }
    }
    FocusTrap.displayName = 'FocusTrap';
    FocusTrap.defaultProps = {
        active: true,
        paused: false,
        focusTrapOptions: {},
        preventScrollOnDeactivate: false
    };

    /** This Component can be used to wrap a functional component in order to generate a random ID
     * Example of how to use this component
     *
     * const Component = ({id}: {id: string}) => (
     *  <GenerateId>{randomId => (
     *     <div id={id || randomId}>
     *       div with random ID
     *     </div>
     *   )}
     *  </GenerateId>
     *  );
     */
    let currentId$2 = 0;
    class GenerateId extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.id = `${this.props.prefix}${currentId$2++}`;
        }
        render() {
            return this.props.children(this.id);
        }
    }
    GenerateId.displayName = 'GenerateId';
    GenerateId.defaultProps = {
        prefix: 'pf-random-id-'
    };

    let uid = 0;
    const ouiaPrefix = 'OUIA-Generated-';
    const ouiaIdByRoute = {};
    /** Get props to conform to OUIA spec
     *
     * For functional components, use the useOUIAProps function instead
     *
     * In class based components, create a state variable ouiaStateId to create a static generated ID:
     * state = {
     *  ouiaStateId: getDefaultOUIAId(Chip.displayName)
     * }
     * This generated ID should remain alive as long as the component is not unmounted.
     *
     * Then add the attributes to the component
     * {...getOUIAProps('OverflowChip', this.props.ouiaId !== undefined ? this.props.ouiaId : this.state.ouiaStateId)}
     *
     * @param {string} componentType OUIA component type
     * @param {number|string} id OUIA component id
     * @param {boolean} ouiaSafe false if in animation
     */
    function getOUIAProps(componentType, id, ouiaSafe = true) {
        return {
            'data-ouia-component-type': `PF4/${componentType}`,
            'data-ouia-safe': ouiaSafe,
            'data-ouia-component-id': id
        };
    }
    /**
     * Hooks version of the getOUIAProps function that also memoizes the generated ID
     * Can only be used in functional components
     *
     * @param {string} componentType OUIA component type
     * @param {number|string} id OUIA component id
     * @param {boolean} ouiaSafe false if in animation
     * @param {string} variant Optional variant to add to the generated ID
     */
    const useOUIAProps = (componentType, id, ouiaSafe = true, variant) => ({
        'data-ouia-component-type': `PF4/${componentType}`,
        'data-ouia-safe': ouiaSafe,
        'data-ouia-component-id': useOUIAId(componentType, id, variant)
    });
    /**
     * Returns the ID or the memoized generated ID
     *
     * @param {string} componentType OUIA component type
     * @param {number|string} id OUIA component id
     * @param {string} variant Optional variant to add to the generated ID
     */
    const useOUIAId = (componentType, id, variant) => {
        if (id !== undefined) {
            return id;
        }
        return React.useMemo(() => getDefaultOUIAId(componentType, variant), [componentType, variant]);
    };
    /**
     * Returns a generated id based on the URL location
     *
     * @param {string} componentType OUIA component type
     * @param {string} variant Optional variant to add to the generated ID
     */
    function getDefaultOUIAId(componentType, variant) {
        /*
        ouiaIdByRoute = {
          [route+componentType]: [number]
        }
        */
        try {
            let key;
            if (typeof window !== 'undefined') {
                // browser environments
                key = `${window.location.href}-${componentType}-${variant || ''}`;
            }
            else {
                // node/SSR environments
                key = `${componentType}-${variant || ''}`;
            }
            if (!ouiaIdByRoute[key]) {
                ouiaIdByRoute[key] = 0;
            }
            return `${ouiaPrefix}${componentType}-${variant ? `${variant}-` : ''}${++ouiaIdByRoute[key]}`;
        }
        catch (exception) {
            return `${ouiaPrefix}${componentType}-${variant ? `${variant}-` : ''}${++uid}`;
        }
    }

    /**
     * @param {string} prefix - String to prefix ID with
     */
    function getUniqueId(prefix = 'pf') {
        const uid = new Date().getTime() +
            Math.random()
                .toString(36)
                .slice(2);
        return `${prefix}-${uid}`;
    }
    /**
     * @param { any } this - "This" reference
     * @param { Function } func - Function to debounce
     * @param { number } wait - Debounce amount
     */
    function debounce$1(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    /** Interpolates a parameterized templateString using values from a templateVars object.
     * The templateVars object should have keys and values which match the templateString's parameters.
     * Example:
     *    const templateString: 'My name is ${firstName} ${lastName}';
     *    const templateVars: {
     *      firstName: 'Jon'
     *      lastName: 'Dough'
     *    };
     *    const result = fillTemplate(templateString, templateVars);
     *    // "My name is Jon Dough"
     *
     * @param {string} templateString  The string passed by the consumer
     * @param {object} templateVars The variables passed to the string
     *
     * @returns {string} The template string literal result
     */
    function fillTemplate(templateString, templateVars) {
        return templateString.replace(/\${(.*?)}/g, (_, match) => templateVars[match] || '');
    }
    /**
     * This function allows for keyboard navigation through dropdowns. The custom argument is optional.
     *
     * @param {number} index The index of the element you're on
     * @param {number} innerIndex Inner index number
     * @param {string} position The orientation of the dropdown
     * @param {string[]} refsCollection Array of refs to the items in the dropdown
     * @param {object[]} kids Array of items in the dropdown
     * @param {boolean} [custom] Allows for handling of flexible content
     */
    function keyHandler(index, innerIndex, position, refsCollection, kids, custom = false) {
        if (!Array.isArray(kids)) {
            return;
        }
        const isMultiDimensional = refsCollection.filter(ref => ref)[0].constructor === Array;
        let nextIndex = index;
        let nextInnerIndex = innerIndex;
        if (position === 'up') {
            if (index === 0) {
                // loop back to end
                nextIndex = kids.length - 1;
            }
            else {
                nextIndex = index - 1;
            }
        }
        else if (position === 'down') {
            if (index === kids.length - 1) {
                // loop back to beginning
                nextIndex = 0;
            }
            else {
                nextIndex = index + 1;
            }
        }
        else if (position === 'left') {
            if (innerIndex === 0) {
                nextInnerIndex = refsCollection[index].length - 1;
            }
            else {
                nextInnerIndex = innerIndex - 1;
            }
        }
        else if (position === 'right') {
            if (innerIndex === refsCollection[index].length - 1) {
                nextInnerIndex = 0;
            }
            else {
                nextInnerIndex = innerIndex + 1;
            }
        }
        if (refsCollection[nextIndex] === null ||
            refsCollection[nextIndex] === undefined ||
            (isMultiDimensional &&
                (refsCollection[nextIndex][nextInnerIndex] === null || refsCollection[nextIndex][nextInnerIndex] === undefined))) {
            keyHandler(nextIndex, nextInnerIndex, position, refsCollection, kids, custom);
        }
        else if (custom) {
            if (refsCollection[nextIndex].focus) {
                refsCollection[nextIndex].focus();
            }
            // eslint-disable-next-line react/no-find-dom-node
            const element = ReactDOM__namespace.findDOMNode(refsCollection[nextIndex]);
            element.focus();
        }
        else if (position !== 'tab') {
            if (isMultiDimensional) {
                refsCollection[nextIndex][nextInnerIndex].focus();
            }
            else {
                refsCollection[nextIndex].focus();
            }
        }
    }
    /** This function returns a list of tabbable items in a container
     *
     *  @param {any} containerRef to the container
     *  @param {string} tababbleSelectors CSS selector string of tabbable items
     */
    function findTabbableElements(containerRef, tababbleSelectors) {
        const tabbable = containerRef.current.querySelectorAll(tababbleSelectors);
        const list = Array.prototype.filter.call(tabbable, function (item) {
            return item.tabIndex >= '0';
        });
        return list;
    }
    /** This function is a helper for keyboard navigation through dropdowns.
     *
     * @param {number} index The index of the element you're on
     * @param {string} position The orientation of the dropdown
     * @param {string[]} collection Array of refs to the items in the dropdown
     */
    function getNextIndex(index, position, collection) {
        let nextIndex;
        if (position === 'up') {
            if (index === 0) {
                // loop back to end
                nextIndex = collection.length - 1;
            }
            else {
                nextIndex = index - 1;
            }
        }
        else if (index === collection.length - 1) {
            // loop back to beginning
            nextIndex = 0;
        }
        else {
            nextIndex = index + 1;
        }
        if (collection[nextIndex] === undefined || collection[nextIndex][0] === null) {
            return getNextIndex(nextIndex, position, collection);
        }
        else {
            return nextIndex;
        }
    }
    /**
     * This function is a helper for turning arrays of breakpointMod objects for data toolbar and flex into classes
     *
     * @param {object} mods The modifiers object
     * @param {any} styles The appropriate styles object for the component
     */
    const formatBreakpointMods = (mods, styles, stylePrefix = '', breakpoint) => {
        if (!mods) {
            return '';
        }
        if (breakpoint) {
            if (breakpoint in mods) {
                return styles.modifiers[toCamel$1(`${stylePrefix}${mods[breakpoint]}`)];
            }
            // the current breakpoint is not specified in mods, so we try to find the next nearest
            const breakpointsOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'default'];
            const breakpointsIndex = breakpointsOrder.indexOf(breakpoint);
            for (let i = breakpointsIndex; i < breakpointsOrder.length; i++) {
                if (breakpointsOrder[i] in mods) {
                    return styles.modifiers[toCamel$1(`${stylePrefix}${mods[breakpointsOrder[i]]}`)];
                }
            }
            return '';
        }
        return Object.entries(mods || {})
            .map(([breakpoint, mod]) => `${stylePrefix}${mod}${breakpoint !== 'default' ? `-on-${breakpoint}` : ''}`)
            .map(toCamel$1)
            .map(mod => mod.replace(/-?(\dxl)/gi, (_res, group) => `_${group}`))
            .map(modifierKey => styles.modifiers[modifierKey])
            .filter(Boolean)
            .join(' ');
    };
    const camelize$1 = (s) => s
        .toUpperCase()
        .replace('-', '')
        .replace('_', '');
    /**
     *
     * @param {string} s string to make camelCased
     */
    const toCamel$1 = (s) => s.replace(/([-_][a-z])/gi, camelize$1);
    /**
     * Copied from exenv
     */
    const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
    /**
     * Calculate the width of the text
     * Example:
     * getTextWidth('my text', node)
     *
     * @param {string} text The text to calculate the width for
     * @param {HTMLElement} node The HTML element
     */
    const getTextWidth = (text, node) => {
        const computedStyle = getComputedStyle(node);
        // Firefox returns the empty string for .font, so this function creates the .font property manually
        const getFontFromComputedStyle = () => {
            let computedFont = '';
            // Firefox uses percentages for font-stretch, but Canvas does not accept percentages
            // so convert to keywords, as listed at:
            // https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch
            const fontStretchLookupTable = {
                '50%': 'ultra-condensed',
                '62.5%': 'extra-condensed',
                '75%': 'condensed',
                '87.5%': 'semi-condensed',
                '100%': 'normal',
                '112.5%': 'semi-expanded',
                '125%': 'expanded',
                '150%': 'extra-expanded',
                '200%': 'ultra-expanded'
            };
            // If the retrieved font-stretch percentage isn't found in the lookup table, use
            // 'normal' as a last resort.
            let fontStretch;
            if (computedStyle.fontStretch in fontStretchLookupTable) {
                fontStretch = fontStretchLookupTable[computedStyle.fontStretch];
            }
            else {
                fontStretch = 'normal';
            }
            computedFont =
                computedStyle.fontStyle +
                    ' ' +
                    computedStyle.fontVariant +
                    ' ' +
                    computedStyle.fontWeight +
                    ' ' +
                    fontStretch +
                    ' ' +
                    computedStyle.fontSize +
                    '/' +
                    computedStyle.lineHeight +
                    ' ' +
                    computedStyle.fontFamily;
            return computedFont;
        };
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = computedStyle.font || getFontFromComputedStyle();
        return context.measureText(text).width;
    };
    /**
     * Get the inner dimensions of an element
     *
     * @param {HTMLElement} node HTML element to calculate the inner dimensions for
     */
    const innerDimensions = (node) => {
        const computedStyle = getComputedStyle(node);
        let width = node.clientWidth; // width with padding
        let height = node.clientHeight; // height with padding
        height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        return { height, width };
    };
    /**
     * This function is a helper for truncating text content on the left, leaving the right side of the content in view
     *
     * @param {HTMLElement} node HTML element
     * @param {string} value The original text value
     */
    const trimLeft = (node, value) => {
        const availableWidth = innerDimensions(node).width;
        let newValue = value;
        if (getTextWidth(value, node) > availableWidth) {
            // we have text overflow, trim the text to the left and add ... in the front until it fits
            while (getTextWidth(`...${newValue}`, node) > availableWidth) {
                newValue = newValue.substring(1);
            }
            // replace text with our truncated text
            if (node.value) {
                node.value = `...${newValue}`;
            }
            else {
                node.innerText = `...${newValue}`;
            }
        }
        else {
            if (node.value) {
                node.value = value;
            }
            else {
                node.innerText = value;
            }
        }
    };
    /**
     * @param {string[]} events - Operations to prevent when disabled
     */
    const preventedEvents = (events) => events.reduce((handlers, eventToPrevent) => (Object.assign(Object.assign({}, handlers), { [eventToPrevent]: (event) => {
            event.preventDefault();
        } })), {});

    /**
     * This component wraps any ReactNode and finds its ref
     * It has to be a class for findDOMNode to work
     * Ideally, all components used as triggers/toggles are either:
     * - class based components we can assign our own ref to
     * - functional components that have forwardRef implemented
     * However, there is no guarantee that is what will get passed in as trigger/toggle in the case of tooltips and popovers
     */
    class FindRefWrapper extends React__namespace.Component {
        componentDidMount() {
            // eslint-disable-next-line react/no-find-dom-node
            const root = ReactDOM__namespace.findDOMNode(this);
            this.props.onFoundRef(root);
        }
        render() {
            return this.props.children || null;
        }
    }
    FindRefWrapper.displayName = 'FindRefWrapper';

    /**
     * @param element
     */
    function getBoundingClientRect(element) {
        const rect = element.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            x: rect.left,
            y: rect.top
        };
    }

    // @ts-nocheck
    /* :: import type { Window } from '../types'; */
    /* :: declare function getWindow(node: Node | Window): Window; */
    /**
     * @param node
     */
    function getWindow(node) {
        if (node.toString() !== '[object Window]') {
            const ownerDocument = node.ownerDocument;
            return ownerDocument ? ownerDocument.defaultView : window;
        }
        return node;
    }

    // @ts-nocheck
    /**
     * @param node
     */
    function getWindowScroll(node) {
        const win = getWindow(node);
        const scrollLeft = win.pageXOffset;
        const scrollTop = win.pageYOffset;
        return {
            scrollLeft,
            scrollTop
        };
    }

    // @ts-nocheck
    /* :: declare function isElement(node: mixed): boolean %checks(node instanceof
      Element); */
    /**
     * @param node
     */
    function isElement(node) {
        const OwnElement = getWindow(node).Element;
        return node instanceof OwnElement || node instanceof Element;
    }
    /* :: declare function isHTMLElement(node: mixed): boolean %checks(node instanceof
      HTMLElement); */
    /**
     * @param node
     */
    function isHTMLElement(node) {
        const OwnElement = getWindow(node).HTMLElement;
        return node instanceof OwnElement || node instanceof HTMLElement;
    }

    // @ts-nocheck
    /**
     * @param element
     */
    function getHTMLElementScroll(element) {
        return {
            scrollLeft: element.scrollLeft,
            scrollTop: element.scrollTop
        };
    }

    // @ts-nocheck
    /**
     * @param node
     */
    function getNodeScroll(node) {
        if (node === getWindow(node) || !isHTMLElement(node)) {
            return getWindowScroll(node);
        }
        else {
            return getHTMLElementScroll(node);
        }
    }

    /**
     * @param element
     */
    function getNodeName(element) {
        return element ? (element.nodeName || '').toLowerCase() : null;
    }

    // @ts-nocheck
    /**
     * @param element
     */
    function getDocumentElement(element) {
        // $FlowFixMe: assume body is always available
        return (isElement(element) ? element.ownerDocument : element.document).documentElement;
    }

    // @ts-nocheck
    /**
     * @param element
     */
    function getWindowScrollBarX(element) {
        // If <html> has a CSS width greater than the viewport, then this will be
        // incorrect for RTL.
        // Popper 1 is broken in this case and never had a bug report so let's assume
        // it's not an issue. I don't think anyone ever specifies width on <html>
        // anyway.
        // Browsers where the left scrollbar doesn't cause an issue report `0` for
        // this (e.g. Edge 2019, IE11, Safari)
        return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    // @ts-nocheck
    /**
     * @param element
     */
    function getComputedStyle$1(element) {
        return getWindow(element).getComputedStyle(element);
    }

    // @ts-nocheck
    /**
     * @param element
     */
    function isScrollParent(element) {
        // Firefox wants us to check `-x` and `-y` variations as well
        const { overflow, overflowX, overflowY } = getComputedStyle$1(element);
        return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.
    /**
     * @param elementOrVirtualElement
     * @param offsetParent
     * @param isFixed
     */
    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed = false) {
        const documentElement = getDocumentElement(offsetParent);
        const rect = getBoundingClientRect(elementOrVirtualElement);
        const isOffsetParentAnElement = isHTMLElement(offsetParent);
        let scroll = { scrollLeft: 0, scrollTop: 0 };
        let offsets = { x: 0, y: 0 };
        if (isOffsetParentAnElement || (!isOffsetParentAnElement && !isFixed)) {
            if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
                isScrollParent(documentElement)) {
                scroll = getNodeScroll(offsetParent);
            }
            if (isHTMLElement(offsetParent)) {
                offsets = getBoundingClientRect(offsetParent);
                offsets.x += offsetParent.clientLeft;
                offsets.y += offsetParent.clientTop;
            }
            else if (documentElement) {
                offsets.x = getWindowScrollBarX(documentElement);
            }
        }
        return {
            x: rect.left + scroll.scrollLeft - offsets.x,
            y: rect.top + scroll.scrollTop - offsets.y,
            width: rect.width,
            height: rect.height
        };
    }

    // Returns the layout rect of an element relative to its offsetParent. Layout
    // means it doesn't take into account transforms.
    /**
     * @param element
     */
    function getLayoutRect(element) {
        return {
            x: element.offsetLeft,
            y: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }

    // @ts-nocheck
    /**
     * @param element
     */
    function getParentNode(element) {
        if (getNodeName(element) === 'html') {
            return element;
        }
        return (
        // $FlowFixMe: this is a quicker (but less type safe) way to save quite some bytes from the bundle
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
            element.parentNode || // DOM Element detected
            // $FlowFixMe: need a better way to handle this...
            element.host || // ShadowRoot detected
            // $FlowFixMe: HTMLElement is a Node
            getDocumentElement(element) // fallback
        );
    }

    // @ts-nocheck
    /**
     * @param node
     */
    function getScrollParent(node) {
        if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
            // $FlowFixMe: assume body is always available
            return node.ownerDocument.body;
        }
        if (isHTMLElement(node) && isScrollParent(node)) {
            return node;
        }
        return getScrollParent(getParentNode(node));
    }

    // @ts-nocheck
    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */
    /**
     * @param element
     * @param list
     */
    function listScrollParents(element, list = []) {
        const scrollParent = getScrollParent(element);
        const isBody = getNodeName(scrollParent) === 'body';
        const win = getWindow(scrollParent);
        const target = isBody
            ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : [])
            : scrollParent;
        const updatedList = list.concat(target);
        return isBody
            ? updatedList // $FlowFixMe: isBody tells us target will be an HTMLElement here
            : updatedList.concat(listScrollParents(getParentNode(target)));
    }

    // @ts-nocheck
    /**
     * @param element
     */
    function isTableElement(element) {
        return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    // @ts-nocheck
    /**
     * @param element
     */
    function getTrueOffsetParent(element) {
        if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
            getComputedStyle$1(element).position === 'fixed') {
            return null;
        }
        const offsetParent = element.offsetParent;
        if (offsetParent) {
            const html = getDocumentElement(offsetParent);
            if (getNodeName(offsetParent) === 'body' &&
                getComputedStyle$1(offsetParent).position === 'static' &&
                getComputedStyle$1(html).position !== 'static') {
                return html;
            }
        }
        return offsetParent;
    }
    // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block
    /**
     * @param element
     */
    function getContainingBlock(element) {
        let currentNode = getParentNode(element);
        while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
            const css = getComputedStyle$1(currentNode);
            // This is non-exhaustive but covers the most common CSS properties that
            // create a containing block.
            if (css.transform !== 'none' || css.perspective !== 'none' || (css.willChange && css.willChange !== 'auto')) {
                return currentNode;
            }
            else {
                currentNode = currentNode.parentNode;
            }
        }
        return null;
    }
    // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.
    /**
     * @param element
     */
    function getOffsetParent(element) {
        const window = getWindow(element);
        let offsetParent = getTrueOffsetParent(element);
        while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
            offsetParent = getTrueOffsetParent(offsetParent);
        }
        if (offsetParent && getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static') {
            return window;
        }
        return offsetParent || getContainingBlock(element) || window;
    }

    // @ts-nocheck
    const top = 'top';
    const bottom = 'bottom';
    const right = 'right';
    const left = 'left';
    const auto = 'auto';
    const basePlacements = [top, bottom, right, left];
    const start = 'start';
    const end = 'end';
    const clippingParents = 'clippingParents';
    const viewport = 'viewport';
    const popper = 'popper';
    const reference = 'reference';
    const variationPlacements = basePlacements.reduce((acc, placement) => acc.concat([`${placement}-${start}`, `${placement}-${end}`]), []);
    const placements = [...basePlacements, auto].reduce((acc, placement) => acc.concat([placement, `${placement}-${start}`, `${placement}-${end}`]), []);
    // modifiers that need to read the DOM
    const beforeRead = 'beforeRead';
    const read = 'read';
    const afterRead = 'afterRead';
    // pure-logic modifiers
    const beforeMain = 'beforeMain';
    const main = 'main';
    const afterMain = 'afterMain';
    // modifier with the purpose to write to the DOM (or write into a framework state)
    const beforeWrite = 'beforeWrite';
    const write = 'write';
    const afterWrite = 'afterWrite';
    const modifierPhases = [
        beforeRead,
        read,
        afterRead,
        beforeMain,
        main,
        afterMain,
        beforeWrite,
        write,
        afterWrite
    ];

    // source: https://stackoverflow.com/questions/49875255
    /**
     * @param modifiers
     */
    function order(modifiers) {
        const map = new Map();
        const visited = new Set();
        const result = [];
        modifiers.forEach(modifier => {
            map.set(modifier.name, modifier);
        });
        // On visiting object, check for its dependencies and visit them recursively
        /**
         * @param modifier
         */
        function sort(modifier) {
            visited.add(modifier.name);
            const requires = [...(modifier.requires || []), ...(modifier.requiresIfExists || [])];
            requires.forEach(dep => {
                if (!visited.has(dep)) {
                    const depModifier = map.get(dep);
                    if (depModifier) {
                        sort(depModifier);
                    }
                }
            });
            result.push(modifier);
        }
        modifiers.forEach(modifier => {
            if (!visited.has(modifier.name)) {
                // check for visited object
                sort(modifier);
            }
        });
        return result;
    }
    /**
     * @param modifiers
     */
    function orderModifiers(modifiers) {
        // order based on dependencies
        const orderedModifiers = order(modifiers);
        // order based on phase
        return modifierPhases.reduce((acc, phase) => acc.concat(orderedModifiers.filter(modifier => modifier.phase === phase)), []);
    }

    // @ts-nocheck
    /**
     * @param fn
     */
    function debounce(fn) {
        let pending;
        return () => {
            if (!pending) {
                pending = new Promise(resolve => {
                    Promise.resolve().then(() => {
                        pending = undefined;
                        resolve(fn());
                    });
                });
            }
            return pending;
        };
    }

    /**
     * @param placement
     */
    function getBasePlacement(placement) {
        return placement.split('-')[0];
    }

    /**
     * @param modifiers
     */
    function mergeByName(modifiers) {
        const merged = modifiers.reduce((merged, current) => {
            const existing = merged[current.name];
            merged[current.name] = existing
                ? Object.assign(Object.assign(Object.assign({}, existing), current), { options: Object.assign(Object.assign({}, existing.options), current.options), data: Object.assign(Object.assign({}, existing.data), current.data) }) : current;
            return merged;
        }, {});
        // IE11 does not support Object.values
        return Object.keys(merged).map(key => merged[key]);
    }

    // @ts-nocheck
    /**
     * @param element
     */
    function getViewportRect(element) {
        const win = getWindow(element);
        const html = getDocumentElement(element);
        const visualViewport = win.visualViewport;
        let width = html.clientWidth;
        let height = html.clientHeight;
        let x = 0;
        let y = 0;
        // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
        // can be obscured underneath it.
        // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
        // if it isn't open, so if this isn't available, the popper will be detected
        // to overflow the bottom of the screen too early.
        if (visualViewport) {
            width = visualViewport.width;
            height = visualViewport.height;
            // Uses Layout Viewport (like Chrome; Safari does not currently)
            // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
            // errors due to floating point numbers, so we need to check precision.
            // Safari returns a number <= 0, usually < -1 when pinch-zoomed
            // Feature detection fails in mobile emulation mode in Chrome.
            // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
            // 0.001
            // Fallback here: "Not Safari" userAgent
            if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                x = visualViewport.offsetLeft;
                y = visualViewport.offsetTop;
            }
        }
        return {
            width,
            height,
            x: x + getWindowScrollBarX(element),
            y
        };
    }

    // Gets the entire size of the scrollable document area, even extending outside
    // of the `<html>` and `<body>` rect bounds if horizontally scrollable
    /**
     * @param element
     */
    function getDocumentRect(element) {
        const html = getDocumentElement(element);
        const winScroll = getWindowScroll(element);
        const body = element.ownerDocument.body;
        const width = Math.max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
        const height = Math.max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
        let x = -winScroll.scrollLeft + getWindowScrollBarX(element);
        const y = -winScroll.scrollTop;
        if (getComputedStyle$1(body || html).direction === 'rtl') {
            x += Math.max(html.clientWidth, body ? body.clientWidth : 0) - width;
        }
        return { width, height, x, y };
    }

    // @ts-nocheck
    /**
     * @param parent
     * @param child
     */
    function contains(parent, child) {
        // $FlowFixMe: hasOwnProperty doesn't seem to work in tests
        const isShadow = Boolean(child.getRootNode && child.getRootNode().host);
        // First, attempt with faster native method
        if (parent.contains(child)) {
            return true;
        } // then fallback to custom implementation with Shadow DOM support
        else if (isShadow) {
            let next = child;
            do {
                if (next && parent.isSameNode(next)) {
                    return true;
                }
                // $FlowFixMe: need a better way to handle this...
                next = next.parentNode || next.host;
            } while (next);
        }
        // Give up, the result is false
        return false;
    }

    /**
     * @param rect
     */
    function rectToClientRect(rect) {
        return Object.assign(Object.assign({}, rect), { left: rect.x, top: rect.y, right: rect.x + rect.width, bottom: rect.y + rect.height });
    }

    /**
     * @param element
     */
    function getInnerBoundingClientRect(element) {
        const rect = getBoundingClientRect(element);
        rect.top = rect.top + element.clientTop;
        rect.left = rect.left + element.clientLeft;
        rect.bottom = rect.top + element.clientHeight;
        rect.right = rect.left + element.clientWidth;
        rect.width = element.clientWidth;
        rect.height = element.clientHeight;
        rect.x = rect.left;
        rect.y = rect.top;
        return rect;
    }
    /**
     * @param element
     * @param clippingParent
     */
    function getClientRectFromMixedType(element, clippingParent) {
        return clippingParent === viewport
            ? rectToClientRect(getViewportRect(element))
            : isHTMLElement(clippingParent)
                ? getInnerBoundingClientRect(clippingParent)
                : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    }
    // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`
    /**
     * @param element
     */
    function getClippingParents(element) {
        const clippingParents = listScrollParents(getParentNode(element));
        const canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
        const clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
        if (!isElement(clipperElement)) {
            return [];
        }
        // $FlowFixMe: https://github.com/facebook/flow/issues/1414
        return clippingParents.filter(clippingParent => isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body');
    }
    // Gets the maximum area that the element is visible in due to any number of
    // clipping parents
    /**
     * @param element
     * @param boundary
     * @param rootBoundary
     */
    function getClippingRect(element, boundary, rootBoundary) {
        const mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
        const clippingParents = [...mainClippingParents, rootBoundary];
        const firstClippingParent = clippingParents[0];
        const clippingRect = clippingParents.reduce((accRect, clippingParent) => {
            const rect = getClientRectFromMixedType(element, clippingParent);
            accRect.top = Math.max(rect.top, accRect.top);
            accRect.right = Math.min(rect.right, accRect.right);
            accRect.bottom = Math.min(rect.bottom, accRect.bottom);
            accRect.left = Math.max(rect.left, accRect.left);
            return accRect;
        }, getClientRectFromMixedType(element, firstClippingParent));
        clippingRect.width = clippingRect.right - clippingRect.left;
        clippingRect.height = clippingRect.bottom - clippingRect.top;
        clippingRect.x = clippingRect.left;
        clippingRect.y = clippingRect.top;
        return clippingRect;
    }

    /**
     * @param placement
     */
    function getVariation(placement) {
        return placement.split('-')[1];
    }

    /**
     * @param placement
     */
    function getMainAxisFromPlacement(placement) {
        return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    // @ts-nocheck
    /**
     *
     */
    function computeOffsets({ reference, element, placement }) {
        const basePlacement = placement ? getBasePlacement(placement) : null;
        const variation = placement ? getVariation(placement) : null;
        const commonX = reference.x + reference.width / 2 - element.width / 2;
        const commonY = reference.y + reference.height / 2 - element.height / 2;
        let offsets;
        switch (basePlacement) {
            case top:
                offsets = {
                    x: commonX,
                    y: reference.y - element.height
                };
                break;
            case bottom:
                offsets = {
                    x: commonX,
                    y: reference.y + reference.height
                };
                break;
            case right:
                offsets = {
                    x: reference.x + reference.width,
                    y: commonY
                };
                break;
            case left:
                offsets = {
                    x: reference.x - element.width,
                    y: commonY
                };
                break;
            default:
                offsets = {
                    x: reference.x,
                    y: reference.y
                };
        }
        const mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
        if (mainAxis != null) {
            const len = mainAxis === 'y' ? 'height' : 'width';
            switch (variation) {
                case start:
                    offsets[mainAxis] = Math.floor(offsets[mainAxis]) - Math.floor(reference[len] / 2 - element[len] / 2);
                    break;
                case end:
                    offsets[mainAxis] = Math.floor(offsets[mainAxis]) + Math.ceil(reference[len] / 2 - element[len] / 2);
                    break;
            }
        }
        return offsets;
    }

    /**
     *
     */
    function getFreshSideObject() {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }

    /**
     * @param paddingObject
     */
    function mergePaddingObject(paddingObject) {
        return Object.assign(Object.assign({}, getFreshSideObject()), paddingObject);
    }

    // @ts-nocheck
    /**
     * @param value
     * @param keys
     */
    function expandToHashMap(value, keys) {
        return keys.reduce((hashMap, key) => {
            hashMap[key] = value;
            return hashMap;
        }, {});
    }

    /**
     * @param state
     * @param options
     */
    function detectOverflow(state, options = {}) {
        const { placement = state.placement, boundary = clippingParents, rootBoundary = viewport, elementContext = popper, altBoundary = false, padding = 0 } = options;
        const paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
        const altContext = elementContext === popper ? reference : popper;
        const referenceElement = state.elements.reference;
        const popperRect = state.rects.popper;
        const element = state.elements[altBoundary ? altContext : elementContext];
        const clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
        const referenceClientRect = getBoundingClientRect(referenceElement);
        const popperOffsets = computeOffsets({
            reference: referenceClientRect,
            element: popperRect,
            strategy: 'absolute',
            placement
        });
        const popperClientRect = rectToClientRect(Object.assign(Object.assign({}, popperRect), popperOffsets));
        const elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
        // positive = overflowing the clipping rect
        // 0 or negative = within the clipping rect
        const overflowOffsets = {
            top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
            bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
            left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
            right: elementClientRect.right - clippingClientRect.right + paddingObject.right
        };
        const offsetData = state.modifiersData.offset;
        // Offsets can be applied only to the popper element
        if (elementContext === popper && offsetData) {
            const offset = offsetData[placement];
            Object.keys(overflowOffsets).forEach(key => {
                const multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
                const axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
                overflowOffsets[key] += offset[axis] * multiply;
            });
        }
        return overflowOffsets;
    }

    const DEFAULT_OPTIONS = {
        placement: 'bottom',
        modifiers: [],
        strategy: 'absolute'
    };
    /**
     * @param args
     */
    function areValidElements(...args) {
        return !args.some(element => !(element && typeof element.getBoundingClientRect === 'function'));
    }
    /**
     * @param generatorOptions
     */
    function popperGenerator(generatorOptions = {}) {
        const { defaultModifiers = [], defaultOptions = DEFAULT_OPTIONS } = generatorOptions;
        return function createPopper(reference, popper, options = defaultOptions) {
            let state = {
                placement: 'bottom',
                orderedModifiers: [],
                options: Object.assign(Object.assign({}, DEFAULT_OPTIONS), defaultOptions),
                modifiersData: {},
                elements: {
                    reference,
                    popper
                },
                attributes: {},
                styles: {}
            };
            let effectCleanupFns = [];
            let isDestroyed = false;
            const instance = {
                state,
                setOptions(options) {
                    cleanupModifierEffects();
                    state.options = Object.assign(Object.assign(Object.assign({}, defaultOptions), state.options), options);
                    state.scrollParents = {
                        reference: isElement(reference)
                            ? listScrollParents(reference)
                            : reference.contextElement
                                ? listScrollParents(reference.contextElement)
                                : [],
                        popper: listScrollParents(popper)
                    };
                    // Orders the modifiers based on their dependencies and `phase`
                    // properties
                    const orderedModifiers = orderModifiers(mergeByName([...defaultModifiers, ...state.options.modifiers]));
                    // Strip out disabled modifiers
                    state.orderedModifiers = orderedModifiers.filter(m => m.enabled);
                    runModifierEffects();
                    return instance.update();
                },
                // Sync update – it will always be executed, even if not necessary. This
                // is useful for low frequency updates where sync behavior simplifies the
                // logic.
                // For high frequency updates (e.g. `resize` and `scroll` events), always
                // prefer the async Popper#update method
                forceUpdate() {
                    if (isDestroyed) {
                        return;
                    }
                    const { reference, popper } = state.elements;
                    // Don't proceed if `reference` or `popper` are not valid elements
                    // anymore
                    if (!areValidElements(reference, popper)) {
                        return;
                    }
                    // Store the reference and popper rects to be read by modifiers
                    state.rects = {
                        reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
                        popper: getLayoutRect(popper)
                    };
                    // Modifiers have the ability to reset the current update cycle. The
                    // most common use case for this is the `flip` modifier changing the
                    // placement, which then needs to re-run all the modifiers, because the
                    // logic was previously ran for the previous placement and is therefore
                    // stale/incorrect
                    state.reset = false;
                    state.placement = state.options.placement;
                    // On each update cycle, the `modifiersData` property for each modifier
                    // is filled with the initial data specified by the modifier. This means
                    // it doesn't persist and is fresh on each update.
                    // To ensure persistent data, use `${name}#persistent`
                    state.orderedModifiers.forEach(modifier => (state.modifiersData[modifier.name] = Object.assign({}, modifier.data)));
                    for (let index = 0; index < state.orderedModifiers.length; index++) {
                        if (state.reset === true) {
                            state.reset = false;
                            index = -1;
                            continue;
                        }
                        const { fn, options = {}, name } = state.orderedModifiers[index];
                        if (typeof fn === 'function') {
                            state = fn({ state, options, name, instance }) || state;
                        }
                    }
                },
                // Async and optimistically optimized update – it will not be executed if
                // not necessary (debounced to run at most once-per-tick)
                update: debounce(() => new Promise(resolve => {
                    instance.forceUpdate();
                    resolve(state);
                })),
                destroy() {
                    cleanupModifierEffects();
                    isDestroyed = true;
                }
            };
            if (!areValidElements(reference, popper)) {
                return instance;
            }
            instance.setOptions(options).then(state => {
                if (!isDestroyed && options.onFirstUpdate) {
                    options.onFirstUpdate(state);
                }
            });
            // Modifiers have the ability to execute arbitrary code before the first
            // update cycle runs. They will be executed in the same order as the update
            // cycle. This is useful when a modifier adds some persistent data that
            // other modifiers need to use, but the modifier is run after the dependent
            // one.
            /**
             *
             */
            function runModifierEffects() {
                state.orderedModifiers.forEach(({ name, options = {}, effect }) => {
                    if (typeof effect === 'function') {
                        const cleanupFn = effect({ state, name, instance, options });
                        const noopFn = () => { };
                        effectCleanupFns.push(cleanupFn || noopFn);
                    }
                });
            }
            /**
             *
             */
            function cleanupModifierEffects() {
                effectCleanupFns.forEach(fn => fn());
                effectCleanupFns = [];
            }
            return instance;
        };
    }

    const passive = { passive: true };
    /**
     *
     */
    function effect$2({ state, instance, options }) {
        const { scroll = true, resize = true } = options;
        const window = getWindow(state.elements.popper);
        const scrollParents = [...state.scrollParents.reference, ...state.scrollParents.popper];
        if (scroll) {
            scrollParents.forEach(scrollParent => {
                scrollParent.addEventListener('scroll', instance.update, passive);
            });
        }
        if (resize) {
            window.addEventListener('resize', instance.update, passive);
        }
        return () => {
            if (scroll) {
                scrollParents.forEach(scrollParent => {
                    scrollParent.removeEventListener('scroll', instance.update, passive);
                });
            }
            if (resize) {
                window.removeEventListener('resize', instance.update, passive);
            }
        };
    }
    var eventListeners = {
        name: 'eventListeners',
        enabled: true,
        phase: 'write',
        fn: () => { },
        effect: effect$2,
        data: {}
    };

    /**
     *
     */
    function popperOffsets({ state, name }) {
        // Offsets are the actual position the popper needs to have to be
        // properly positioned near its reference element
        // This is the most basic placement, and will be adjusted by
        // the modifiers in the next step
        state.modifiersData[name] = computeOffsets({
            reference: state.rects.reference,
            element: state.rects.popper,
            strategy: 'absolute',
            placement: state.placement
        });
    }
    var popperOffsets$1 = {
        name: 'popperOffsets',
        enabled: true,
        phase: 'read',
        fn: popperOffsets,
        data: {}
    };

    const unsetSides = {
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto'
    };
    // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.
    /**
     *
     */
    function roundOffsets({ x, y }) {
        const win = window;
        const dpr = win.devicePixelRatio || 1;
        return {
            x: Math.round(x * dpr) / dpr || 0,
            y: Math.round(y * dpr) / dpr || 0
        };
    }
    /**
     *
     */
    function mapToStyles({ popper, popperRect, placement, offsets, position, gpuAcceleration, adaptive }) {
        let { x, y } = roundOffsets(offsets);
        const hasX = offsets.hasOwnProperty('x');
        const hasY = offsets.hasOwnProperty('y');
        let sideX = left;
        let sideY = top;
        const win = window;
        if (adaptive) {
            let offsetParent = getOffsetParent(popper);
            if (offsetParent === getWindow(popper)) {
                offsetParent = getDocumentElement(popper);
            }
            // $FlowFixMe: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it
            /* :: offsetParent = (offsetParent: Element); */
            if (placement === top) {
                sideY = bottom;
                y -= offsetParent.clientHeight - popperRect.height;
                y *= gpuAcceleration ? 1 : -1;
            }
            if (placement === left) {
                sideX = right;
                x -= offsetParent.clientWidth - popperRect.width;
                x *= gpuAcceleration ? 1 : -1;
            }
        }
        const commonStyles = Object.assign({ position }, (adaptive && unsetSides));
        if (gpuAcceleration) {
            return Object.assign(Object.assign({}, commonStyles), { [sideY]: hasY ? '0' : '', [sideX]: hasX ? '0' : '', 
                // Layer acceleration can disable subpixel rendering which causes slightly
                // blurry text on low PPI displays, so we want to use 2D transforms
                // instead
                transform: (win.devicePixelRatio || 1) < 2 ? `translate(${x}px, ${y}px)` : `translate3d(${x}px, ${y}px, 0)` });
        }
        return Object.assign(Object.assign({}, commonStyles), { [sideY]: hasY ? `${y}px` : '', [sideX]: hasX ? `${x}px` : '', transform: '' });
    }
    /**
     *
     */
    function computeStyles({ state, options }) {
        const { gpuAcceleration = true, adaptive = true } = options;
        const commonStyles = {
            placement: getBasePlacement(state.placement),
            popper: state.elements.popper,
            popperRect: state.rects.popper,
            gpuAcceleration
        };
        if (state.modifiersData.popperOffsets != null) {
            state.styles.popper = Object.assign(Object.assign({}, state.styles.popper), mapToStyles(Object.assign(Object.assign({}, commonStyles), { offsets: state.modifiersData.popperOffsets, position: state.options.strategy, adaptive })));
        }
        if (state.modifiersData.arrow != null) {
            state.styles.arrow = Object.assign(Object.assign({}, state.styles.arrow), mapToStyles(Object.assign(Object.assign({}, commonStyles), { offsets: state.modifiersData.arrow, position: 'absolute', adaptive: false })));
        }
        state.attributes.popper = Object.assign(Object.assign({}, state.attributes.popper), { 'data-popper-placement': state.placement });
    }
    var computeStyles$1 = {
        name: 'computeStyles',
        enabled: true,
        phase: 'beforeWrite',
        fn: computeStyles,
        data: {}
    };

    // This modifier takes the styles prepared by the `computeStyles` modifier
    // and applies them to the HTMLElements such as popper and arrow
    /**
     *
     */
    function applyStyles({ state }) {
        Object.keys(state.elements).forEach(name => {
            const style = state.styles[name] || {};
            const attributes = state.attributes[name] || {};
            const element = state.elements[name];
            // arrow is optional + virtual elements
            if (!isHTMLElement(element) || !getNodeName(element)) {
                return;
            }
            // Flow doesn't support to extend this property, but it's the most
            // effective way to apply styles to an HTMLElement
            // $FlowFixMe
            Object.assign(element.style, style);
            Object.keys(attributes).forEach(name => {
                const value = attributes[name];
                if (value === false) {
                    element.removeAttribute(name);
                }
                else {
                    element.setAttribute(name, value === true ? '' : value);
                }
            });
        });
    }
    /**
     *
     */
    function effect$1({ state }) {
        const initialStyles = {
            popper: {
                position: state.options.strategy,
                left: '0',
                top: '0',
                margin: '0'
            },
            arrow: {
                position: 'absolute'
            },
            reference: {}
        };
        Object.assign(state.elements.popper.style, initialStyles.popper);
        if (state.elements.arrow) {
            Object.assign(state.elements.arrow.style, initialStyles.arrow);
        }
        return () => {
            Object.keys(state.elements).forEach(name => {
                const element = state.elements[name];
                const attributes = state.attributes[name] || {};
                const styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
                // Set all values to an empty string to unset them
                const style = styleProperties.reduce((style, property) => {
                    style[property] = '';
                    return style;
                }, {});
                // arrow is optional + virtual elements
                if (!isHTMLElement(element) || !getNodeName(element)) {
                    return;
                }
                // Flow doesn't support to extend this property, but it's the most
                // effective way to apply styles to an HTMLElement
                // $FlowFixMe
                Object.assign(element.style, style);
                Object.keys(attributes).forEach(attribute => {
                    element.removeAttribute(attribute);
                });
            });
        };
    }
    var applyStyles$1 = {
        name: 'applyStyles',
        enabled: true,
        phase: 'write',
        fn: applyStyles,
        effect: effect$1,
        requires: ['computeStyles']
    };

    /**
     * @param placement
     * @param rects
     * @param offset
     */
    function distanceAndSkiddingToXY(placement, rects, offset) {
        const basePlacement = getBasePlacement(placement);
        const invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
        let [skidding, distance] = typeof offset === 'function'
            ? offset(Object.assign(Object.assign({}, rects), { placement }))
            : offset;
        skidding = skidding || 0;
        distance = (distance || 0) * invertDistance;
        return [left, right].indexOf(basePlacement) >= 0 ? { x: distance, y: skidding } : { x: skidding, y: distance };
    }
    /**
     *
     */
    function offset({ state, options, name }) {
        const { offset = [0, 0] } = options;
        const data = placements.reduce((acc, placement) => {
            acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
            return acc;
        }, {});
        const { x, y } = data[state.placement];
        if (state.modifiersData.popperOffsets != null) {
            state.modifiersData.popperOffsets.x += x;
            state.modifiersData.popperOffsets.y += y;
        }
        state.modifiersData[name] = data;
    }
    var offset$1 = {
        name: 'offset',
        enabled: true,
        phase: 'main',
        requires: ['popperOffsets'],
        fn: offset
    };

    const hash$2 = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    /**
     * @param placement
     */
    function getOppositePlacement$1(placement) {
        return placement.replace(/left|right|bottom|top/g, matched => hash$2[matched]);
    }

    const hash$1 = { start: 'end', end: 'start' };
    /**
     * @param placement
     */
    function getOppositeVariationPlacement(placement) {
        return placement.replace(/start|end/g, matched => hash$1[matched]);
    }

    /* :: type OverflowsMap = { [ComputedPlacement]: number }; */
    /* ;; type OverflowsMap = { [key in ComputedPlacement]: number }; */
    /**
     * @param state
     * @param options
     */
    function computeAutoPlacement(state, options = {}) {
        const { placement, boundary, rootBoundary, padding, flipVariations, allowedAutoPlacements = placements } = options;
        const variation = getVariation(placement);
        const placements$1 = variation
            ? flipVariations
                ? variationPlacements
                : variationPlacements.filter(placement => getVariation(placement) === variation)
            : basePlacements;
        // $FlowFixMe
        let allowedPlacements = placements$1.filter(placement => allowedAutoPlacements.indexOf(placement) >= 0);
        if (allowedPlacements.length === 0) {
            allowedPlacements = placements$1;
        }
        // $FlowFixMe: Flow seems to have problems with two array unions...
        const overflows = allowedPlacements.reduce((acc, placement) => {
            acc[placement] = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                padding
            })[getBasePlacement(placement)];
            return acc;
        }, {});
        return Object.keys(overflows).sort((a, b) => overflows[a] - overflows[b]);
    }

    /**
     * @param placement
     */
    function getExpandedFallbackPlacements(placement) {
        if (getBasePlacement(placement) === auto) {
            return [];
        }
        const oppositePlacement = getOppositePlacement$1(placement);
        return [
            getOppositeVariationPlacement(placement),
            oppositePlacement,
            getOppositeVariationPlacement(oppositePlacement)
        ];
    }
    /**
     *
     */
    function flip({ state, options, name }) {
        if (state.modifiersData[name]._skip) {
            return;
        }
        const { mainAxis: checkMainAxis = true, altAxis: checkAltAxis = true, fallbackPlacements: specifiedFallbackPlacements, padding, boundary, rootBoundary, altBoundary, flipVariations = true, allowedAutoPlacements } = options;
        const preferredPlacement = state.options.placement;
        const basePlacement = getBasePlacement(preferredPlacement);
        const isBasePlacement = basePlacement === preferredPlacement;
        const fallbackPlacements = specifiedFallbackPlacements ||
            (isBasePlacement || !flipVariations
                ? [getOppositePlacement$1(preferredPlacement)]
                : getExpandedFallbackPlacements(preferredPlacement));
        const placements = [preferredPlacement, ...fallbackPlacements].reduce((acc, placement) => acc.concat(getBasePlacement(placement) === auto
            ? computeAutoPlacement(state, {
                placement,
                boundary,
                rootBoundary,
                padding,
                flipVariations,
                allowedAutoPlacements
            })
            : placement), []);
        const referenceRect = state.rects.reference;
        const popperRect = state.rects.popper;
        const checksMap = new Map();
        let makeFallbackChecks = true;
        let firstFittingPlacement = placements[0];
        for (let i = 0; i < placements.length; i++) {
            const placement = placements[i];
            const basePlacement = getBasePlacement(placement);
            const isStartVariation = getVariation(placement) === start;
            const isVertical = [top, bottom].indexOf(basePlacement) >= 0;
            const len = isVertical ? 'width' : 'height';
            const overflow = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                altBoundary,
                padding
            });
            let mainVariationSide = isVertical ? (isStartVariation ? right : left) : isStartVariation ? bottom : top;
            if (referenceRect[len] > popperRect[len]) {
                mainVariationSide = getOppositePlacement$1(mainVariationSide);
            }
            const altVariationSide = getOppositePlacement$1(mainVariationSide);
            const checks = [];
            if (checkMainAxis) {
                checks.push(overflow[basePlacement] <= 0);
            }
            if (checkAltAxis) {
                checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
            }
            if (checks.every(check => check)) {
                firstFittingPlacement = placement;
                makeFallbackChecks = false;
                break;
            }
            checksMap.set(placement, checks);
        }
        if (makeFallbackChecks) {
            // `2` may be desired in some cases – research later
            const numberOfChecks = flipVariations ? 3 : 1;
            for (let i = numberOfChecks; i > 0; i--) {
                const fittingPlacement = placements.find(placement => {
                    const checks = checksMap.get(placement);
                    if (checks) {
                        return checks.slice(0, i).every(check => check);
                    }
                });
                if (fittingPlacement) {
                    firstFittingPlacement = fittingPlacement;
                    break;
                }
            }
        }
        if (state.placement !== firstFittingPlacement) {
            state.modifiersData[name]._skip = true;
            state.placement = firstFittingPlacement;
            state.reset = true;
        }
    }
    var flip$1 = {
        name: 'flip',
        enabled: true,
        phase: 'main',
        fn: flip,
        requiresIfExists: ['offset'],
        data: { _skip: false }
    };

    // @ts-nocheck
    /**
     * @param axis
     */
    function getAltAxis(axis) {
        return axis === 'x' ? 'y' : 'x';
    }

    // @ts-nocheck
    /**
     * @param min
     * @param value
     * @param max
     */
    function within(min, value, max) {
        return Math.max(min, Math.min(value, max));
    }

    // @ts-nocheck
    /**
     *
     */
    function preventOverflow({ state, options, name }) {
        const { mainAxis: checkMainAxis = true, altAxis: checkAltAxis = false, boundary, rootBoundary, altBoundary, padding, tether = true, tetherOffset = 0 } = options;
        const overflow = detectOverflow(state, {
            boundary,
            rootBoundary,
            padding,
            altBoundary
        });
        const basePlacement = getBasePlacement(state.placement);
        const variation = getVariation(state.placement);
        const isBasePlacement = !variation;
        const mainAxis = getMainAxisFromPlacement(basePlacement);
        const altAxis = getAltAxis(mainAxis);
        const popperOffsets = state.modifiersData.popperOffsets;
        const referenceRect = state.rects.reference;
        const popperRect = state.rects.popper;
        const tetherOffsetValue = typeof tetherOffset === 'function'
            ? tetherOffset(Object.assign(Object.assign({}, state.rects), { placement: state.placement }))
            : tetherOffset;
        const data = { x: 0, y: 0 };
        if (!popperOffsets) {
            return;
        }
        if (checkMainAxis) {
            const mainSide = mainAxis === 'y' ? top : left;
            const altSide = mainAxis === 'y' ? bottom : right;
            const len = mainAxis === 'y' ? 'height' : 'width';
            const offset = popperOffsets[mainAxis];
            const min = popperOffsets[mainAxis] + overflow[mainSide];
            const max = popperOffsets[mainAxis] - overflow[altSide];
            const additive = tether ? -popperRect[len] / 2 : 0;
            const minLen = variation === start ? referenceRect[len] : popperRect[len];
            const maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
            // We need to include the arrow in the calculation so the arrow doesn't go
            // outside the reference bounds
            const arrowElement = state.elements.arrow;
            const arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : { width: 0, height: 0 };
            const arrowPaddingObject = state.modifiersData['arrow#persistent']
                ? state.modifiersData['arrow#persistent'].padding
                : getFreshSideObject();
            const arrowPaddingMin = arrowPaddingObject[mainSide];
            const arrowPaddingMax = arrowPaddingObject[altSide];
            // If the reference length is smaller than the arrow length, we don't want
            // to include its full size in the calculation. If the reference is small
            // and near the edge of a boundary, the popper can overflow even if the
            // reference is not overflowing as well (e.g. virtual elements with no
            // width or height)
            const arrowLen = within(0, referenceRect[len], arrowRect[len]);
            const minOffset = isBasePlacement
                ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue
                : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
            const maxOffset = isBasePlacement
                ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue
                : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
            const arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
            const clientOffset = arrowOffsetParent
                ? mainAxis === 'y'
                    ? arrowOffsetParent.clientTop || 0
                    : arrowOffsetParent.clientLeft || 0
                : 0;
            const offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
            const tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
            const tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;
            const preventedOffset = within(tether ? Math.min(min, tetherMin) : min, offset, tether ? Math.max(max, tetherMax) : max);
            popperOffsets[mainAxis] = preventedOffset;
            data[mainAxis] = preventedOffset - offset;
        }
        if (checkAltAxis) {
            const mainSide = mainAxis === 'x' ? top : left;
            const altSide = mainAxis === 'x' ? bottom : right;
            const offset = popperOffsets[altAxis];
            const min = offset + overflow[mainSide];
            const max = offset - overflow[altSide];
            const preventedOffset = within(min, offset, max);
            popperOffsets[altAxis] = preventedOffset;
            data[altAxis] = preventedOffset - offset;
        }
        state.modifiersData[name] = data;
    }
    var preventOverflow$1 = {
        name: 'preventOverflow',
        enabled: true,
        phase: 'main',
        fn: preventOverflow,
        requiresIfExists: ['offset']
    };

    /**
     *
     */
    function arrow({ state, name }) {
        const arrowElement = state.elements.arrow;
        const popperOffsets = state.modifiersData.popperOffsets;
        const basePlacement = getBasePlacement(state.placement);
        const axis = getMainAxisFromPlacement(basePlacement);
        const isVertical = [left, right].indexOf(basePlacement) >= 0;
        const len = isVertical ? 'height' : 'width';
        if (!arrowElement || !popperOffsets) {
            return;
        }
        const paddingObject = state.modifiersData[`${name}#persistent`].padding;
        const arrowRect = getLayoutRect(arrowElement);
        const minProp = axis === 'y' ? top : left;
        const maxProp = axis === 'y' ? bottom : right;
        const endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
        const startDiff = popperOffsets[axis] - state.rects.reference[axis];
        const arrowOffsetParent = getOffsetParent(arrowElement);
        const clientSize = arrowOffsetParent
            ? axis === 'y'
                ? arrowOffsetParent.clientHeight || 0
                : arrowOffsetParent.clientWidth || 0
            : 0;
        const centerToReference = endDiff / 2 - startDiff / 2;
        // Make sure the arrow doesn't overflow the popper if the center point is
        // outside of the popper bounds
        const min = paddingObject[minProp];
        const max = clientSize - arrowRect[len] - paddingObject[maxProp];
        const center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
        const offset = within(min, center, max);
        // Prevents breaking syntax highlighting...
        const axisProp = axis;
        state.modifiersData[name] = {
            [axisProp]: offset,
            centerOffset: offset - center
        };
    }
    /**
     *
     */
    function effect({ state, options, name }) {
        let { element: arrowElement = '[data-popper-arrow]', padding = 0 } = options;
        if (arrowElement == null) {
            return;
        }
        // CSS selector
        if (typeof arrowElement === 'string') {
            arrowElement = state.elements.popper.querySelector(arrowElement);
            if (!arrowElement) {
                return;
            }
        }
        if (!contains(state.elements.popper, arrowElement)) {
            return;
        }
        state.elements.arrow = arrowElement;
        state.modifiersData[`${name}#persistent`] = {
            padding: mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements))
        };
    }
    var arrow$1 = {
        name: 'arrow',
        enabled: true,
        phase: 'main',
        fn: arrow,
        effect,
        requires: ['popperOffsets'],
        requiresIfExists: ['preventOverflow']
    };

    /**
     * @param overflow
     * @param rect
     * @param preventedOffsets
     */
    function getSideOffsets(overflow, rect, preventedOffsets = { x: 0, y: 0 }) {
        return {
            top: overflow.top - rect.height - preventedOffsets.y,
            right: overflow.right - rect.width + preventedOffsets.x,
            bottom: overflow.bottom - rect.height + preventedOffsets.y,
            left: overflow.left - rect.width - preventedOffsets.x
        };
    }
    /**
     * @param overflow
     */
    function isAnySideFullyClipped(overflow) {
        return [top, right, bottom, left].some(side => overflow[side] >= 0);
    }
    /**
     *
     */
    function hide({ state, name }) {
        const referenceRect = state.rects.reference;
        const popperRect = state.rects.popper;
        const preventedOffsets = state.modifiersData.preventOverflow;
        const referenceOverflow = detectOverflow(state, {
            elementContext: 'reference'
        });
        const popperAltOverflow = detectOverflow(state, {
            altBoundary: true
        });
        const referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
        const popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
        const isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
        const hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
        state.modifiersData[name] = {
            referenceClippingOffsets,
            popperEscapeOffsets,
            isReferenceHidden,
            hasPopperEscaped
        };
        state.attributes.popper = Object.assign(Object.assign({}, state.attributes.popper), { 'data-popper-reference-hidden': isReferenceHidden, 'data-popper-escaped': hasPopperEscaped });
    }
    var hide$1 = {
        name: 'hide',
        enabled: true,
        phase: 'main',
        requiresIfExists: ['preventOverflow'],
        fn: hide
    };

    // @ts-nocheck
    const defaultModifiers = [
        eventListeners,
        popperOffsets$1,
        computeStyles$1,
        applyStyles$1,
        offset$1,
        flip$1,
        preventOverflow$1,
        arrow$1,
        hide$1
    ];
    const createPopper = popperGenerator({ defaultModifiers });

    /**
     * Small wrapper around `useLayoutEffect` to get rid of the warning on SSR envs
     */
    const useIsomorphicLayoutEffect = canUseDOM ? React__namespace.useLayoutEffect : React__namespace.useEffect;

    /* eslint-disable @typescript-eslint/consistent-type-definitions */
    const isEqual$1 = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    /**
     * Simple ponyfill for Object.fromEntries
     */
    const fromEntries = (entries) => entries.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
    const EMPTY_MODIFIERS = [];
    const usePopper = (referenceElement, popperElement, options = {}) => {
        const prevOptions = React__namespace.useRef(null);
        const optionsWithDefaults = {
            onFirstUpdate: options.onFirstUpdate,
            placement: options.placement || 'bottom',
            strategy: options.strategy || 'absolute',
            modifiers: options.modifiers || EMPTY_MODIFIERS
        };
        const [state, setState] = React__namespace.useState({
            styles: {
                popper: {
                    position: optionsWithDefaults.strategy,
                    left: '0',
                    top: '0'
                }
            },
            attributes: {}
        });
        const updateStateModifier = React__namespace.useMemo(() => ({
            name: 'updateState',
            enabled: true,
            phase: 'write',
            // eslint-disable-next-line no-shadow
            fn: ({ state }) => {
                const elements = Object.keys(state.elements);
                setState({
                    styles: fromEntries(elements.map(element => [element, state.styles[element] || {}])),
                    attributes: fromEntries(elements.map(element => [element, state.attributes[element]]))
                });
            },
            requires: ['computeStyles']
        }), []);
        const popperOptions = React__namespace.useMemo(() => {
            const newOptions = {
                onFirstUpdate: optionsWithDefaults.onFirstUpdate,
                placement: optionsWithDefaults.placement,
                strategy: optionsWithDefaults.strategy,
                modifiers: [...optionsWithDefaults.modifiers, updateStateModifier, { name: 'applyStyles', enabled: false }]
            };
            if (isEqual$1(prevOptions.current, newOptions)) {
                return prevOptions.current || newOptions;
            }
            else {
                prevOptions.current = newOptions;
                return newOptions;
            }
        }, [
            optionsWithDefaults.onFirstUpdate,
            optionsWithDefaults.placement,
            optionsWithDefaults.strategy,
            optionsWithDefaults.modifiers,
            updateStateModifier
        ]);
        const popperInstanceRef = React__namespace.useRef();
        useIsomorphicLayoutEffect(() => {
            if (popperInstanceRef && popperInstanceRef.current) {
                popperInstanceRef.current.setOptions(popperOptions);
            }
        }, [popperOptions]);
        useIsomorphicLayoutEffect(() => {
            if (referenceElement == null || popperElement == null) {
                return;
            }
            const createPopper$1 = options.createPopper || createPopper;
            const popperInstance = createPopper$1(referenceElement, popperElement, popperOptions);
            popperInstanceRef.current = popperInstance;
            return () => {
                popperInstance.destroy();
                popperInstanceRef.current = null;
            };
        }, [referenceElement, popperElement, options.createPopper]);
        return {
            state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
            styles: state.styles,
            attributes: state.attributes,
            update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
            forceUpdate: popperInstanceRef.current ? popperInstanceRef.current.forceUpdate : null
        };
    };

    const hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    const getOppositePlacement = (placement) => placement.replace(/left|right|bottom|top/g, (matched) => hash[matched]);
    const getOpacityTransition = (animationDuration) => `opacity ${animationDuration}ms cubic-bezier(.54, 1.5, .38, 1.11)`;
    const Popper = ({ trigger, popper, popperMatchesTriggerWidth = true, direction = 'down', position = 'left', placement, appendTo = () => document.body, zIndex = 9999, isVisible = true, positionModifiers, distance = 0, onMouseEnter, onMouseLeave, onFocus, onBlur, onDocumentClick, onTriggerClick, onTriggerEnter, onPopperClick, onDocumentKeyDown, enableFlip = true, flipBehavior = 'flip', reference }) => {
        const [triggerElement, setTriggerElement] = React__namespace.useState(null);
        const [refElement, setRefElement] = React__namespace.useState(null);
        const [popperElement, setPopperElement] = React__namespace.useState(null);
        const [ready, setReady] = React__namespace.useState(false);
        const refOrTrigger = refElement || triggerElement;
        const onDocumentClickCallback = React__namespace.useCallback((event) => onDocumentClick(event, refOrTrigger, popperElement), [isVisible, triggerElement, refElement, popperElement, onDocumentClick]);
        React__namespace.useEffect(() => {
            setReady(true);
        }, []);
        React__namespace.useEffect(() => {
            if (reference) {
                if (reference.current) {
                    setRefElement(reference.current);
                }
                else if (typeof reference === 'function') {
                    setRefElement(reference());
                }
            }
        }, [reference]);
        const addEventListener = (listener, element, event) => {
            if (listener && element) {
                element.addEventListener(event, listener);
            }
        };
        const removeEventListener = (listener, element, event) => {
            if (listener && element) {
                element.removeEventListener(event, listener);
            }
        };
        React__namespace.useEffect(() => {
            addEventListener(onMouseEnter, refOrTrigger, 'mouseenter');
            addEventListener(onMouseLeave, refOrTrigger, 'mouseleave');
            addEventListener(onFocus, refOrTrigger, 'focus');
            addEventListener(onBlur, refOrTrigger, 'blur');
            addEventListener(onTriggerClick, refOrTrigger, 'click');
            addEventListener(onTriggerEnter, refOrTrigger, 'keydown');
            addEventListener(onPopperClick, popperElement, 'click');
            onDocumentClick && addEventListener(onDocumentClickCallback, document, 'click');
            addEventListener(onDocumentKeyDown, document, 'keydown');
            // Trigger a Popper update when content changes.
            const observer = new MutationObserver(() => {
                update && update();
            });
            popperElement && observer.observe(popperElement, { attributes: true, childList: true, subtree: true });
            return () => {
                removeEventListener(onMouseEnter, refOrTrigger, 'mouseenter');
                removeEventListener(onMouseLeave, refOrTrigger, 'mouseleave');
                removeEventListener(onFocus, refOrTrigger, 'focus');
                removeEventListener(onBlur, refOrTrigger, 'blur');
                removeEventListener(onTriggerClick, refOrTrigger, 'click');
                removeEventListener(onTriggerEnter, refOrTrigger, 'keydown');
                removeEventListener(onPopperClick, popperElement, 'click');
                onDocumentClick && removeEventListener(onDocumentClickCallback, document, 'click');
                removeEventListener(onDocumentKeyDown, document, 'keydown');
                observer.disconnect();
            };
        }, [
            triggerElement,
            popperElement,
            onMouseEnter,
            onMouseLeave,
            onFocus,
            onBlur,
            onTriggerClick,
            onTriggerEnter,
            onPopperClick,
            onDocumentClick,
            onDocumentKeyDown,
            refElement
        ]);
        const getPlacement = () => {
            if (placement) {
                return placement;
            }
            let convertedPlacement = direction === 'up' ? 'top' : 'bottom';
            if (position !== 'center') {
                convertedPlacement = `${convertedPlacement}-${position === 'right' ? 'end' : 'start'}`;
            }
            return convertedPlacement;
        };
        const getPlacementMemo = React__namespace.useMemo(getPlacement, [direction, position, placement]);
        const getOppositePlacementMemo = React__namespace.useMemo(() => getOppositePlacement(getPlacement()), [
            direction,
            position,
            placement
        ]);
        const sameWidthMod = React__namespace.useMemo(() => ({
            name: 'sameWidth',
            enabled: popperMatchesTriggerWidth,
            phase: 'beforeWrite',
            requires: ['computeStyles'],
            fn: ({ state }) => {
                state.styles.popper.width = `${state.rects.reference.width}px`;
            },
            effect: ({ state }) => {
                state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
                return () => { };
            }
        }), [popperMatchesTriggerWidth]);
        const { styles: popperStyles, attributes, update } = usePopper(refOrTrigger, popperElement, {
            placement: getPlacementMemo,
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, distance]
                    }
                },
                {
                    name: 'preventOverflow',
                    enabled: false
                },
                {
                    // adds attribute [data-popper-reference-hidden] to the popper element which can be used to hide it using CSS
                    name: 'hide',
                    enabled: true
                },
                {
                    name: 'flip',
                    enabled: getPlacementMemo.startsWith('auto') || enableFlip,
                    options: {
                        fallbackPlacements: flipBehavior === 'flip' ? [getOppositePlacementMemo] : flipBehavior
                    }
                },
                sameWidthMod
            ]
        });
        // Returns the CSS modifier class in order to place the Popper's arrow properly
        // Depends on the position of the Popper relative to the reference element
        const modifierFromPopperPosition = () => {
            if (attributes && attributes.popper && attributes.popper['data-popper-placement']) {
                const popperPlacement = attributes.popper['data-popper-placement'];
                return positionModifiers[popperPlacement];
            }
            return positionModifiers.top;
        };
        const menuWithPopper = React__namespace.cloneElement(popper, Object.assign({ className: css(popper.props && popper.props.className, positionModifiers && modifierFromPopperPosition()), style: Object.assign(Object.assign(Object.assign({}, ((popper.props && popper.props.style) || {})), popperStyles.popper), { zIndex }) }, attributes.popper));
        const getTarget = () => {
            if (typeof appendTo === 'function') {
                return appendTo();
            }
            return appendTo;
        };
        return (React__namespace.createElement(React__namespace.Fragment, null,
            !reference && trigger && (React__namespace.createElement(FindRefWrapper, { onFoundRef: (foundRef) => setTriggerElement(foundRef) }, trigger)),
            ready &&
                isVisible &&
                ReactDOM__namespace.createPortal(React__namespace.createElement(FindRefWrapper, { onFoundRef: (foundRef) => setPopperElement(foundRef) }, menuWithPopper), getTarget())));
    };
    Popper.displayName = 'Popper';

    /**
     * This function is a helper for handling basic arrow keyboard interactions. If a component already has its own key handler and event start up/tear down, this function may be easier to integrate in over the full component.
     *
     * @param {event} event Event triggered by the keyboard
     * @param {element[]} navigableElements Valid traversable elements of the container
     * @param {function} isActiveElement Callback to determine if a given element from the navigable elements array is the active element of the page
     * @param {function} getFocusableElement Callback returning the focusable element of a given element from the navigable elements array
     * @param {string[]} validSiblingTags Valid sibling tags that horizontal arrow handling will focus
     * @param {boolean} noVerticalArrowHandling Flag indicating that the included vertical arrow key handling should be ignored
     * @param {boolean} noHorizontalArrowHandling Flag indicating that the included horizontal arrow key handling should be ignored
     * @param {boolean} updateTabIndex Flag indicating that the tabIndex of the currently focused element and next focused element should be updated, in the case of using a roving tabIndex
     * @param {boolean} onlyTraverseSiblings Flag indicating that next focusable element of a horizontal movement will be this element's sibling
     */
    const handleArrows = (event, navigableElements, isActiveElement = element => document.activeElement.contains(element), getFocusableElement = element => element, validSiblingTags = ['A', 'BUTTON', 'INPUT'], noVerticalArrowHandling = false, noHorizontalArrowHandling = false, updateTabIndex = true, onlyTraverseSiblings = true) => {
        const activeElement = document.activeElement;
        const key = event.key;
        let moveTarget = null;
        // Handle vertical arrow keys. If noVerticalArrowHandling is passed, skip this block
        if (!noVerticalArrowHandling) {
            if (['ArrowUp', 'ArrowDown'].includes(key)) {
                event.preventDefault();
                event.stopImmediatePropagation(); // For menus in menus
                // Traverse navigableElements to find the element which is currently active
                let currentIndex = -1;
                // while (currentIndex === -1) {
                navigableElements.forEach((element, index) => {
                    if (isActiveElement(element)) {
                        // Once found, move up or down the array by 1. Determined by the vertical arrow key direction
                        let increment = 0;
                        // keep increasing the increment until you've tried the whole navigableElement
                        while (!moveTarget && increment < navigableElements.length && increment * -1 < navigableElements.length) {
                            key === 'ArrowUp' ? increment-- : increment++;
                            currentIndex = index + increment;
                            if (currentIndex >= navigableElements.length) {
                                currentIndex = 0;
                            }
                            if (currentIndex < 0) {
                                currentIndex = navigableElements.length - 1;
                            }
                            // Set the next target element (undefined if none found)
                            moveTarget = getFocusableElement(navigableElements[currentIndex]);
                        }
                    }
                });
                // }
            }
        }
        // Handle horizontal arrow keys. If noHorizontalArrowHandling is passed, skip this block
        if (!noHorizontalArrowHandling) {
            if (['ArrowLeft', 'ArrowRight'].includes(key)) {
                event.preventDefault();
                event.stopImmediatePropagation(); // For menus in menus
                let currentIndex = -1;
                navigableElements.forEach((element, index) => {
                    if (isActiveElement(element)) {
                        const activeRow = navigableElements[index].querySelectorAll(validSiblingTags.join(',')); // all focusable elements in my row
                        if (!activeRow.length || onlyTraverseSiblings) {
                            let nextSibling = activeElement;
                            // While a sibling exists, check each sibling to determine if it should be focussed
                            while (nextSibling) {
                                // Set the next checked sibling, determined by the horizontal arrow key direction
                                nextSibling = key === 'ArrowLeft' ? nextSibling.previousElementSibling : nextSibling.nextElementSibling;
                                if (nextSibling) {
                                    if (validSiblingTags.includes(nextSibling.tagName)) {
                                        // If the sibling's tag is included in validSiblingTags, set the next target element and break the loop
                                        moveTarget = nextSibling;
                                        break;
                                    }
                                    // If the sibling's tag is not valid, skip to the next sibling if possible
                                }
                            }
                        }
                        else {
                            activeRow.forEach((focusableElement, index) => {
                                if (event.target === focusableElement) {
                                    // Once found, move up or down the array by 1. Determined by the vertical arrow key direction
                                    const increment = key === 'ArrowLeft' ? -1 : 1;
                                    currentIndex = index + increment;
                                    if (currentIndex >= activeRow.length) {
                                        currentIndex = 0;
                                    }
                                    if (currentIndex < 0) {
                                        currentIndex = activeRow.length - 1;
                                    }
                                    // Set the next target element
                                    moveTarget = activeRow[currentIndex];
                                }
                            });
                        }
                    }
                });
            }
        }
        if (moveTarget) {
            // If updateTabIndex is true, set the previously focussed element's tabIndex to -1 and the next focussed element's tabIndex to 0
            // This updates the tabIndex for a roving tabIndex
            if (updateTabIndex) {
                activeElement.tabIndex = -1;
                moveTarget.tabIndex = 0;
            }
            // If a move target has been set by either arrow handler, focus that target
            moveTarget.focus();
        }
    };
    /**
     * This function is a helper for setting the initial tabIndexes in a roving tabIndex
     *
     * @param {HTMLElement[]} options Array of elements which should have a tabIndex of -1, except for the first element which will have a tabIndex of 0
     */
    const setTabIndex = (options) => {
        if (options && options.length > 0) {
            // Iterate the options and set the tabIndex to -1 on every option
            options.forEach((option) => {
                option.tabIndex = -1;
            });
            // Manually set the tabIndex of the first option to 0
            options[0].tabIndex = 0;
        }
    };
    class KeyboardHandler extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.keyHandler = (event) => {
                const { isEventFromContainer } = this.props;
                // If the passed keyboard event is not from the container, ignore the event by returning
                if (isEventFromContainer ? !isEventFromContainer(event) : !this._isEventFromContainer(event)) {
                    return;
                }
                const { isActiveElement, getFocusableElement, noVerticalArrowHandling, noHorizontalArrowHandling, noEnterHandling, noSpaceHandling, updateTabIndex, validSiblingTags, additionalKeyHandler, createNavigableElements, onlyTraverseSiblings } = this.props;
                // Pass the event off to be handled by any custom handler
                additionalKeyHandler && additionalKeyHandler(event);
                // Initalize navigableElements from the createNavigableElements callback
                const navigableElements = createNavigableElements();
                if (!navigableElements) {
                    // eslint-disable-next-line no-console
                    console.warn('No navigable elements have been passed to the KeyboardHandler. Keyboard navigation provided by this component will be ignored.');
                    return;
                }
                const key = event.key;
                // Handle enter key. If noEnterHandling is passed, skip this block
                if (!noEnterHandling) {
                    if (key === 'Enter') {
                        event.preventDefault();
                        event.stopImmediatePropagation(); // For menus in menus
                        document.activeElement.click();
                    }
                }
                // Handle space key. If noSpaceHandling is passed, skip this block
                if (!noSpaceHandling) {
                    if (key === ' ') {
                        event.preventDefault();
                        event.stopImmediatePropagation(); // For menus in menus
                        document.activeElement.click();
                    }
                }
                // Inject helper handler for arrow navigation
                handleArrows(event, navigableElements, isActiveElement, getFocusableElement, validSiblingTags, noVerticalArrowHandling, noHorizontalArrowHandling, updateTabIndex, onlyTraverseSiblings);
            };
            this._isEventFromContainer = (event) => {
                const { containerRef } = this.props;
                return containerRef.current && containerRef.current.contains(event.target);
            };
        }
        componentDidMount() {
            if (canUseDOM) {
                window.addEventListener('keydown', this.keyHandler);
            }
        }
        componentWillUnmount() {
            if (canUseDOM) {
                window.removeEventListener('keydown', this.keyHandler);
            }
        }
        render() {
            return null;
        }
    }
    KeyboardHandler.displayName = 'KeyboardHandler';
    KeyboardHandler.defaultProps = {
        containerRef: null,
        createNavigableElements: () => null,
        isActiveElement: (navigableElement) => document.activeElement === navigableElement,
        getFocusableElement: (navigableElement) => navigableElement,
        validSiblingTags: ['BUTTON', 'A'],
        onlyTraverseSiblings: true,
        updateTabIndex: true,
        noHorizontalArrowHandling: false,
        noVerticalArrowHandling: false,
        noEnterHandling: false,
        noSpaceHandling: false
    };

    /**
     * This function creates a ResizeObserver used to handle resize events for the given containerRef. If ResizeObserver
     * or the given containerRef are not available, a window resize event listener is used by default.
     *
     * Example 1:
     *
     * private containerRef = React.createRef<HTMLDivElement>();
     * private observer: any = () => {};
     *
     * public componentDidMount() {
     *   this.observer = getResizeObserver(this.containerRef.current, this.handleResize);
     * }
     *
     * public componentWillUnmount() {
     *   this.observer();
     * }
     *
     * private handleResize = () => {
     *   if (this.containerRef.current && this.containerRef.current.clientWidth) {
     *     this.setState({ width: this.containerRef.current.clientWidth });
     *   }
     * };
     *
     * public render() {
     *   return (
     *     <div ref={this.containerRef} >
     *       <Chart width={this.state.width} ... />
     *     </div>
     *   );
     * }
     *
     * Example 2:
     *
     * private inputRef = React.createRef<HTMLInputElement>();
     * private observer: any = () => {};
     *
     * public componentDidMount() {
     *   this.observer = getResizeObserver(this.inputRef.current, this.handleResize);
     * }
     *
     * public componentWillUnmount() {
     *   this.observer();
     * }
     *
     * private handleResize = () => {
     *   if (this.inputRef.current) {
     *     trimLeft(inputRef.current, String(this.props.value));
     *   }
     * };
     *
     * public render() {
     *   return (
     *     <input ref={this.inputRef} ... />
     *   );
     * }
     *
     * @param {Element} containerRefElement The container reference to observe
     * @param {Function} handleResize The function to call for resize events
     * @return {Function} The function used to unobserve resize events
     */
    const getResizeObserver = (containerRefElement, handleResize) => {
        let unobserve;
        if (canUseDOM) {
            const { ResizeObserver } = window;
            if (containerRefElement && ResizeObserver) {
                const resizeObserver = new ResizeObserver((entries) => {
                    // Wrap resize function in requestAnimationFrame to avoid "ResizeObserver loop limit exceeded" errors
                    window.requestAnimationFrame(() => {
                        if (Array.isArray(entries) && entries.length > 0) {
                            handleResize();
                        }
                    });
                });
                resizeObserver.observe(containerRefElement);
                unobserve = () => resizeObserver.unobserve(containerRefElement);
            }
            else {
                window.addEventListener('resize', handleResize);
                unobserve = () => window.removeEventListener('resize', handleResize);
            }
        }
        return () => {
            if (unobserve) {
                unobserve();
            }
        };
    };

    Promise.resolve().then(function () { return bullseye; });
    var styles$c = {
      "bullseye": "pf-l-bullseye"
    };

    Promise.resolve().then(function () { return title; });
    var styles$b = {
      "modifiers": {
        "4xl": "pf-m-4xl",
        "3xl": "pf-m-3xl",
        "2xl": "pf-m-2xl",
        "xl": "pf-m-xl",
        "lg": "pf-m-lg",
        "md": "pf-m-md",
        "overpassFont": "pf-m-overpass-font"
      },
      "title": "pf-c-title"
    };

    var TitleSizes;
    (function (TitleSizes) {
        TitleSizes["md"] = "md";
        TitleSizes["lg"] = "lg";
        TitleSizes["xl"] = "xl";
        TitleSizes["2xl"] = "2xl";
        TitleSizes["3xl"] = "3xl";
        TitleSizes["4xl"] = "4xl";
    })(TitleSizes || (TitleSizes = {}));
    var headingLevelSizeMap;
    (function (headingLevelSizeMap) {
        headingLevelSizeMap["h1"] = "2xl";
        headingLevelSizeMap["h2"] = "xl";
        headingLevelSizeMap["h3"] = "lg";
        headingLevelSizeMap["h4"] = "md";
        headingLevelSizeMap["h5"] = "md";
        headingLevelSizeMap["h6"] = "md";
    })(headingLevelSizeMap || (headingLevelSizeMap = {}));
    const Title = (_a) => {
        var { className = '', children = '', headingLevel: HeadingLevel, size = headingLevelSizeMap[HeadingLevel], ouiaId, ouiaSafe = true } = _a, props = __rest$1(_a, ["className", "children", "headingLevel", "size", "ouiaId", "ouiaSafe"]);
        const ouiaProps = useOUIAProps(Title.displayName, ouiaId, ouiaSafe);
        return (React__namespace.createElement(HeadingLevel, Object.assign({}, ouiaProps, props, { className: css(styles$b.title, size && styles$b.modifiers[size], className) }), children));
    };
    Title.displayName = 'Title';

    Promise.resolve().then(function () { return button; });
    var buttonStyles = {
      "button": "pf-c-button",
      "buttonIcon": "pf-c-button__icon",
      "buttonProgress": "pf-c-button__progress",
      "modifiers": {
        "active": "pf-m-active",
        "block": "pf-m-block",
        "small": "pf-m-small",
        "primary": "pf-m-primary",
        "displayLg": "pf-m-display-lg",
        "secondary": "pf-m-secondary",
        "tertiary": "pf-m-tertiary",
        "link": "pf-m-link",
        "inline": "pf-m-inline",
        "danger": "pf-m-danger",
        "warning": "pf-m-warning",
        "control": "pf-m-control",
        "expanded": "pf-m-expanded",
        "plain": "pf-m-plain",
        "disabled": "pf-m-disabled",
        "ariaDisabled": "pf-m-aria-disabled",
        "progress": "pf-m-progress",
        "inProgress": "pf-m-in-progress",
        "start": "pf-m-start",
        "end": "pf-m-end",
        "overpassFont": "pf-m-overpass-font"
      },
      "spinner": "pf-c-spinner"
    };

    Promise.resolve().then(function () { return spinner; });
    var styles$a = {
      "modifiers": {
        "sm": "pf-m-sm",
        "md": "pf-m-md",
        "lg": "pf-m-lg",
        "xl": "pf-m-xl"
      },
      "spinner": "pf-c-spinner",
      "spinnerClipper": "pf-c-spinner__clipper",
      "spinnerLeadBall": "pf-c-spinner__lead-ball",
      "spinnerPath": "pf-c-spinner__path",
      "spinnerTailBall": "pf-c-spinner__tail-ball"
    };

    var spinnerSize;
    (function (spinnerSize) {
        spinnerSize["sm"] = "sm";
        spinnerSize["md"] = "md";
        spinnerSize["lg"] = "lg";
        spinnerSize["xl"] = "xl";
    })(spinnerSize || (spinnerSize = {}));
    const Spinner = (_a) => {
        var { 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        className = '', size = 'xl', 'aria-valuetext': ariaValueText = 'Loading...', isSVG = false, diameter, 'aria-label': ariaLabel, 'aria-labelledBy': ariaLabelledBy } = _a, props = __rest$1(_a, ["className", "size", 'aria-valuetext', "isSVG", "diameter", 'aria-label', 'aria-labelledBy']);
        const Component = isSVG ? 'svg' : 'span';
        return (React__namespace.createElement(Component, Object.assign({ className: css(styles$a.spinner, styles$a.modifiers[size], className), role: "progressbar", "aria-valuetext": ariaValueText }, (isSVG && { viewBox: '0 0 100 100' }), (diameter && { style: { '--pf-c-spinner--diameter': diameter } }), (ariaLabel && { 'aria-label': ariaLabel }), (ariaLabelledBy && { 'aria-labelledBy': ariaLabelledBy }), (!ariaLabel && !ariaLabelledBy && { 'aria-label': 'Contents' }), props), isSVG ? (React__namespace.createElement("circle", { className: styles$a.spinnerPath, cx: "50", cy: "50", r: "45", fill: "none" })) : (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement("span", { className: css(styles$a.spinnerClipper) }),
            React__namespace.createElement("span", { className: css(styles$a.spinnerLeadBall) }),
            React__namespace.createElement("span", { className: css(styles$a.spinnerTailBall) })))));
    };
    Spinner.displayName = 'Spinner';

    var ButtonVariant;
    (function (ButtonVariant) {
        ButtonVariant["primary"] = "primary";
        ButtonVariant["secondary"] = "secondary";
        ButtonVariant["tertiary"] = "tertiary";
        ButtonVariant["danger"] = "danger";
        ButtonVariant["warning"] = "warning";
        ButtonVariant["link"] = "link";
        ButtonVariant["plain"] = "plain";
        ButtonVariant["control"] = "control";
    })(ButtonVariant || (ButtonVariant = {}));
    var ButtonType;
    (function (ButtonType) {
        ButtonType["button"] = "button";
        ButtonType["submit"] = "submit";
        ButtonType["reset"] = "reset";
    })(ButtonType || (ButtonType = {}));
    const ButtonBase = (_a) => {
        var { children = null, className = '', component = 'button', isActive = false, isBlock = false, isDisabled = false, isAriaDisabled = false, isLoading = null, isDanger = false, spinnerAriaValueText, spinnerAriaLabelledBy, spinnerAriaLabel, isSmall = false, isLarge = false, inoperableEvents = ['onClick', 'onKeyPress'], isInline = false, type = ButtonType.button, variant = ButtonVariant.primary, iconPosition = 'left', 'aria-label': ariaLabel = null, icon = null, ouiaId, ouiaSafe = true, tabIndex = null, innerRef } = _a, props = __rest$1(_a, ["children", "className", "component", "isActive", "isBlock", "isDisabled", "isAriaDisabled", "isLoading", "isDanger", "spinnerAriaValueText", "spinnerAriaLabelledBy", "spinnerAriaLabel", "isSmall", "isLarge", "inoperableEvents", "isInline", "type", "variant", "iconPosition", 'aria-label', "icon", "ouiaId", "ouiaSafe", "tabIndex", "innerRef"]);
        const ouiaProps = useOUIAProps(Button.displayName, ouiaId, ouiaSafe, variant);
        const Component = component;
        const isButtonElement = Component === 'button';
        const isInlineSpan = isInline && Component === 'span';
        const preventedEvents = inoperableEvents.reduce((handlers, eventToPrevent) => (Object.assign(Object.assign({}, handlers), { [eventToPrevent]: (event) => {
                event.preventDefault();
            } })), {});
        const getDefaultTabIdx = () => {
            if (isDisabled) {
                return isButtonElement ? null : -1;
            }
            else if (isAriaDisabled) {
                return null;
            }
            else if (isInlineSpan) {
                return 0;
            }
        };
        return (React__namespace.createElement(Component, Object.assign({}, props, (isAriaDisabled ? preventedEvents : null), { "aria-disabled": isDisabled || isAriaDisabled, "aria-label": ariaLabel, className: css(buttonStyles.button, buttonStyles.modifiers[variant], isBlock && buttonStyles.modifiers.block, isDisabled && buttonStyles.modifiers.disabled, isAriaDisabled && buttonStyles.modifiers.ariaDisabled, isActive && buttonStyles.modifiers.active, isInline && variant === ButtonVariant.link && buttonStyles.modifiers.inline, isDanger && (variant === ButtonVariant.secondary || variant === ButtonVariant.link) && buttonStyles.modifiers.danger, isLoading !== null && children !== null && buttonStyles.modifiers.progress, isLoading && buttonStyles.modifiers.inProgress, isSmall && buttonStyles.modifiers.small, isLarge && buttonStyles.modifiers.displayLg, className), disabled: isButtonElement ? isDisabled : null, tabIndex: tabIndex !== null ? tabIndex : getDefaultTabIdx(), type: isButtonElement || isInlineSpan ? type : null, role: isInlineSpan ? 'button' : null, ref: innerRef }, ouiaProps),
            isLoading && (React__namespace.createElement("span", { className: css(buttonStyles.buttonProgress) },
                React__namespace.createElement(Spinner, { size: spinnerSize.md, "aria-valuetext": spinnerAriaValueText, "aria-label": spinnerAriaLabel, "aria-labelledby": spinnerAriaLabelledBy }))),
            variant === ButtonVariant.plain && children === null && icon ? icon : null,
            variant !== ButtonVariant.plain && icon && iconPosition === 'left' && (React__namespace.createElement("span", { className: css(buttonStyles.buttonIcon, buttonStyles.modifiers.start) }, icon)),
            children,
            variant !== ButtonVariant.plain && icon && iconPosition === 'right' && (React__namespace.createElement("span", { className: css(buttonStyles.buttonIcon, buttonStyles.modifiers.end) }, icon))));
    };
    const Button = React__namespace.forwardRef((props, ref) => (React__namespace.createElement(ButtonBase, Object.assign({ innerRef: ref }, props))));
    Button.displayName = 'Button';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    var IconSize;
    (function (IconSize) {
        IconSize["sm"] = "sm";
        IconSize["md"] = "md";
        IconSize["lg"] = "lg";
        IconSize["xl"] = "xl";
    })(IconSize || (IconSize = {}));
    const getSize = (size) => {
        switch (size) {
            case IconSize.sm:
                return '1em';
            case IconSize.md:
                return '1.5em';
            case IconSize.lg:
                return '2em';
            case IconSize.xl:
                return '3em';
            default:
                return '1em';
        }
    };
    let currentId$1 = 0;
    /**
     * Factory to create Icon class components for consumers
     */
    function createIcon({ name, xOffset = 0, yOffset = 0, width, height, svgPath }) {
        var _a;
        return _a = class SVGIcon extends React__namespace.Component {
                constructor() {
                    super(...arguments);
                    this.id = `icon-title-${currentId$1++}`;
                }
                render() {
                    const _a = this.props, { size, color, title, noVerticalAlign } = _a, props = __rest(_a, ["size", "color", "title", "noVerticalAlign"]);
                    const hasTitle = Boolean(title);
                    const heightWidth = getSize(size);
                    const baseAlign = -0.125 * Number.parseFloat(heightWidth);
                    const style = noVerticalAlign ? null : { verticalAlign: `${baseAlign}em` };
                    const viewBox = [xOffset, yOffset, width, height].join(' ');
                    return (React__namespace.createElement("svg", Object.assign({ style: style, fill: color, height: heightWidth, width: heightWidth, viewBox: viewBox, "aria-labelledby": hasTitle ? this.id : null, "aria-hidden": hasTitle ? null : true, role: "img" }, props),
                        hasTitle && React__namespace.createElement("title", { id: this.id }, title),
                        React__namespace.createElement("path", { d: svgPath })));
                }
            },
            _a.displayName = name,
            _a.defaultProps = {
                color: 'currentColor',
                size: IconSize.sm,
                noVerticalAlign: false
            },
            _a;
    }

    const TimesIconConfig = {
      name: 'TimesIcon',
      height: 512,
      width: 352,
      svgPath: 'M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z',
      yOffset: 0,
      xOffset: 0,
    };

    const TimesIcon = createIcon(TimesIconConfig);

    var TimesIcon$1 = TimesIcon;

    const CheckCircleIconConfig = {
      name: 'CheckCircleIcon',
      height: 512,
      width: 512,
      svgPath: 'M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z',
      yOffset: 0,
      xOffset: 0,
    };

    const CheckCircleIcon = createIcon(CheckCircleIconConfig);

    var CheckCircleIcon$1 = CheckCircleIcon;

    const ExclamationCircleIconConfig = {
      name: 'ExclamationCircleIcon',
      height: 512,
      width: 512,
      svgPath: 'M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z',
      yOffset: 0,
      xOffset: 0,
    };

    const ExclamationCircleIcon = createIcon(ExclamationCircleIconConfig);

    var ExclamationCircleIcon$1 = ExclamationCircleIcon;

    const ExclamationTriangleIconConfig = {
      name: 'ExclamationTriangleIcon',
      height: 512,
      width: 576,
      svgPath: 'M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z',
      yOffset: 0,
      xOffset: 0,
    };

    const ExclamationTriangleIcon = createIcon(ExclamationTriangleIconConfig);

    var ExclamationTriangleIcon$1 = ExclamationTriangleIcon;

    Promise.resolve().then(function () { return tooltip; });
    var styles$9 = {
      "modifiers": {
        "top": "pf-m-top",
        "topLeft": "pf-m-top-left",
        "topRight": "pf-m-top-right",
        "bottom": "pf-m-bottom",
        "bottomLeft": "pf-m-bottom-left",
        "bottomRight": "pf-m-bottom-right",
        "left": "pf-m-left",
        "leftTop": "pf-m-left-top",
        "leftBottom": "pf-m-left-bottom",
        "right": "pf-m-right",
        "rightTop": "pf-m-right-top",
        "rightBottom": "pf-m-right-bottom",
        "textAlignLeft": "pf-m-text-align-left"
      },
      "tooltip": "pf-c-tooltip",
      "tooltipArrow": "pf-c-tooltip__arrow",
      "tooltipContent": "pf-c-tooltip__content"
    };

    const TooltipContent = (_a) => {
        var { className, children, isLeftAligned } = _a, props = __rest$1(_a, ["className", "children", "isLeftAligned"]);
        return (React__namespace.createElement("div", Object.assign({ className: css(styles$9.tooltipContent, isLeftAligned && styles$9.modifiers.textAlignLeft, className) }, props), children));
    };
    TooltipContent.displayName = 'TooltipContent';

    const TooltipArrow = (_a) => {
        var { className } = _a, props = __rest$1(_a, ["className"]);
        return React__namespace.createElement("div", Object.assign({ className: css(styles$9.tooltipArrow, className) }, props));
    };
    TooltipArrow.displayName = 'TooltipArrow';

    const c_tooltip_MaxWidth = {
      "name": "--pf-c-tooltip--MaxWidth",
      "value": "18.75rem",
      "var": "var(--pf-c-tooltip--MaxWidth)"
    };
    var tooltipMaxWidth = c_tooltip_MaxWidth;

    var TooltipPosition;
    (function (TooltipPosition) {
        TooltipPosition["auto"] = "auto";
        TooltipPosition["top"] = "top";
        TooltipPosition["bottom"] = "bottom";
        TooltipPosition["left"] = "left";
        TooltipPosition["right"] = "right";
        TooltipPosition["topStart"] = "top-start";
        TooltipPosition["topEnd"] = "top-end";
        TooltipPosition["bottomStart"] = "bottom-start";
        TooltipPosition["bottomEnd"] = "bottom-end";
        TooltipPosition["leftStart"] = "left-start";
        TooltipPosition["leftEnd"] = "left-end";
        TooltipPosition["rightStart"] = "right-start";
        TooltipPosition["rightEnd"] = "right-end";
    })(TooltipPosition || (TooltipPosition = {}));
    // id for associating trigger with the content aria-describedby or aria-labelledby
    let pfTooltipIdCounter = 1;
    const Tooltip = (_a) => {
        var { content: bodyContent, position = 'top', trigger = 'mouseenter focus', isVisible = false, isContentLeftAligned = false, enableFlip = true, className = '', entryDelay = 300, exitDelay = 0, appendTo = () => document.body, zIndex = 9999, maxWidth = tooltipMaxWidth.value, distance = 15, aria = 'describedby', 
        // For every initial starting position, there are 3 escape positions
        flipBehavior = ['top', 'right', 'bottom', 'left', 'top', 'right', 'bottom'], id = `pf-tooltip-${pfTooltipIdCounter++}`, children, animationDuration = 300, reference, 'aria-live': ariaLive = reference ? 'polite' : 'off', boundary, isAppLauncher, tippyProps } = _a, rest = __rest$1(_a, ["content", "position", "trigger", "isVisible", "isContentLeftAligned", "enableFlip", "className", "entryDelay", "exitDelay", "appendTo", "zIndex", "maxWidth", "distance", "aria", "flipBehavior", "id", "children", "animationDuration", "reference", 'aria-live', "boundary", "isAppLauncher", "tippyProps"]);
        {
            boundary !== undefined &&
                console.warn('The Tooltip boundary prop has been deprecated. If you want to constrain the popper to a specific element use the appendTo prop instead.');
            isAppLauncher !== undefined &&
                console.warn('The Tooltip isAppLauncher prop has been deprecated and is no longer used.');
            tippyProps !== undefined && console.warn('The Tooltip tippyProps prop has been deprecated and is no longer used.');
        }
        const triggerOnMouseenter = trigger.includes('mouseenter');
        const triggerOnFocus = trigger.includes('focus');
        const triggerOnClick = trigger.includes('click');
        const triggerManually = trigger === 'manual';
        const [visible, setVisible] = React__namespace.useState(false);
        const [opacity, setOpacity] = React__namespace.useState(0);
        const transitionTimerRef = React__namespace.useRef(null);
        const showTimerRef = React__namespace.useRef(null);
        const hideTimerRef = React__namespace.useRef(null);
        const clearTimeouts = (timeoutRefs) => {
            timeoutRefs.forEach(ref => {
                if (ref.current) {
                    clearTimeout(ref.current);
                }
            });
        };
        // Cancel all timers on unmount
        React__namespace.useEffect(() => () => {
            clearTimeouts([transitionTimerRef, hideTimerRef, showTimerRef]);
        }, []);
        const onDocumentKeyDown = (event) => {
            if (!triggerManually) {
                if (event.keyCode === KEY_CODES.ESCAPE_KEY && visible) {
                    hide();
                }
            }
        };
        const onTriggerEnter = (event) => {
            if (event.keyCode === KEY_CODES.ENTER) {
                if (!visible) {
                    show();
                }
                else {
                    hide();
                }
            }
        };
        React__namespace.useEffect(() => {
            if (isVisible) {
                show();
            }
            else {
                hide();
            }
        }, [isVisible]);
        const show = () => {
            clearTimeouts([transitionTimerRef, hideTimerRef]);
            showTimerRef.current = setTimeout(() => {
                setVisible(true);
                setOpacity(1);
            }, entryDelay);
        };
        const hide = () => {
            clearTimeouts([showTimerRef]);
            hideTimerRef.current = setTimeout(() => {
                setOpacity(0);
                transitionTimerRef.current = setTimeout(() => setVisible(false), animationDuration);
            }, exitDelay);
        };
        const positionModifiers = {
            top: styles$9.modifiers.top,
            bottom: styles$9.modifiers.bottom,
            left: styles$9.modifiers.left,
            right: styles$9.modifiers.right,
            'top-start': styles$9.modifiers.topLeft,
            'top-end': styles$9.modifiers.topRight,
            'bottom-start': styles$9.modifiers.bottomLeft,
            'bottom-end': styles$9.modifiers.bottomRight,
            'left-start': styles$9.modifiers.leftTop,
            'left-end': styles$9.modifiers.leftBottom,
            'right-start': styles$9.modifiers.rightTop,
            'right-end': styles$9.modifiers.rightBottom
        };
        const hasCustomMaxWidth = maxWidth !== tooltipMaxWidth.value;
        const content = (React__namespace.createElement("div", Object.assign({ "aria-live": ariaLive, className: css(styles$9.tooltip, className), role: "tooltip", id: id, style: {
                maxWidth: hasCustomMaxWidth ? maxWidth : null,
                opacity,
                transition: getOpacityTransition(animationDuration)
            } }, rest),
            React__namespace.createElement(TooltipArrow, null),
            React__namespace.createElement(TooltipContent, { isLeftAligned: isContentLeftAligned }, bodyContent)));
        const onDocumentClick = (event, triggerElement) => {
            // event.currentTarget = document
            // event.target could be triggerElement or something else
            {
                // hide on inside the toggle as well as on outside clicks
                if (visible) {
                    hide();
                }
                else if (event.target === triggerElement) {
                    show();
                }
            }
        };
        const addAriaToTrigger = () => {
            if (aria === 'describedby' && children && children.props && !children.props['aria-describedby']) {
                return React__namespace.cloneElement(children, { 'aria-describedby': id });
            }
            else if (aria === 'labelledby' && children.props && !children.props['aria-labelledby']) {
                return React__namespace.cloneElement(children, { 'aria-labelledby': id });
            }
            return children;
        };
        return (React__namespace.createElement(Popper, { trigger: aria !== 'none' && visible ? addAriaToTrigger() : children, reference: reference, popper: content, popperMatchesTriggerWidth: false, appendTo: appendTo, isVisible: visible, positionModifiers: positionModifiers, distance: distance, placement: position, onMouseEnter: triggerOnMouseenter && show, onMouseLeave: triggerOnMouseenter && hide, onFocus: triggerOnFocus && show, onBlur: triggerOnFocus && hide, onDocumentClick: triggerOnClick && onDocumentClick, onDocumentKeyDown: triggerManually ? null : onDocumentKeyDown, onTriggerEnter: triggerManually ? null : onTriggerEnter, enableFlip: enableFlip, zIndex: zIndex, flipBehavior: flipBehavior }));
    };
    Tooltip.displayName = 'Tooltip';

    Promise.resolve().then(function () { return formControl; });
    var formStyles$1 = {
      "formControl": "pf-c-form-control",
      "modifiers": {
        "success": "pf-m-success",
        "expanded": "pf-m-expanded",
        "icon": "pf-m-icon",
        "warning": "pf-m-warning",
        "search": "pf-m-search",
        "calendar": "pf-m-calendar",
        "clock": "pf-m-clock",
        "iconSprite": "pf-m-icon-sprite",
        "placeholder": "pf-m-placeholder",
        "resizeVertical": "pf-m-resize-vertical",
        "resizeHorizontal": "pf-m-resize-horizontal"
      }
    };

    Promise.resolve().then(function () { return dropdown; });
    var styles$8 = {
      "badge": "pf-c-badge",
      "check": "pf-c-check",
      "divider": "pf-c-divider",
      "dropdown": "pf-c-dropdown",
      "dropdownGroup": "pf-c-dropdown__group",
      "dropdownGroupTitle": "pf-c-dropdown__group-title",
      "dropdownMenu": "pf-c-dropdown__menu",
      "dropdownMenuItem": "pf-c-dropdown__menu-item",
      "dropdownMenuItemDescription": "pf-c-dropdown__menu-item-description",
      "dropdownMenuItemIcon": "pf-c-dropdown__menu-item-icon",
      "dropdownMenuItemMain": "pf-c-dropdown__menu-item-main",
      "dropdownToggle": "pf-c-dropdown__toggle",
      "dropdownToggleButton": "pf-c-dropdown__toggle-button",
      "dropdownToggleCheck": "pf-c-dropdown__toggle-check",
      "dropdownToggleIcon": "pf-c-dropdown__toggle-icon",
      "dropdownToggleImage": "pf-c-dropdown__toggle-image",
      "dropdownToggleText": "pf-c-dropdown__toggle-text",
      "menu": "pf-c-menu",
      "modifiers": {
        "fullHeight": "pf-m-full-height",
        "expanded": "pf-m-expanded",
        "action": "pf-m-action",
        "disabled": "pf-m-disabled",
        "plain": "pf-m-plain",
        "text": "pf-m-text",
        "splitButton": "pf-m-split-button",
        "primary": "pf-m-primary",
        "active": "pf-m-active",
        "secondary": "pf-m-secondary",
        "top": "pf-m-top",
        "alignRight": "pf-m-align-right",
        "alignLeft": "pf-m-align-left",
        "alignRightOnSm": "pf-m-align-right-on-sm",
        "alignLeftOnSm": "pf-m-align-left-on-sm",
        "alignRightOnMd": "pf-m-align-right-on-md",
        "alignLeftOnMd": "pf-m-align-left-on-md",
        "alignRightOnLg": "pf-m-align-right-on-lg",
        "alignLeftOnLg": "pf-m-align-left-on-lg",
        "alignRightOnXl": "pf-m-align-right-on-xl",
        "alignLeftOnXl": "pf-m-align-left-on-xl",
        "alignRightOn_2xl": "pf-m-align-right-on-2xl",
        "alignLeftOn_2xl": "pf-m-align-left-on-2xl",
        "ariaDisabled": "pf-m-aria-disabled",
        "icon": "pf-m-icon",
        "description": "pf-m-description"
      }
    };

    var DropdownPosition;
    (function (DropdownPosition) {
        DropdownPosition["right"] = "right";
        DropdownPosition["left"] = "left";
    })(DropdownPosition || (DropdownPosition = {}));
    var DropdownDirection;
    (function (DropdownDirection) {
        DropdownDirection["up"] = "up";
        DropdownDirection["down"] = "down";
    })(DropdownDirection || (DropdownDirection = {}));
    const DropdownContext = React__namespace.createContext({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSelect: (event) => undefined,
        id: '',
        toggleIndicatorClass: '',
        toggleIconClass: '',
        toggleTextClass: '',
        menuClass: '',
        itemClass: '',
        toggleClass: '',
        baseClass: '',
        baseComponent: 'div',
        sectionClass: '',
        sectionTitleClass: '',
        sectionComponent: 'section',
        disabledClass: '',
        plainTextClass: '',
        menuComponent: 'ul'
    });
    const DropdownArrowContext = React__namespace.createContext({
        keyHandler: null,
        sendRef: null
    });

    class DropdownMenu extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.refsCollection = [];
            this.componentWillUnmount = () => {
                document.removeEventListener('keydown', this.onKeyDown);
            };
            this.onKeyDown = (event) => {
                if (!this.props.isOpen ||
                    !Array.from(document.activeElement.classList).find(className => DropdownMenu.validToggleClasses.concat(this.context.toggleClass).includes(className))) {
                    return;
                }
                const refs = this.refsCollection;
                if (event.key === 'ArrowDown') {
                    const firstFocusTargetCollection = refs.find(ref => ref && ref[0] && !ref[0].hasAttribute('disabled'));
                    DropdownMenu.focusFirstRef(firstFocusTargetCollection);
                    event.stopPropagation();
                }
                else if (event.key === 'ArrowUp') {
                    const collectionLength = refs.length;
                    const lastFocusTargetCollection = refs.slice(collectionLength - 1, collectionLength);
                    const lastFocusTarget = lastFocusTargetCollection && lastFocusTargetCollection[0];
                    DropdownMenu.focusFirstRef(lastFocusTarget);
                    event.stopPropagation();
                }
            };
            this.childKeyHandler = (index, innerIndex, position, custom = false) => {
                keyHandler(index, innerIndex, position, this.refsCollection, this.props.isGrouped ? this.refsCollection : React__namespace.Children.toArray(this.props.children), custom);
            };
            this.sendRef = (index, nodes, isDisabled, isSeparator) => {
                this.refsCollection[index] = [];
                nodes.map((node, innerIndex) => {
                    if (!node) {
                        this.refsCollection[index][innerIndex] = null;
                    }
                    else if (!node.getAttribute) {
                        // eslint-disable-next-line react/no-find-dom-node
                        this.refsCollection[index][innerIndex] = ReactDOM__namespace.findDOMNode(node);
                    }
                    else if (isSeparator) {
                        this.refsCollection[index][innerIndex] = null;
                    }
                    else {
                        this.refsCollection[index][innerIndex] = node;
                    }
                });
            };
        }
        componentDidMount() {
            document.addEventListener('keydown', this.onKeyDown);
            const { autoFocus } = this.props;
            if (autoFocus) {
                // Focus first non-disabled element
                const focusTargetCollection = this.refsCollection.find(ref => ref && ref[0] && !ref[0].hasAttribute('disabled'));
                const focusTarget = focusTargetCollection && focusTargetCollection[0];
                if (focusTarget && focusTarget.focus) {
                    setTimeout(() => focusTarget.focus());
                }
            }
        }
        shouldComponentUpdate() {
            // reset refsCollection before updating to account for child removal between mounts
            this.refsCollection = [];
            return true;
        }
        extendChildren() {
            const { children, isGrouped } = this.props;
            if (isGrouped) {
                let index = 0;
                return React__namespace.Children.map(children, groupedChildren => {
                    const group = groupedChildren;
                    const props = {};
                    if (group.props && group.props.children) {
                        if (Array.isArray(group.props.children)) {
                            props.children = React__namespace.Children.map(group.props.children, option => React__namespace.cloneElement(option, {
                                index: index++
                            }));
                        }
                        else {
                            props.children = React__namespace.cloneElement(group.props.children, {
                                index: index++
                            });
                        }
                    }
                    return React__namespace.cloneElement(group, props);
                });
            }
            return React__namespace.Children.map(children, (child, index) => React__namespace.cloneElement(child, {
                index
            }));
        }
        render() {
            const _a = this.props, { className, isOpen, position, children, component, isGrouped, setMenuComponentRef, 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            openedOnEnter, alignments } = _a, props = __rest$1(_a, ["className", "isOpen", "position", "children", "component", "isGrouped", "setMenuComponentRef", "openedOnEnter", "alignments"]);
            return (React__namespace.createElement(DropdownArrowContext.Provider, { value: {
                    keyHandler: this.childKeyHandler,
                    sendRef: this.sendRef
                } }, component === 'div' ? (React__namespace.createElement(DropdownContext.Consumer, null, ({ onSelect, menuClass }) => (React__namespace.createElement("div", { className: css(menuClass, position === DropdownPosition.right && styles$8.modifiers.alignRight, formatBreakpointMods(alignments, styles$8, 'align-'), className), hidden: !isOpen, onClick: event => onSelect && onSelect(event), ref: setMenuComponentRef }, children)))) : ((isGrouped && (React__namespace.createElement(DropdownContext.Consumer, null, ({ menuClass, menuComponent }) => {
                const MenuComponent = (menuComponent || 'div');
                return (React__namespace.createElement(MenuComponent, Object.assign({}, props, { className: css(menuClass, position === DropdownPosition.right && styles$8.modifiers.alignRight, formatBreakpointMods(alignments, styles$8, 'align-'), className), hidden: !isOpen, role: "menu", ref: setMenuComponentRef }), this.extendChildren()));
            }))) || (React__namespace.createElement(DropdownContext.Consumer, null, ({ menuClass, menuComponent }) => {
                const MenuComponent = (menuComponent || component);
                return (React__namespace.createElement(MenuComponent, Object.assign({}, props, { className: css(menuClass, position === DropdownPosition.right && styles$8.modifiers.alignRight, formatBreakpointMods(alignments, styles$8, 'align-'), className), hidden: !isOpen, role: "menu", ref: setMenuComponentRef }), this.extendChildren()));
            })))));
        }
    }
    DropdownMenu.displayName = 'DropdownMenu';
    DropdownMenu.defaultProps = {
        className: '',
        isOpen: true,
        openedOnEnter: false,
        autoFocus: true,
        position: DropdownPosition.left,
        component: 'ul',
        isGrouped: false,
        setMenuComponentRef: null
    };
    DropdownMenu.validToggleClasses = [styles$8.dropdownToggle, styles$8.dropdownToggleButton];
    DropdownMenu.focusFirstRef = (refCollection) => {
        if (refCollection && refCollection[0] && refCollection[0].focus) {
            setTimeout(() => refCollection[0].focus());
        }
    };
    DropdownMenu.contextType = DropdownContext;

    class DropdownWithContext extends React__namespace.Component {
        constructor(props) {
            super(props);
            this.openedOnEnter = false;
            this.baseComponentRef = React__namespace.createRef();
            this.menuComponentRef = React__namespace.createRef();
            this.onEnter = () => {
                this.openedOnEnter = true;
            };
            this.setMenuComponentRef = (element) => {
                this.menuComponentRef = element;
            };
            this.getMenuComponentRef = () => this.menuComponentRef;
            if (props.dropdownItems && props.dropdownItems.length > 0 && props.children) {
                // eslint-disable-next-line no-console
                console.error('Children and dropdownItems props have been provided. Only the dropdownItems prop items will be rendered');
            }
        }
        componentDidUpdate() {
            if (!this.props.isOpen) {
                this.openedOnEnter = false;
            }
        }
        render() {
            const _a = this.props, { children, className, direction, dropdownItems, isOpen, isPlain, isText, isGrouped, isFullHeight, 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onSelect, position, toggle, autoFocus, menuAppendTo } = _a, props = __rest$1(_a, ["children", "className", "direction", "dropdownItems", "isOpen", "isPlain", "isText", "isGrouped", "isFullHeight", "onSelect", "position", "toggle", "autoFocus", "menuAppendTo"]);
            const id = toggle.props.id || `pf-dropdown-toggle-id-${DropdownWithContext.currentId++}`;
            let component;
            let renderedContent;
            let ariaHasPopup = false;
            if (dropdownItems && dropdownItems.length > 0) {
                component = 'ul';
                renderedContent = dropdownItems;
                ariaHasPopup = true;
            }
            else {
                component = 'div';
                renderedContent = React__namespace.Children.toArray(children);
            }
            const openedOnEnter = this.openedOnEnter;
            return (React__namespace.createElement(DropdownContext.Consumer, null, ({ baseClass, baseComponent, id: contextId, ouiaId, ouiaComponentType, ouiaSafe, alignments }) => {
                const BaseComponent = baseComponent;
                const menuContainer = (React__namespace.createElement(DropdownMenu, { setMenuComponentRef: this.setMenuComponentRef, component: component, isOpen: isOpen, position: position, "aria-labelledby": contextId ? `${contextId}-toggle` : id, isGrouped: isGrouped, autoFocus: openedOnEnter && autoFocus, alignments: alignments }, renderedContent));
                const popperContainer = (React__namespace.createElement("div", { className: css(baseClass, direction === DropdownDirection.up && styles$8.modifiers.top, position === DropdownPosition.right && styles$8.modifiers.alignRight, isOpen && styles$8.modifiers.expanded, className) }, isOpen && menuContainer));
                const mainContainer = (React__namespace.createElement(BaseComponent, Object.assign({}, props, { className: css(baseClass, direction === DropdownDirection.up && styles$8.modifiers.top, position === DropdownPosition.right && styles$8.modifiers.alignRight, isOpen && styles$8.modifiers.expanded, isFullHeight && styles$8.modifiers.fullHeight, className), ref: this.baseComponentRef }, getOUIAProps(ouiaComponentType, ouiaId, ouiaSafe)),
                    React__namespace.Children.map(toggle, oneToggle => React__namespace.cloneElement(oneToggle, {
                        parentRef: this.baseComponentRef,
                        getMenuRef: this.getMenuComponentRef,
                        isOpen,
                        id,
                        isPlain,
                        isText,
                        'aria-haspopup': ariaHasPopup,
                        onEnter: () => {
                            this.onEnter();
                            oneToggle.props.onEnter && oneToggle.props.onEnter();
                        }
                    })),
                    menuAppendTo === 'inline' && isOpen && menuContainer));
                const getParentElement = () => {
                    if (this.baseComponentRef && this.baseComponentRef.current) {
                        return this.baseComponentRef.current.parentElement;
                    }
                    return null;
                };
                return menuAppendTo === 'inline' ? (mainContainer) : (React__namespace.createElement(Popper, { trigger: mainContainer, popper: popperContainer, direction: direction, position: position, appendTo: menuAppendTo === 'parent' ? getParentElement() : menuAppendTo, isVisible: isOpen }));
            }));
        }
    }
    DropdownWithContext.displayName = 'DropdownWithContext';
    // seed for the aria-labelledby ID
    DropdownWithContext.currentId = 0;
    DropdownWithContext.defaultProps = {
        className: '',
        dropdownItems: [],
        isOpen: false,
        isPlain: false,
        isText: false,
        isGrouped: false,
        position: DropdownPosition.left,
        direction: DropdownDirection.down,
        onSelect: () => undefined,
        autoFocus: true,
        menuAppendTo: 'inline'
    };

    const Dropdown = (_a) => {
        var { onSelect, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ref, // Types of Ref are different for React.FunctionComponent vs React.Component
        ouiaId, ouiaSafe, alignments, contextProps } = _a, props = __rest$1(_a, ["onSelect", "ref", "ouiaId", "ouiaSafe", "alignments", "contextProps"]);
        return (React__namespace.createElement(DropdownContext.Provider, { value: Object.assign({ onSelect: event => onSelect && onSelect(event), toggleTextClass: styles$8.dropdownToggleText, toggleIconClass: styles$8.dropdownToggleImage, toggleIndicatorClass: styles$8.dropdownToggleIcon, menuClass: styles$8.dropdownMenu, itemClass: styles$8.dropdownMenuItem, toggleClass: styles$8.dropdownToggle, baseClass: styles$8.dropdown, baseComponent: 'div', sectionClass: styles$8.dropdownGroup, sectionTitleClass: styles$8.dropdownGroupTitle, sectionComponent: 'section', disabledClass: styles$8.modifiers.disabled, plainTextClass: styles$8.modifiers.text, ouiaId: useOUIAId(Dropdown.displayName, ouiaId), ouiaSafe, ouiaComponentType: Dropdown.displayName, alignments }, contextProps) },
            React__namespace.createElement(DropdownWithContext, Object.assign({}, props))));
    };
    Dropdown.displayName = 'Dropdown';

    class InternalDropdownItem extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.ref = React__namespace.createRef();
            this.additionalRef = React__namespace.createRef();
            this.getInnerNode = (node) => (node && node.childNodes && node.childNodes.length ? node.childNodes[0] : node);
            this.onKeyDown = (event) => {
                // Detected key press on this item, notify the menu parent so that the appropriate item can be focused
                const innerIndex = event.target === this.ref.current ? 0 : 1;
                if (!this.props.customChild) {
                    event.preventDefault();
                }
                if (event.key === 'ArrowUp') {
                    this.props.context.keyHandler(this.props.index, innerIndex, KEYHANDLER_DIRECTION.UP);
                    event.stopPropagation();
                }
                else if (event.key === 'ArrowDown') {
                    this.props.context.keyHandler(this.props.index, innerIndex, KEYHANDLER_DIRECTION.DOWN);
                    event.stopPropagation();
                }
                else if (event.key === 'ArrowRight') {
                    this.props.context.keyHandler(this.props.index, innerIndex, KEYHANDLER_DIRECTION.RIGHT);
                    event.stopPropagation();
                }
                else if (event.key === 'ArrowLeft') {
                    this.props.context.keyHandler(this.props.index, innerIndex, KEYHANDLER_DIRECTION.LEFT);
                    event.stopPropagation();
                }
                else if (event.key === 'Enter' || event.key === ' ') {
                    event.target.click();
                    this.props.enterTriggersArrowDown &&
                        this.props.context.keyHandler(this.props.index, innerIndex, KEYHANDLER_DIRECTION.DOWN);
                }
            };
            this.componentRef = (element) => {
                this.ref.current = element;
                const { component } = this.props;
                const ref = component.ref;
                if (ref) {
                    if (typeof ref === 'function') {
                        ref(element);
                    }
                    else {
                        ref.current = element;
                    }
                }
            };
        }
        componentDidMount() {
            const { context, index, isDisabled, role, customChild, autoFocus } = this.props;
            const customRef = customChild ? this.getInnerNode(this.ref.current) : this.ref.current;
            context.sendRef(index, [customRef, customChild ? customRef : this.additionalRef.current], isDisabled, role === 'separator');
            autoFocus && setTimeout(() => customRef.focus());
        }
        componentDidUpdate() {
            const { context, index, isDisabled, role, customChild } = this.props;
            const customRef = customChild ? this.getInnerNode(this.ref.current) : this.ref.current;
            context.sendRef(index, [customRef, customChild ? customRef : this.additionalRef.current], isDisabled, role === 'separator');
        }
        extendAdditionalChildRef() {
            const { additionalChild } = this.props;
            return React__namespace.cloneElement(additionalChild, {
                ref: this.additionalRef
            });
        }
        render() {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const _a = this.props, { className, children, isHovered, context, onClick, component, role, isDisabled, isAriaDisabled, isPlainText, index, href, tooltip, tooltipProps, id, componentID, listItemClassName, additionalChild, customChild, enterTriggersArrowDown, icon, autoFocus, styleChildren, description, inoperableEvents } = _a, additionalProps = __rest$1(_a, ["className", "children", "isHovered", "context", "onClick", "component", "role", "isDisabled", "isAriaDisabled", "isPlainText", "index", "href", "tooltip", "tooltipProps", "id", "componentID", "listItemClassName", "additionalChild", "customChild", "enterTriggersArrowDown", "icon", "autoFocus", "styleChildren", "description", "inoperableEvents"]);
            /* eslint-enable @typescript-eslint/no-unused-vars */
            let classes = css(icon && styles$8.modifiers.icon, isAriaDisabled && styles$8.modifiers.ariaDisabled, className);
            if (component === 'a') {
                additionalProps['aria-disabled'] = isDisabled || isAriaDisabled;
            }
            else if (component === 'button') {
                additionalProps['aria-disabled'] = isDisabled || isAriaDisabled;
                additionalProps.type = additionalProps.type || 'button';
            }
            const renderWithTooltip = (childNode) => tooltip ? (React__namespace.createElement(Tooltip, Object.assign({ content: tooltip }, tooltipProps), childNode)) : (childNode);
            const renderClonedComponent = (element) => React__namespace.cloneElement(element, Object.assign(Object.assign({}, (styleChildren && {
                className: css(element.props.className, classes)
            })), (this.props.role !== 'separator' && { ref: this.componentRef })));
            const renderDefaultComponent = (tag) => {
                const Component = tag;
                const componentContent = description ? (React__namespace.createElement(React__namespace.Fragment, null,
                    React__namespace.createElement("div", { className: styles$8.dropdownMenuItemMain },
                        icon && React__namespace.createElement("span", { className: css(styles$8.dropdownMenuItemIcon) }, icon),
                        children),
                    React__namespace.createElement("div", { className: styles$8.dropdownMenuItemDescription }, description))) : (React__namespace.createElement(React__namespace.Fragment, null,
                    icon && React__namespace.createElement("span", { className: css(styles$8.dropdownMenuItemIcon) }, icon),
                    children));
                return (React__namespace.createElement(Component, Object.assign({}, additionalProps, (isDisabled || isAriaDisabled ? preventedEvents(inoperableEvents) : null), { href: href, ref: this.ref, className: classes, id: componentID }), componentContent));
            };
            return (React__namespace.createElement(DropdownContext.Consumer, null, ({ onSelect, itemClass, disabledClass, plainTextClass }) => {
                if (this.props.role !== 'separator') {
                    classes = css(classes, isDisabled && disabledClass, isPlainText && plainTextClass, itemClass, description && styles$8.modifiers.description);
                }
                if (customChild) {
                    return React__namespace.cloneElement(customChild, {
                        ref: this.ref,
                        onKeyDown: this.onKeyDown
                    });
                }
                return (React__namespace.createElement("li", { className: listItemClassName || null, role: role, onKeyDown: this.onKeyDown, onClick: (event) => {
                        if (!isDisabled && !isAriaDisabled) {
                            onClick(event);
                            onSelect(event);
                        }
                    }, id: id },
                    renderWithTooltip(React__namespace.isValidElement(component)
                        ? renderClonedComponent(component)
                        : renderDefaultComponent(component)),
                    additionalChild && this.extendAdditionalChildRef()));
            }));
        }
    }
    InternalDropdownItem.displayName = 'InternalDropdownItem';
    InternalDropdownItem.defaultProps = {
        className: '',
        isHovered: false,
        component: 'a',
        role: 'none',
        isDisabled: false,
        isPlainText: false,
        tooltipProps: {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (event) => undefined,
        index: -1,
        context: {
            keyHandler: () => { },
            sendRef: () => { }
        },
        enterTriggersArrowDown: false,
        icon: null,
        styleChildren: true,
        description: null,
        inoperableEvents: ['onClick', 'onKeyPress']
    };

    const DropdownItem = (_a) => {
        var { children, className, component = 'a', isDisabled = false, isAriaDisabled = false, isPlainText = false, isHovered = false, href, tooltip, tooltipProps = {}, listItemClassName, onClick, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ref, // Types of Ref are different for React.FunctionComponent vs React.Component
        additionalChild, customChild, tabIndex = -1, icon = null, autoFocus, description = null, styleChildren, ouiaId, ouiaSafe } = _a, props = __rest$1(_a, ["children", "className", "component", "isDisabled", "isAriaDisabled", "isPlainText", "isHovered", "href", "tooltip", "tooltipProps", "listItemClassName", "onClick", "ref", "additionalChild", "customChild", "tabIndex", "icon", "autoFocus", "description", "styleChildren", "ouiaId", "ouiaSafe"]);
        const ouiaProps = useOUIAProps(DropdownItem.displayName, ouiaId, ouiaSafe);
        return (React__namespace.createElement(DropdownArrowContext.Consumer, null, context => (React__namespace.createElement(InternalDropdownItem, Object.assign({ context: context, role: "menuitem", tabIndex: tabIndex, className: className, component: component, isDisabled: isDisabled, isAriaDisabled: isAriaDisabled, isPlainText: isPlainText, isHovered: isHovered, href: href, tooltip: tooltip, tooltipProps: tooltipProps, listItemClassName: listItemClassName, onClick: onClick, additionalChild: additionalChild, customChild: customChild, icon: icon, autoFocus: autoFocus, styleChildren: styleChildren, description: description }, ouiaProps, props), children))));
    };
    DropdownItem.displayName = 'DropdownItem';

    Promise.resolve().then(function () { return divider; });
    var styles$7 = {
      "divider": "pf-c-divider",
      "modifiers": {
        "hidden": "pf-m-hidden",
        "hiddenOnSm": "pf-m-hidden-on-sm",
        "visibleOnSm": "pf-m-visible-on-sm",
        "hiddenOnMd": "pf-m-hidden-on-md",
        "visibleOnMd": "pf-m-visible-on-md",
        "hiddenOnLg": "pf-m-hidden-on-lg",
        "visibleOnLg": "pf-m-visible-on-lg",
        "hiddenOnXl": "pf-m-hidden-on-xl",
        "visibleOnXl": "pf-m-visible-on-xl",
        "hiddenOn_2xl": "pf-m-hidden-on-2xl",
        "visibleOn_2xl": "pf-m-visible-on-2xl",
        "vertical": "pf-m-vertical",
        "insetNone": "pf-m-inset-none",
        "insetXs": "pf-m-inset-xs",
        "insetSm": "pf-m-inset-sm",
        "insetMd": "pf-m-inset-md",
        "insetLg": "pf-m-inset-lg",
        "insetXl": "pf-m-inset-xl",
        "inset_2xl": "pf-m-inset-2xl",
        "inset_3xl": "pf-m-inset-3xl",
        "horizontalOnSm": "pf-m-horizontal-on-sm",
        "verticalOnSm": "pf-m-vertical-on-sm",
        "insetNoneOnSm": "pf-m-inset-none-on-sm",
        "insetXsOnSm": "pf-m-inset-xs-on-sm",
        "insetSmOnSm": "pf-m-inset-sm-on-sm",
        "insetMdOnSm": "pf-m-inset-md-on-sm",
        "insetLgOnSm": "pf-m-inset-lg-on-sm",
        "insetXlOnSm": "pf-m-inset-xl-on-sm",
        "inset_2xlOnSm": "pf-m-inset-2xl-on-sm",
        "inset_3xlOnSm": "pf-m-inset-3xl-on-sm",
        "horizontalOnMd": "pf-m-horizontal-on-md",
        "verticalOnMd": "pf-m-vertical-on-md",
        "insetNoneOnMd": "pf-m-inset-none-on-md",
        "insetXsOnMd": "pf-m-inset-xs-on-md",
        "insetSmOnMd": "pf-m-inset-sm-on-md",
        "insetMdOnMd": "pf-m-inset-md-on-md",
        "insetLgOnMd": "pf-m-inset-lg-on-md",
        "insetXlOnMd": "pf-m-inset-xl-on-md",
        "inset_2xlOnMd": "pf-m-inset-2xl-on-md",
        "inset_3xlOnMd": "pf-m-inset-3xl-on-md",
        "horizontalOnLg": "pf-m-horizontal-on-lg",
        "verticalOnLg": "pf-m-vertical-on-lg",
        "insetNoneOnLg": "pf-m-inset-none-on-lg",
        "insetXsOnLg": "pf-m-inset-xs-on-lg",
        "insetSmOnLg": "pf-m-inset-sm-on-lg",
        "insetMdOnLg": "pf-m-inset-md-on-lg",
        "insetLgOnLg": "pf-m-inset-lg-on-lg",
        "insetXlOnLg": "pf-m-inset-xl-on-lg",
        "inset_2xlOnLg": "pf-m-inset-2xl-on-lg",
        "inset_3xlOnLg": "pf-m-inset-3xl-on-lg",
        "horizontalOnXl": "pf-m-horizontal-on-xl",
        "verticalOnXl": "pf-m-vertical-on-xl",
        "insetNoneOnXl": "pf-m-inset-none-on-xl",
        "insetXsOnXl": "pf-m-inset-xs-on-xl",
        "insetSmOnXl": "pf-m-inset-sm-on-xl",
        "insetMdOnXl": "pf-m-inset-md-on-xl",
        "insetLgOnXl": "pf-m-inset-lg-on-xl",
        "insetXlOnXl": "pf-m-inset-xl-on-xl",
        "inset_2xlOnXl": "pf-m-inset-2xl-on-xl",
        "inset_3xlOnXl": "pf-m-inset-3xl-on-xl",
        "horizontalOn_2xl": "pf-m-horizontal-on-2xl",
        "verticalOn_2xl": "pf-m-vertical-on-2xl",
        "insetNoneOn_2xl": "pf-m-inset-none-on-2xl",
        "insetXsOn_2xl": "pf-m-inset-xs-on-2xl",
        "insetSmOn_2xl": "pf-m-inset-sm-on-2xl",
        "insetMdOn_2xl": "pf-m-inset-md-on-2xl",
        "insetLgOn_2xl": "pf-m-inset-lg-on-2xl",
        "insetXlOn_2xl": "pf-m-inset-xl-on-2xl",
        "inset_2xlOn_2xl": "pf-m-inset-2xl-on-2xl",
        "inset_3xlOn_2xl": "pf-m-inset-3xl-on-2xl"
      }
    };

    var DividerVariant;
    (function (DividerVariant) {
        DividerVariant["hr"] = "hr";
        DividerVariant["li"] = "li";
        DividerVariant["div"] = "div";
    })(DividerVariant || (DividerVariant = {}));
    const Divider = (_a) => {
        var { className, component = DividerVariant.hr, isVertical = false, inset, orientation } = _a, props = __rest$1(_a, ["className", "component", "isVertical", "inset", "orientation"]);
        const Component = component;
        return (React__namespace.createElement(Component, Object.assign({ className: css(styles$7.divider, isVertical && styles$7.modifiers.vertical, formatBreakpointMods(inset, styles$7), formatBreakpointMods(orientation, styles$7), className) }, (component !== 'hr' && { role: 'separator' }), props)));
    };
    Divider.displayName = 'Divider';

    const DropdownSeparator = (_a) => {
        var { className = '', 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ref, // Types of Ref are different for React.FunctionComponent vs React.Component
        ouiaId, ouiaSafe } = _a, props = __rest$1(_a, ["className", "ref", "ouiaId", "ouiaSafe"]);
        const ouiaProps = useOUIAProps(DropdownSeparator.displayName, ouiaId, ouiaSafe);
        return (React__namespace.createElement(DropdownArrowContext.Consumer, null, context => (React__namespace.createElement(InternalDropdownItem, Object.assign({}, props, { context: context, component: React__namespace.createElement(Divider, { component: DividerVariant.div }), className: className, role: "separator" }, ouiaProps)))));
    };
    DropdownSeparator.displayName = 'DropdownSeparator';

    const CaretDownIconConfig = {
      name: 'CaretDownIcon',
      height: 512,
      width: 320,
      svgPath: 'M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z',
      yOffset: 0,
      xOffset: 0,
    };

    const CaretDownIcon = createIcon(CaretDownIconConfig);

    var CaretDownIcon$1 = CaretDownIcon;

    const buttonVariantStyles = {
        default: '',
        primary: styles$8.modifiers.primary,
        secondary: styles$8.modifiers.secondary
    };
    class Toggle extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.buttonRef = React__namespace.createRef();
            this.componentDidMount = () => {
                document.addEventListener('click', this.onDocClick);
                document.addEventListener('touchstart', this.onDocClick);
                document.addEventListener('keydown', this.onEscPress);
            };
            this.componentWillUnmount = () => {
                document.removeEventListener('click', this.onDocClick);
                document.removeEventListener('touchstart', this.onDocClick);
                document.removeEventListener('keydown', this.onEscPress);
            };
            this.onDocClick = (event) => {
                const { isOpen, parentRef, onToggle, getMenuRef } = this.props;
                const menuRef = getMenuRef && getMenuRef();
                const clickedOnToggle = parentRef && parentRef.current && parentRef.current.contains(event.target);
                const clickedWithinMenu = menuRef && menuRef.contains && menuRef.contains(event.target);
                if (isOpen && !(clickedOnToggle || clickedWithinMenu)) {
                    onToggle(false, event);
                }
            };
            this.onEscPress = (event) => {
                const { parentRef, getMenuRef } = this.props;
                const keyCode = event.keyCode || event.which;
                const menuRef = getMenuRef && getMenuRef();
                const escFromToggle = parentRef && parentRef.current && parentRef.current.contains(event.target);
                const escFromWithinMenu = menuRef && menuRef.contains && menuRef.contains(event.target);
                if (this.props.isOpen &&
                    (keyCode === KEY_CODES.ESCAPE_KEY || event.key === 'Tab') &&
                    (escFromToggle || escFromWithinMenu)) {
                    this.props.onToggle(false, event);
                    this.buttonRef.current.focus();
                }
            };
            this.onKeyDown = (event) => {
                if (event.key === 'Tab' && !this.props.isOpen) {
                    return;
                }
                if ((event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') && this.props.isOpen) {
                    if (!this.props.bubbleEvent) {
                        event.stopPropagation();
                    }
                    event.preventDefault();
                    this.props.onToggle(!this.props.isOpen, event);
                }
                else if ((event.key === 'Enter' || event.key === ' ') && !this.props.isOpen) {
                    if (!this.props.bubbleEvent) {
                        event.stopPropagation();
                    }
                    event.preventDefault();
                    this.props.onToggle(!this.props.isOpen, event);
                    this.props.onEnter();
                }
            };
        }
        render() {
            const _a = this.props, { className, children, isOpen, isDisabled, isPlain, isText, isPrimary, isSplitButton, toggleVariant, onToggle, 'aria-haspopup': ariaHasPopup, 
            /* eslint-disable @typescript-eslint/no-unused-vars */
            isActive, bubbleEvent, onEnter, parentRef, getMenuRef, 
            /* eslint-enable @typescript-eslint/no-unused-vars */
            id, type } = _a, props = __rest$1(_a, ["className", "children", "isOpen", "isDisabled", "isPlain", "isText", "isPrimary", "isSplitButton", "toggleVariant", "onToggle", 'aria-haspopup', "isActive", "bubbleEvent", "onEnter", "parentRef", "getMenuRef", "id", "type"]);
            return (React__namespace.createElement(DropdownContext.Consumer, null, ({ toggleClass }) => (React__namespace.createElement("button", Object.assign({}, props, { id: id, ref: this.buttonRef, className: css(isSplitButton ? styles$8.dropdownToggleButton : toggleClass || styles$8.dropdownToggle, isActive && styles$8.modifiers.active, isPlain && styles$8.modifiers.plain, isText && styles$8.modifiers.text, isPrimary && styles$8.modifiers.primary, buttonVariantStyles[toggleVariant], className), type: type || 'button', onClick: event => onToggle(!isOpen, event), "aria-expanded": isOpen, "aria-haspopup": ariaHasPopup, onKeyDown: event => this.onKeyDown(event), disabled: isDisabled }), children))));
        }
    }
    Toggle.displayName = 'Toggle';
    Toggle.defaultProps = {
        className: '',
        isOpen: false,
        isActive: false,
        isDisabled: false,
        isPlain: false,
        isText: false,
        isPrimary: false,
        isSplitButton: false,
        onToggle: () => { },
        onEnter: () => { },
        bubbleEvent: false
    };

    Promise.resolve().then(function () { return badge; });
    var badgeStyles = {
      "badge": "pf-c-badge",
      "modifiers": {
        "read": "pf-m-read",
        "unread": "pf-m-unread"
      }
    };

    const EllipsisVIconConfig = {
      name: 'EllipsisVIcon',
      height: 512,
      width: 192,
      svgPath: 'M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z',
      yOffset: 0,
      xOffset: 0,
    };

    const EllipsisVIcon = createIcon(EllipsisVIconConfig);

    var EllipsisVIcon$1 = EllipsisVIcon;

    const KebabToggle = (_a) => {
        var { id = '', 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        children = null, className = '', isOpen = false, 'aria-label': ariaLabel = 'Actions', parentRef = null, getMenuRef = null, isActive = false, isPlain = false, isDisabled = false, bubbleEvent = false, onToggle = () => undefined, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ref } = _a, // Types of Ref are different for React.FunctionComponent vs React.Component
        props = __rest$1(_a, ["id", "children", "className", "isOpen", 'aria-label', "parentRef", "getMenuRef", "isActive", "isPlain", "isDisabled", "bubbleEvent", "onToggle", "ref"]);
        return (React__namespace.createElement(Toggle, Object.assign({ id: id, className: className, isOpen: isOpen, "aria-label": ariaLabel, parentRef: parentRef, getMenuRef: getMenuRef, isActive: isActive, isPlain: isPlain, isDisabled: isDisabled, onToggle: onToggle, bubbleEvent: bubbleEvent }, props),
            React__namespace.createElement(EllipsisVIcon$1, null)));
    };
    KebabToggle.displayName = 'KebabToggle';

    const ApplicationLauncherSeparator = (_a) => {
        var props = __rest$1(_a, ["children"]);
        return React__namespace.createElement(DropdownSeparator, Object.assign({}, props));
    };
    ApplicationLauncherSeparator.displayName = 'ApplicationLauncherSeparator';

    const StarIconConfig = {
      name: 'StarIcon',
      height: 512,
      width: 576,
      svgPath: 'M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z',
      yOffset: 0,
      xOffset: 0,
    };

    const StarIcon = createIcon(StarIconConfig);

    var StarIcon$1 = StarIcon;

    /**
     * This function is a helper for creating an array of renderable favorite items for the Application launcher or Select
     *
     * @param {object} items The items rendered in Select or Application aLauncher
     * @param {boolean} isGrouped Flag indicating if items are grouped
     * @param {any[]} favorites Array of ids of favorited items
     * @param {boolean} isEnterTriggersArrowDown Flag indicating if we should add isEnterTriggersArrowDown to favorited item
     */
    const createRenderableFavorites = (items, isGrouped, favorites, isEnterTriggersArrowDown) => {
        if (isGrouped) {
            const favoriteItems = [];
            items.forEach(group => {
                if (favorites.length > 0) {
                    return (group.props.children &&
                        group.props.children
                            .filter(item => favorites.includes(item.props.id))
                            .map(item => {
                            if (isEnterTriggersArrowDown) {
                                return favoriteItems.push(React__namespace.cloneElement(item, {
                                    isFavorite: true,
                                    enterTriggersArrowDown: isEnterTriggersArrowDown,
                                    id: `favorite-${item.props.id}`
                                }));
                            }
                            else {
                                return favoriteItems.push(React__namespace.cloneElement(item, { isFavorite: true, id: `favorite-${item.props.id}` }));
                            }
                        }));
                }
            });
            return favoriteItems;
        }
        return items
            .filter(item => favorites.includes(item.props.id))
            .map(item => React__namespace.cloneElement(item, { isFavorite: true, enterTriggersArrowDown: isEnterTriggersArrowDown }));
    };
    /**
     * This function is a helper for extending the array of renderable favorite with the select/application launcher items to  render in the Application launcher or Select
     *
     * @param {object} items The items rendered in Select or Application aLauncher
     * @param {boolean} isGrouped Flag indicating if items are grouped
     * @param {any[]} favorites Array of ids of favorited items
     */
    const extendItemsWithFavorite = (items, isGrouped, favorites) => {
        if (isGrouped) {
            return items.map(group => React__namespace.cloneElement(group, {
                children: React__namespace.Children.map(group.props.children, item => {
                    if (item.type === ApplicationLauncherSeparator || item.type === Divider) {
                        return item;
                    }
                    return React__namespace.cloneElement(item, {
                        isFavorite: favorites.some(favoriteId => favoriteId === item.props.id || `favorite-${favoriteId}` === item.props.id)
                    });
                })
            }));
        }
        return items.map(item => React__namespace.cloneElement(item, {
            isFavorite: favorites.some(favoriteId => favoriteId === item.props.id)
        }));
    };

    var TextInputTypes;
    (function (TextInputTypes) {
        TextInputTypes["text"] = "text";
        TextInputTypes["date"] = "date";
        TextInputTypes["datetimeLocal"] = "datetime-local";
        TextInputTypes["email"] = "email";
        TextInputTypes["month"] = "month";
        TextInputTypes["number"] = "number";
        TextInputTypes["password"] = "password";
        TextInputTypes["search"] = "search";
        TextInputTypes["tel"] = "tel";
        TextInputTypes["time"] = "time";
        TextInputTypes["url"] = "url";
    })(TextInputTypes || (TextInputTypes = {}));
    class TextInputBase extends React__namespace.Component {
        constructor(props) {
            super(props);
            this.inputRef = React__namespace.createRef();
            this.observer = () => { };
            this.handleChange = (event) => {
                if (this.props.onChange) {
                    this.props.onChange(event.currentTarget.value, event);
                }
            };
            this.handleResize = () => {
                const inputRef = this.props.innerRef || this.inputRef;
                if (inputRef && inputRef.current) {
                    trimLeft(inputRef.current, String(this.props.value));
                }
            };
            this.restoreText = () => {
                const inputRef = this.props.innerRef || this.inputRef;
                // restore the value
                inputRef.current.value = String(this.props.value);
                // make sure we still see the rightmost value to preserve cursor click position
                inputRef.current.scrollLeft = inputRef.current.scrollWidth;
            };
            this.onFocus = (event) => {
                const { isLeftTruncated, onFocus } = this.props;
                if (isLeftTruncated) {
                    this.restoreText();
                }
                onFocus && onFocus(event);
            };
            this.onBlur = (event) => {
                const { isLeftTruncated, onBlur } = this.props;
                if (isLeftTruncated) {
                    this.handleResize();
                }
                onBlur && onBlur(event);
            };
            this.sanitizeInputValue = (value) => typeof value === 'string' ? value.replace(/\n/g, ' ') : value;
            if (!props.id && !props['aria-label'] && !props['aria-labelledby']) {
                // eslint-disable-next-line no-console
                console.error('Text input:', 'Text input requires either an id or aria-label to be specified');
            }
            this.state = {
                ouiaStateId: getDefaultOUIAId(TextInputBase.displayName)
            };
        }
        componentDidMount() {
            if (this.props.isLeftTruncated) {
                const inputRef = this.props.innerRef || this.inputRef;
                this.observer = getResizeObserver(inputRef.current, this.handleResize);
                this.handleResize();
            }
        }
        componentWillUnmount() {
            if (this.props.isLeftTruncated) {
                this.observer();
            }
        }
        render() {
            const _a = this.props, { innerRef, className, type, value, validated, 
            /* eslint-disable @typescript-eslint/no-unused-vars */
            onChange, onFocus, onBlur, isLeftTruncated, 
            /* eslint-enable @typescript-eslint/no-unused-vars */
            isReadOnly, isRequired, isDisabled, isIconSprite, iconVariant, customIconUrl, customIconDimensions, ouiaId, ouiaSafe } = _a, props = __rest$1(_a, ["innerRef", "className", "type", "value", "validated", "onChange", "onFocus", "onBlur", "isLeftTruncated", "isReadOnly", "isRequired", "isDisabled", "isIconSprite", "iconVariant", "customIconUrl", "customIconDimensions", "ouiaId", "ouiaSafe"]);
            const customIconStyle = {};
            if (customIconUrl) {
                customIconStyle.backgroundImage = `url('${customIconUrl}')`;
            }
            if (customIconDimensions) {
                customIconStyle.backgroundSize = customIconDimensions;
            }
            return (React__namespace.createElement("input", Object.assign({}, props, { onFocus: this.onFocus, onBlur: this.onBlur, className: css(formStyles$1.formControl, isIconSprite && formStyles$1.modifiers.iconSprite, validated === ValidatedOptions.success && formStyles$1.modifiers.success, validated === ValidatedOptions.warning && formStyles$1.modifiers.warning, ((iconVariant && iconVariant !== 'search') || customIconUrl) && formStyles$1.modifiers.icon, iconVariant && formStyles$1.modifiers[iconVariant], className), onChange: this.handleChange, type: type, value: this.sanitizeInputValue(value), "aria-invalid": props['aria-invalid'] ? props['aria-invalid'] : validated === ValidatedOptions.error, required: isRequired, disabled: isDisabled, readOnly: isReadOnly, ref: innerRef || this.inputRef }, ((customIconUrl || customIconDimensions) && { style: customIconStyle }), getOUIAProps(TextInput.displayName, ouiaId !== undefined ? ouiaId : this.state.ouiaStateId, ouiaSafe))));
        }
    }
    TextInputBase.displayName = 'TextInputBase';
    TextInputBase.defaultProps = {
        'aria-label': null,
        className: '',
        isRequired: false,
        validated: 'default',
        isDisabled: false,
        isReadOnly: false,
        isIconSprite: false,
        type: TextInputTypes.text,
        isLeftTruncated: false,
        onChange: () => undefined,
        ouiaSafe: true
    };
    const TextInput = React__namespace.forwardRef((props, ref) => (React__namespace.createElement(TextInputBase, Object.assign({}, props, { innerRef: ref }))));
    TextInput.displayName = 'TextInput';

    Promise.resolve().then(function () { return select; });
    var styles$6 = {
      "check": "pf-c-check",
      "checkLabel": "pf-c-check__label",
      "chipGroup": "pf-c-chip-group",
      "divider": "pf-c-divider",
      "formControl": "pf-c-form-control",
      "modifiers": {
        "invalid": "pf-m-invalid",
        "success": "pf-m-success",
        "warning": "pf-m-warning",
        "disabled": "pf-m-disabled",
        "active": "pf-m-active",
        "expanded": "pf-m-expanded",
        "plain": "pf-m-plain",
        "typeahead": "pf-m-typeahead",
        "placeholder": "pf-m-placeholder",
        "top": "pf-m-top",
        "alignRight": "pf-m-align-right",
        "favorite": "pf-m-favorite",
        "favoriteAction": "pf-m-favorite-action",
        "focus": "pf-m-focus",
        "link": "pf-m-link",
        "action": "pf-m-action",
        "selected": "pf-m-selected",
        "description": "pf-m-description",
        "load": "pf-m-load",
        "loading": "pf-m-loading"
      },
      "select": "pf-c-select",
      "selectListItem": "pf-c-select__list-item",
      "selectMenu": "pf-c-select__menu",
      "selectMenuFieldset": "pf-c-select__menu-fieldset",
      "selectMenuFooter": "pf-c-select__menu-footer",
      "selectMenuGroup": "pf-c-select__menu-group",
      "selectMenuGroupTitle": "pf-c-select__menu-group-title",
      "selectMenuItem": "pf-c-select__menu-item",
      "selectMenuItemActionIcon": "pf-c-select__menu-item-action-icon",
      "selectMenuItemCount": "pf-c-select__menu-item-count",
      "selectMenuItemDescription": "pf-c-select__menu-item-description",
      "selectMenuItemIcon": "pf-c-select__menu-item-icon",
      "selectMenuItemMain": "pf-c-select__menu-item-main",
      "selectMenuItemMatch": "pf-c-select__menu-item--match",
      "selectMenuItemRow": "pf-c-select__menu-item-row",
      "selectMenuItemText": "pf-c-select__menu-item-text",
      "selectMenuSearch": "pf-c-select__menu-search",
      "selectMenuWrapper": "pf-c-select__menu-wrapper",
      "selectToggle": "pf-c-select__toggle",
      "selectToggleArrow": "pf-c-select__toggle-arrow",
      "selectToggleBadge": "pf-c-select__toggle-badge",
      "selectToggleButton": "pf-c-select__toggle-button",
      "selectToggleClear": "pf-c-select__toggle-clear",
      "selectToggleIcon": "pf-c-select__toggle-icon",
      "selectToggleStatusIcon": "pf-c-select__toggle-status-icon",
      "selectToggleText": "pf-c-select__toggle-text",
      "selectToggleTypeahead": "pf-c-select__toggle-typeahead",
      "selectToggleWrapper": "pf-c-select__toggle-wrapper"
    };

    const TimesCircleIconConfig = {
      name: 'TimesCircleIcon',
      height: 512,
      width: 512,
      svgPath: 'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z',
      yOffset: 0,
      xOffset: 0,
    };

    const TimesCircleIcon = createIcon(TimesCircleIconConfig);

    var TimesCircleIcon$1 = TimesCircleIcon;

    Promise.resolve().then(function () { return form; });
    var formStyles = {
      "form": "pf-c-form",
      "formActions": "pf-c-form__actions",
      "formFieldGroup": "pf-c-form__field-group",
      "formFieldGroupBody": "pf-c-form__field-group-body",
      "formFieldGroupHeader": "pf-c-form__field-group-header",
      "formFieldGroupHeaderActions": "pf-c-form__field-group-header-actions",
      "formFieldGroupHeaderDescription": "pf-c-form__field-group-header-description",
      "formFieldGroupHeaderMain": "pf-c-form__field-group-header-main",
      "formFieldGroupHeaderTitle": "pf-c-form__field-group-header-title",
      "formFieldGroupHeaderTitleText": "pf-c-form__field-group-header-title-text",
      "formFieldGroupToggle": "pf-c-form__field-group-toggle",
      "formFieldGroupToggleButton": "pf-c-form__field-group-toggle-button",
      "formFieldGroupToggleIcon": "pf-c-form__field-group-toggle-icon",
      "formFieldset": "pf-c-form__fieldset",
      "formGroup": "pf-c-form__group",
      "formGroupControl": "pf-c-form__group-control",
      "formGroupLabel": "pf-c-form__group-label",
      "formGroupLabelHelp": "pf-c-form__group-label-help",
      "formGroupLabelInfo": "pf-c-form__group-label-info",
      "formGroupLabelMain": "pf-c-form__group-label-main",
      "formHelperText": "pf-c-form__helper-text",
      "formHelperTextIcon": "pf-c-form__helper-text-icon",
      "formLabel": "pf-c-form__label",
      "formLabelRequired": "pf-c-form__label-required",
      "formLabelText": "pf-c-form__label-text",
      "formSection": "pf-c-form__section",
      "formSectionTitle": "pf-c-form__section-title",
      "modifiers": {
        "horizontal": "pf-m-horizontal",
        "alignRight": "pf-m-align-right",
        "noPaddingTop": "pf-m-no-padding-top",
        "horizontalOnXs": "pf-m-horizontal-on-xs",
        "horizontalOnSm": "pf-m-horizontal-on-sm",
        "horizontalOnMd": "pf-m-horizontal-on-md",
        "horizontalOnLg": "pf-m-horizontal-on-lg",
        "horizontalOnXl": "pf-m-horizontal-on-xl",
        "horizontalOn_2xl": "pf-m-horizontal-on-2xl",
        "limitWidth": "pf-m-limit-width",
        "action": "pf-m-action",
        "info": "pf-m-info",
        "disabled": "pf-m-disabled",
        "inline": "pf-m-inline",
        "stack": "pf-m-stack",
        "error": "pf-m-error",
        "success": "pf-m-success",
        "warning": "pf-m-warning",
        "inactive": "pf-m-inactive",
        "hidden": "pf-m-hidden",
        "expanded": "pf-m-expanded"
      }
    };

    Promise.resolve().then(function () { return check; });
    var checkStyles = {
      "check": "pf-c-check",
      "checkBody": "pf-c-check__body",
      "checkDescription": "pf-c-check__description",
      "checkInput": "pf-c-check__input",
      "checkLabel": "pf-c-check__label",
      "modifiers": {
        "standalone": "pf-m-standalone",
        "disabled": "pf-m-disabled"
      }
    };

    const CheckIconConfig = {
      name: 'CheckIcon',
      height: 512,
      width: 512,
      svgPath: 'M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z',
      yOffset: 0,
      xOffset: 0,
    };

    const CheckIcon = createIcon(CheckIconConfig);

    var CheckIcon$1 = CheckIcon;

    const SelectContext = React__namespace.createContext(null);
    SelectContext.Provider;
    const SelectConsumer = SelectContext.Consumer;
    var SelectVariant;
    (function (SelectVariant) {
        SelectVariant["single"] = "single";
        SelectVariant["checkbox"] = "checkbox";
        SelectVariant["typeahead"] = "typeahead";
        SelectVariant["typeaheadMulti"] = "typeaheadmulti";
    })(SelectVariant || (SelectVariant = {}));
    var SelectPosition;
    (function (SelectPosition) {
        SelectPosition["right"] = "right";
        SelectPosition["left"] = "left";
    })(SelectPosition || (SelectPosition = {}));
    var SelectDirection;
    (function (SelectDirection) {
        SelectDirection["up"] = "up";
        SelectDirection["down"] = "down";
    })(SelectDirection || (SelectDirection = {}));
    const SelectFooterTabbableItems = 'input, button, select, textarea, a[href]';

    class SelectOption extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.ref = React__namespace.createRef();
            this.liRef = React__namespace.createRef();
            this.favoriteRef = React__namespace.createRef();
            this.onKeyDown = (event, innerIndex, onEnter, isCheckbox) => {
                const { index, keyHandler, isLastOptionBeforeFooter } = this.props;
                let isLastItemBeforeFooter = false;
                if (isLastOptionBeforeFooter !== undefined) {
                    isLastItemBeforeFooter = isLastOptionBeforeFooter(index);
                }
                if (event.key === KeyTypes.Tab) {
                    // More modal-like experience for checkboxes
                    if (isCheckbox && !isLastItemBeforeFooter) {
                        if (event.shiftKey) {
                            keyHandler(index, innerIndex, 'up');
                        }
                        else {
                            keyHandler(index, innerIndex, 'down');
                        }
                        event.stopPropagation();
                    }
                    else {
                        if (event.shiftKey) {
                            keyHandler(index, innerIndex, 'up');
                        }
                        else {
                            keyHandler(index, innerIndex, 'tab');
                        }
                    }
                }
                event.preventDefault();
                if (event.key === KeyTypes.ArrowUp) {
                    keyHandler(index, innerIndex, 'up');
                }
                else if (event.key === KeyTypes.ArrowDown) {
                    keyHandler(index, innerIndex, 'down');
                }
                else if (event.key === KeyTypes.ArrowLeft) {
                    keyHandler(index, innerIndex, 'left');
                }
                else if (event.key === KeyTypes.ArrowRight) {
                    keyHandler(index, innerIndex, 'right');
                }
                else if (event.key === KeyTypes.Enter) {
                    if (onEnter !== undefined) {
                        onEnter();
                    }
                    else {
                        this.ref.current.click();
                    }
                }
            };
        }
        componentDidMount() {
            this.props.sendRef(this.props.isDisabled ? null : this.ref.current, this.props.isDisabled ? null : this.favoriteRef.current, this.props.isDisabled ? null : this.liRef.current, this.props.index);
        }
        componentDidUpdate() {
            this.props.sendRef(this.props.isDisabled ? null : this.ref.current, this.props.isDisabled ? null : this.favoriteRef.current, this.props.isDisabled ? null : this.liRef.current, this.props.index);
        }
        render() {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const _a = this.props, { children, className, id, description, itemCount, value, onClick, isDisabled, isPlaceholder, isNoResultsOption, isSelected, isChecked, isFocused, sendRef, keyHandler, index, component, inputId, isFavorite, ariaIsFavoriteLabel = 'starred', ariaIsNotFavoriteLabel = 'not starred', isLoad, isLoading, setViewMoreNextIndex, 
            // eslint-disable-next-line no-console
            isLastOptionBeforeFooter, isGrouped = false } = _a, props = __rest$1(_a, ["children", "className", "id", "description", "itemCount", "value", "onClick", "isDisabled", "isPlaceholder", "isNoResultsOption", "isSelected", "isChecked", "isFocused", "sendRef", "keyHandler", "index", "component", "inputId", "isFavorite", "ariaIsFavoriteLabel", "ariaIsNotFavoriteLabel", "isLoad", "isLoading", "setViewMoreNextIndex", "isLastOptionBeforeFooter", "isGrouped"]);
            /* eslint-enable @typescript-eslint/no-unused-vars */
            const Component = component;
            if (!id && isFavorite !== null) {
                // eslint-disable-next-line no-console
                console.error('Please provide an id to use the favorites feature.');
            }
            const generatedId = id || getUniqueId('select-option');
            const favoriteButton = (onFavorite) => (React__namespace.createElement("button", { className: css(styles$6.selectMenuItem, styles$6.modifiers.action, styles$6.modifiers.favoriteAction), "aria-label": isFavorite ? ariaIsFavoriteLabel : ariaIsNotFavoriteLabel, onClick: () => {
                    onFavorite(generatedId.replace('favorite-', ''), isFavorite);
                }, onKeyDown: event => {
                    this.onKeyDown(event, 1, () => onFavorite(generatedId.replace('favorite-', ''), isFavorite));
                }, ref: this.favoriteRef },
                React__namespace.createElement("span", { className: css(styles$6.selectMenuItemActionIcon) },
                    React__namespace.createElement(StarIcon$1, null))));
            const itemDisplay = itemCount ? (React__namespace.createElement("span", { className: css(styles$6.selectMenuItemRow) },
                React__namespace.createElement("span", { className: css(styles$6.selectMenuItemText) }, children || (value && value.toString && value.toString())),
                React__namespace.createElement("span", { className: css(styles$6.selectMenuItemCount) }, itemCount))) : (children || value.toString());
            const onViewMoreClick = (event) => {
                // Set the index for the next item to focus after view more clicked, then call view more callback
                setViewMoreNextIndex();
                onClick(event);
            };
            const renderOption = (onSelect, onClose, variant, inputIdPrefix, onFavorite, shouldResetOnSelect) => {
                if (variant !== SelectVariant.checkbox && isLoading && isGrouped) {
                    return (React__namespace.createElement("div", { role: "presentation", className: css(styles$6.selectListItem, isLoading && styles$6.modifiers.loading, className) }, children));
                }
                else if (variant !== SelectVariant.checkbox && isLoad && isGrouped) {
                    return (React__namespace.createElement("div", null,
                        React__namespace.createElement("button", Object.assign({}, props, { role: "presentation", className: css(styles$6.selectMenuItem, styles$6.modifiers.load, className), onClick: (event) => {
                                onViewMoreClick(event);
                                event.stopPropagation();
                            }, ref: this.ref, type: "button" }), children || value.toString())));
                }
                else if (variant !== SelectVariant.checkbox) {
                    return (React__namespace.createElement("li", { id: generatedId, role: "presentation", className: css(isLoading && styles$6.selectListItem, !isLoading && styles$6.selectMenuWrapper, isFavorite && styles$6.modifiers.favorite, isFocused && styles$6.modifiers.focus, isLoading && styles$6.modifiers.loading), ref: this.liRef },
                        isLoading && children,
                        isLoad && !isGrouped && (React__namespace.createElement("button", Object.assign({}, props, { className: css(styles$6.selectMenuItem, styles$6.modifiers.load, className), onClick: (event) => {
                                onViewMoreClick(event);
                                event.stopPropagation();
                            }, ref: this.ref, onKeyDown: (event) => {
                                this.onKeyDown(event, 0);
                            }, type: "button" }), itemDisplay)),
                        !isLoading && !isLoad && (React__namespace.createElement(React__namespace.Fragment, null,
                            React__namespace.createElement(Component, Object.assign({}, props, { className: css(styles$6.selectMenuItem, isLoad && styles$6.modifiers.load, isSelected && styles$6.modifiers.selected, isDisabled && styles$6.modifiers.disabled, description && styles$6.modifiers.description, isFavorite !== null && styles$6.modifiers.link, className), onClick: (event) => {
                                    if (!isDisabled) {
                                        onClick(event);
                                        onSelect(event, value, isPlaceholder);
                                        shouldResetOnSelect && onClose();
                                    }
                                }, role: "option", "aria-selected": isSelected || null, ref: this.ref, onKeyDown: (event) => {
                                    this.onKeyDown(event, 0);
                                }, type: "button" }),
                                description && (React__namespace.createElement(React__namespace.Fragment, null,
                                    React__namespace.createElement("span", { className: css(styles$6.selectMenuItemMain) },
                                        itemDisplay,
                                        isSelected && (React__namespace.createElement("span", { className: css(styles$6.selectMenuItemIcon) },
                                            React__namespace.createElement(CheckIcon$1, { "aria-hidden": true })))),
                                    React__namespace.createElement("span", { className: css(styles$6.selectMenuItemDescription) }, description))),
                                !description && (React__namespace.createElement(React__namespace.Fragment, null,
                                    itemDisplay,
                                    isSelected && (React__namespace.createElement("span", { className: css(styles$6.selectMenuItemIcon) },
                                        React__namespace.createElement(CheckIcon$1, { "aria-hidden": true })))))),
                            isFavorite !== null && id && favoriteButton(onFavorite)))));
                }
                else if (variant === SelectVariant.checkbox && isLoad) {
                    return (React__namespace.createElement("button", { className: css(styles$6.selectMenuItem, styles$6.modifiers.load, isFocused && styles$6.modifiers.focus, className), onKeyDown: (event) => {
                            this.onKeyDown(event, 0, undefined, true);
                        }, onClick: (event) => {
                            onViewMoreClick(event);
                            event.stopPropagation();
                        }, ref: this.ref }, children || (value && value.toString && value.toString())));
                }
                else if (variant === SelectVariant.checkbox && isLoading) {
                    return (React__namespace.createElement("div", { className: css(styles$6.selectListItem, isLoading && styles$6.modifiers.loading, className) }, children));
                }
                else if (variant === SelectVariant.checkbox && !isNoResultsOption && !isLoading && !isLoad) {
                    return (React__namespace.createElement("label", Object.assign({}, props, { className: css(checkStyles.check, styles$6.selectMenuItem, isDisabled && styles$6.modifiers.disabled, description && styles$6.modifiers.description, className), onKeyDown: (event) => {
                            this.onKeyDown(event, 0, undefined, true);
                        } }),
                        React__namespace.createElement("input", { id: inputId || `${inputIdPrefix}-${value.toString()}`, className: css(checkStyles.checkInput), type: "checkbox", onChange: event => {
                                if (!isDisabled) {
                                    onClick(event);
                                    onSelect(event, value);
                                }
                            }, ref: this.ref, checked: isChecked || false, disabled: isDisabled }),
                        React__namespace.createElement("span", { className: css(checkStyles.checkLabel, isDisabled && styles$6.modifiers.disabled) }, itemDisplay),
                        description && React__namespace.createElement("div", { className: css(checkStyles.checkDescription) }, description)));
                }
                else if (variant === SelectVariant.checkbox && isNoResultsOption && !isLoading && !isLoad) {
                    return (React__namespace.createElement("div", null,
                        React__namespace.createElement(Component, Object.assign({}, props, { className: css(styles$6.selectMenuItem, isSelected && styles$6.modifiers.selected, isDisabled && styles$6.modifiers.disabled, className), role: "option", "aria-selected": isSelected || null, ref: this.ref, onKeyDown: (event) => {
                                this.onKeyDown(event, 0, undefined, true);
                            }, type: "button" }), itemDisplay)));
                }
            };
            return (React__namespace.createElement(SelectConsumer, null, ({ onSelect, onClose, variant, inputIdPrefix, onFavorite, shouldResetOnSelect }) => (React__namespace.createElement(React__namespace.Fragment, null, renderOption(onSelect, onClose, variant, inputIdPrefix, onFavorite, shouldResetOnSelect)))));
        }
    }
    SelectOption.displayName = 'SelectOption';
    SelectOption.defaultProps = {
        className: '',
        value: '',
        index: 0,
        isDisabled: false,
        isPlaceholder: false,
        isSelected: false,
        isChecked: false,
        isNoResultsOption: false,
        component: 'button',
        onClick: () => { },
        sendRef: () => { },
        keyHandler: () => { },
        inputId: '',
        isFavorite: null,
        isLoad: false,
        isLoading: false,
        setViewMoreNextIndex: () => { },
        isLastOptionBeforeFooter: () => false
    };

    const SelectGroup = (_a) => {
        var { children = [], className = '', label = '', titleId = '' } = _a, props = __rest$1(_a, ["children", "className", "label", "titleId"]);
        return (React__namespace.createElement(SelectConsumer, null, ({ variant }) => (React__namespace.createElement("div", Object.assign({}, props, { className: css(styles$6.selectMenuGroup, className) }),
            React__namespace.createElement("div", { className: css(styles$6.selectMenuGroupTitle), id: titleId, "aria-hidden": true }, label),
            variant === SelectVariant.checkbox ? children : React__namespace.createElement("ul", { role: "listbox" }, children)))));
    };
    SelectGroup.displayName = 'SelectGroup';

    class SelectMenuWithRef extends React__namespace.Component {
        extendChildren(randomId) {
            const { children, hasInlineFilter, isGrouped } = this.props;
            const childrenArray = children;
            let index = hasInlineFilter ? 1 : 0;
            if (isGrouped) {
                return React__namespace.Children.map(childrenArray, (group) => {
                    if (group.type === SelectGroup) {
                        return React__namespace.cloneElement(group, {
                            titleId: group.props.label && group.props.label.replace(/\W/g, '-'),
                            children: React__namespace.Children.map(group.props.children, (option) => this.cloneOption(option, index++, randomId))
                        });
                    }
                    else {
                        return this.cloneOption(group, index++, randomId);
                    }
                });
            }
            return React__namespace.Children.map(childrenArray, (child) => this.cloneOption(child, index++, randomId));
        }
        cloneOption(child, index, randomId) {
            const { selected, sendRef, keyHandler } = this.props;
            const isSelected = this.checkForValue(child.props.value, selected);
            if (child.type === Divider) {
                return child;
            }
            return React__namespace.cloneElement(child, {
                inputId: `${randomId}-${index}`,
                isSelected,
                sendRef,
                keyHandler,
                index
            });
        }
        checkForValue(valueToCheck, options) {
            if (!options || !valueToCheck) {
                return false;
            }
            const isSelectOptionObject = typeof valueToCheck !== 'string' &&
                valueToCheck.toString &&
                valueToCheck.compareTo;
            if (Array.isArray(options)) {
                if (isSelectOptionObject) {
                    return options.some(option => option.compareTo(valueToCheck));
                }
                else {
                    return options.includes(valueToCheck);
                }
            }
            else {
                if (isSelectOptionObject) {
                    return options.compareTo(valueToCheck);
                }
                else {
                    return options === valueToCheck;
                }
            }
        }
        extendCheckboxChildren(children) {
            const { isGrouped, checked, sendRef, keyHandler, hasInlineFilter, isLastOptionBeforeFooter } = this.props;
            let index = hasInlineFilter ? 1 : 0;
            if (isGrouped) {
                return React__namespace.Children.map(children, (group) => {
                    if (group.type === Divider) {
                        return group;
                    }
                    else if (group.type === SelectOption) {
                        return React__namespace.cloneElement(group, {
                            isChecked: this.checkForValue(group.props.value, checked),
                            sendRef,
                            keyHandler,
                            index: index++,
                            isLastOptionBeforeFooter
                        });
                    }
                    return React__namespace.cloneElement(group, {
                        titleId: group.props.label && group.props.label.replace(/\W/g, '-'),
                        children: group.props.children ? (React__namespace.createElement("fieldset", { "aria-labelledby": group.props.label && group.props.label.replace(/\W/g, '-'), className: css(styles$6.selectMenuFieldset) }, React__namespace.Children.map(group.props.children, (option) => option.type === Divider
                            ? option
                            : React__namespace.cloneElement(option, {
                                isChecked: this.checkForValue(option.props.value, checked),
                                sendRef,
                                keyHandler,
                                index: index++,
                                isLastOptionBeforeFooter
                            })))) : null
                    });
                });
            }
            return React__namespace.Children.map(children, (child) => child.type === Divider
                ? child
                : React__namespace.cloneElement(child, {
                    isChecked: this.checkForValue(child.props.value, checked),
                    sendRef,
                    keyHandler,
                    index: index++,
                    isLastOptionBeforeFooter
                }));
        }
        renderSelectMenu({ variant, inputIdPrefix }) {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const _a = this.props, { children, isCustomContent, className, isExpanded, openedOnEnter, selected, checked, isGrouped, position, sendRef, keyHandler, maxHeight, noResultsFoundText, createText, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, hasInlineFilter, innerRef, footer, footerRef, isLastOptionBeforeFooter } = _a, props = __rest$1(_a, ["children", "isCustomContent", "className", "isExpanded", "openedOnEnter", "selected", "checked", "isGrouped", "position", "sendRef", "keyHandler", "maxHeight", "noResultsFoundText", "createText", 'aria-label', 'aria-labelledby', "hasInlineFilter", "innerRef", "footer", "footerRef", "isLastOptionBeforeFooter"]);
            /* eslint-enable @typescript-eslint/no-unused-vars */
            let Component = 'div';
            const variantProps = Object.assign({ ref: innerRef, className: css(!footer ? styles$6.selectMenu : 'pf-c-select__menu-list', position === SelectPosition.right && styles$6.modifiers.alignRight, className) }, (maxHeight && { style: { maxHeight, overflow: 'auto' } }));
            const extendedChildren = () => variant === SelectVariant.checkbox
                ? this.extendCheckboxChildren(children)
                : this.extendChildren(inputIdPrefix);
            if (isCustomContent) {
                variantProps.children = children;
            }
            else if (hasInlineFilter) {
                if (React__namespace.Children.count(children) === 0) {
                    variantProps.children = React__namespace.createElement("fieldset", { className: css(styles$6.selectMenuFieldset) });
                }
                else {
                    variantProps.children = (React__namespace.createElement("fieldset", { "aria-label": ariaLabel, "aria-labelledby": (!ariaLabel && ariaLabelledBy) || null, className: css(formStyles.formFieldset) },
                        children.shift(),
                        extendedChildren()));
                }
            }
            else {
                variantProps.children = extendedChildren();
                if (!isGrouped) {
                    Component = 'ul';
                    variantProps.role = 'listbox';
                    variantProps['aria-label'] = ariaLabel;
                    variantProps['aria-labelledby'] = (!ariaLabel && ariaLabelledBy) || null;
                }
            }
            return (React__namespace.createElement(React__namespace.Fragment, null,
                React__namespace.createElement(Component, Object.assign({}, variantProps, props)),
                footer && (React__namespace.createElement("div", { className: css(styles$6.selectMenuFooter), ref: footerRef }, footer))));
        }
        render() {
            return React__namespace.createElement(SelectConsumer, null, context => this.renderSelectMenu(context));
        }
    }
    SelectMenuWithRef.displayName = 'SelectMenu';
    SelectMenuWithRef.defaultProps = {
        className: '',
        isExpanded: false,
        isGrouped: false,
        openedOnEnter: false,
        selected: '',
        maxHeight: '',
        position: SelectPosition.left,
        sendRef: () => { },
        keyHandler: () => { },
        isCustomContent: false,
        hasInlineFilter: false,
        isLastOptionBeforeFooter: () => { }
    };
    const SelectMenu = React__namespace.forwardRef((props, ref) => (React__namespace.createElement(SelectMenuWithRef, Object.assign({ innerRef: ref }, props), props.children)));

    class SelectToggle extends React__namespace.Component {
        constructor(props) {
            super(props);
            this.onDocClick = (event) => {
                const { parentRef, menuRef, footerRef, isOpen, onToggle, onClose } = this.props;
                const clickedOnToggle = parentRef && parentRef.current && parentRef.current.contains(event.target);
                const clickedWithinMenu = menuRef && menuRef.current && menuRef.current.contains && menuRef.current.contains(event.target);
                const clickedWithinFooter = footerRef && footerRef.current && footerRef.current.contains && footerRef.current.contains(event.target);
                if (isOpen && !(clickedOnToggle || clickedWithinMenu || clickedWithinFooter)) {
                    onToggle(false, event);
                    onClose();
                }
            };
            this.handleGlobalKeys = (event) => {
                const { parentRef, menuRef, hasFooter, footerRef, isOpen, variant, onToggle, onClose, moveFocusToLastMenuItem } = this.props;
                const escFromToggle = parentRef && parentRef.current && parentRef.current.contains(event.target);
                const escFromWithinMenu = menuRef && menuRef.current && menuRef.current.contains && menuRef.current.contains(event.target);
                if (isOpen &&
                    event.key === KeyTypes.Tab &&
                    (variant === SelectVariant.typeahead || variant === SelectVariant.typeaheadMulti)) {
                    this.props.handleTypeaheadKeys('tab', event.shiftKey);
                    event.preventDefault();
                    return;
                }
                if (isOpen && event.key === KeyTypes.Tab && hasFooter) {
                    const tabbableItems = findTabbableElements(footerRef, SelectFooterTabbableItems);
                    // If no tabbable item in footer close select
                    if (tabbableItems.length <= 0) {
                        onToggle(false, event);
                        onClose();
                        this.toggle.current.focus();
                        return;
                    }
                    else {
                        // if current element is not in footer, tab to first tabbable element in footer, or close if shift clicked
                        const currentElementIndex = tabbableItems.findIndex((item) => item === document.activeElement);
                        if (currentElementIndex === -1) {
                            if (event.shiftKey) {
                                if (variant !== 'checkbox') {
                                    // only close non checkbox variation on shift clicked
                                    onToggle(false, event);
                                    onClose();
                                    this.toggle.current.focus();
                                }
                            }
                            else {
                                // tab to footer
                                tabbableItems[0].focus();
                                return;
                            }
                        }
                        // Current element is in footer.
                        if (event.shiftKey) {
                            // Move focus back to menu if current tab index is 0
                            if (currentElementIndex === 0) {
                                moveFocusToLastMenuItem();
                                event.preventDefault();
                            }
                            return;
                        }
                        // Tab to next element in footer or close if there are none
                        if (currentElementIndex + 1 < tabbableItems.length) {
                            tabbableItems[currentElementIndex + 1].focus();
                        }
                        else {
                            // no more footer items close menu
                            onToggle(false, event);
                            onClose();
                            this.toggle.current.focus();
                        }
                        event.preventDefault();
                        return;
                    }
                }
                if (isOpen &&
                    (event.key === KeyTypes.Escape || event.key === KeyTypes.Tab) &&
                    (escFromToggle || escFromWithinMenu)) {
                    onToggle(false, event);
                    onClose();
                    this.toggle.current.focus();
                }
            };
            this.onKeyDown = (event) => {
                const { isOpen, onToggle, variant, onClose, onEnter, handleTypeaheadKeys } = this.props;
                if (variant === SelectVariant.typeahead || variant === SelectVariant.typeaheadMulti) {
                    if (event.key === KeyTypes.ArrowDown || event.key === KeyTypes.ArrowUp) {
                        handleTypeaheadKeys((event.key === KeyTypes.ArrowDown && 'down') || (event.key === KeyTypes.ArrowUp && 'up'));
                        event.preventDefault();
                    }
                    else if (event.key === KeyTypes.Enter) {
                        if (isOpen) {
                            handleTypeaheadKeys('enter');
                        }
                        else {
                            onToggle(!isOpen, event);
                        }
                    }
                }
                if (variant === SelectVariant.typeahead ||
                    variant === SelectVariant.typeaheadMulti ||
                    (event.key === KeyTypes.Tab && !isOpen) ||
                    (event.key !== KeyTypes.Enter && event.key !== KeyTypes.Space)) {
                    return;
                }
                event.preventDefault();
                if ((event.key === KeyTypes.Tab || event.key === KeyTypes.Enter || event.key === KeyTypes.Space) && isOpen) {
                    onToggle(!isOpen, event);
                    onClose();
                    this.toggle.current.focus();
                }
                else if ((event.key === KeyTypes.Enter || event.key === KeyTypes.Space) && !isOpen) {
                    onToggle(!isOpen, event);
                    onEnter();
                }
            };
            const { variant } = props;
            const isTypeahead = variant === SelectVariant.typeahead || variant === SelectVariant.typeaheadMulti;
            this.toggle = isTypeahead ? React__namespace.createRef() : React__namespace.createRef();
        }
        componentDidMount() {
            document.addEventListener('click', this.onDocClick, { capture: true });
            document.addEventListener('touchstart', this.onDocClick);
            document.addEventListener('keydown', this.handleGlobalKeys);
        }
        componentWillUnmount() {
            document.removeEventListener('click', this.onDocClick);
            document.removeEventListener('touchstart', this.onDocClick);
            document.removeEventListener('keydown', this.handleGlobalKeys);
        }
        render() {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const _a = this.props, { className, children, isOpen, isActive, isPlain, isDisabled, hasPlaceholderStyle, variant, onToggle, onEnter, onClose, onBlur, onClickTypeaheadToggleButton, handleTypeaheadKeys, moveFocusToLastMenuItem, parentRef, menuRef, id, type, hasClearButton, 'aria-labelledby': ariaLabelledBy, 'aria-label': ariaLabel, hasFooter, footerRef } = _a, props = __rest$1(_a, ["className", "children", "isOpen", "isActive", "isPlain", "isDisabled", "hasPlaceholderStyle", "variant", "onToggle", "onEnter", "onClose", "onBlur", "onClickTypeaheadToggleButton", "handleTypeaheadKeys", "moveFocusToLastMenuItem", "parentRef", "menuRef", "id", "type", "hasClearButton", 'aria-labelledby', 'aria-label', "hasFooter", "footerRef"]);
            /* eslint-enable @typescript-eslint/no-unused-vars */
            const isTypeahead = variant === SelectVariant.typeahead || variant === SelectVariant.typeaheadMulti || hasClearButton;
            const toggleProps = {
                id,
                'aria-labelledby': ariaLabelledBy,
                'aria-expanded': isOpen,
                'aria-haspopup': (variant !== SelectVariant.checkbox && 'listbox') || null
            };
            return (React__namespace.createElement(React__namespace.Fragment, null,
                !isTypeahead && (React__namespace.createElement("button", Object.assign({}, props, toggleProps, { ref: this.toggle, type: type, className: css(styles$6.selectToggle, hasPlaceholderStyle && styles$6.modifiers.placeholder, isDisabled && styles$6.modifiers.disabled, isPlain && styles$6.modifiers.plain, isActive && styles$6.modifiers.active, className), "aria-label": ariaLabel, onBlur: onBlur, 
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    onClick: event => {
                        onToggle(!isOpen, event);
                        if (isOpen) {
                            onClose();
                        }
                    }, onKeyDown: this.onKeyDown, disabled: isDisabled }),
                    children,
                    React__namespace.createElement("span", { className: css(styles$6.selectToggleArrow) },
                        React__namespace.createElement(CaretDownIcon$1, null)))),
                isTypeahead && (React__namespace.createElement("div", Object.assign({}, props, { ref: this.toggle, className: css(styles$6.selectToggle, hasPlaceholderStyle && styles$6.modifiers.placeholder, isDisabled && styles$6.modifiers.disabled, isPlain && styles$6.modifiers.plain, isTypeahead && styles$6.modifiers.typeahead, className), onBlur: onBlur, 
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    onClick: event => {
                        if (!isDisabled) {
                            onToggle(!isOpen, event);
                            if (isOpen) {
                                onClose();
                            }
                        }
                    }, onKeyDown: this.onKeyDown }),
                    children,
                    React__namespace.createElement("button", Object.assign({}, toggleProps, { type: type, className: css(buttonStyles.button, styles$6.selectToggleButton, styles$6.modifiers.plain), "aria-label": ariaLabel, onClick: event => {
                            onToggle(!isOpen, event);
                            if (isOpen) {
                                onClose();
                            }
                            onClickTypeaheadToggleButton();
                        } }, ((variant === SelectVariant.typeahead || variant === SelectVariant.typeaheadMulti) && {
                        tabIndex: -1
                    }), { disabled: isDisabled }),
                        React__namespace.createElement(CaretDownIcon$1, { className: css(styles$6.selectToggleArrow) }))))));
        }
    }
    SelectToggle.displayName = 'SelectToggle';
    SelectToggle.defaultProps = {
        className: '',
        isOpen: false,
        isActive: false,
        isPlain: false,
        isDisabled: false,
        hasPlaceholderStyle: false,
        hasClearButton: false,
        hasFooter: false,
        variant: 'single',
        'aria-labelledby': '',
        'aria-label': '',
        type: 'button',
        onToggle: () => { },
        onEnter: () => { },
        onClose: () => { },
        onClickTypeaheadToggleButton: () => { }
    };

    Promise.resolve().then(function () { return chipGroup; });
    var styles$5 = {
      "chipGroup": "pf-c-chip-group",
      "chipGroupClose": "pf-c-chip-group__close",
      "chipGroupLabel": "pf-c-chip-group__label",
      "chipGroupList": "pf-c-chip-group__list",
      "chipGroupListItem": "pf-c-chip-group__list-item",
      "chipGroupMain": "pf-c-chip-group__main",
      "modifiers": {
        "category": "pf-m-category"
      }
    };

    Promise.resolve().then(function () { return chip; });
    var styles$4 = {
      "badge": "pf-c-badge",
      "button": "pf-c-button",
      "chip": "pf-c-chip",
      "chipIcon": "pf-c-chip__icon",
      "chipText": "pf-c-chip__text",
      "modifiers": {
        "overflow": "pf-m-overflow",
        "draggable": "pf-m-draggable"
      }
    };

    class Chip extends React__namespace.Component {
        constructor(props) {
            super(props);
            this.span = React__namespace.createRef();
            this.renderOverflowChip = () => {
                const { children, className, onClick, ouiaId } = this.props;
                const Component = this.props.component;
                return (React__namespace.createElement(Component, Object.assign({ onClick: onClick, className: css(styles$4.chip, styles$4.modifiers.overflow, className) }, (this.props.component === 'button' ? { type: 'button' } : {}), getOUIAProps('OverflowChip', ouiaId !== undefined ? ouiaId : this.state.ouiaStateId)),
                    React__namespace.createElement("span", { className: css(styles$4.chipText) }, children)));
            };
            this.renderChip = (randomId) => {
                const { children, tooltipPosition } = this.props;
                if (this.state.isTooltipVisible) {
                    return (React__namespace.createElement(Tooltip, { position: tooltipPosition, content: children }, this.renderInnerChip(randomId)));
                }
                return this.renderInnerChip(randomId);
            };
            this.state = {
                isTooltipVisible: false,
                ouiaStateId: getDefaultOUIAId(Chip.displayName)
            };
        }
        componentDidMount() {
            this.setState({
                isTooltipVisible: Boolean(this.span.current && this.span.current.offsetWidth < this.span.current.scrollWidth)
            });
        }
        renderInnerChip(id) {
            const { children, className, onClick, closeBtnAriaLabel, isReadOnly, component, ouiaId } = this.props;
            const Component = component;
            return (React__namespace.createElement(Component, Object.assign({ className: css(styles$4.chip, className) }, (this.state.isTooltipVisible && { tabIndex: 0 }), getOUIAProps(Chip.displayName, ouiaId !== undefined ? ouiaId : this.state.ouiaStateId)),
                React__namespace.createElement("span", { ref: this.span, className: css(styles$4.chipText), id: id }, children),
                !isReadOnly && (React__namespace.createElement(Button, { onClick: onClick, variant: "plain", "aria-label": closeBtnAriaLabel, id: `remove_${id}`, "aria-labelledby": `remove_${id} ${id}`, ouiaId: ouiaId || closeBtnAriaLabel },
                    React__namespace.createElement(TimesIcon$1, { "aria-hidden": "true" })))));
        }
        render() {
            const { isOverflowChip } = this.props;
            return (React__namespace.createElement(GenerateId, null, randomId => (isOverflowChip ? this.renderOverflowChip() : this.renderChip(this.props.id || randomId))));
        }
    }
    Chip.displayName = 'Chip';
    Chip.defaultProps = {
        closeBtnAriaLabel: 'close',
        className: '',
        isOverflowChip: false,
        isReadOnly: false,
        tooltipPosition: 'top',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (_e) => undefined,
        component: 'div'
    };

    class ChipGroup extends React__namespace.Component {
        constructor(props) {
            super(props);
            this.headingRef = React__namespace.createRef();
            this.toggleCollapse = () => {
                this.setState(prevState => ({
                    isOpen: !prevState.isOpen,
                    isTooltipVisible: Boolean(this.headingRef.current && this.headingRef.current.offsetWidth < this.headingRef.current.scrollWidth)
                }));
            };
            this.state = {
                isOpen: this.props.defaultIsOpen,
                isTooltipVisible: false
            };
        }
        componentDidMount() {
            this.setState({
                isTooltipVisible: Boolean(this.headingRef.current && this.headingRef.current.offsetWidth < this.headingRef.current.scrollWidth)
            });
        }
        renderLabel(id) {
            const { categoryName, tooltipPosition } = this.props;
            const { isTooltipVisible } = this.state;
            return isTooltipVisible ? (React__namespace.createElement(Tooltip, { position: tooltipPosition, content: categoryName },
                React__namespace.createElement("span", { tabIndex: 0, ref: this.headingRef, className: css(styles$5.chipGroupLabel) },
                    React__namespace.createElement("span", { id: id }, categoryName)))) : (React__namespace.createElement("span", { ref: this.headingRef, className: css(styles$5.chipGroupLabel), id: id }, categoryName));
        }
        render() {
            const _a = this.props, { categoryName, children, className, isClosable, closeBtnAriaLabel, 'aria-label': ariaLabel, onClick, onOverflowChipClick, numChips, expandedText, collapsedText, ouiaId, 
            /* eslint-disable @typescript-eslint/no-unused-vars */
            defaultIsOpen, tooltipPosition } = _a, 
            /* eslint-enable @typescript-eslint/no-unused-vars */
            rest = __rest$1(_a, ["categoryName", "children", "className", "isClosable", "closeBtnAriaLabel", 'aria-label', "onClick", "onOverflowChipClick", "numChips", "expandedText", "collapsedText", "ouiaId", "defaultIsOpen", "tooltipPosition"]);
            const { isOpen } = this.state;
            const numChildren = React__namespace.Children.count(children);
            const collapsedTextResult = fillTemplate(collapsedText, {
                remaining: React__namespace.Children.count(children) - numChips
            });
            const renderChipGroup = (id) => {
                const chipArray = !isOpen
                    ? React__namespace.Children.toArray(children).slice(0, numChips)
                    : React__namespace.Children.toArray(children);
                return (React__namespace.createElement("div", Object.assign({ className: css(styles$5.chipGroup, className, categoryName && styles$5.modifiers.category), role: "group" }, (categoryName && { 'aria-labelledby': id }), (!categoryName && { 'aria-label': ariaLabel }), getOUIAProps(ChipGroup.displayName, ouiaId)),
                    React__namespace.createElement("div", { className: css(styles$5.chipGroupMain) },
                        categoryName && this.renderLabel(id),
                        React__namespace.createElement("ul", Object.assign({ className: css(styles$5.chipGroupList) }, (categoryName && { 'aria-labelledby': id }), (!categoryName && { 'aria-label': ariaLabel }), { role: "list" }, rest),
                            chipArray.map((child, i) => (React__namespace.createElement("li", { className: css(styles$5.chipGroupListItem), key: i }, child))),
                            numChildren > numChips && (React__namespace.createElement("li", { className: css(styles$5.chipGroupListItem) },
                                React__namespace.createElement(Chip, { isOverflowChip: true, onClick: event => {
                                        this.toggleCollapse();
                                        onOverflowChipClick(event);
                                    }, component: "button" }, isOpen ? expandedText : collapsedTextResult))))),
                    isClosable && (React__namespace.createElement("div", { className: css(styles$5.chipGroupClose) },
                        React__namespace.createElement(Button, { variant: "plain", "aria-label": closeBtnAriaLabel, onClick: onClick, id: `remove_group_${id}`, "aria-labelledby": `remove_group_${id} ${id}`, ouiaId: ouiaId || closeBtnAriaLabel },
                            React__namespace.createElement(TimesCircleIcon$1, { "aria-hidden": "true" }))))));
            };
            return numChildren === 0 ? null : React__namespace.createElement(GenerateId, null, randomId => renderChipGroup(this.props.id || randomId));
        }
    }
    ChipGroup.displayName = 'ChipGroup';
    ChipGroup.defaultProps = {
        expandedText: 'Show Less',
        collapsedText: '${remaining} more',
        categoryName: '',
        defaultIsOpen: false,
        numChips: 3,
        isClosable: false,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (_e) => undefined,
        onOverflowChipClick: (_e) => undefined,
        closeBtnAriaLabel: 'Close chip group',
        tooltipPosition: 'top',
        'aria-label': 'Chip group category'
    };

    // seed for the aria-labelledby ID
    let currentId = 0;
    class Select extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.parentRef = React__namespace.createRef();
            this.menuComponentRef = React__namespace.createRef();
            this.filterRef = React__namespace.createRef();
            this.clearRef = React__namespace.createRef();
            this.inputRef = React__namespace.createRef();
            this.refCollection = [[]];
            this.optionContainerRefCollection = [];
            this.footerRef = React__namespace.createRef();
            this.state = {
                focusFirstOption: false,
                typeaheadInputValue: null,
                typeaheadFilteredChildren: React__namespace.Children.toArray(this.props.children),
                favoritesGroup: [],
                typeaheadCurrIndex: -1,
                typeaheadStoredIndex: -1,
                creatableValue: '',
                tabbedIntoFavoritesMenu: false,
                ouiaStateId: getDefaultOUIAId(Select.displayName, this.props.variant),
                viewMoreNextIndex: -1
            };
            this.getTypeaheadActiveChild = (typeaheadCurrIndex) => this.refCollection[typeaheadCurrIndex] ? this.refCollection[typeaheadCurrIndex][0] : null;
            this.componentDidUpdate = (prevProps, prevState) => {
                if (this.props.hasInlineFilter) {
                    this.refCollection[0][0] = this.filterRef.current;
                }
                // Move focus to top of the menu if state.focusFirstOption was updated to true and the menu does not have custom content
                if (!prevState.focusFirstOption && this.state.focusFirstOption && !this.props.customContent) {
                    const firstRef = this.refCollection.find(ref => ref !== null);
                    if (firstRef && firstRef[0]) {
                        firstRef[0].focus();
                    }
                }
                else if (
                // if viewMoreNextIndex is not -1, view more was clicked, set focus on first newly loaded item
                this.state.viewMoreNextIndex !== -1 &&
                    this.refCollection.length > this.state.viewMoreNextIndex &&
                    this.props.loadingVariant !== 'spinner' &&
                    this.refCollection[this.state.viewMoreNextIndex][0] &&
                    this.props.variant !== 'typeahead' && // do not hard focus newly added items for typeahead variants
                    this.props.variant !== 'typeaheadmulti') {
                    this.refCollection[this.state.viewMoreNextIndex][0].focus();
                }
                const hasUpdatedChildren = prevProps.children.length !== this.props.children.length ||
                    prevProps.children.some((prevChild, index) => {
                        const prevChildProps = prevChild.props;
                        const currChild = this.props.children[index];
                        const { props: currChildProps } = currChild;
                        if (prevChildProps && currChildProps) {
                            return (prevChildProps.value !== currChildProps.value ||
                                prevChildProps.label !== currChildProps.label ||
                                prevChildProps.isDisabled !== currChildProps.isDisabled ||
                                prevChildProps.isPlaceholder !== currChildProps.isPlaceholder);
                        }
                        else {
                            return prevChild !== currChild;
                        }
                    });
                if (hasUpdatedChildren) {
                    this.updateTypeAheadFilteredChildren(prevState.typeaheadInputValue || '', null);
                }
                // for menus with favorites,
                // if the number of favorites or typeahead filtered children has changed, the generated
                // list of favorites needs to be updated
                if (this.props.onFavorite &&
                    (this.props.favorites.length !== prevProps.favorites.length ||
                        this.state.typeaheadFilteredChildren !== prevState.typeaheadFilteredChildren)) {
                    const tempRenderableChildren = this.props.variant === 'typeahead' || this.props.variant === 'typeaheadmulti'
                        ? this.state.typeaheadFilteredChildren
                        : this.props.children;
                    const renderableFavorites = createRenderableFavorites(tempRenderableChildren, this.props.isGrouped, this.props.favorites);
                    const favoritesGroup = renderableFavorites.length
                        ? [
                            React__namespace.createElement(SelectGroup, { key: "favorites", label: this.props.favoritesLabel }, renderableFavorites),
                            React__namespace.createElement(Divider, { key: "favorites-group-divider" })
                        ]
                        : [];
                    this.setState({ favoritesGroup });
                }
            };
            this.onEnter = () => {
                this.setState({ focusFirstOption: true });
            };
            this.onToggle = (isExpanded, e) => {
                const { isInputValuePersisted, onSelect, onToggle, hasInlineFilter } = this.props;
                if (!isExpanded && isInputValuePersisted && onSelect) {
                    onSelect(undefined, this.inputRef.current ? this.inputRef.current.value : '');
                }
                if (isExpanded && hasInlineFilter) {
                    this.setState({
                        focusFirstOption: true
                    });
                }
                onToggle(isExpanded, e);
            };
            this.onClose = () => {
                const { isInputFilterPersisted } = this.props;
                this.setState(Object.assign(Object.assign({ focusFirstOption: false, typeaheadInputValue: null }, (!isInputFilterPersisted && {
                    typeaheadFilteredChildren: React__namespace.Children.toArray(this.props.children)
                })), { typeaheadCurrIndex: -1, tabbedIntoFavoritesMenu: false, viewMoreNextIndex: -1 }));
            };
            this.onChange = (e) => {
                if (e.target.value.toString() !== '' && !this.props.isOpen) {
                    this.onToggle(true, e);
                }
                if (this.props.onTypeaheadInputChanged) {
                    this.props.onTypeaheadInputChanged(e.target.value.toString());
                }
                this.setState({
                    typeaheadCurrIndex: -1,
                    typeaheadInputValue: e.target.value,
                    creatableValue: e.target.value
                });
                this.updateTypeAheadFilteredChildren(e.target.value.toString(), e);
                this.refCollection = [[]];
            };
            this.updateTypeAheadFilteredChildren = (typeaheadInputValue, e) => {
                let typeaheadFilteredChildren;
                const { onFilter, isCreatable, onCreateOption, createText, noResultsFoundText, children, isGrouped, isCreateSelectOptionObject, loadingVariant } = this.props;
                if (onFilter) {
                    /* The updateTypeAheadFilteredChildren callback is not only called on input changes but also when the children change.
                     * In this case the e is null but we can get the typeaheadInputValue from the state.
                     */
                    typeaheadFilteredChildren = onFilter(e, e ? e.target.value : typeaheadInputValue) || children;
                }
                else {
                    let input;
                    try {
                        input = new RegExp(typeaheadInputValue.toString(), 'i');
                    }
                    catch (err) {
                        input = new RegExp(typeaheadInputValue.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                    }
                    const childrenArray = React__namespace.Children.toArray(children);
                    if (isGrouped) {
                        const childFilter = (child) => child.props.value &&
                            child.props.value.toString &&
                            this.getDisplay(child.props.value.toString(), 'text').search(input) === 0;
                        typeaheadFilteredChildren =
                            typeaheadInputValue.toString() !== ''
                                ? React__namespace.Children.map(children, group => {
                                    if (React__namespace.isValidElement(group) && group.type === SelectGroup) {
                                        const filteredGroupChildren = React__namespace.Children.toArray(group.props.children).filter(childFilter);
                                        if (filteredGroupChildren.length > 0) {
                                            return React__namespace.cloneElement(group, {
                                                titleId: group.props.label && group.props.label.replace(/\W/g, '-'),
                                                children: filteredGroupChildren
                                            });
                                        }
                                    }
                                    else {
                                        return React__namespace.Children.toArray(group).filter(childFilter);
                                    }
                                })
                                : childrenArray;
                    }
                    else {
                        typeaheadFilteredChildren =
                            typeaheadInputValue.toString() !== ''
                                ? childrenArray.filter(child => {
                                    const valueToCheck = child.props.value;
                                    // Dividers don't have value and should not be filtered
                                    if (!valueToCheck) {
                                        return true;
                                    }
                                    const isSelectOptionObject = typeof valueToCheck !== 'string' &&
                                        valueToCheck.toString &&
                                        valueToCheck.compareTo;
                                    // View more option should be returned as not a match
                                    if (loadingVariant !== 'spinner' && (loadingVariant === null || loadingVariant === void 0 ? void 0 : loadingVariant.text) === valueToCheck) {
                                        return true;
                                    }
                                    // spinner should be returned as not a match
                                    if (loadingVariant === 'spinner' && valueToCheck === 'loading') {
                                        return true;
                                    }
                                    if (isSelectOptionObject) {
                                        return valueToCheck.compareTo(typeaheadInputValue);
                                    }
                                    else {
                                        return this.getDisplay(child.props.value.toString(), 'text').search(input) === 0;
                                    }
                                })
                                : childrenArray;
                    }
                }
                if (!typeaheadFilteredChildren) {
                    typeaheadFilteredChildren = [];
                }
                if (typeaheadFilteredChildren.length === 0) {
                    !isCreatable &&
                        typeaheadFilteredChildren.push(React__namespace.createElement(SelectOption, { isDisabled: true, key: "no-results", value: noResultsFoundText, isNoResultsOption: true }));
                }
                if (isCreatable && typeaheadInputValue !== '') {
                    const newValue = typeaheadInputValue;
                    if (!typeaheadFilteredChildren.find((i) => i.props.value && i.props.value.toString().toLowerCase() === newValue.toString().toLowerCase())) {
                        const newOptionValue = isCreateSelectOptionObject
                            ? {
                                toString: () => newValue,
                                compareTo: value => this.toString()
                                    .toLowerCase()
                                    .includes(value.toString().toLowerCase())
                            }
                            : newValue;
                        typeaheadFilteredChildren.push(React__namespace.createElement(SelectOption, { key: `create ${newValue}`, value: newOptionValue, onClick: () => onCreateOption && onCreateOption(newValue) },
                            createText,
                            " \"",
                            newValue,
                            "\""));
                    }
                }
                this.setState({
                    typeaheadFilteredChildren
                });
            };
            this.onClick = (e) => {
                if (!this.props.isOpen) {
                    this.onToggle(true, e);
                }
            };
            this.clearSelection = (_e) => {
                this.setState({
                    typeaheadInputValue: null,
                    typeaheadFilteredChildren: React__namespace.Children.toArray(this.props.children),
                    typeaheadCurrIndex: -1
                });
            };
            this.sendRef = (optionRef, favoriteRef, optionContainerRef, index) => {
                this.refCollection[index] = [optionRef, favoriteRef];
                this.optionContainerRefCollection[index] = optionContainerRef;
            };
            this.handleMenuKeys = (index, innerIndex, position) => {
                keyHandler(index, innerIndex, position, this.refCollection, this.refCollection);
                if (this.props.variant === SelectVariant.typeahead || this.props.variant === SelectVariant.typeaheadMulti) {
                    if (position !== 'tab') {
                        this.handleTypeaheadKeys(position);
                    }
                }
            };
            this.moveFocus = (nextIndex, updateCurrentIndex = true) => {
                const { isCreatable, createText } = this.props;
                const hasDescriptionElm = Boolean(this.refCollection[nextIndex][0] && this.refCollection[nextIndex][0].classList.contains('pf-m-description'));
                const isLoad = Boolean(this.refCollection[nextIndex][0] && this.refCollection[nextIndex][0].classList.contains('pf-m-load'));
                const optionTextElm = hasDescriptionElm
                    ? this.refCollection[nextIndex][0].firstElementChild
                    : this.refCollection[nextIndex][0];
                let typeaheadInputValue = '';
                if (isCreatable && optionTextElm.innerText.includes(createText)) {
                    typeaheadInputValue = this.state.creatableValue;
                }
                else if (optionTextElm && !isLoad) {
                    // !isLoad prevents the view more button text from appearing the typeahead input
                    typeaheadInputValue = optionTextElm.innerText;
                }
                this.setState(prevState => ({
                    typeaheadCurrIndex: updateCurrentIndex ? nextIndex : prevState.typeaheadCurrIndex,
                    typeaheadStoredIndex: nextIndex,
                    typeaheadInputValue
                }));
            };
            this.switchFocusToFavoriteMenu = () => {
                const { typeaheadCurrIndex, typeaheadStoredIndex } = this.state;
                let indexForFocus = 0;
                if (typeaheadCurrIndex !== -1) {
                    indexForFocus = typeaheadCurrIndex;
                }
                else if (typeaheadStoredIndex !== -1) {
                    indexForFocus = typeaheadStoredIndex;
                }
                if (this.refCollection[indexForFocus] !== null && this.refCollection[indexForFocus][0] !== null) {
                    this.refCollection[indexForFocus][0].focus();
                }
                else {
                    this.clearRef.current.focus();
                }
                this.setState({
                    tabbedIntoFavoritesMenu: true,
                    typeaheadCurrIndex: -1
                });
            };
            this.moveFocusToLastMenuItem = () => {
                const refCollectionLen = this.refCollection.length;
                if (refCollectionLen > 0 &&
                    this.refCollection[refCollectionLen - 1] !== null &&
                    this.refCollection[refCollectionLen - 1][0] !== null) {
                    this.refCollection[refCollectionLen - 1][0].focus();
                }
            };
            this.handleTypeaheadKeys = (position, shiftKey = false) => {
                const { isOpen, onFavorite } = this.props;
                const { typeaheadCurrIndex, tabbedIntoFavoritesMenu } = this.state;
                const typeaheadActiveChild = this.getTypeaheadActiveChild(typeaheadCurrIndex);
                if (isOpen) {
                    if (position === 'enter') {
                        if (typeaheadCurrIndex !== -1 && // do not allow selection without moving to an initial option
                            (typeaheadActiveChild || (this.refCollection[0] && this.refCollection[0][0]))) {
                            if (typeaheadActiveChild) {
                                if (!typeaheadActiveChild.classList.contains('pf-m-load')) {
                                    const hasDescriptionElm = typeaheadActiveChild.childElementCount > 1;
                                    const typeaheadActiveChildText = hasDescriptionElm
                                        ? typeaheadActiveChild.firstChild.innerText
                                        : typeaheadActiveChild.innerText;
                                    this.setState({
                                        typeaheadInputValue: typeaheadActiveChildText
                                    });
                                }
                            }
                            else if (this.refCollection[0] && this.refCollection[0][0]) {
                                this.setState({
                                    typeaheadInputValue: this.refCollection[0][0].innerText
                                });
                            }
                            if (typeaheadActiveChild) {
                                typeaheadActiveChild.click();
                            }
                            else {
                                this.refCollection[0][0].click();
                            }
                        }
                    }
                    else if (position === 'tab') {
                        if (onFavorite) {
                            // if the input has focus, tab to the first item or the last item that was previously focused.
                            if (this.inputRef.current === document.activeElement) {
                                // If shift is also clicked and there is a footer, tab to the last item in tabbable footer
                                if (this.props.footer && shiftKey) {
                                    const tabbableItems = findTabbableElements(this.footerRef, SelectFooterTabbableItems);
                                    if (tabbableItems.length > 0) {
                                        if (tabbableItems[tabbableItems.length - 1]) {
                                            tabbableItems[tabbableItems.length - 1].focus();
                                        }
                                    }
                                }
                                else {
                                    this.switchFocusToFavoriteMenu();
                                }
                            }
                            else {
                                // focus is on menu or footer
                                if (this.props.footer) {
                                    let tabbedIntoMenu = false;
                                    const tabbableItems = findTabbableElements(this.footerRef, SelectFooterTabbableItems);
                                    if (tabbableItems.length > 0) {
                                        // if current element is not in footer, tab to first tabbable element in footer,
                                        // if shift was clicked, tab to input since focus is on menu
                                        const currentElementIndex = tabbableItems.findIndex((item) => item === document.activeElement);
                                        if (currentElementIndex === -1) {
                                            if (shiftKey) {
                                                // currently in menu, shift back to input
                                                this.inputRef.current.focus();
                                            }
                                            else {
                                                // currently in menu, tab to first tabbable item in footer
                                                tabbableItems[0].focus();
                                            }
                                        }
                                        else {
                                            // already in footer
                                            if (shiftKey) {
                                                // shift to previous item
                                                if (currentElementIndex === 0) {
                                                    // on first footer item, shift back to menu
                                                    this.switchFocusToFavoriteMenu();
                                                    tabbedIntoMenu = true;
                                                }
                                                else {
                                                    // shift to previous footer item
                                                    tabbableItems[currentElementIndex - 1].focus();
                                                }
                                            }
                                            else {
                                                // tab to next tabbable item in footer or to input.
                                                if (tabbableItems[currentElementIndex + 1]) {
                                                    tabbableItems[currentElementIndex + 1].focus();
                                                }
                                                else {
                                                    this.inputRef.current.focus();
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        // no tabbable items in footer, tab to input
                                        this.inputRef.current.focus();
                                        tabbedIntoMenu = false;
                                    }
                                    this.setState({ tabbedIntoFavoritesMenu: tabbedIntoMenu });
                                }
                                else {
                                    this.inputRef.current.focus();
                                    this.setState({ tabbedIntoFavoritesMenu: false });
                                }
                            }
                        }
                        else {
                            // Close if there is no footer
                            if (!this.props.footer) {
                                this.onToggle(false, null);
                                this.onClose();
                            }
                            else {
                                // has footer
                                const tabbableItems = findTabbableElements(this.footerRef, SelectFooterTabbableItems);
                                const currentElementIndex = tabbableItems.findIndex((item) => item === document.activeElement);
                                if (this.inputRef.current === document.activeElement) {
                                    if (shiftKey) {
                                        // close toggle if shift key and tab on input
                                        this.onToggle(false, null);
                                        this.onClose();
                                    }
                                    else {
                                        // tab to first tabbable item in footer
                                        if (tabbableItems[0]) {
                                            tabbableItems[0].focus();
                                        }
                                        else {
                                            this.onToggle(false, null);
                                            this.onClose();
                                        }
                                    }
                                }
                                else {
                                    // focus is in footer
                                    if (shiftKey) {
                                        if (currentElementIndex === 0) {
                                            // shift tab back to input
                                            this.inputRef.current.focus();
                                        }
                                        else {
                                            // shift to previous footer item
                                            tabbableItems[currentElementIndex - 1].focus();
                                        }
                                    }
                                    else {
                                        // tab to next footer item or close tab if last item
                                        if (tabbableItems[currentElementIndex + 1]) {
                                            tabbableItems[currentElementIndex + 1].focus();
                                        }
                                        else {
                                            // no next item, close toggle
                                            this.onToggle(false, null);
                                            this.inputRef.current.focus();
                                            this.onClose();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (!tabbedIntoFavoritesMenu) {
                        if (this.refCollection[0][0] === null) {
                            return;
                        }
                        let nextIndex;
                        if (typeaheadCurrIndex === -1 && position === 'down') {
                            nextIndex = 0;
                        }
                        else if (typeaheadCurrIndex === -1 && position === 'up') {
                            nextIndex = this.refCollection.length - 1;
                        }
                        else if (position !== 'left' && position !== 'right') {
                            nextIndex = getNextIndex(typeaheadCurrIndex, position, this.refCollection);
                        }
                        else {
                            nextIndex = typeaheadCurrIndex;
                        }
                        if (this.refCollection[nextIndex] === null) {
                            return;
                        }
                        this.moveFocus(nextIndex);
                    }
                    else {
                        const nextIndex = this.refCollection.findIndex(ref => ref !== undefined && (ref[0] === document.activeElement || ref[1] === document.activeElement));
                        this.moveFocus(nextIndex);
                    }
                }
            };
            this.onClickTypeaheadToggleButton = () => {
                if (this.inputRef && this.inputRef.current) {
                    this.inputRef.current.focus();
                }
            };
            this.getDisplay = (value, type = 'node') => {
                if (!value) {
                    return;
                }
                const item = this.props.isGrouped
                    ? React__namespace.Children.toArray(this.props.children)
                        .reduce((acc, curr) => [...acc, ...React__namespace.Children.toArray(curr.props.children)], [])
                        .find(child => child.props.value.toString() === value.toString())
                    : React__namespace.Children.toArray(this.props.children).find(child => child.props.value &&
                        child.props.value.toString() === value.toString());
                if (item) {
                    if (item && item.props.children) {
                        if (type === 'node') {
                            return item.props.children;
                        }
                        return this.findText(item);
                    }
                    return item.props.value.toString();
                }
                return value.toString();
            };
            this.findText = (item) => {
                if (typeof item === 'string') {
                    return item;
                }
                else if (!React__namespace.isValidElement(item)) {
                    return '';
                }
                else {
                    const multi = [];
                    React__namespace.Children.toArray(item.props.children).forEach(child => multi.push(this.findText(child)));
                    return multi.join('');
                }
            };
            this.generateSelectedBadge = () => {
                const { customBadgeText, selections } = this.props;
                if (customBadgeText !== null) {
                    return customBadgeText;
                }
                if (Array.isArray(selections) && selections.length > 0) {
                    return selections.length;
                }
                return null;
            };
            this.setVieMoreNextIndex = () => {
                this.setState({ viewMoreNextIndex: this.refCollection.length - 1 });
            };
            this.isLastOptionBeforeFooter = (index) => this.props.footer && index === this.refCollection.length - 1 ? true : false;
        }
        extendTypeaheadChildren(typeaheadCurrIndex, favoritesGroup) {
            const { isGrouped, onFavorite } = this.props;
            const typeaheadChildren = favoritesGroup
                ? favoritesGroup.concat(this.state.typeaheadFilteredChildren)
                : this.state.typeaheadFilteredChildren;
            const activeElement = this.optionContainerRefCollection[typeaheadCurrIndex];
            let typeaheadActiveChild = this.getTypeaheadActiveChild(typeaheadCurrIndex);
            if (typeaheadActiveChild && typeaheadActiveChild.classList.contains('pf-m-description')) {
                typeaheadActiveChild = typeaheadActiveChild.firstElementChild;
            }
            this.refCollection = [[]];
            this.optionContainerRefCollection = [];
            if (isGrouped) {
                return React__namespace.Children.map(typeaheadChildren, (group) => {
                    if (group.type === Divider) {
                        return group;
                    }
                    else if (group.type === SelectGroup && onFavorite) {
                        return React__namespace.cloneElement(group, {
                            titleId: group.props.label && group.props.label.replace(/\W/g, '-'),
                            children: React__namespace.Children.map(group.props.children, (child) => child.type === Divider
                                ? child
                                : React__namespace.cloneElement(child, {
                                    isFocused: activeElement &&
                                        (activeElement.id === child.props.id ||
                                            (this.props.isCreatable &&
                                                typeaheadActiveChild.innerText ===
                                                    `{createText} "${group.props.value}"`))
                                }))
                        });
                    }
                    else if (group.type === SelectGroup) {
                        return React__namespace.cloneElement(group, {
                            titleId: group.props.label && group.props.label.replace(/\W/g, '-'),
                            children: React__namespace.Children.map(group.props.children, (child) => child.type === Divider
                                ? child
                                : React__namespace.cloneElement(child, {
                                    isFocused: typeaheadActiveChild &&
                                        (typeaheadActiveChild.innerText === child.props.value.toString() ||
                                            (this.props.isCreatable &&
                                                typeaheadActiveChild.innerText ===
                                                    `{createText} "${child.props.value}"`))
                                }))
                        });
                    }
                    else {
                        // group has been filtered down to SelectOption
                        return React__namespace.cloneElement(group, {
                            isFocused: typeaheadActiveChild &&
                                (typeaheadActiveChild.innerText === group.props.value.toString() ||
                                    (this.props.isCreatable && typeaheadActiveChild.innerText === `{createText} "${group.props.value}"`))
                        });
                    }
                });
            }
            return typeaheadChildren.map((child, index) => {
                const childElement = child;
                return childElement.type.displayName === 'Divider'
                    ? child
                    : React__namespace.cloneElement(child, {
                        isFocused: typeaheadActiveChild
                            ? typeaheadActiveChild.innerText === child.props.value.toString() ||
                                (this.props.isCreatable &&
                                    typeaheadActiveChild.innerText === `{createText} "${child.props.value}"`)
                            : index === typeaheadCurrIndex // fallback for view more + typeahead use cases, when the new expanded list is loaded and refCollection hasn't be updated yet
                    });
            });
        }
        render() {
            const _a = this.props, { children, chipGroupProps, chipGroupComponent, className, customContent, variant, direction, onSelect, onClear, onBlur, toggleId, isOpen, isGrouped, isPlain, isDisabled, hasPlaceholderStyle, validated, selections: selectionsProp, typeAheadAriaLabel, clearSelectionsAriaLabel, toggleAriaLabel, removeSelectionAriaLabel, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedby, 'aria-invalid': ariaInvalid, placeholderText, width, maxHeight, toggleIcon, ouiaId, ouiaSafe, hasInlineFilter, isCheckboxSelectionBadgeHidden, inlineFilterPlaceholderText, 
            /* eslint-disable @typescript-eslint/no-unused-vars */
            onFilter, 
            /* eslint-disable @typescript-eslint/no-unused-vars */
            onTypeaheadInputChanged, onCreateOption, isCreatable, onToggle, createText, noResultsFoundText, customBadgeText, inputIdPrefix, inputAutoComplete, 
            /* eslint-disable @typescript-eslint/no-unused-vars */
            isInputValuePersisted, isInputFilterPersisted, 
            /* eslint-enable @typescript-eslint/no-unused-vars */
            menuAppendTo, favorites, onFavorite, 
            /* eslint-disable @typescript-eslint/no-unused-vars */
            favoritesLabel, footer, loadingVariant, isCreateSelectOptionObject, shouldResetOnSelect } = _a, props = __rest$1(_a, ["children", "chipGroupProps", "chipGroupComponent", "className", "customContent", "variant", "direction", "onSelect", "onClear", "onBlur", "toggleId", "isOpen", "isGrouped", "isPlain", "isDisabled", "hasPlaceholderStyle", "validated", "selections", "typeAheadAriaLabel", "clearSelectionsAriaLabel", "toggleAriaLabel", "removeSelectionAriaLabel", 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid', "placeholderText", "width", "maxHeight", "toggleIcon", "ouiaId", "ouiaSafe", "hasInlineFilter", "isCheckboxSelectionBadgeHidden", "inlineFilterPlaceholderText", "onFilter", "onTypeaheadInputChanged", "onCreateOption", "isCreatable", "onToggle", "createText", "noResultsFoundText", "customBadgeText", "inputIdPrefix", "inputAutoComplete", "isInputValuePersisted", "isInputFilterPersisted", "menuAppendTo", "favorites", "onFavorite", "favoritesLabel", "footer", "loadingVariant", "isCreateSelectOptionObject", "shouldResetOnSelect"]);
            const { focusFirstOption: openedOnEnter, typeaheadCurrIndex, typeaheadInputValue, typeaheadFilteredChildren, favoritesGroup } = this.state;
            const selectToggleId = toggleId || `pf-select-toggle-id-${currentId++}`;
            const selections = Array.isArray(selectionsProp) ? selectionsProp : [selectionsProp];
            // Find out if the selected option is a placeholder
            const selectedOption = React__namespace.Children.toArray(children).find((option) => option.props.value === selections[0]);
            const isSelectedPlaceholder = selectedOption && selectedOption.props.isPlaceholder;
            const hasAnySelections = Boolean(selections[0] && selections[0] !== '');
            const typeaheadActiveChild = this.getTypeaheadActiveChild(typeaheadCurrIndex);
            let childPlaceholderText = null;
            // If onFavorites is set,  add isFavorite prop to children and add a Favorites group to the SelectMenu
            let renderableItems = [];
            if (onFavorite) {
                // if variant is type-ahead call the extendTypeaheadChildren before adding favorites
                let tempExtendedChildren = children;
                if (variant === 'typeahead' || variant === 'typeaheadmulti') {
                    tempExtendedChildren = this.extendTypeaheadChildren(typeaheadCurrIndex, favoritesGroup);
                }
                else if (onFavorite) {
                    tempExtendedChildren = favoritesGroup.concat(children);
                }
                // mark items that are favorited with isFavorite
                renderableItems = extendItemsWithFavorite(tempExtendedChildren, isGrouped, favorites);
            }
            else {
                renderableItems = children;
            }
            if (!customContent) {
                if (!hasAnySelections && !placeholderText) {
                    const childPlaceholder = React__namespace.Children.toArray(children).filter((child) => child.props.isPlaceholder === true);
                    childPlaceholderText =
                        (childPlaceholder[0] && this.getDisplay(childPlaceholder[0].props.value, 'node')) ||
                            (children[0] && this.getDisplay(children[0].props.value, 'node'));
                }
            }
            if (isOpen) {
                if (renderableItems.find(item => { var _a; return ((_a = item) === null || _a === void 0 ? void 0 : _a.key) === 'loading'; }) === undefined) {
                    if (loadingVariant === 'spinner') {
                        renderableItems.push(React__namespace.createElement(SelectOption, { isLoading: true, key: "loading", value: "loading" },
                            React__namespace.createElement(Spinner, { size: "lg" })));
                    }
                    else if (loadingVariant === null || loadingVariant === void 0 ? void 0 : loadingVariant.text) {
                        renderableItems.push(React__namespace.createElement(SelectOption, { isLoad: true, key: "loading", value: loadingVariant.text, setViewMoreNextIndex: this.setVieMoreNextIndex, onClick: loadingVariant === null || loadingVariant === void 0 ? void 0 : loadingVariant.onClick }));
                    }
                }
            }
            const hasOnClear = onClear !== Select.defaultProps.onClear;
            const clearBtn = (React__namespace.createElement("button", { className: css(buttonStyles.button, buttonStyles.modifiers.plain, styles$6.selectToggleClear), onClick: e => {
                    this.clearSelection(e);
                    onClear(e);
                    e.stopPropagation();
                }, "aria-label": clearSelectionsAriaLabel, type: "button", disabled: isDisabled, ref: this.clearRef, onKeyDown: event => {
                    if (event.key === KeyTypes.Enter) {
                        this.clearRef.current.click();
                    }
                } },
                React__namespace.createElement(TimesCircleIcon$1, { "aria-hidden": true })));
            let selectedChips = null;
            if (variant === SelectVariant.typeaheadMulti) {
                selectedChips = chipGroupComponent ? (chipGroupComponent) : (React__namespace.createElement(ChipGroup, Object.assign({}, chipGroupProps), selections &&
                    selections.map(item => (React__namespace.createElement(Chip, { key: item, onClick: (e) => onSelect(e, item), closeBtnAriaLabel: removeSelectionAriaLabel }, this.getDisplay(item, 'node'))))));
            }
            if (hasInlineFilter) {
                const filterBox = (React__namespace.createElement(React__namespace.Fragment, null,
                    React__namespace.createElement("div", { key: "inline-filter", className: css(styles$6.selectMenuSearch) },
                        React__namespace.createElement("input", { key: "inline-filter-input", type: "search", className: css(formStyles$1.formControl, formStyles$1.modifiers.search), onChange: this.onChange, placeholder: inlineFilterPlaceholderText, onKeyDown: event => {
                                if (event.key === KeyTypes.ArrowUp) {
                                    this.handleMenuKeys(0, 0, 'up');
                                    event.preventDefault();
                                }
                                else if (event.key === KeyTypes.ArrowDown) {
                                    this.handleMenuKeys(0, 0, 'down');
                                    event.preventDefault();
                                }
                                else if (event.key === KeyTypes.ArrowLeft) {
                                    this.handleMenuKeys(0, 0, 'left');
                                    event.preventDefault();
                                }
                                else if (event.key === KeyTypes.ArrowRight) {
                                    this.handleMenuKeys(0, 0, 'right');
                                    event.preventDefault();
                                }
                                else if (event.key === KeyTypes.Tab && variant !== SelectVariant.checkbox && this.props.footer) {
                                    // tab to footer or close menu if shift key
                                    if (event.shiftKey) {
                                        this.onToggle(false, event);
                                    }
                                    else {
                                        const tabbableItems = findTabbableElements(this.footerRef, SelectFooterTabbableItems);
                                        if (tabbableItems.length > 0) {
                                            tabbableItems[0].focus();
                                            event.stopPropagation();
                                            event.preventDefault();
                                        }
                                        else {
                                            this.onToggle(false, event);
                                        }
                                    }
                                }
                                else if (event.key === KeyTypes.Tab && variant === SelectVariant.checkbox) {
                                    // More modal-like experience for checkboxes
                                    // Let SelectOption handle this
                                    if (event.shiftKey) {
                                        this.handleMenuKeys(0, 0, 'up');
                                    }
                                    else {
                                        this.handleMenuKeys(0, 0, 'down');
                                    }
                                    event.stopPropagation();
                                    event.preventDefault();
                                }
                            }, ref: this.filterRef, autoComplete: inputAutoComplete })),
                    React__namespace.createElement(Divider, { key: "inline-filter-divider" })));
                renderableItems = [filterBox, ...typeaheadFilteredChildren].map((option, index) => React__namespace.cloneElement(option, { key: index }));
            }
            let variantProps;
            let variantChildren;
            if (customContent) {
                variantProps = {
                    selected: selections,
                    openedOnEnter,
                    isCustomContent: true
                };
                variantChildren = customContent;
            }
            else {
                switch (variant) {
                    case 'single':
                        variantProps = {
                            selected: selections[0],
                            hasInlineFilter,
                            openedOnEnter
                        };
                        variantChildren = renderableItems;
                        break;
                    case 'checkbox':
                        variantProps = {
                            checked: selections,
                            isGrouped,
                            hasInlineFilter,
                            openedOnEnter
                        };
                        variantChildren = renderableItems;
                        break;
                    case 'typeahead':
                        variantProps = {
                            selected: selections[0],
                            openedOnEnter
                        };
                        variantChildren = onFavorite ? renderableItems : this.extendTypeaheadChildren(typeaheadCurrIndex);
                        if (variantChildren.length === 0) {
                            variantChildren.push(React__namespace.createElement(SelectOption, { isDisabled: true, key: 0, value: noResultsFoundText, isNoResultsOption: true }));
                        }
                        break;
                    case 'typeaheadmulti':
                        variantProps = {
                            selected: selections,
                            openedOnEnter
                        };
                        variantChildren = onFavorite ? renderableItems : this.extendTypeaheadChildren(typeaheadCurrIndex);
                        if (variantChildren.length === 0) {
                            variantChildren.push(React__namespace.createElement(SelectOption, { isDisabled: true, key: 0, value: noResultsFoundText, isNoResultsOption: true }));
                        }
                        break;
                }
            }
            const innerMenu = (React__namespace.createElement(SelectMenu, Object.assign({}, props, { isGrouped: isGrouped, selected: selections }, variantProps, { openedOnEnter: openedOnEnter, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, sendRef: this.sendRef, keyHandler: this.handleMenuKeys, maxHeight: maxHeight, ref: this.menuComponentRef, footer: footer, footerRef: this.footerRef, isLastOptionBeforeFooter: this.isLastOptionBeforeFooter }), variantChildren));
            const menuContainer = footer ? React__namespace.createElement("div", { className: css(styles$6.selectMenu) },
                " ",
                innerMenu,
                " ") : innerMenu;
            const popperContainer = (React__namespace.createElement("div", Object.assign({ className: css(styles$6.select, isOpen && styles$6.modifiers.expanded, validated === ValidatedOptions.success && styles$6.modifiers.success, validated === ValidatedOptions.warning && styles$6.modifiers.warning, validated === ValidatedOptions.error && styles$6.modifiers.invalid, direction === SelectDirection.up && styles$6.modifiers.top, className) }, (width && { style: { width } }), (validated !== ValidatedOptions.default && { 'aria-describedby': ariaDescribedby }), (validated !== ValidatedOptions.default && { 'aria-invalid': ariaInvalid })), isOpen && menuContainer));
            const mainContainer = (React__namespace.createElement("div", Object.assign({ className: css(styles$6.select, isOpen && styles$6.modifiers.expanded, validated === ValidatedOptions.success && styles$6.modifiers.success, validated === ValidatedOptions.warning && styles$6.modifiers.warning, validated === ValidatedOptions.error && styles$6.modifiers.invalid, direction === SelectDirection.up && styles$6.modifiers.top, className), ref: this.parentRef }, getOUIAProps(Select.displayName, ouiaId !== undefined ? ouiaId : this.state.ouiaStateId, ouiaSafe), (width && { style: { width } }), (validated !== ValidatedOptions.default && { 'aria-describedby': ariaDescribedby }), (validated !== ValidatedOptions.default && { 'aria-invalid': ariaInvalid })),
                React__namespace.createElement(SelectToggle, Object.assign({ id: selectToggleId, parentRef: this.parentRef, menuRef: this.menuComponentRef }, (footer && { footerRef: this.footerRef }), { isOpen: isOpen, isPlain: isPlain, hasPlaceholderStyle: hasPlaceholderStyle && (!selections.length || selections[0] === null || isSelectedPlaceholder), onToggle: this.onToggle, onEnter: this.onEnter, onClose: this.onClose, onBlur: onBlur, variant: variant, "aria-labelledby": `${ariaLabelledBy || ''} ${selectToggleId}`, "aria-label": toggleAriaLabel, handleTypeaheadKeys: this.handleTypeaheadKeys, moveFocusToLastMenuItem: this.moveFocusToLastMenuItem, isDisabled: isDisabled, hasClearButton: hasOnClear, hasFooter: footer !== undefined, onClickTypeaheadToggleButton: this.onClickTypeaheadToggleButton }),
                    customContent && (React__namespace.createElement("div", { className: css(styles$6.selectToggleWrapper) },
                        toggleIcon && React__namespace.createElement("span", { className: css(styles$6.selectToggleIcon) }, toggleIcon),
                        React__namespace.createElement("span", { className: css(styles$6.selectToggleText) }, placeholderText))),
                    variant === SelectVariant.single && !customContent && (React__namespace.createElement(React__namespace.Fragment, null,
                        React__namespace.createElement("div", { className: css(styles$6.selectToggleWrapper) },
                            toggleIcon && React__namespace.createElement("span", { className: css(styles$6.selectToggleIcon) }, toggleIcon),
                            React__namespace.createElement("span", { className: css(styles$6.selectToggleText) }, this.getDisplay(selections[0], 'node') || placeholderText || childPlaceholderText)),
                        hasOnClear && hasAnySelections && clearBtn)),
                    variant === SelectVariant.checkbox && !customContent && (React__namespace.createElement(React__namespace.Fragment, null,
                        React__namespace.createElement("div", { className: css(styles$6.selectToggleWrapper) },
                            toggleIcon && React__namespace.createElement("span", { className: css(styles$6.selectToggleIcon) }, toggleIcon),
                            React__namespace.createElement("span", { className: css(styles$6.selectToggleText) }, placeholderText),
                            !isCheckboxSelectionBadgeHidden && hasAnySelections && (React__namespace.createElement("div", { className: css(styles$6.selectToggleBadge) },
                                React__namespace.createElement("span", { className: css(badgeStyles.badge, badgeStyles.modifiers.read) }, this.generateSelectedBadge())))),
                        hasOnClear && hasAnySelections && clearBtn)),
                    variant === SelectVariant.typeahead && !customContent && (React__namespace.createElement(React__namespace.Fragment, null,
                        React__namespace.createElement("div", { className: css(styles$6.selectToggleWrapper) },
                            toggleIcon && React__namespace.createElement("span", { className: css(styles$6.selectToggleIcon) }, toggleIcon),
                            React__namespace.createElement("input", { className: css(formStyles$1.formControl, styles$6.selectToggleTypeahead), "aria-activedescendant": typeaheadActiveChild && typeaheadActiveChild.id, id: `${selectToggleId}-select-typeahead`, "aria-label": typeAheadAriaLabel, placeholder: placeholderText, value: typeaheadInputValue !== null
                                    ? typeaheadInputValue
                                    : this.getDisplay(selections[0], 'text') || '', type: "text", onClick: this.onClick, onChange: this.onChange, autoComplete: inputAutoComplete, disabled: isDisabled, ref: this.inputRef })),
                        hasOnClear && (selections[0] || typeaheadInputValue) && clearBtn)),
                    variant === SelectVariant.typeaheadMulti && !customContent && (React__namespace.createElement(React__namespace.Fragment, null,
                        React__namespace.createElement("div", { className: css(styles$6.selectToggleWrapper) },
                            toggleIcon && React__namespace.createElement("span", { className: css(styles$6.selectToggleIcon) }, toggleIcon),
                            selections && Array.isArray(selections) && selections.length > 0 && selectedChips,
                            React__namespace.createElement("input", { className: css(formStyles$1.formControl, styles$6.selectToggleTypeahead), "aria-activedescendant": typeaheadActiveChild && typeaheadActiveChild.id, id: `${selectToggleId}-select-multi-typeahead-typeahead`, "aria-label": typeAheadAriaLabel, "aria-invalid": validated === ValidatedOptions.error, placeholder: placeholderText, value: typeaheadInputValue !== null ? typeaheadInputValue : '', type: "text", onChange: this.onChange, onClick: this.onClick, autoComplete: inputAutoComplete, disabled: isDisabled, ref: this.inputRef })),
                        hasOnClear && ((selections && selections.length > 0) || typeaheadInputValue) && clearBtn)),
                    validated === ValidatedOptions.success && (React__namespace.createElement("span", { className: css(styles$6.selectToggleStatusIcon) },
                        React__namespace.createElement(CheckCircleIcon$1, { "aria-hidden": "true" }))),
                    validated === ValidatedOptions.error && (React__namespace.createElement("span", { className: css(styles$6.selectToggleStatusIcon) },
                        React__namespace.createElement(ExclamationCircleIcon$1, { "aria-hidden": "true" }))),
                    validated === ValidatedOptions.warning && (React__namespace.createElement("span", { className: css(styles$6.selectToggleStatusIcon) },
                        React__namespace.createElement(ExclamationTriangleIcon$1, { "aria-hidden": "true" })))),
                isOpen && menuAppendTo === 'inline' && menuContainer));
            const getParentElement = () => {
                if (this.parentRef && this.parentRef.current) {
                    return this.parentRef.current.parentElement;
                }
                return null;
            };
            return (React__namespace.createElement(GenerateId, null, randomId => (React__namespace.createElement(SelectContext.Provider, { value: {
                    onSelect,
                    onFavorite,
                    onClose: this.onClose,
                    variant,
                    inputIdPrefix: inputIdPrefix || randomId,
                    shouldResetOnSelect
                } }, menuAppendTo === 'inline' ? (mainContainer) : (React__namespace.createElement(Popper, { trigger: mainContainer, popper: popperContainer, direction: direction, appendTo: menuAppendTo === 'parent' ? getParentElement() : menuAppendTo, isVisible: isOpen }))))));
        }
    }
    Select.displayName = 'Select';
    Select.defaultProps = {
        children: [],
        className: '',
        position: SelectPosition.left,
        direction: SelectDirection.down,
        toggleId: null,
        isOpen: false,
        isGrouped: false,
        isPlain: false,
        isDisabled: false,
        hasPlaceholderStyle: false,
        isCreatable: false,
        validated: 'default',
        'aria-label': '',
        'aria-labelledby': '',
        'aria-describedby': '',
        'aria-invalid': false,
        typeAheadAriaLabel: '',
        clearSelectionsAriaLabel: 'Clear all',
        toggleAriaLabel: 'Options menu',
        removeSelectionAriaLabel: 'Remove',
        selections: [],
        createText: 'Create',
        placeholderText: '',
        noResultsFoundText: 'No results found',
        variant: SelectVariant.single,
        width: '',
        onClear: () => undefined,
        onCreateOption: () => undefined,
        toggleIcon: null,
        onFilter: null,
        onTypeaheadInputChanged: null,
        customContent: null,
        hasInlineFilter: false,
        inlineFilterPlaceholderText: null,
        customBadgeText: null,
        inputIdPrefix: '',
        inputAutoComplete: 'off',
        menuAppendTo: 'inline',
        favorites: [],
        favoritesLabel: 'Favorites',
        ouiaSafe: true,
        chipGroupComponent: null,
        isInputValuePersisted: false,
        isInputFilterPersisted: false,
        isCreateSelectOptionObject: false,
        shouldResetOnSelect: true
    };

    // tslint:disable-next-line:no-empty
    const defaultOnChange = () => { };
    class Checkbox extends React__namespace.Component {
        constructor(props) {
            super(props);
            this.handleChange = (event) => {
                this.props.onChange(event.currentTarget.checked, event);
            };
            this.state = {
                ouiaStateId: getDefaultOUIAId(Checkbox.displayName)
            };
        }
        render() {
            const _a = this.props, { 'aria-label': ariaLabel, className, onChange, isValid, isDisabled, isChecked, label, checked, defaultChecked, description, body, ouiaId, ouiaSafe } = _a, props = __rest$1(_a, ['aria-label', "className", "onChange", "isValid", "isDisabled", "isChecked", "label", "checked", "defaultChecked", "description", "body", "ouiaId", "ouiaSafe"]);
            if (!props.id) {
                // eslint-disable-next-line no-console
                console.error('Checkbox:', 'id is required to make input accessible');
            }
            const checkedProps = {};
            if ([true, false].includes(checked) || isChecked === true) {
                checkedProps.checked = checked || isChecked;
            }
            if (onChange !== defaultOnChange) {
                checkedProps.checked = isChecked;
            }
            if ([false, true].includes(defaultChecked)) {
                checkedProps.defaultChecked = defaultChecked;
            }
            checkedProps.checked = checkedProps.checked === null ? false : checkedProps.checked;
            return (React__namespace.createElement("div", { className: css(checkStyles.check, !label && checkStyles.modifiers.standalone, className) },
                React__namespace.createElement("input", Object.assign({}, props, { className: css(checkStyles.checkInput), type: "checkbox", onChange: this.handleChange, "aria-invalid": !isValid, "aria-label": ariaLabel, disabled: isDisabled, ref: elem => elem && (elem.indeterminate = isChecked === null) }, checkedProps, getOUIAProps(Checkbox.displayName, ouiaId !== undefined ? ouiaId : this.state.ouiaStateId, ouiaSafe))),
                label && (React__namespace.createElement("label", { className: css(checkStyles.checkLabel, isDisabled && checkStyles.modifiers.disabled), htmlFor: props.id }, label)),
                description && React__namespace.createElement("span", { className: css(checkStyles.checkDescription) }, description),
                body && React__namespace.createElement("span", { className: css(checkStyles.checkBody) }, body)));
        }
    }
    Checkbox.displayName = 'Checkbox';
    Checkbox.defaultProps = {
        className: '',
        isValid: true,
        isDisabled: false,
        isChecked: false,
        onChange: defaultOnChange,
        ouiaSafe: true
    };

    Promise.resolve().then(function () { return popover; });
    var styles$3 = {
      "button": "pf-c-button",
      "modifiers": {
        "noPadding": "pf-m-no-padding",
        "widthAuto": "pf-m-width-auto",
        "top": "pf-m-top",
        "topLeft": "pf-m-top-left",
        "topRight": "pf-m-top-right",
        "bottom": "pf-m-bottom",
        "bottomLeft": "pf-m-bottom-left",
        "bottomRight": "pf-m-bottom-right",
        "left": "pf-m-left",
        "leftTop": "pf-m-left-top",
        "leftBottom": "pf-m-left-bottom",
        "right": "pf-m-right",
        "rightTop": "pf-m-right-top",
        "rightBottom": "pf-m-right-bottom",
        "danger": "pf-m-danger",
        "warning": "pf-m-warning",
        "success": "pf-m-success",
        "default": "pf-m-default",
        "info": "pf-m-info",
        "icon": "pf-m-icon"
      },
      "popover": "pf-c-popover",
      "popoverArrow": "pf-c-popover__arrow",
      "popoverBody": "pf-c-popover__body",
      "popoverContent": "pf-c-popover__content",
      "popoverFooter": "pf-c-popover__footer",
      "popoverTitle": "pf-c-popover__title",
      "popoverTitleIcon": "pf-c-popover__title-icon",
      "popoverTitleText": "pf-c-popover__title-text",
      "title": "pf-c-title"
    };

    const PopoverContext = React__namespace.createContext({});

    const PopoverContent = (_a) => {
        var { className = null, children } = _a, props = __rest$1(_a, ["className", "children"]);
        return (React__namespace.createElement("div", Object.assign({ className: css(styles$3.popoverContent, className) }, props), children));
    };
    PopoverContent.displayName = 'PopoverContent';

    const PopoverBody = (_a) => {
        var { children, id, className } = _a, props = __rest$1(_a, ["children", "id", "className"]);
        return (React__namespace.createElement("div", Object.assign({ className: css(styles$3.popoverBody, className), id: id }, props), children));
    };
    PopoverBody.displayName = 'PopoverBody';

    const PopoverHeaderIcon = (_a) => {
        var { children, className } = _a, props = __rest$1(_a, ["children", "className"]);
        return (React__namespace.createElement("span", Object.assign({ className: css(styles$3.popoverTitleIcon, className) }, props), children));
    };
    PopoverHeaderIcon.displayName = 'PopoverHeaderIcon';

    const PopoverHeaderText = (_a) => {
        var { children, className } = _a, props = __rest$1(_a, ["children", "className"]);
        return (React__namespace.createElement("span", Object.assign({ className: css(styles$3.popoverTitleText, className) }, props), children));
    };
    PopoverHeaderText.displayName = 'PopoverHeaderText';

    const PopoverHeader = (_a) => {
        var { children, icon, className, titleHeadingLevel = 'h6', alertSeverityVariant, id, alertSeverityScreenReaderText } = _a, props = __rest$1(_a, ["children", "icon", "className", "titleHeadingLevel", "alertSeverityVariant", "id", "alertSeverityScreenReaderText"]);
        const HeadingLevel = titleHeadingLevel;
        return icon || alertSeverityVariant ? (React__namespace.createElement("header", Object.assign({ className: css('pf-c-popover__header', className), id: id }, props),
            React__namespace.createElement(HeadingLevel, { className: css(styles$3.popoverTitle, icon && styles$3.modifiers.icon) },
                icon && React__namespace.createElement(PopoverHeaderIcon, null, icon),
                alertSeverityVariant && alertSeverityScreenReaderText && (React__namespace.createElement("span", { className: "pf-u-screen-reader" }, alertSeverityScreenReaderText)),
                React__namespace.createElement(PopoverHeaderText, null, children)))) : (React__namespace.createElement(Title, Object.assign({ headingLevel: titleHeadingLevel, size: TitleSizes.md, id: id, className: className }, props), children));
    };
    PopoverHeader.displayName = 'PopoverHeader';

    const PopoverFooter = (_a) => {
        var { children, className = '' } = _a, props = __rest$1(_a, ["children", "className"]);
        return (React__namespace.createElement("footer", Object.assign({ className: css(styles$3.popoverFooter, className) }, props), children));
    };
    PopoverFooter.displayName = 'PopoverFooter';

    const PopoverCloseButton = (_a) => {
        var { onClose = () => undefined } = _a, props = __rest$1(_a, ["onClose"]);
        const [closeButtonElement, setCloseButtonElement] = React__namespace.useState(null);
        React__namespace.useEffect(() => {
            closeButtonElement && closeButtonElement.addEventListener('click', onClose, false);
            return () => {
                closeButtonElement && closeButtonElement.removeEventListener('click', onClose, false);
            };
        }, [closeButtonElement]);
        return (React__namespace.createElement(FindRefWrapper, { onFoundRef: (foundRef) => setCloseButtonElement(foundRef) },
            React__namespace.createElement(Button, Object.assign({ variant: "plain", "aria-label": true }, props, { style: { pointerEvents: 'auto' } }),
                React__namespace.createElement(TimesIcon$1, null))));
    };
    PopoverCloseButton.displayName = 'PopoverCloseButton';

    const PopoverArrow = (_a) => {
        var { className = '' } = _a, props = __rest$1(_a, ["className"]);
        return React__namespace.createElement("div", Object.assign({ className: css(styles$3.popoverArrow, className) }, props));
    };
    PopoverArrow.displayName = 'PopoverArrow';

    const c_popover_MaxWidth = {
      "name": "--pf-c-popover--MaxWidth",
      "value": "none",
      "var": "var(--pf-c-popover--MaxWidth)"
    };
    var popoverMaxWidth = c_popover_MaxWidth;

    const c_popover_MinWidth = {
      "name": "--pf-c-popover--MinWidth",
      "value": "auto",
      "var": "var(--pf-c-popover--MinWidth)"
    };
    var popoverMinWidth = c_popover_MinWidth;

    var PopoverPosition;
    (function (PopoverPosition) {
        PopoverPosition["auto"] = "auto";
        PopoverPosition["top"] = "top";
        PopoverPosition["bottom"] = "bottom";
        PopoverPosition["left"] = "left";
        PopoverPosition["right"] = "right";
        PopoverPosition["topStart"] = "top-start";
        PopoverPosition["topEnd"] = "top-end";
        PopoverPosition["bottomStart"] = "bottom-start";
        PopoverPosition["bottomEnd"] = "bottom-end";
        PopoverPosition["leftStart"] = "left-start";
        PopoverPosition["leftEnd"] = "left-end";
        PopoverPosition["rightStart"] = "right-start";
        PopoverPosition["rightEnd"] = "right-end";
    })(PopoverPosition || (PopoverPosition = {}));
    const alertStyle = {
        default: styles$3.modifiers.default,
        info: styles$3.modifiers.info,
        success: styles$3.modifiers.success,
        warning: styles$3.modifiers.warning,
        danger: styles$3.modifiers.danger
    };
    const Popover = (_a) => {
        var { children, position = 'top', enableFlip = true, className = '', isVisible = null, shouldClose = () => null, shouldOpen = () => null, 'aria-label': ariaLabel = '', bodyContent, headerContent = null, headerComponent = 'h6', headerIcon = null, alertSeverityVariant, alertSeverityScreenReaderText, footerContent = null, appendTo = () => document.body, hideOnOutsideClick = true, onHide = () => null, onHidden = () => null, onShow = () => null, onShown = () => null, onMount = () => null, zIndex = 9999, minWidth = popoverMinWidth && popoverMinWidth.value, maxWidth = popoverMaxWidth && popoverMaxWidth.value, closeBtnAriaLabel = 'Close', showClose = true, distance = 25, 
        // For every initial starting position, there are 3 escape positions
        flipBehavior = ['top', 'right', 'bottom', 'left', 'top', 'right', 'bottom'], animationDuration = 300, id, withFocusTrap: propWithFocusTrap, boundary, tippyProps, reference, hasNoPadding = false, hasAutoWidth = false } = _a, rest = __rest$1(_a, ["children", "position", "enableFlip", "className", "isVisible", "shouldClose", "shouldOpen", 'aria-label', "bodyContent", "headerContent", "headerComponent", "headerIcon", "alertSeverityVariant", "alertSeverityScreenReaderText", "footerContent", "appendTo", "hideOnOutsideClick", "onHide", "onHidden", "onShow", "onShown", "onMount", "zIndex", "minWidth", "maxWidth", "closeBtnAriaLabel", "showClose", "distance", "flipBehavior", "animationDuration", "id", "withFocusTrap", "boundary", "tippyProps", "reference", "hasNoPadding", "hasAutoWidth"]);
        {
            boundary !== undefined &&
                console.warn('The Popover boundary prop has been deprecated. If you want to constrain the popper to a specific element use the appendTo prop instead.');
            tippyProps !== undefined && console.warn('The Popover tippyProps prop has been deprecated and is no longer used.');
        }
        // could make this a prop in the future (true | false | 'toggle')
        // const hideOnClick = true;
        const uniqueId = id || getUniqueId();
        const triggerManually = isVisible !== null;
        const [visible, setVisible] = React__namespace.useState(false);
        const [opacity, setOpacity] = React__namespace.useState(0);
        const [focusTrapActive, setFocusTrapActive] = React__namespace.useState(Boolean(propWithFocusTrap));
        const transitionTimerRef = React__namespace.useRef(null);
        const showTimerRef = React__namespace.useRef(null);
        const hideTimerRef = React__namespace.useRef(null);
        React__namespace.useEffect(() => {
            onMount();
        }, []);
        React__namespace.useEffect(() => {
            if (triggerManually) {
                if (isVisible) {
                    show();
                }
                else {
                    hide();
                }
            }
        }, [isVisible, triggerManually]);
        const show = (withFocusTrap) => {
            onShow();
            if (transitionTimerRef.current) {
                clearTimeout(transitionTimerRef.current);
            }
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
            }
            showTimerRef.current = setTimeout(() => {
                setVisible(true);
                setOpacity(1);
                propWithFocusTrap !== false && withFocusTrap && setFocusTrapActive(true);
                onShown();
            }, 0);
        };
        const hide = () => {
            onHide();
            if (showTimerRef.current) {
                clearTimeout(showTimerRef.current);
            }
            hideTimerRef.current = setTimeout(() => {
                setVisible(false);
                setOpacity(0);
                setFocusTrapActive(false);
                transitionTimerRef.current = setTimeout(() => {
                    onHidden();
                }, animationDuration);
            }, 0);
        };
        const positionModifiers = {
            top: styles$3.modifiers.top,
            bottom: styles$3.modifiers.bottom,
            left: styles$3.modifiers.left,
            right: styles$3.modifiers.right,
            'top-start': styles$3.modifiers.topLeft,
            'top-end': styles$3.modifiers.topRight,
            'bottom-start': styles$3.modifiers.bottomLeft,
            'bottom-end': styles$3.modifiers.bottomRight,
            'left-start': styles$3.modifiers.leftTop,
            'left-end': styles$3.modifiers.leftBottom,
            'right-start': styles$3.modifiers.rightTop,
            'right-end': styles$3.modifiers.rightBottom
        };
        const hasCustomMinWidth = minWidth !== popoverMinWidth.value;
        const hasCustomMaxWidth = maxWidth !== popoverMaxWidth.value;
        const onDocumentKeyDown = (event) => {
            if (event.keyCode === KEY_CODES.ESCAPE_KEY && visible) {
                if (triggerManually) {
                    shouldClose(null, hide, event);
                }
                else {
                    hide();
                }
            }
        };
        const onDocumentClick = (event, triggerElement, popperElement) => {
            if (hideOnOutsideClick && visible) {
                // check if we clicked within the popper, if so don't do anything
                const isChild = popperElement && popperElement.contains(event.target);
                if (isChild) {
                    // clicked within the popper
                    return;
                }
                if (triggerManually) {
                    shouldClose(null, hide, event);
                }
                else {
                    hide();
                }
            }
        };
        const onTriggerClick = (event) => {
            if (triggerManually) {
                if (visible) {
                    shouldClose(null, hide, event);
                }
                else {
                    shouldOpen(show, event);
                }
            }
            else {
                if (visible) {
                    hide();
                }
                else {
                    show(true);
                }
            }
        };
        const onContentMouseDown = () => {
            if (focusTrapActive) {
                setFocusTrapActive(false);
            }
        };
        const closePopover = (event) => {
            event.stopPropagation();
            if (triggerManually) {
                shouldClose(null, hide, event);
            }
            else {
                hide();
            }
        };
        const content = (React__namespace.createElement(FocusTrap, Object.assign({ active: focusTrapActive, focusTrapOptions: {
                returnFocusOnDeactivate: true,
                clickOutsideDeactivates: true,
                fallbackFocus: () => {
                    // If the popover's trigger is focused but scrolled out of view,
                    // FocusTrap will throw an error when the Enter button is used on the trigger.
                    // That is because the Popover is hidden when its trigger is out of view.
                    // Provide a fallback in that case.
                    let node = null;
                    if (document && document.activeElement) {
                        node = document.activeElement;
                    }
                    return node;
                }
            }, preventScrollOnDeactivate: true, className: css(styles$3.popover, alertSeverityVariant && alertStyle[alertSeverityVariant], hasNoPadding && styles$3.modifiers.noPadding, hasAutoWidth && styles$3.modifiers.widthAuto, className), role: "dialog", "aria-modal": "true", "aria-label": headerContent ? undefined : ariaLabel, "aria-labelledby": headerContent ? `popover-${uniqueId}-header` : undefined, "aria-describedby": `popover-${uniqueId}-body`, onMouseDown: onContentMouseDown, style: {
                minWidth: hasCustomMinWidth ? minWidth : null,
                maxWidth: hasCustomMaxWidth ? maxWidth : null,
                opacity,
                transition: getOpacityTransition(animationDuration)
            } }, rest),
            React__namespace.createElement(PopoverArrow, null),
            React__namespace.createElement(PopoverContent, null,
                showClose && React__namespace.createElement(PopoverCloseButton, { onClose: closePopover, "aria-label": closeBtnAriaLabel }),
                headerContent && (React__namespace.createElement(PopoverHeader, { id: `popover-${uniqueId}-header`, icon: headerIcon, alertSeverityVariant: alertSeverityVariant, alertSeverityScreenReaderText: alertSeverityScreenReaderText || `${alertSeverityVariant} alert:`, titleHeadingLevel: headerComponent }, typeof headerContent === 'function' ? headerContent(hide) : headerContent)),
                React__namespace.createElement(PopoverBody, { id: `popover-${uniqueId}-body` }, typeof bodyContent === 'function' ? bodyContent(hide) : bodyContent),
                footerContent && (React__namespace.createElement(PopoverFooter, { id: `popover-${uniqueId}-footer` }, typeof footerContent === 'function' ? footerContent(hide) : footerContent)))));
        return (React__namespace.createElement(PopoverContext.Provider, { value: { headerComponent } },
            React__namespace.createElement(Popper, { trigger: children, reference: reference, popper: content, popperMatchesTriggerWidth: false, appendTo: appendTo, isVisible: visible, positionModifiers: positionModifiers, distance: distance, placement: position, onTriggerClick: onTriggerClick, onDocumentClick: onDocumentClick, onDocumentKeyDown: onDocumentKeyDown, enableFlip: enableFlip, zIndex: zIndex, flipBehavior: flipBehavior })));
    };
    Popover.displayName = 'Popover';

    const AngleDownIconConfig = {
      name: 'AngleDownIcon',
      height: 512,
      width: 320,
      svgPath: 'M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z',
      yOffset: 0,
      xOffset: 0,
    };

    const AngleDownIcon = createIcon(AngleDownIconConfig);

    var AngleDownIcon$1 = AngleDownIcon;

    const GripVerticalIconConfig = {
      name: 'GripVerticalIcon',
      height: 512,
      width: 320,
      svgPath: 'M96 32H32C14.33 32 0 46.33 0 64v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zM288 32h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z',
      yOffset: 0,
      xOffset: 0,
    };

    const GripVerticalIcon = createIcon(GripVerticalIconConfig);

    var GripVerticalIcon$1 = GripVerticalIcon;

    Promise.resolve().then(function () { return emptyState; });
    var styles$2 = {
      "button": "pf-c-button",
      "emptyState": "pf-c-empty-state",
      "emptyStateBody": "pf-c-empty-state__body",
      "emptyStateContent": "pf-c-empty-state__content",
      "emptyStateIcon": "pf-c-empty-state__icon",
      "emptyStatePrimary": "pf-c-empty-state__primary",
      "emptyStateSecondary": "pf-c-empty-state__secondary",
      "modifiers": {
        "xs": "pf-m-xs",
        "sm": "pf-m-sm",
        "lg": "pf-m-lg",
        "xl": "pf-m-xl",
        "fullHeight": "pf-m-full-height",
        "primary": "pf-m-primary",
        "overpassFont": "pf-m-overpass-font"
      },
      "title": "pf-c-title"
    };

    var EmptyStateVariant;
    (function (EmptyStateVariant) {
        EmptyStateVariant["xs"] = "xs";
        EmptyStateVariant["small"] = "small";
        EmptyStateVariant["large"] = "large";
        EmptyStateVariant["xl"] = "xl";
        EmptyStateVariant["full"] = "full";
    })(EmptyStateVariant || (EmptyStateVariant = {}));
    const EmptyState = (_a) => {
        var { children, className = '', variant = EmptyStateVariant.full, isFullHeight } = _a, props = __rest$1(_a, ["children", "className", "variant", "isFullHeight"]);
        return (React__namespace.createElement("div", Object.assign({ className: css(styles$2.emptyState, variant === 'xs' && styles$2.modifiers.xs, variant === 'small' && styles$2.modifiers.sm, variant === 'large' && styles$2.modifiers.lg, variant === 'xl' && styles$2.modifiers.xl, isFullHeight && styles$2.modifiers.fullHeight, className) }, props),
            React__namespace.createElement("div", { className: css(styles$2.emptyStateContent) }, children)));
    };
    EmptyState.displayName = 'EmptyState';

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    const Bullseye = (_a) => {
        var { children = null, className = '', component = 'div' } = _a, props = __rest$1(_a, ["children", "className", "component"]);
        const Component = component;
        return (React__namespace.createElement(Component, Object.assign({ className: css(styles$c.bullseye, className) }, props), children));
    };
    Bullseye.displayName = 'Bullseye';

    Promise.resolve().then(function () { return inlineEdit; });
    var inlineStyles = {
      "button": "pf-c-button",
      "inlineEdit": "pf-c-inline-edit",
      "inlineEditAction": "pf-c-inline-edit__action",
      "inlineEditEditableText": "pf-c-inline-edit__editable-text",
      "inlineEditGroup": "pf-c-inline-edit__group",
      "inlineEditInput": "pf-c-inline-edit__input",
      "inlineEditLabel": "pf-c-inline-edit__label",
      "inlineEditValue": "pf-c-inline-edit__value",
      "modifiers": {
        "iconGroup": "pf-m-icon-group",
        "footer": "pf-m-footer",
        "column": "pf-m-column",
        "valid": "pf-m-valid",
        "plain": "pf-m-plain",
        "actionGroup": "pf-m-action-group",
        "enableEditable": "pf-m-enable-editable",
        "inlineEditable": "pf-m-inline-editable",
        "enable": "pf-m-enable",
        "bold": "pf-m-bold"
      }
    };

    Promise.resolve().then(function () { return table; });
    var styles$1 = {
      "button": "pf-c-button",
      "modifiers": {
        "hidden": "pf-m-hidden",
        "hiddenOnSm": "pf-m-hidden-on-sm",
        "visibleOnSm": "pf-m-visible-on-sm",
        "hiddenOnMd": "pf-m-hidden-on-md",
        "visibleOnMd": "pf-m-visible-on-md",
        "hiddenOnLg": "pf-m-hidden-on-lg",
        "visibleOnLg": "pf-m-visible-on-lg",
        "hiddenOnXl": "pf-m-hidden-on-xl",
        "visibleOnXl": "pf-m-visible-on-xl",
        "hiddenOn_2xl": "pf-m-hidden-on-2xl",
        "visibleOn_2xl": "pf-m-visible-on-2xl",
        "fixed": "pf-m-fixed",
        "stickyHeader": "pf-m-sticky-header",
        "striped": "pf-m-striped",
        "expandable": "pf-m-expandable",
        "stripedEven": "pf-m-striped-even",
        "ghostRow": "pf-m-ghost-row",
        "center": "pf-m-center",
        "help": "pf-m-help",
        "favorite": "pf-m-favorite",
        "borderRight": "pf-m-border-right",
        "borderLeft": "pf-m-border-left",
        "nestedColumnHeader": "pf-m-nested-column-header",
        "truncate": "pf-m-truncate",
        "wrap": "pf-m-wrap",
        "nowrap": "pf-m-nowrap",
        "fitContent": "pf-m-fit-content",
        "breakWord": "pf-m-break-word",
        "noBorderRows": "pf-m-no-border-rows",
        "expanded": "pf-m-expanded",
        "hoverable": "pf-m-hoverable",
        "selected": "pf-m-selected",
        "firstCellOffsetReset": "pf-m-first-cell-offset-reset",
        "dragOver": "pf-m-drag-over",
        "favorited": "pf-m-favorited",
        "noPadding": "pf-m-no-padding",
        "compact": "pf-m-compact",
        "width_10": "pf-m-width-10",
        "width_15": "pf-m-width-15",
        "width_20": "pf-m-width-20",
        "width_25": "pf-m-width-25",
        "width_30": "pf-m-width-30",
        "width_35": "pf-m-width-35",
        "width_40": "pf-m-width-40",
        "width_45": "pf-m-width-45",
        "width_50": "pf-m-width-50",
        "width_60": "pf-m-width-60",
        "width_70": "pf-m-width-70",
        "width_80": "pf-m-width-80",
        "width_90": "pf-m-width-90",
        "width_100": "pf-m-width-100"
      },
      "table": "pf-c-table",
      "tableAction": "pf-c-table__action",
      "tableButton": "pf-c-table__button",
      "tableButtonContent": "pf-c-table__button-content",
      "tableCheck": "pf-c-table__check",
      "tableColumnHelp": "pf-c-table__column-help",
      "tableColumnHelpAction": "pf-c-table__column-help-action",
      "tableCompoundExpansionToggle": "pf-c-table__compound-expansion-toggle",
      "tableControlRow": "pf-c-table__control-row",
      "tableDraggable": "pf-c-table__draggable",
      "tableExpandableRow": "pf-c-table__expandable-row",
      "tableExpandableRowContent": "pf-c-table__expandable-row-content",
      "tableFavorite": "pf-c-table__favorite",
      "tableIcon": "pf-c-table__icon",
      "tableIconInline": "pf-c-table__icon-inline",
      "tableInlineEditAction": "pf-c-table__inline-edit-action",
      "tableSort": "pf-c-table__sort",
      "tableSortIndicator": "pf-c-table__sort-indicator",
      "tableSubhead": "pf-c-table__subhead",
      "tableText": "pf-c-table__text",
      "tableToggle": "pf-c-table__toggle",
      "tableToggleIcon": "pf-c-table__toggle-icon"
    };

    Promise.resolve().then(function () { return tableGrid; });
    var stylesGrid = {
      "button": "pf-c-button",
      "modifiers": {
        "grid": "pf-m-grid",
        "compact": "pf-m-compact",
        "expanded": "pf-m-expanded",
        "selected": "pf-m-selected",
        "noPadding": "pf-m-no-padding",
        "hoverable": "pf-m-hoverable",
        "nowrap": "pf-m-nowrap",
        "fitContent": "pf-m-fit-content",
        "truncate": "pf-m-truncate",
        "gridMd": "pf-m-grid-md",
        "gridLg": "pf-m-grid-lg",
        "gridXl": "pf-m-grid-xl",
        "grid_2xl": "pf-m-grid-2xl"
      },
      "table": "pf-c-table",
      "tableAction": "pf-c-table__action",
      "tableButton": "pf-c-table__button",
      "tableCheck": "pf-c-table__check",
      "tableCompoundExpansionToggle": "pf-c-table__compound-expansion-toggle",
      "tableExpandableRow": "pf-c-table__expandable-row",
      "tableExpandableRowContent": "pf-c-table__expandable-row-content",
      "tableFavorite": "pf-c-table__favorite",
      "tableIcon": "pf-c-table__icon",
      "tableInlineEditAction": "pf-c-table__inline-edit-action",
      "tableText": "pf-c-table__text",
      "tableToggle": "pf-c-table__toggle",
      "tableToggleIcon": "pf-c-table__toggle-icon"
    };

    Promise.resolve().then(function () { return tableTreeView; });
    var stylesTreeView = {
      "dropdown": "pf-c-dropdown",
      "modifiers": {
        "treeView": "pf-m-tree-view",
        "treeViewGrid": "pf-m-tree-view-grid",
        "treeViewDetailsExpanded": "pf-m-tree-view-details-expanded",
        "treeViewGridMd": "pf-m-tree-view-grid-md",
        "treeViewGridLg": "pf-m-tree-view-grid-lg",
        "treeViewGridXl": "pf-m-tree-view-grid-xl",
        "treeViewGrid_2xl": "pf-m-tree-view-grid-2xl"
      },
      "table": "pf-c-table",
      "tableAction": "pf-c-table__action",
      "tableCheck": "pf-c-table__check",
      "tableToggle": "pf-c-table__toggle",
      "tableToggleIcon": "pf-c-table__toggle-icon",
      "tableTreeViewDetailsToggle": "pf-c-table__tree-view-details-toggle",
      "tableTreeViewIcon": "pf-c-table__tree-view-icon",
      "tableTreeViewMain": "pf-c-table__tree-view-main",
      "tableTreeViewText": "pf-c-table__tree-view-text",
      "tableTreeViewTitleCell": "pf-c-table__tree-view-title-cell",
      "tableTreeViewTitleHeaderCell": "pf-c-table__tree-view-title-header-cell"
    };

    const hasCompoundParentsExpanded = (parentId, compoundParent, rows) => {
        // max rows.length parents
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const i of rows) {
            if (rows[parentId].hasOwnProperty('parent')) {
                parentId = rows[parentId].parent;
            }
            else {
                return rows[parentId].cells[compoundParent].props.isOpen;
            }
        }
        return false;
    };
    const hasParentsExpanded = (parentId, rows) => {
        // max rows.length parents
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const i of rows) {
            if (rows[parentId].hasOwnProperty('parent')) {
                parentId = rows[parentId].parent;
            }
            else {
                return rows[parentId].isOpen;
            }
        }
        return false;
    };
    const isRowExpanded = (row, rows) => {
        if (row.parent !== undefined) {
            if (row.hasOwnProperty('compoundParent')) {
                return hasCompoundParentsExpanded(row.parent, row.compoundParent, rows);
            }
            return hasParentsExpanded(row.parent, rows) && rows[row.parent].isOpen;
        }
        return undefined;
    };
    const getErrorTextByValidator = (validatorName, validators) => {
        const result = validators.filter(validator => validator.name === validatorName);
        return result[0].errorText;
    };
    const cancelCellEdits = (row) => {
        row.cells.forEach(cell => {
            delete cell.props.errorText;
            delete cell.props.editableValue;
            cell.props.isValid = true;
            // for editable selects, revert the selected property to its original value
            if (cell.props.selected) {
                cell.props.selected = cell.props.value;
            }
        });
        row.isEditable = !row.isEditable;
        row.isValid = true;
        return row;
    };
    const validateCellEdits = (row, type, validationErrors, missingPropErrorTxt = 'Validation requires unique name property for row cells') => {
        row.isValid = Object.keys(validationErrors).length ? false : true;
        row.cells.forEach(cell => {
            delete cell.props.errorText;
            const hasValue = cell.props.value !== undefined && cell.props.value !== null;
            const hasEditableValue = cell.props.editableValue !== undefined && cell.props.editableValue !== null;
            if (cell.props && hasValue && hasEditableValue) {
                if (type === 'save') {
                    const errorMsg = Object.keys(validationErrors)
                        .filter(validatorName => validationErrors[validatorName].includes(cell.props.name))
                        .map(validatorName => getErrorTextByValidator(validatorName, row.rowEditValidationRules));
                    if (errorMsg.length) {
                        cell.props.errorText = cell.props.name ? errorMsg.join(', ') : missingPropErrorTxt;
                        if (cell.props.name === undefined) {
                            // eslint-disable-next-line no-console
                            console.warn('Row edit validation reporting requires cell definitions to have a unique name property.');
                        }
                    }
                    else {
                        delete cell.props.errorText;
                        cell.props.isValid = true;
                    }
                }
            }
        });
        return row;
    };
    const applyCellEdits = (row, type) => {
        row.cells.forEach(cell => {
            delete cell.props.errorText;
            const hasValue = cell.props.value !== undefined && cell.props.value !== null;
            const hasEditableValue = cell.props.editableValue !== undefined && cell.props.editableValue !== null;
            // sync for validation
            if (hasValue && !hasEditableValue) {
                cell.props.editableValue = cell.props.value;
            }
            if (cell.props && hasValue && hasEditableValue) {
                if (type === 'save') {
                    cell.props.value = cell.props.editableValue;
                    cell.props.isValid = true;
                    delete cell.props.errorText;
                }
                delete cell.props.editableValue;
            }
        });
        row.isEditable = !row.isEditable;
        row.isValid = true;
        return row;
    };
    const camelize = (s) => s
        .toUpperCase()
        .replace('-', '')
        .replace('_', '');
    const toCamel = (s) => s.replace(/([-_][a-z])/gi, camelize);
    /**
     * @param {string} input - String to capitalize
     */
    function capitalize(input) {
        return input[0].toUpperCase() + input.substring(1);
    }

    exports.TableGridBreakpoint = void 0;
    (function (TableGridBreakpoint) {
        TableGridBreakpoint["none"] = "";
        TableGridBreakpoint["grid"] = "grid";
        TableGridBreakpoint["gridMd"] = "grid-md";
        TableGridBreakpoint["gridLg"] = "grid-lg";
        TableGridBreakpoint["gridXl"] = "grid-xl";
        TableGridBreakpoint["grid2xl"] = "grid-2xl";
    })(exports.TableGridBreakpoint || (exports.TableGridBreakpoint = {}));
    exports.TableVariant = void 0;
    (function (TableVariant) {
        TableVariant["compact"] = "compact";
    })(exports.TableVariant || (exports.TableVariant = {}));

    const TableComposableBase = (_a) => {
        var _b, _c;
        var { children, className, variant, borders = true, isStickyHeader = false, gridBreakPoint = exports.TableGridBreakpoint.gridMd, 'aria-label': ariaLabel, role = 'grid', innerRef, ouiaId, ouiaSafe = true, isTreeTable = false, isNested = false, isStriped = false, isExpandable = false, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nestedHeaderColumnSpans } = _a, props = __rest$2(_a, ["children", "className", "variant", "borders", "isStickyHeader", "gridBreakPoint", 'aria-label', "role", "innerRef", "ouiaId", "ouiaSafe", "isTreeTable", "isNested", "isStriped", "isExpandable", "nestedHeaderColumnSpans"]);
        const tableRef = innerRef || React__namespace.useRef(null);
        React__namespace.useEffect(() => {
            document.addEventListener('keydown', handleKeys);
            // sets up roving tab-index to tree tables only
            if (tableRef && tableRef.current && tableRef.current.classList.contains('pf-m-tree-view')) {
                const tbody = tableRef.current.querySelector('tbody');
                tbody && setTabIndex(Array.from(tbody.querySelectorAll('button, a, input')));
            }
            return function cleanup() {
                document.removeEventListener('keydown', handleKeys);
            };
        }, [tableRef, tableRef.current]);
        const ouiaProps = useOUIAProps('Table', ouiaId, ouiaSafe);
        const grid = (_b = stylesGrid.modifiers) === null || _b === void 0 ? void 0 : _b[toCamel(gridBreakPoint || '').replace(/-?2xl/, '_2xl')];
        const breakPointPrefix = `treeView${gridBreakPoint.charAt(0).toUpperCase() + gridBreakPoint.slice(1)}`;
        const treeGrid = (_c = stylesTreeView.modifiers) === null || _c === void 0 ? void 0 : _c[toCamel(breakPointPrefix || '').replace(/-?2xl/, '_2xl')];
        const handleKeys = (event) => {
            if (isNested ||
                !(tableRef && tableRef.current && tableRef.current.classList.contains('pf-m-tree-view')) || // implements roving tab-index to tree tables only
                (tableRef && tableRef.current !== event.target.closest('.pf-c-table:not(.pf-m-nested)'))) {
                return;
            }
            const activeElement = document.activeElement;
            const key = event.key;
            const rows = Array.from(tableRef.current.querySelectorAll('tbody tr')).filter(el => !el.classList.contains('pf-m-disabled') && !el.hidden);
            if (key === 'Space' || key === 'Enter') {
                activeElement.click();
                event.preventDefault();
            }
            const getFocusableElement = (element) => element.querySelectorAll('button:not(:disabled), input:not(:disabled), a:not(:disabled)')[0];
            handleArrows(event, rows, (element) => element === activeElement.closest('tr'), getFocusableElement, ['button', 'input', 'a'], undefined, false, true, false);
        };
        return (React__namespace.createElement("table", Object.assign({ "aria-label": ariaLabel, role: role, className: css(className, styles$1.table, isTreeTable ? treeGrid : grid, styles$1.modifiers[variant], !borders && styles$1.modifiers.noBorderRows, isStickyHeader && styles$1.modifiers.stickyHeader, isTreeTable && stylesTreeView.modifiers.treeView, isStriped && styles$1.modifiers.striped, isExpandable && styles$1.modifiers.expandable, isNested && 'pf-m-nested'), ref: tableRef }, (isTreeTable && { role: 'treegrid' }), ouiaProps, props), children));
    };
    const TableComposable = React__namespace.forwardRef((props, ref) => (React__namespace.createElement(TableComposableBase, Object.assign({}, props, { innerRef: ref }))));
    TableComposable.displayName = 'TableComposable';

    const TheadBase = (_a) => {
        var { children, className, noWrap = false, innerRef, hasNestedHeader } = _a, props = __rest$2(_a, ["children", "className", "noWrap", "innerRef", "hasNestedHeader"]);
        return (React__namespace.createElement("thead", Object.assign({ className: css(className, noWrap && styles$1.modifiers.nowrap, hasNestedHeader && styles$1.modifiers.nestedColumnHeader), ref: innerRef }, props), children));
    };
    const Thead = React__namespace.forwardRef((props, ref) => (React__namespace.createElement(TheadBase, Object.assign({}, props, { innerRef: ref }))));
    Thead.displayName = 'Thead';

    const TbodyBase = (_a) => {
        var { children, className, isExpanded, innerRef, isEvenStriped = false, isOddStriped = false } = _a, props = __rest$2(_a, ["children", "className", "isExpanded", "innerRef", "isEvenStriped", "isOddStriped"]);
        return (React__namespace.createElement("tbody", Object.assign({ role: "rowgroup", className: css(className, isExpanded && styles$1.modifiers.expanded, isOddStriped && styles$1.modifiers.striped, isEvenStriped && styles$1.modifiers.stripedEven), ref: innerRef }, props), children));
    };
    const Tbody = React__namespace.forwardRef((props, ref) => (React__namespace.createElement(TbodyBase, Object.assign({}, props, { innerRef: ref }))));
    Tbody.displayName = 'Tbody';

    const TrBase = (_a) => {
        var { children, className, isExpanded, isEditable, isHidden = false, isHoverable = false, isRowSelected = false, isStriped = false, innerRef, ouiaId, ouiaSafe = true, resetOffset = false, onRowClick } = _a, props = __rest$2(_a, ["children", "className", "isExpanded", "isEditable", "isHidden", "isHoverable", "isRowSelected", "isStriped", "innerRef", "ouiaId", "ouiaSafe", "resetOffset", "onRowClick"]);
        const ouiaProps = useOUIAProps('TableRow', ouiaId, ouiaSafe);
        let onKeyDown = null;
        if (onRowClick) {
            onKeyDown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onRowClick(e);
                    e.preventDefault();
                }
            };
        }
        return (React__namespace.createElement("tr", Object.assign({ className: css(className, isExpanded !== undefined && styles$1.tableExpandableRow, isExpanded && styles$1.modifiers.expanded, isEditable && inlineStyles.modifiers.inlineEditable, isHoverable && styles$1.modifiers.hoverable, isRowSelected && styles$1.modifiers.selected, isStriped && styles$1.modifiers.striped, resetOffset && styles$1.modifiers.firstCellOffsetReset), hidden: isHidden || (isExpanded !== undefined && !isExpanded) }, (isHoverable && { tabIndex: 0 }), { ref: innerRef }, (onRowClick && { onClick: onRowClick, onKeyDown }), ouiaProps, props), children));
    };
    const Tr = React__namespace.forwardRef((props, ref) => (React__namespace.createElement(TrBase, Object.assign({}, props, { innerRef: ref }))));
    Tr.displayName = 'Tr';

    Promise.resolve().then(function () { return tableScrollable; });
    var styles = {
      "modifiers": {
        "borderRight": "pf-m-border-right",
        "borderLeft": "pf-m-border-left",
        "stickyHeader": "pf-m-sticky-header"
      },
      "scrollInnerWrapper": "pf-c-scroll-inner-wrapper",
      "scrollOuterWrapper": "pf-c-scroll-outer-wrapper",
      "table": "pf-c-table",
      "tableStickyColumn": "pf-c-table__sticky-column"
    };

    const HelpIconConfig = {
      name: 'HelpIcon',
      height: 1024,
      width: 1024,
      svgPath: 'M521.3,576 C627.5,576 713.7,502 713.7,413.7 C713.7,325.4 627.6,253.6 521.3,253.6 C366,253.6 334.5,337.7 329.2,407.2 C329.2,414.3 335.2,416 343.5,416 L445,416 C450.5,416 458,415.5 460.8,406.5 C460.8,362.6 582.9,357.1 582.9,413.6 C582.9,441.9 556.2,470.9 521.3,473 C486.4,475.1 447.3,479.8 447.3,521.7 L447.3,553.8 C447.3,570.8 456.1,576 472,576 C487.9,576 521.3,576 521.3,576 M575.3,751.3 L575.3,655.3 C575.313862,651.055109 573.620137,646.982962 570.6,644 C567.638831,640.947672 563.552355,639.247987 559.3,639.29884 L463.3,639.29884 C459.055109,639.286138 454.982962,640.979863 452,644 C448.947672,646.961169 447.247987,651.047645 447.29884,655.3 L447.29884,751.3 C447.286138,755.544891 448.979863,759.617038 452,762.6 C454.961169,765.652328 459.047645,767.352013 463.3,767.30116 L559.3,767.30116 C563.544891,767.313862 567.617038,765.620137 570.6,762.6 C573.659349,759.643612 575.360354,755.553963 575.3,751.3 M512,896 C300.2,896 128,723.9 128,512 C128,300.3 300.2,128 512,128 C723.8,128 896,300.2 896,512 C896,723.8 723.7,896 512,896 M512.1,0 C229.7,0 0,229.8 0,512 C0,794.2 229.8,1024 512.1,1024 C794.4,1024 1024,794.3 1024,512 C1024,229.7 794.4,0 512.1,0',
      yOffset: 0,
      xOffset: 0,
    };

    const HelpIcon = createIcon(HelpIconConfig);

    var HelpIcon$1 = HelpIcon;

    exports.TableTextVariant = void 0;
    (function (TableTextVariant) {
        TableTextVariant["div"] = "div";
        TableTextVariant["nav"] = "nav";
    })(exports.TableTextVariant || (exports.TableTextVariant = {}));
    exports.WrapModifier = void 0;
    (function (WrapModifier) {
        WrapModifier["wrap"] = "wrap";
        WrapModifier["nowrap"] = "nowrap";
        WrapModifier["truncate"] = "truncate";
        WrapModifier["breakWord"] = "breakWord";
        WrapModifier["fitContent"] = "fitContent";
    })(exports.WrapModifier || (exports.WrapModifier = {}));
    const TableText = (_a) => {
        var { children = null, className = '', variant = 'span', wrapModifier = null, tooltip: tooltipProp = '', tooltipProps = {}, onMouseEnter: onMouseEnterProp = () => { } } = _a, props = __rest$2(_a, ["children", "className", "variant", "wrapModifier", "tooltip", "tooltipProps", "onMouseEnter"]);
        const Component = variant;
        const [tooltip, setTooltip] = React__namespace.useState('');
        const onMouseEnter = (event) => {
            if (event.target.offsetWidth < event.target.scrollWidth) {
                setTooltip(tooltipProp || event.target.innerText);
            }
            else {
                setTooltip('');
            }
            onMouseEnterProp(event);
        };
        const text = (React__namespace.createElement(Component, Object.assign({ onMouseEnter: onMouseEnter, className: css(className, wrapModifier && styles$1.modifiers[wrapModifier], styles$1.tableText) }, props), children));
        return tooltip !== '' ? (React__namespace.createElement(Tooltip, Object.assign({ content: tooltip, isVisible: true }, tooltipProps), text)) : (text);
    };
    TableText.displayName = 'TableText';

    const HeaderCellInfoWrapper = ({ children, info, className, variant = 'tooltip', popoverProps, tooltipProps, ariaLabel }) => (React__namespace.createElement("div", { className: css(styles$1.tableColumnHelp, className) },
        typeof children === 'string' ? React__namespace.createElement(TableText, null, children) : children,
        React__namespace.createElement("span", { className: css(styles$1.tableColumnHelpAction) }, variant === 'tooltip' ? (React__namespace.createElement(Tooltip, Object.assign({ content: info }, tooltipProps),
            React__namespace.createElement(Button, { variant: "plain", "aria-label": ariaLabel || (typeof info === 'string' && info) || 'More info' },
                React__namespace.createElement(HelpIcon$1, { noVerticalAlign: true })))) : (React__namespace.createElement(Popover, Object.assign({ bodyContent: info }, popoverProps),
            React__namespace.createElement(Button, { variant: "plain", "aria-label": ariaLabel || (typeof info === 'string' && info) || 'More info' },
                React__namespace.createElement(HelpIcon$1, { noVerticalAlign: true })))))));
    HeaderCellInfoWrapper.displayName = 'HeaderCellInfoWrapper';

    const info = ({ tooltip, tooltipProps, popover, popoverProps, className, ariaLabel }) => {
        const infoObj = (value) => ({
            className: styles$1.modifiers.help,
            children: tooltip ? (React__namespace.createElement(HeaderCellInfoWrapper, { variant: "tooltip", info: tooltip, tooltipProps: tooltipProps, ariaLabel: ariaLabel, className: className }, value)) : (React__namespace.createElement(HeaderCellInfoWrapper, { variant: "popover", info: popover, popoverProps: popoverProps, ariaLabel: ariaLabel, className: className }, value))
        });
        return infoObj;
    };

    const LongArrowAltUpIconConfig = {
      name: 'LongArrowAltUpIcon',
      height: 512,
      width: 256,
      svgPath: 'M88 166.059V468c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12V166.059h46.059c21.382 0 32.09-25.851 16.971-40.971l-86.059-86.059c-9.373-9.373-24.569-9.373-33.941 0l-86.059 86.059c-15.119 15.119-4.411 40.971 16.971 40.971H88z',
      yOffset: 0,
      xOffset: 0,
    };

    const LongArrowAltUpIcon = createIcon(LongArrowAltUpIconConfig);

    var LongArrowAltUpIcon$1 = LongArrowAltUpIcon;

    const LongArrowAltDownIconConfig = {
      name: 'LongArrowAltDownIcon',
      height: 512,
      width: 256,
      svgPath: 'M168 345.941V44c0-6.627-5.373-12-12-12h-56c-6.627 0-12 5.373-12 12v301.941H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.569 9.373 33.941 0l86.059-86.059c15.119-15.119 4.411-40.971-16.971-40.971H168z',
      yOffset: 0,
      xOffset: 0,
    };

    const LongArrowAltDownIcon = createIcon(LongArrowAltDownIconConfig);

    var LongArrowAltDownIcon$1 = LongArrowAltDownIcon;

    const ArrowsAltVIconConfig = {
      name: 'ArrowsAltVIcon',
      height: 512,
      width: 256,
      svgPath: 'M214.059 377.941H168V134.059h46.059c21.382 0 32.09-25.851 16.971-40.971L144.971 7.029c-9.373-9.373-24.568-9.373-33.941 0L24.971 93.088c-15.119 15.119-4.411 40.971 16.971 40.971H88v243.882H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.568 9.373 33.941 0l86.059-86.059c15.12-15.119 4.412-40.971-16.97-40.971z',
      yOffset: 0,
      xOffset: 0,
    };

    const ArrowsAltVIcon = createIcon(ArrowsAltVIconConfig);

    var ArrowsAltVIcon$1 = ArrowsAltVIcon;

    exports.SortByDirection = void 0;
    (function (SortByDirection) {
        SortByDirection["asc"] = "asc";
        SortByDirection["desc"] = "desc";
    })(exports.SortByDirection || (exports.SortByDirection = {}));
    const SortColumn = (_a) => {
        var { children = null, className = '', isSortedBy = false, onSort = null, sortDirection = '', type = 'button' } = _a, props = __rest$2(_a, ["children", "className", "isSortedBy", "onSort", "sortDirection", "type"]);
        let SortedByIcon;
        if (isSortedBy) {
            SortedByIcon = sortDirection === exports.SortByDirection.asc ? LongArrowAltUpIcon$1 : LongArrowAltDownIcon$1;
        }
        else {
            SortedByIcon = ArrowsAltVIcon$1;
        }
        return (React__namespace.createElement("button", Object.assign({}, props, { type: type, className: css(className, styles$1.tableButton), onClick: event => onSort && onSort(event) }),
            React__namespace.createElement("div", { className: css(className, styles$1.tableButtonContent) },
                React__namespace.createElement(TableText, null, children),
                React__namespace.createElement("span", { className: css(styles$1.tableSortIndicator) },
                    React__namespace.createElement(SortedByIcon, null)))));
    };
    SortColumn.displayName = 'SortColumn';

    const sortableFavorites = (sort) => () => sortable(React__namespace.createElement(StarIcon$1, { "aria-hidden": true }), {
        columnIndex: sort.columnIndex,
        className: styles$1.modifiers.favorite,
        ariaLabel: 'Sort favorites',
        column: {
            extraParams: {
                sortBy: sort.sortBy,
                onSort: sort === null || sort === void 0 ? void 0 : sort.onSort
            }
        }
    });
    const sortable = (label, { columnIndex, column, property, className, ariaLabel }) => {
        const { extraParams: { sortBy, onSort } } = column;
        const extraData = {
            columnIndex,
            column,
            property
        };
        const isSortedBy = sortBy && columnIndex === sortBy.index;
        /**
         * @param {React.MouseEvent} event - React mouse event
         */
        function sortClicked(event) {
            let reversedDirection;
            if (!isSortedBy) {
                reversedDirection = sortBy.defaultDirection ? sortBy.defaultDirection : exports.SortByDirection.asc;
            }
            else {
                reversedDirection = sortBy.direction === exports.SortByDirection.asc ? exports.SortByDirection.desc : exports.SortByDirection.asc;
            }
            // tslint:disable-next-line:no-unused-expression
            onSort && onSort(event, columnIndex, reversedDirection, extraData);
        }
        return {
            className: css(styles$1.tableSort, isSortedBy && styles$1.modifiers.selected, className),
            'aria-sort': isSortedBy ? `${sortBy.direction}ending` : 'none',
            children: (React__namespace.createElement(SortColumn, { isSortedBy: isSortedBy, sortDirection: isSortedBy ? sortBy.direction : '', onSort: sortClicked, "aria-label": ariaLabel }, label))
        };
    };

    exports.RowSelectVariant = void 0;
    (function (RowSelectVariant) {
        RowSelectVariant["radio"] = "radio";
        RowSelectVariant["checkbox"] = "checkbox";
    })(exports.RowSelectVariant || (exports.RowSelectVariant = {}));
    const SelectColumn = (_a) => {
        var { children = null, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        className, onSelect = null, selectVariant } = _a, props = __rest$2(_a, ["children", "className", "onSelect", "selectVariant"]);
        return (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement("label", null,
                React__namespace.createElement("input", Object.assign({}, props, { type: selectVariant, onChange: onSelect }))),
            children));
    };
    SelectColumn.displayName = 'SelectColumn';

    const selectable = (label, { rowIndex, columnIndex, rowData, column, property }) => {
        const { extraParams: { onSelect, selectVariant, allRowsSelected, isHeaderSelectDisabled } } = column;
        const extraData = {
            rowIndex,
            columnIndex,
            column,
            property
        };
        if (rowData && rowData.hasOwnProperty('parent') && !rowData.showSelect && !rowData.fullWidth) {
            return {
                component: 'td',
                isVisible: true
            };
        }
        const rowId = rowIndex !== undefined ? rowIndex : -1;
        /**
         * @param {React.FormEvent} event - React form event
         */
        function selectClick(event) {
            const selected = rowIndex === undefined ? event.currentTarget.checked : rowData && !rowData.selected;
            // tslint:disable-next-line:no-unused-expression
            onSelect && onSelect(event, selected, rowId, rowData, extraData);
        }
        const customProps = Object.assign(Object.assign(Object.assign({}, (rowId !== -1
            ? {
                checked: rowData && !!rowData.selected,
                'aria-label': `Select row ${rowIndex}`
            }
            : {
                checked: allRowsSelected,
                'aria-label': 'Select all rows'
            })), (rowData &&
            (rowData.disableCheckbox || rowData.disableSelection) && {
            disabled: true,
            className: checkStyles.checkInput
        })), (!rowData && isHeaderSelectDisabled && { disabled: true }));
        let selectName = 'check-all';
        if (rowId !== -1 && selectVariant === exports.RowSelectVariant.checkbox) {
            selectName = `checkrow${rowIndex}`;
        }
        else if (rowId !== -1) {
            selectName = 'radioGroup';
        }
        return {
            className: css(styles$1.tableCheck),
            component: 'td',
            isVisible: !rowData || !rowData.fullWidth,
            children: (React__namespace.createElement(SelectColumn, Object.assign({}, customProps, { selectVariant: selectVariant, onSelect: selectClick, name: selectName }), label))
        };
    };

    const CollapseColumn = (_a) => {
        var { className = '', children = null, isOpen, onToggle } = _a, props = __rest$2(_a, ["className", "children", "isOpen", "onToggle"]);
        return (React__namespace.createElement(React__namespace.Fragment, null,
            isOpen !== undefined && (React__namespace.createElement(Button, Object.assign({ className: css(className, isOpen && styles$1.modifiers.expanded) }, props, { variant: "plain", "aria-label": props['aria-label'] || 'Details', onClick: onToggle, "aria-expanded": isOpen }),
                React__namespace.createElement("div", { className: css(styles$1.tableToggleIcon) },
                    React__namespace.createElement(AngleDownIcon$1, null)))),
            children));
    };
    CollapseColumn.displayName = 'CollapseColumn';

    const ExpandableRowContent = (_a) => {
        var { children = null } = _a, props = __rest$2(_a, ["children"]);
        return (React__namespace.createElement("div", Object.assign({}, props, { className: css(styles$1.tableExpandableRowContent) }), children));
    };
    ExpandableRowContent.displayName = 'ExpandableRowContent';

    const collapsible = (value, { rowIndex, columnIndex, rowData, column, property }) => {
        const { extraParams: { onCollapse, rowLabeledBy = 'simple-node', expandId = 'expand-toggle', allRowsExpanded, collapseAllAriaLabel } } = column;
        const extraData = {
            rowIndex,
            columnIndex,
            column,
            property
        };
        const rowId = rowIndex !== undefined ? rowIndex : -1;
        const customProps = Object.assign({}, (rowId !== -1
            ? {
                isOpen: rowData === null || rowData === void 0 ? void 0 : rowData.isOpen,
                'aria-labelledby': `${rowLabeledBy}${rowId} ${expandId}${rowId}`
            }
            : {
                isOpen: allRowsExpanded,
                'aria-label': collapseAllAriaLabel || 'Expand all rows'
            }));
        /**
         * @param {React.MouseEvent} event - Mouse event
         */
        function onToggle(event) {
            const open = rowData ? !rowData.isOpen : !allRowsExpanded;
            // tslint:disable-next-line:no-unused-expression
            onCollapse && onCollapse(event, rowIndex, open, rowData, extraData);
        }
        return {
            className: ((rowData === null || rowData === void 0 ? void 0 : rowData.isOpen) !== undefined || rowId === -1) && css(styles$1.tableToggle),
            isVisible: !(rowData === null || rowData === void 0 ? void 0 : rowData.fullWidth),
            children: (React__namespace.createElement(CollapseColumn, Object.assign({ "aria-labelledby": `${rowLabeledBy}${rowId} ${expandId}${rowId}`, onToggle: onToggle, id: expandId + rowId }, customProps), value))
        };
    };
    const expandable = (value, { rowData }) => rowData && rowData.hasOwnProperty('parent') ? React__namespace.createElement(ExpandableRowContent, null, value) : value;
    const expandedRow = (colSpan) => {
        const expandedRowFormatter = (value, { columnIndex, rowIndex, rowData, column: { extraParams: { contentId = 'expanded-content' } } }) => value &&
            rowData.hasOwnProperty('parent') && {
            // todo: rewrite this logic, it is not type safe
            colSpan: !rowData.cells || rowData.cells.length === 1 ? colSpan + !!rowData.fullWidth : 1,
            id: contentId + rowIndex + (columnIndex ? '-' + columnIndex : ''),
            className: rowData.noPadding && css(styles$1.modifiers.noPadding)
        };
        return expandedRowFormatter;
    };

    const cellWidth = (width) => () => ({
        className: css(styles$1.modifiers[typeof width === 'number' ? `width_${width}` : `width${capitalize(width)}`])
    });

    const visibilityModifiers = [
        'hidden',
        'hiddenOnSm',
        'hiddenOnMd',
        'hiddenOnLg',
        'hiddenOnXl',
        'hiddenOn_2xl',
        'visibleOnSm',
        'visibleOnMd',
        'visibleOnLg',
        'visibleOnXl',
        'visibleOn_2xl'
    ];
    const Visibility = visibilityModifiers
        .filter(key => styles$1.modifiers[key])
        .reduce((acc, curr) => {
        const key2 = curr.replace('_2xl', '2Xl');
        acc[key2] = styles$1.modifiers[curr];
        return acc;
    }, {});
    const classNames = (...classes) => () => ({
        className: css(...classes)
    });

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */

    function listCacheClear$1() {
      this.__data__ = [];
      this.size = 0;
    }

    var _listCacheClear = listCacheClear$1;

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */

    function eq$5(value, other) {
      return value === other || (value !== value && other !== other);
    }

    var eq_1 = eq$5;

    var eq$4 = eq_1;

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf$4(array, key) {
      var length = array.length;
      while (length--) {
        if (eq$4(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    var _assocIndexOf = assocIndexOf$4;

    var assocIndexOf$3 = _assocIndexOf;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete$1(key) {
      var data = this.__data__,
          index = assocIndexOf$3(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    var _listCacheDelete = listCacheDelete$1;

    var assocIndexOf$2 = _assocIndexOf;

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet$1(key) {
      var data = this.__data__,
          index = assocIndexOf$2(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    var _listCacheGet = listCacheGet$1;

    var assocIndexOf$1 = _assocIndexOf;

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas$1(key) {
      return assocIndexOf$1(this.__data__, key) > -1;
    }

    var _listCacheHas = listCacheHas$1;

    var assocIndexOf = _assocIndexOf;

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet$1(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    var _listCacheSet = listCacheSet$1;

    var listCacheClear = _listCacheClear,
        listCacheDelete = _listCacheDelete,
        listCacheGet = _listCacheGet,
        listCacheHas = _listCacheHas,
        listCacheSet = _listCacheSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache$4(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache$4.prototype.clear = listCacheClear;
    ListCache$4.prototype['delete'] = listCacheDelete;
    ListCache$4.prototype.get = listCacheGet;
    ListCache$4.prototype.has = listCacheHas;
    ListCache$4.prototype.set = listCacheSet;

    var _ListCache = ListCache$4;

    var ListCache$3 = _ListCache;

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear$1() {
      this.__data__ = new ListCache$3;
      this.size = 0;
    }

    var _stackClear = stackClear$1;

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */

    function stackDelete$1(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    var _stackDelete = stackDelete$1;

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */

    function stackGet$1(key) {
      return this.__data__.get(key);
    }

    var _stackGet = stackGet$1;

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */

    function stackHas$1(key) {
      return this.__data__.has(key);
    }

    var _stackHas = stackHas$1;

    /** Detect free variable `global` from Node.js. */

    var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal$1;

    var freeGlobal = _freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root$8 = freeGlobal || freeSelf || Function('return this')();

    var _root = root$8;

    var root$7 = _root;

    /** Built-in value references. */
    var Symbol$3 = root$7.Symbol;

    var _Symbol = Symbol$3;

    var Symbol$2 = _Symbol;

    /** Used for built-in method references. */
    var objectProto$e = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$b = objectProto$e.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$e.toString;

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag$1(value) {
      var isOwn = hasOwnProperty$b.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    var _getRawTag = getRawTag$1;

    /** Used for built-in method references. */

    var objectProto$d = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto$d.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString$1(value) {
      return nativeObjectToString.call(value);
    }

    var _objectToString = objectToString$1;

    var Symbol$1 = _Symbol,
        getRawTag = _getRawTag,
        objectToString = _objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag$5(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    var _baseGetTag = baseGetTag$5;

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */

    function isObject$7(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject$7;

    var baseGetTag$4 = _baseGetTag,
        isObject$6 = isObject_1;

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag$1 = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction$3(value) {
      if (!isObject$6(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag$4(value);
      return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    var isFunction_1 = isFunction$3;

    var root$6 = _root;

    /** Used to detect overreaching core-js shims. */
    var coreJsData$1 = root$6['__core-js_shared__'];

    var _coreJsData = coreJsData$1;

    var coreJsData = _coreJsData;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked$1(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    var _isMasked = isMasked$1;

    /** Used for built-in method references. */

    var funcProto$2 = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$2 = funcProto$2.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource$2(func) {
      if (func != null) {
        try {
          return funcToString$2.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    var _toSource = toSource$2;

    var isFunction$2 = isFunction_1,
        isMasked = _isMasked,
        isObject$5 = isObject_1,
        toSource$1 = _toSource;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype,
        objectProto$c = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$a = objectProto$c.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString$1.call(hasOwnProperty$a).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative$1(value) {
      if (!isObject$5(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction$2(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource$1(value));
    }

    var _baseIsNative = baseIsNative$1;

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */

    function getValue$1(object, key) {
      return object == null ? undefined : object[key];
    }

    var _getValue = getValue$1;

    var baseIsNative = _baseIsNative,
        getValue = _getValue;

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative$7(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    var _getNative = getNative$7;

    var getNative$6 = _getNative,
        root$5 = _root;

    /* Built-in method references that are verified to be native. */
    var Map$4 = getNative$6(root$5, 'Map');

    var _Map = Map$4;

    var getNative$5 = _getNative;

    /* Built-in method references that are verified to be native. */
    var nativeCreate$4 = getNative$5(Object, 'create');

    var _nativeCreate = nativeCreate$4;

    var nativeCreate$3 = _nativeCreate;

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear$1() {
      this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
      this.size = 0;
    }

    var _hashClear = hashClear$1;

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */

    function hashDelete$1(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    var _hashDelete = hashDelete$1;

    var nativeCreate$2 = _nativeCreate;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$b = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet$1(key) {
      var data = this.__data__;
      if (nativeCreate$2) {
        var result = data[key];
        return result === HASH_UNDEFINED$2 ? undefined : result;
      }
      return hasOwnProperty$9.call(data, key) ? data[key] : undefined;
    }

    var _hashGet = hashGet$1;

    var nativeCreate$1 = _nativeCreate;

    /** Used for built-in method references. */
    var objectProto$a = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas$1(key) {
      var data = this.__data__;
      return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty$8.call(data, key);
    }

    var _hashHas = hashHas$1;

    var nativeCreate = _nativeCreate;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet$1(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
      return this;
    }

    var _hashSet = hashSet$1;

    var hashClear = _hashClear,
        hashDelete = _hashDelete,
        hashGet = _hashGet,
        hashHas = _hashHas,
        hashSet = _hashSet;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash$1(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash$1.prototype.clear = hashClear;
    Hash$1.prototype['delete'] = hashDelete;
    Hash$1.prototype.get = hashGet;
    Hash$1.prototype.has = hashHas;
    Hash$1.prototype.set = hashSet;

    var _Hash = Hash$1;

    var Hash = _Hash,
        ListCache$2 = _ListCache,
        Map$3 = _Map;

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear$1() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map$3 || ListCache$2),
        'string': new Hash
      };
    }

    var _mapCacheClear = mapCacheClear$1;

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */

    function isKeyable$1(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    var _isKeyable = isKeyable$1;

    var isKeyable = _isKeyable;

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData$4(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    var _getMapData = getMapData$4;

    var getMapData$3 = _getMapData;

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete$1(key) {
      var result = getMapData$3(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    var _mapCacheDelete = mapCacheDelete$1;

    var getMapData$2 = _getMapData;

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet$1(key) {
      return getMapData$2(this, key).get(key);
    }

    var _mapCacheGet = mapCacheGet$1;

    var getMapData$1 = _getMapData;

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas$1(key) {
      return getMapData$1(this, key).has(key);
    }

    var _mapCacheHas = mapCacheHas$1;

    var getMapData = _getMapData;

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet$1(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    var _mapCacheSet = mapCacheSet$1;

    var mapCacheClear = _mapCacheClear,
        mapCacheDelete = _mapCacheDelete,
        mapCacheGet = _mapCacheGet,
        mapCacheHas = _mapCacheHas,
        mapCacheSet = _mapCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache$2(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache$2.prototype.clear = mapCacheClear;
    MapCache$2.prototype['delete'] = mapCacheDelete;
    MapCache$2.prototype.get = mapCacheGet;
    MapCache$2.prototype.has = mapCacheHas;
    MapCache$2.prototype.set = mapCacheSet;

    var _MapCache = MapCache$2;

    var ListCache$1 = _ListCache,
        Map$2 = _Map,
        MapCache$1 = _MapCache;

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet$1(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache$1) {
        var pairs = data.__data__;
        if (!Map$2 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache$1(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    var _stackSet = stackSet$1;

    var ListCache = _ListCache,
        stackClear = _stackClear,
        stackDelete = _stackDelete,
        stackGet = _stackGet,
        stackHas = _stackHas,
        stackSet = _stackSet;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack$2(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    // Add methods to `Stack`.
    Stack$2.prototype.clear = stackClear;
    Stack$2.prototype['delete'] = stackDelete;
    Stack$2.prototype.get = stackGet;
    Stack$2.prototype.has = stackHas;
    Stack$2.prototype.set = stackSet;

    var _Stack = Stack$2;

    var getNative$4 = _getNative;

    var defineProperty$2 = (function() {
      try {
        var func = getNative$4(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    var _defineProperty = defineProperty$2;

    var defineProperty$1 = _defineProperty;

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue$3(object, key, value) {
      if (key == '__proto__' && defineProperty$1) {
        defineProperty$1(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    var _baseAssignValue = baseAssignValue$3;

    var baseAssignValue$2 = _baseAssignValue,
        eq$3 = eq_1;

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue$2(object, key, value) {
      if ((value !== undefined && !eq$3(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue$2(object, key, value);
      }
    }

    var _assignMergeValue = assignMergeValue$2;

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */

    function createBaseFor$1(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    var _createBaseFor = createBaseFor$1;

    var createBaseFor = _createBaseFor;

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor$1 = createBaseFor();

    var _baseFor = baseFor$1;

    var _cloneBuffer = {exports: {}};

    (function (module, exports) {
    var root = _root;

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    module.exports = cloneBuffer;
    }(_cloneBuffer, _cloneBuffer.exports));

    var root$4 = _root;

    /** Built-in value references. */
    var Uint8Array$2 = root$4.Uint8Array;

    var _Uint8Array = Uint8Array$2;

    var Uint8Array$1 = _Uint8Array;

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer$1(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
      return result;
    }

    var _cloneArrayBuffer = cloneArrayBuffer$1;

    var cloneArrayBuffer = _cloneArrayBuffer;

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray$1(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    var _cloneTypedArray = cloneTypedArray$1;

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */

    function copyArray$1(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    var _copyArray = copyArray$1;

    var isObject$4 = isObject_1;

    /** Built-in value references. */
    var objectCreate = Object.create;

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate$1 = (function() {
      function object() {}
      return function(proto) {
        if (!isObject$4(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    var _baseCreate = baseCreate$1;

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */

    function overArg$2(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    var _overArg = overArg$2;

    var overArg$1 = _overArg;

    /** Built-in value references. */
    var getPrototype$2 = overArg$1(Object.getPrototypeOf, Object);

    var _getPrototype = getPrototype$2;

    /** Used for built-in method references. */

    var objectProto$9 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype$3(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

      return value === proto;
    }

    var _isPrototype = isPrototype$3;

    var baseCreate = _baseCreate,
        getPrototype$1 = _getPrototype,
        isPrototype$2 = _isPrototype;

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject$1(object) {
      return (typeof object.constructor == 'function' && !isPrototype$2(object))
        ? baseCreate(getPrototype$1(object))
        : {};
    }

    var _initCloneObject = initCloneObject$1;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */

    function isObjectLike$6(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike$6;

    var baseGetTag$3 = _baseGetTag,
        isObjectLike$5 = isObjectLike_1;

    /** `Object#toString` result references. */
    var argsTag$2 = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments$1(value) {
      return isObjectLike$5(value) && baseGetTag$3(value) == argsTag$2;
    }

    var _baseIsArguments = baseIsArguments$1;

    var baseIsArguments = _baseIsArguments,
        isObjectLike$4 = isObjectLike_1;

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable$1 = objectProto$8.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments$2 = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike$4(value) && hasOwnProperty$7.call(value, 'callee') &&
        !propertyIsEnumerable$1.call(value, 'callee');
    };

    var isArguments_1 = isArguments$2;

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */

    var isArray$4 = Array.isArray;

    var isArray_1 = isArray$4;

    /** Used as references for various `Number` constants. */

    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength$2(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
    }

    var isLength_1 = isLength$2;

    var isFunction$1 = isFunction_1,
        isLength$1 = isLength_1;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike$4(value) {
      return value != null && isLength$1(value.length) && !isFunction$1(value);
    }

    var isArrayLike_1 = isArrayLike$4;

    var isArrayLike$3 = isArrayLike_1,
        isObjectLike$3 = isObjectLike_1;

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject$1(value) {
      return isObjectLike$3(value) && isArrayLike$3(value);
    }

    var isArrayLikeObject_1 = isArrayLikeObject$1;

    var isBuffer$3 = {exports: {}};

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */

    function stubFalse() {
      return false;
    }

    var stubFalse_1 = stubFalse;

    (function (module, exports) {
    var root = _root,
        stubFalse = stubFalse_1;

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    module.exports = isBuffer;
    }(isBuffer$3, isBuffer$3.exports));

    var baseGetTag$2 = _baseGetTag,
        getPrototype = _getPrototype,
        isObjectLike$2 = isObjectLike_1;

    /** `Object#toString` result references. */
    var objectTag$3 = '[object Object]';

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto$7 = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject$1(value) {
      if (!isObjectLike$2(value) || baseGetTag$2(value) != objectTag$3) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty$6.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    var isPlainObject_1 = isPlainObject$1;

    var baseGetTag$1 = _baseGetTag,
        isLength = isLength_1,
        isObjectLike$1 = isObjectLike_1;

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]',
        arrayTag$1 = '[object Array]',
        boolTag$1 = '[object Boolean]',
        dateTag$1 = '[object Date]',
        errorTag$1 = '[object Error]',
        funcTag = '[object Function]',
        mapTag$2 = '[object Map]',
        numberTag$1 = '[object Number]',
        objectTag$2 = '[object Object]',
        regexpTag$1 = '[object RegExp]',
        setTag$2 = '[object Set]',
        stringTag$1 = '[object String]',
        weakMapTag$1 = '[object WeakMap]';

    var arrayBufferTag$1 = '[object ArrayBuffer]',
        dataViewTag$2 = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
    typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
    typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] =
    typedArrayTags[errorTag$1] = typedArrayTags[funcTag] =
    typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] =
    typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$1] =
    typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] =
    typedArrayTags[weakMapTag$1] = false;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray$1(value) {
      return isObjectLike$1(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag$1(value)];
    }

    var _baseIsTypedArray = baseIsTypedArray$1;

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */

    function baseUnary$1(func) {
      return function(value) {
        return func(value);
      };
    }

    var _baseUnary = baseUnary$1;

    var _nodeUtil = {exports: {}};

    (function (module, exports) {
    var freeGlobal = _freeGlobal;

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    module.exports = nodeUtil;
    }(_nodeUtil, _nodeUtil.exports));

    var baseIsTypedArray = _baseIsTypedArray,
        baseUnary = _baseUnary,
        nodeUtil = _nodeUtil.exports;

    /* Node.js helper references. */
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray$3 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    var isTypedArray_1 = isTypedArray$3;

    /**
     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */

    function safeGet$2(object, key) {
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }

      if (key == '__proto__') {
        return;
      }

      return object[key];
    }

    var _safeGet = safeGet$2;

    var baseAssignValue$1 = _baseAssignValue,
        eq$2 = eq_1;

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue$1(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty$5.call(object, key) && eq$2(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue$1(object, key, value);
      }
    }

    var _assignValue = assignValue$1;

    var assignValue = _assignValue,
        baseAssignValue = _baseAssignValue;

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject$1(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    var _copyObject = copyObject$1;

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */

    function baseTimes$1(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    var _baseTimes = baseTimes$1;

    /** Used as references for various `Number` constants. */

    var MAX_SAFE_INTEGER = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex$2(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    var _isIndex = isIndex$2;

    var baseTimes = _baseTimes,
        isArguments$1 = isArguments_1,
        isArray$3 = isArray_1,
        isBuffer$2 = isBuffer$3.exports,
        isIndex$1 = _isIndex,
        isTypedArray$2 = isTypedArray_1;

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys$2(value, inherited) {
      var isArr = isArray$3(value),
          isArg = !isArr && isArguments$1(value),
          isBuff = !isArr && !isArg && isBuffer$2(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray$2(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty$4.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex$1(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    var _arrayLikeKeys = arrayLikeKeys$2;

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */

    function nativeKeysIn$1(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    var _nativeKeysIn = nativeKeysIn$1;

    var isObject$3 = isObject_1,
        isPrototype$1 = _isPrototype,
        nativeKeysIn = _nativeKeysIn;

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn$1(object) {
      if (!isObject$3(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype$1(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty$3.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeysIn = baseKeysIn$1;

    var arrayLikeKeys$1 = _arrayLikeKeys,
        baseKeysIn = _baseKeysIn,
        isArrayLike$2 = isArrayLike_1;

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn$2(object) {
      return isArrayLike$2(object) ? arrayLikeKeys$1(object, true) : baseKeysIn(object);
    }

    var keysIn_1 = keysIn$2;

    var copyObject = _copyObject,
        keysIn$1 = keysIn_1;

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject$1(value) {
      return copyObject(value, keysIn$1(value));
    }

    var toPlainObject_1 = toPlainObject$1;

    var assignMergeValue$1 = _assignMergeValue,
        cloneBuffer = _cloneBuffer.exports,
        cloneTypedArray = _cloneTypedArray,
        copyArray = _copyArray,
        initCloneObject = _initCloneObject,
        isArguments = isArguments_1,
        isArray$2 = isArray_1,
        isArrayLikeObject = isArrayLikeObject_1,
        isBuffer$1 = isBuffer$3.exports,
        isFunction = isFunction_1,
        isObject$2 = isObject_1,
        isPlainObject = isPlainObject_1,
        isTypedArray$1 = isTypedArray_1,
        safeGet$1 = _safeGet,
        toPlainObject = toPlainObject_1;

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep$1(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet$1(object, key),
          srcValue = safeGet$1(source, key),
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue$1(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr = isArray$2(srcValue),
            isBuff = !isArr && isBuffer$1(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray$1(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray$2(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject$2(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue$1(object, key, newValue);
    }

    var _baseMergeDeep = baseMergeDeep$1;

    var Stack$1 = _Stack,
        assignMergeValue = _assignMergeValue,
        baseFor = _baseFor,
        baseMergeDeep = _baseMergeDeep,
        isObject$1 = isObject_1,
        keysIn = keysIn_1,
        safeGet = _safeGet;

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge$1(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack$1);
        if (isObject$1(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge$1, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    var _baseMerge = baseMerge$1;

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */

    function identity$2(value) {
      return value;
    }

    var identity_1 = identity$2;

    /**
     * A faster alternative to `Function#apply`, this function invokes `func`
     * with the `this` binding of `thisArg` and the arguments of `args`.
     *
     * @private
     * @param {Function} func The function to invoke.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} args The arguments to invoke `func` with.
     * @returns {*} Returns the result of `func`.
     */

    function apply$1(func, thisArg, args) {
      switch (args.length) {
        case 0: return func.call(thisArg);
        case 1: return func.call(thisArg, args[0]);
        case 2: return func.call(thisArg, args[0], args[1]);
        case 3: return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }

    var _apply = apply$1;

    var apply = _apply;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max;

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest$1(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    var _overRest = overRest$1;

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */

    function constant$1(value) {
      return function() {
        return value;
      };
    }

    var constant_1 = constant$1;

    var constant = constant_1,
        defineProperty = _defineProperty,
        identity$1 = identity_1;

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString$1 = !defineProperty ? identity$1 : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    var _baseSetToString = baseSetToString$1;

    /** Used to detect hot functions by number of calls within a span of milliseconds. */

    var HOT_COUNT = 800,
        HOT_SPAN = 16;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeNow = Date.now;

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut$1(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    var _shortOut = shortOut$1;

    var baseSetToString = _baseSetToString,
        shortOut = _shortOut;

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString$1 = shortOut(baseSetToString);

    var _setToString = setToString$1;

    var identity = identity_1,
        overRest = _overRest,
        setToString = _setToString;

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest$1(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    var _baseRest = baseRest$1;

    var eq$1 = eq_1,
        isArrayLike$1 = isArrayLike_1,
        isIndex = _isIndex,
        isObject = isObject_1;

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall$1(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike$1(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq$1(object[index], value);
      }
      return false;
    }

    var _isIterateeCall = isIterateeCall$1;

    var baseRest = _baseRest,
        isIterateeCall = _isIterateeCall;

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner$1(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    var _createAssigner = createAssigner$1;

    var baseMerge = _baseMerge,
        createAssigner = _createAssigner;

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    var mergeWith_1 = mergeWith;

    var mergeWith$1 = mergeWith_1;

    /**
     * merge-props.js
     *
     * Forked from reactabular-table version 8.14.0
     * https://github.com/reactabular/reactabular/tree/v8.14.0/packages/reactabular-table/src
     */
    /**
     * @param {any} props - Props
     */
    function mergeProps(...props) {
        const firstProps = props[0];
        const restProps = props.slice(1);
        if (!restProps.length) {
            return mergeWith$1({}, firstProps);
        }
        // Avoid mutating the first prop collection
        return mergeWith$1(mergeWith$1({}, firstProps), ...restProps, (a, b, key) => {
            if (key === 'children') {
                if (a && b) {
                    // compose the two
                    return React__namespace.cloneElement(a, {
                        children: b
                    });
                }
                // Children have to be merged in reverse order for Reactabular
                // logic to work.
                return Object.assign(Object.assign({}, b), a);
            }
            if (key === 'className') {
                // Process class names through classNames to merge properly
                // as a string.
                return css(a, b);
            }
            return undefined;
        });
    }

    const ThBase = (_a) => {
        var { children, className, component = 'th', dataLabel, scope = 'col', textCenter = false, sort = null, modifier, select = null, expand: collapse = null, tooltip = '', onMouseEnter: onMouseEnterProp = () => { }, width, visibility, innerRef, info: infoProps, isStickyColumn = false, hasRightBorder = false, stickyMinWidth = '120px', stickyLeftOffset, isSubheader = false } = _a, props = __rest$2(_a, ["children", "className", "component", "dataLabel", "scope", "textCenter", "sort", "modifier", "select", "expand", "tooltip", "onMouseEnter", "width", "visibility", "innerRef", "info", "isStickyColumn", "hasRightBorder", "stickyMinWidth", "stickyLeftOffset", "isSubheader"]);
        const [showTooltip, setShowTooltip] = React__namespace.useState(false);
        const onMouseEnter = (event) => {
            if (event.target.offsetWidth < event.target.scrollWidth) {
                !showTooltip && setShowTooltip(true);
            }
            else {
                showTooltip && setShowTooltip(false);
            }
            onMouseEnterProp(event);
        };
        let sortParams = null;
        if (sort) {
            if (sort.isFavorites) {
                sortParams = sortableFavorites({
                    onSort: sort === null || sort === void 0 ? void 0 : sort.onSort,
                    columnIndex: sort.columnIndex,
                    sortBy: sort.sortBy
                })();
            }
            else {
                sortParams = sortable(children, {
                    columnIndex: sort.columnIndex,
                    column: {
                        extraParams: {
                            sortBy: sort.sortBy,
                            onSort: sort === null || sort === void 0 ? void 0 : sort.onSort
                        }
                    }
                });
            }
        }
        const selectParams = select
            ? selectable(children, {
                column: {
                    extraParams: {
                        onSelect: select === null || select === void 0 ? void 0 : select.onSelect,
                        selectVariant: 'checkbox',
                        allRowsSelected: select.isSelected,
                        isHeaderSelectDisabled: !!select.isHeaderSelectDisabled
                    }
                }
            })
            : null;
        const collapseParams = collapse
            ? collapsible(children, {
                column: {
                    extraParams: {
                        onCollapse: collapse === null || collapse === void 0 ? void 0 : collapse.onToggle,
                        allRowsExpanded: !collapse.areAllExpanded,
                        collapseAllAriaLabel: ''
                    }
                }
            })
            : null;
        const widthParams = width ? cellWidth(width)() : null;
        const visibilityParams = visibility
            ? classNames(...visibility.map((vis) => Visibility[vis]))()
            : null;
        let transformedChildren = (sortParams === null || sortParams === void 0 ? void 0 : sortParams.children) || (selectParams === null || selectParams === void 0 ? void 0 : selectParams.children) || (collapseParams === null || collapseParams === void 0 ? void 0 : collapseParams.children) || children;
        // info can wrap other transformedChildren
        let infoParams = null;
        if (infoProps) {
            infoParams = info(infoProps)(transformedChildren);
            transformedChildren = infoParams.children;
        }
        const merged = mergeProps(sortParams, selectParams, collapseParams, widthParams, visibilityParams, infoParams);
        const { 
        // ignore the merged children since we transform them ourselves so we can wrap it with info
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        children: mergedChildren = null, 
        // selectable adds this but we don't want it
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isVisible = null, className: mergedClassName = '', component: MergedComponent = component } = merged, mergedProps = __rest$2(merged, ["children", "isVisible", "className", "component"]);
        const cell = (React__namespace.createElement(MergedComponent, Object.assign({ "data-label": dataLabel, onMouseEnter: tooltip !== null ? onMouseEnter : onMouseEnterProp, scope: component === 'th' && children ? scope : null, ref: innerRef, className: css(className, textCenter && styles$1.modifiers.center, isSubheader && styles$1.tableSubhead, isStickyColumn && styles.tableStickyColumn, hasRightBorder && styles.modifiers.borderRight, modifier && styles$1.modifiers[modifier], mergedClassName) }, mergedProps, props, (isStickyColumn && {
            style: Object.assign({ '--pf-c-table__sticky-column--MinWidth': stickyMinWidth ? stickyMinWidth : undefined, '--pf-c-table__sticky-column--Left': stickyLeftOffset ? stickyLeftOffset : undefined }, props.style)
        })), transformedChildren));
        const canDefault = tooltip === '' ? typeof children === 'string' : true;
        return tooltip !== null && canDefault && showTooltip ? (React__namespace.createElement(Tooltip, { content: tooltip || (tooltip === '' && children), isVisible: true }, cell)) : (cell);
    };
    const Th = React__namespace.forwardRef((props, ref) => (React__namespace.createElement(ThBase, Object.assign({}, props, { innerRef: ref }))));
    Th.displayName = 'Th';

    class ActionsColumn extends React__namespace.Component {
        constructor(props) {
            super(props);
            this.toggleRef = React__namespace.createRef();
            this.onToggle = (isOpen) => {
                this.setState({
                    isOpen
                });
            };
            this.onClick = (event, onClick) => {
                const { rowData, extraData } = this.props;
                // Only prevent default if onClick is provided.  This allows href support.
                if (onClick) {
                    event.preventDefault();
                    // tslint:disable-next-line:no-unused-expression
                    onClick(event, extraData && extraData.rowIndex, rowData, extraData);
                }
            };
            this.state = {
                isOpen: false
            };
        }
        render() {
            const { isOpen } = this.state;
            const { items, children, dropdownPosition, dropdownDirection, isDisabled, rowData, actionsToggle } = this.props;
            const actionsToggleClone = actionsToggle ? (actionsToggle({ onToggle: this.onToggle, isOpen, isDisabled })) : (React__namespace.createElement(KebabToggle, { isDisabled: isDisabled, onToggle: this.onToggle }));
            return (React__namespace.createElement(React__namespace.Fragment, null,
                items
                    .filter(item => item.isOutsideDropdown)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .map((_a, key) => {
                    var { title, itemKey, onClick, isOutsideDropdown } = _a, props = __rest$2(_a, ["title", "itemKey", "onClick", "isOutsideDropdown"]);
                    return typeof title === 'string' ? (React__namespace.createElement(Button, Object.assign({ onClick: event => this.onClick(event, onClick) }, props, { isDisabled: isDisabled, key: itemKey || `outside_dropdown_${key}`, "data-key": itemKey || `outside_dropdown_${key}` }), title)) : (React__namespace.cloneElement(title, Object.assign({ onClick, isDisabled }, props)));
                }),
                React__namespace.createElement(Dropdown, Object.assign({ toggle: actionsToggleClone, position: dropdownPosition, direction: dropdownDirection, isOpen: isOpen, dropdownItems: items
                        .filter(item => !item.isOutsideDropdown)
                        .map((_a, key) => {
                        var { title, itemKey, onClick, isSeparator } = _a, props = __rest$2(_a, ["title", "itemKey", "onClick", "isSeparator"]);
                        return isSeparator ? (React__namespace.createElement(DropdownSeparator, Object.assign({}, props, { key: itemKey || key, "data-key": itemKey || key }))) : (React__namespace.createElement(DropdownItem, Object.assign({ component: "button", onClick: event => {
                                this.onClick(event, onClick);
                                this.onToggle(!isOpen);
                            } }, props, { key: itemKey || key, "data-key": itemKey || key }), title));
                    }), isPlain: true }, (rowData && rowData.actionProps))),
                children));
        }
    }
    ActionsColumn.displayName = 'ActionsColumn';
    ActionsColumn.defaultProps = {
        children: null,
        items: [],
        dropdownPosition: DropdownPosition.right,
        dropdownDirection: DropdownDirection.down,
        rowData: {},
        extraData: {}
    };

    const resolveOrDefault = (resolver, defaultValue, rowData, extraData) => (typeof resolver === 'function' ? resolver(rowData, extraData) : defaultValue);
    const cellActions = (actions, actionResolver, areActionsDisabled) => (label, { rowData, column, rowIndex, columnIndex, column: { extraParams: { dropdownPosition, dropdownDirection, actionsToggle } }, property }) => {
        const extraData = {
            rowIndex,
            columnIndex,
            column,
            property
        };
        const resolvedActions = resolveOrDefault(actionResolver, actions, rowData, extraData);
        const resolvedIsDisabled = resolveOrDefault(areActionsDisabled, rowData && rowData.disableActions, rowData, extraData);
        const renderProps = resolvedActions && resolvedActions.length > 0
            ? {
                children: (React__namespace.createElement(ActionsColumn, { items: resolvedActions, dropdownPosition: dropdownPosition, dropdownDirection: dropdownDirection, isDisabled: resolvedIsDisabled, rowData: rowData, extraData: extraData, actionsToggle: actionsToggle }, label))
            }
            : {};
        return Object.assign({ className: css(styles$1.tableAction), style: { paddingRight: 0 }, isVisible: true }, renderProps);
    };

    const compoundExpand = (value, { rowIndex, columnIndex, rowData, column, property }) => {
        if (!value) {
            return null;
        }
        const { title, props } = value;
        const { extraParams: { onExpand } } = column;
        const extraData = {
            rowIndex,
            columnIndex,
            column,
            property
        };
        /**
         * @param {React.MouseEvent} event - Mouse event
         */
        function onToggle(event) {
            // tslint:disable-next-line:no-unused-expression
            onExpand && onExpand(event, rowIndex, columnIndex, props.isOpen, rowData, extraData);
        }
        return {
            className: css(styles$1.tableCompoundExpansionToggle, props.isOpen && styles$1.modifiers.expanded),
            children: props.isOpen !== undefined && (React__namespace.createElement("button", { type: "button", className: css(styles$1.tableButton), onClick: onToggle, "aria-expanded": props.isOpen, "aria-controls": props.ariaControls },
                React__namespace.createElement(TableText, null, title)))
        };
    };

    const FavoritesCell = (_a) => {
        var { className = '', onFavorite, isFavorited, rowIndex } = _a, props = __rest$2(_a, ["className", "onFavorite", "isFavorited", "rowIndex"]);
        const ariaProps = rowIndex === undefined
            ? {}
            : {
                id: `favorites-button-${rowIndex}`,
                'aria-labelledby': `favorites-button-${rowIndex}`
            };
        return (React__namespace.createElement(Button, Object.assign({ variant: "plain", className: className, type: "button", "aria-label": isFavorited ? 'Starred' : 'Not starred', onClick: onFavorite }, ariaProps, props),
            React__namespace.createElement(StarIcon$1, { "aria-hidden": true })));
    };
    FavoritesCell.displayName = 'FavoritesCell';

    const favoritable = (value, { rowIndex, columnIndex, rowData, column, property }) => {
        const { extraParams: { onFavorite } } = column;
        const extraData = {
            rowIndex,
            columnIndex,
            column,
            property
        };
        // this is a child row which should not display the favorites icon
        if (rowData && rowData.hasOwnProperty('parent') && !rowData.fullWidth) {
            return {
                component: 'td',
                isVisible: true
            };
        }
        /**
         * @param {React.MouseEvent} event - Mouse event
         */
        function favoritesClick(event) {
            // tslint:disable-next-line:no-unused-expression
            onFavorite && onFavorite(event, rowData && !rowData.favorited, rowIndex, rowData, extraData);
        }
        const additionalProps = rowData.favoritesProps || {};
        return {
            className: css(styles$1.tableFavorite, rowData && rowData.favorited && styles$1.modifiers.favorited),
            isVisible: !rowData || !rowData.fullWidth,
            children: (React__namespace.createElement(FavoritesCell, Object.assign({ rowIndex: rowIndex, onFavorite: favoritesClick, isFavorited: rowData && rowData.favorited }, additionalProps)))
        };
    };

    const DraggableCell = (_a) => {
        var { className, onClick, 'aria-label': ariaLabel, id } = _a, props = __rest$2(_a, ["className", "onClick", 'aria-label', "id"]);
        return (React__namespace.createElement(Button, Object.assign({ id: id, variant: "plain", className: className, type: "button", "aria-label": ariaLabel || `Draggable row draggable button`, onClick: onClick }, props),
            React__namespace.createElement(GripVerticalIcon$1, { "aria-hidden": true })));
    };
    DraggableCell.displayName = 'DraggableCell';

    const draggable = (value, { rowData }) => {
        const { id } = rowData;
        return {
            className: '',
            children: React__namespace.createElement(DraggableCell, { id: id })
        };
    };

    const EllipsisHIconConfig = {
      name: 'EllipsisHIcon',
      height: 512,
      width: 512,
      svgPath: 'M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z',
      yOffset: 0,
      xOffset: 0,
    };

    const EllipsisHIcon = createIcon(EllipsisHIconConfig);

    var EllipsisHIcon$1 = EllipsisHIcon;

    const treeRow = (onCollapse, onCheckChange, onToggleRowDetails) => (value, { rowIndex, rowData }) => {
        const { isExpanded, isDetailsExpanded, 'aria-level': level, 'aria-setsize': setsize, toggleAriaLabel, checkAriaLabel, showDetailsAriaLabel, isChecked, checkboxId, icon } = rowData.props;
        const content = value.title || value;
        const text = (React__namespace.createElement("div", { className: css(stylesTreeView.tableTreeViewText), key: "tree-view-text" },
            icon && (React__namespace.createElement("span", { className: css(stylesTreeView.tableTreeViewIcon), key: "tree-view-text-icon" }, icon)),
            React__namespace.createElement("span", { className: "pf-c-table__text", key: "table-text" }, content)));
        const onChange = (isChecked, event) => {
            onCheckChange(event, isChecked, rowIndex, content, rowData);
        };
        return {
            component: 'th',
            className: 'pf-c-table__tree-view-title-cell',
            children: level !== undefined ? (React__namespace.createElement("div", { className: css(stylesTreeView.tableTreeViewMain) },
                setsize > 0 && (React__namespace.createElement("span", { className: css(stylesTreeView.tableToggle), key: "table-toggle" },
                    React__namespace.createElement(Button, { variant: "plain", onClick: event => onCollapse && onCollapse(event, rowIndex, content, rowData), className: css(isExpanded && styles$1.modifiers.expanded), "aria-expanded": isExpanded, "aria-label": toggleAriaLabel || `${isExpanded ? 'Collapse' : 'Expand'} row ${rowIndex}` },
                        React__namespace.createElement("div", { className: css(stylesTreeView.tableToggleIcon) },
                            React__namespace.createElement(AngleDownIcon$1, { "aria-hidden": "true" }))))),
                !!onCheckChange && (React__namespace.createElement("span", { className: css(stylesTreeView.tableCheck), key: "table-check" },
                    React__namespace.createElement("label", { htmlFor: checkboxId || `checkbox_${rowIndex}` },
                        React__namespace.createElement(Checkbox, { id: checkboxId || `checkbox_${rowIndex}`, "aria-label": checkAriaLabel || `Row ${rowIndex} checkbox`, isChecked: isChecked, onChange: onChange })))),
                text,
                !!onToggleRowDetails && (React__namespace.createElement("span", { className: css(stylesTreeView.tableTreeViewDetailsToggle), key: "view-details-toggle" },
                    React__namespace.createElement(Button, { variant: "plain", "aria-expanded": isDetailsExpanded, "aria-label": showDetailsAriaLabel || 'Show row details', onClick: event => onToggleRowDetails && onToggleRowDetails(event, rowIndex, content, rowData) },
                        React__namespace.createElement("span", { className: "pf-c-table__details-toggle-icon" },
                            React__namespace.createElement(EllipsisHIcon$1, { "aria-hidden": true }))))))) : (text)
        };
    };

    const TdBase = (_a) => {
        var { children, className, isActionCell = false, component = 'td', dataLabel, textCenter = false, modifier, select = null, actions = null, expand = null, treeRow: treeRowProp = null, compoundExpand: compoundExpandProp = null, noPadding, width, visibility, innerRef, favorites = null, draggableRow: draggableRowProp = null } = _a, props = __rest$2(_a, ["children", "className", "isActionCell", "component", "dataLabel", "textCenter", "modifier", "select", "actions", "expand", "treeRow", "compoundExpand", "noPadding", "width", "visibility", "innerRef", "favorites", "draggableRow"]);
        const selectParams = select
            ? selectable(children, {
                rowIndex: select.rowIndex,
                rowData: {
                    selected: select.isSelected,
                    disableSelection: select === null || select === void 0 ? void 0 : select.disable,
                    props: select === null || select === void 0 ? void 0 : select.props
                },
                column: {
                    extraParams: {
                        onSelect: select === null || select === void 0 ? void 0 : select.onSelect,
                        selectVariant: select.variant || 'checkbox'
                    }
                }
            })
            : null;
        const favoriteParams = favorites
            ? favoritable(null, {
                rowIndex: favorites === null || favorites === void 0 ? void 0 : favorites.rowIndex,
                rowData: {
                    favorited: favorites.isFavorited,
                    favoritesProps: favorites === null || favorites === void 0 ? void 0 : favorites.props
                },
                column: {
                    extraParams: {
                        onFavorite: favorites === null || favorites === void 0 ? void 0 : favorites.onFavorite
                    }
                }
            })
            : null;
        const draggableParams = draggableRowProp !== null
            ? draggable(null, {
                rowData: {
                    id: draggableRowProp.id
                }
            })
            : null;
        const actionParamsFunc = actions ? cellActions(actions.items, null, null) : null;
        const actionParams = actionParamsFunc
            ? actionParamsFunc(null, {
                rowIndex: actions === null || actions === void 0 ? void 0 : actions.rowIndex,
                rowData: {
                    disableActions: actions === null || actions === void 0 ? void 0 : actions.disable
                },
                column: {
                    extraParams: {
                        dropdownPosition: actions === null || actions === void 0 ? void 0 : actions.dropdownPosition,
                        dropdownDirection: actions === null || actions === void 0 ? void 0 : actions.dropdownDirection,
                        actionsToggle: actions === null || actions === void 0 ? void 0 : actions.actionsToggle
                    }
                }
            })
            : null;
        const expandableParams = expand !== null
            ? collapsible(null, {
                rowIndex: expand.rowIndex,
                columnIndex: expand === null || expand === void 0 ? void 0 : expand.columnIndex,
                rowData: {
                    isOpen: expand.isExpanded
                },
                column: {
                    extraParams: {
                        onCollapse: expand === null || expand === void 0 ? void 0 : expand.onToggle
                    }
                }
            })
            : null;
        const compoundParams = compoundExpandProp !== null
            ? compoundExpand({
                title: children,
                props: {
                    isOpen: compoundExpandProp.isExpanded
                }
            }, {
                column: {
                    extraParams: {
                        onExpand: compoundExpandProp === null || compoundExpandProp === void 0 ? void 0 : compoundExpandProp.onToggle
                    }
                }
            })
            : null;
        const widthParams = width ? cellWidth(width)() : null;
        const visibilityParams = visibility
            ? classNames(...visibility.map((vis) => Visibility[vis]))()
            : null;
        const treeRowParams = treeRowProp !== null
            ? treeRow(treeRowProp.onCollapse, treeRowProp.onCheckChange, treeRowProp.onToggleRowDetails)({
                title: children
            }, {
                rowIndex: treeRowProp.rowIndex,
                rowData: {
                    props: treeRowProp.props
                }
            })
            : null;
        const merged = mergeProps(selectParams, actionParams, expandableParams, compoundParams, widthParams, visibilityParams, favoriteParams, treeRowParams, draggableParams);
        const { 
        // selectable adds this but we don't want it
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isVisible = null, children: mergedChildren = null, className: mergedClassName = '', component: MergedComponent = component } = merged, mergedProps = __rest$2(merged, ["isVisible", "children", "className", "component"]);
        const treeTableTitleCell = (className && className.includes('pf-c-table__tree-view-title-cell')) ||
            (mergedClassName && mergedClassName.includes('pf-c-table__tree-view-title-cell'));
        return (React__namespace.createElement(MergedComponent, Object.assign({}, (!treeTableTitleCell && { 'data-label': dataLabel }), { className: css(className, isActionCell && styles$1.tableAction, textCenter && styles$1.modifiers.center, noPadding && styles$1.modifiers.noPadding, styles$1.modifiers[modifier], draggableParams && styles$1.tableDraggable, mergedClassName), ref: innerRef }, mergedProps, props), mergedChildren || children));
    };
    const Td = React__namespace.forwardRef((props, ref) => (React__namespace.createElement(TdBase, Object.assign({}, props, { innerRef: ref }))));
    Td.displayName = 'Td';

    /**
     * types.tsx
     *
     * Forked from reactabular-table version 8.14.0
     * https://github.com/reactabular/reactabular/tree/v8.14.0/packages/reactabular-table/src
     */
    // Table Defaults
    const TableDefaults = {
        renderers: {
            table: TableComposable,
            header: {
                wrapper: Thead,
                row: Tr,
                cell: Th
            },
            body: {
                wrapper: Tbody,
                row: Tr,
                cell: Td
            }
        }
    };

    const ProviderContext = React__namespace.createContext({
        columns: null,
        renderers: null
    });
    class Provider extends React__namespace.Component {
        render() {
            const _a = this.props, { columns, renderers, components, children } = _a, props = __rest$2(_a, ["columns", "renderers", "components", "children"]);
            let finalRenderers = renderers;
            if (components) {
                // eslint-disable-next-line no-console
                console.warn('`components` have been deprecated in favor of `renderers` and will be removed in the next major version, please rename!');
                finalRenderers = components;
            }
            const provider = React__namespace.createElement(renderers.table || TableDefaults.renderers.table, props, children);
            return (React__namespace.createElement(ProviderContext.Provider, { value: {
                    columns,
                    renderers: {
                        table: finalRenderers.table || TableDefaults.renderers.table,
                        header: Object.assign(Object.assign({}, TableDefaults.renderers.header), finalRenderers.header),
                        body: Object.assign(Object.assign({}, TableDefaults.renderers.body), finalRenderers.body)
                    }
                } }, provider));
        }
    }
    Provider.displayName = 'Provider';
    Provider.defaultProps = {
        renderers: TableDefaults.renderers
    };

    /**
     * @param {formattersType} formatters - formatters type
     */
    function evaluateFormatters(formatters) {
        return (value, extra) => formatters.reduce((parameters, formatter) => ({
            value: formatter(parameters.value, parameters.extra),
            extra
        }), { value, extra }).value;
    }

    /**
     * evaluate-transforms.ts
     *
     * Forked from reactabular-table version 8.14.0
     * https://github.com/reactabular/reactabular/tree/v8.14.0/packages/reactabular-table/src
     */
    /**
     * @param {transformsType} transforms - transforms type
     * @param {string | object} value - value
     * @param {ExtraParamsType} extraParameters - extra params type
     */
    function evaluateTransforms(transforms = [], value, extraParameters = {}) {
        {
            if (!transforms.every(f => typeof f === 'function')) {
                throw new Error("All transforms weren't functions!");
            }
        }
        if (transforms.length === 0) {
            return {};
        }
        return mergeProps(...transforms.map(transform => transform(value, extraParameters)));
    }

    /**
     * header-row.tsx
     *
     * Forked from reactabular-table version 8.14.0
     * https://github.com/reactabular/reactabular/tree/v8.14.0/packages/reactabular-table/src
     */
    const HeaderRow = ({ rowData, rowIndex, renderers, onRow = () => ({}) }) => React__namespace.createElement(renderers.row, onRow(rowData, { rowIndex }), rowData.map((column, columnIndex) => {
        const { property, header = {}, props = {} } = column;
        const evaluatedProperty = property || (header && header.property);
        const { label, transforms = [], formatters = [], info = {} } = header;
        const extraParameters = {
            columnIndex,
            property: evaluatedProperty,
            column
        };
        const transformedProps = evaluateTransforms(transforms, label, extraParameters);
        if (!transformedProps) {
            // tslint:disable-next-line:no-console
            console.warn('Table.Header - Failed to receive a transformed result'); // eslint-disable-line max-len, no-console
        }
        let cellNode;
        const { tooltip, tooltipProps, popover, popoverProps, ariaLabel, className } = info;
        // consumer can specify header cell tooltip/popover in two ways, but the transforms approach is preferred,
        // especially for sorting tables that use `transforms: [sortable]`
        // {
        //   title: 'Repositories',
        //   header: {
        //     info: {
        //       tooltip: 'More information about repositories',
        //       className: 'repositories-info-tip',
        //       tooltipProps: {
        //         isContentLeftAligned: true
        //       }
        //     }
        //   }
        // }
        //
        // {
        //   title: 'Repositories',
        //   transforms: [
        //     info({
        //       tooltip: 'More information about repositories',
        //       className: 'repositories-info-tip',
        //       tooltipProps: {
        //         isContentLeftAligned: true
        //       }
        //     }),
        //     sortable
        //   ]
        // },
        if (tooltip) {
            cellNode = (React__namespace.createElement(HeaderCellInfoWrapper, { variant: "tooltip", info: tooltip, tooltipProps: tooltipProps, ariaLabel: ariaLabel, className: className }, transformedProps.children || evaluateFormatters(formatters)(label, extraParameters)));
        }
        else if (popover) {
            cellNode = (React__namespace.createElement(HeaderCellInfoWrapper, { variant: "popover", info: popover, popoverProps: popoverProps, ariaLabel: ariaLabel, className: className }, transformedProps.children || evaluateFormatters(formatters)(label, extraParameters)));
        }
        else {
            cellNode = transformedProps.children || evaluateFormatters(formatters)(label, extraParameters);
        }
        return React__namespace.createElement(renderers.cell, Object.assign({ key: `${columnIndex}-header` }, mergeProps(props, header && header.props, transformedProps)), cellNode);
    }));
    HeaderRow.displayName = 'HeaderRow';

    class BaseHeader extends React__namespace.Component {
        render() {
            const _a = this.props, { children, headerRows, onRow, renderers, columns } = _a, props = __rest$2(_a, ["children", "headerRows", "onRow", "renderers", "columns"]);
            // If headerRows aren't passed, default to bodyColumns as header rows
            return React__namespace.createElement(renderers.header.wrapper, props, [
                (headerRows || [columns]).map((rowData, rowIndex) => React__namespace.createElement(HeaderRow, {
                    key: `${rowIndex}-header-row`,
                    renderers: renderers.header,
                    onRow,
                    rowData,
                    rowIndex
                }))
            ].concat(children));
        }
    }
    const Header = (props) => (React__namespace.createElement(ProviderContext.Consumer, null, ({ columns, renderers }) => React__namespace.createElement(BaseHeader, Object.assign({ columns: columns, renderers: renderers }, props))));

    /** Used to stand-in for `undefined` hash values. */

    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd$1(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    var _setCacheAdd = setCacheAdd$1;

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */

    function setCacheHas$1(value) {
      return this.__data__.has(value);
    }

    var _setCacheHas = setCacheHas$1;

    var MapCache = _MapCache,
        setCacheAdd = _setCacheAdd,
        setCacheHas = _setCacheHas;

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache$1(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    // Add methods to `SetCache`.
    SetCache$1.prototype.add = SetCache$1.prototype.push = setCacheAdd;
    SetCache$1.prototype.has = setCacheHas;

    var _SetCache = SetCache$1;

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */

    function arraySome$1(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    var _arraySome = arraySome$1;

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */

    function cacheHas$1(cache, key) {
      return cache.has(key);
    }

    var _cacheHas = cacheHas$1;

    var SetCache = _SetCache,
        arraySome = _arraySome,
        cacheHas = _cacheHas;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$3 = 1,
        COMPARE_UNORDERED_FLAG$1 = 2;

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays$2(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG$1) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    var _equalArrays = equalArrays$2;

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */

    function mapToArray$1(map) {
      var index = -1,
          result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    var _mapToArray = mapToArray$1;

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */

    function setToArray$1(set) {
      var index = -1,
          result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    var _setToArray = setToArray$1;

    var Symbol = _Symbol,
        Uint8Array = _Uint8Array,
        eq = eq_1,
        equalArrays$1 = _equalArrays,
        mapToArray = _mapToArray,
        setToArray = _setToArray;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$2 = 1,
        COMPARE_UNORDERED_FLAG = 2;

    /** `Object#toString` result references. */
    var boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        mapTag$1 = '[object Map]',
        numberTag = '[object Number]',
        regexpTag = '[object RegExp]',
        setTag$1 = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag$1 = '[object DataView]';

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag$1(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag$1:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag$1:
          var convert = mapToArray;

        case setTag$1:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays$1(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    var _equalByTag = equalByTag$1;

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */

    function arrayPush$1(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    var _arrayPush = arrayPush$1;

    var arrayPush = _arrayPush,
        isArray$1 = isArray_1;

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys$1(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    var _baseGetAllKeys = baseGetAllKeys$1;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */

    function arrayFilter$1(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    var _arrayFilter = arrayFilter$1;

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */

    function stubArray$1() {
      return [];
    }

    var stubArray_1 = stubArray$1;

    var arrayFilter = _arrayFilter,
        stubArray = stubArray_1;

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols$1 = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    var _getSymbols = getSymbols$1;

    var overArg = _overArg;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys$1 = overArg(Object.keys, Object);

    var _nativeKeys = nativeKeys$1;

    var isPrototype = _isPrototype,
        nativeKeys = _nativeKeys;

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys$1(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty$2.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeys = baseKeys$1;

    var arrayLikeKeys = _arrayLikeKeys,
        baseKeys = _baseKeys,
        isArrayLike = isArrayLike_1;

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys$1(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    var keys_1 = keys$1;

    var baseGetAllKeys = _baseGetAllKeys,
        getSymbols = _getSymbols,
        keys = keys_1;

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys$1(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    var _getAllKeys = getAllKeys$1;

    var getAllKeys = _getAllKeys;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$1 = 1;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects$1(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    var _equalObjects = equalObjects$1;

    var getNative$3 = _getNative,
        root$3 = _root;

    /* Built-in method references that are verified to be native. */
    var DataView$1 = getNative$3(root$3, 'DataView');

    var _DataView = DataView$1;

    var getNative$2 = _getNative,
        root$2 = _root;

    /* Built-in method references that are verified to be native. */
    var Promise$2 = getNative$2(root$2, 'Promise');

    var _Promise = Promise$2;

    var getNative$1 = _getNative,
        root$1 = _root;

    /* Built-in method references that are verified to be native. */
    var Set$2 = getNative$1(root$1, 'Set');

    var _Set = Set$2;

    var getNative = _getNative,
        root = _root;

    /* Built-in method references that are verified to be native. */
    var WeakMap$1 = getNative(root, 'WeakMap');

    var _WeakMap = WeakMap$1;

    var DataView = _DataView,
        Map$1 = _Map,
        Promise$1 = _Promise,
        Set$1 = _Set,
        WeakMap = _WeakMap,
        baseGetTag = _baseGetTag,
        toSource = _toSource;

    /** `Object#toString` result references. */
    var mapTag = '[object Map]',
        objectTag$1 = '[object Object]',
        promiseTag = '[object Promise]',
        setTag = '[object Set]',
        weakMapTag = '[object WeakMap]';

    var dataViewTag = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map$1),
        promiseCtorString = toSource(Promise$1),
        setCtorString = toSource(Set$1),
        weakMapCtorString = toSource(WeakMap);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag$1 = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag$1(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map$1 && getTag$1(new Map$1) != mapTag) ||
        (Promise$1 && getTag$1(Promise$1.resolve()) != promiseTag) ||
        (Set$1 && getTag$1(new Set$1) != setTag) ||
        (WeakMap && getTag$1(new WeakMap) != weakMapTag)) {
      getTag$1 = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag$1 ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    var _getTag = getTag$1;

    var Stack = _Stack,
        equalArrays = _equalArrays,
        equalByTag = _equalByTag,
        equalObjects = _equalObjects,
        getTag = _getTag,
        isArray = isArray_1,
        isBuffer = isBuffer$3.exports,
        isTypedArray = isTypedArray_1;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG = 1;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        objectTag = '[object Object]';

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep$1(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    var _baseIsEqualDeep = baseIsEqualDeep$1;

    var baseIsEqualDeep = _baseIsEqualDeep,
        isObjectLike = isObjectLike_1;

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual$2(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual$2, stack);
    }

    var _baseIsEqual = baseIsEqual$2;

    var baseIsEqual$1 = _baseIsEqual;

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual$1(value, other);
    }

    var isEqual_1 = isEqual;

    /**
     * resolve-row-key.ts
     *
     * Forked from reactabular-table version 8.14.0
     * https://github.com/reactabular/reactabular/tree/v8.14.0/packages/reactabular-table/src
     */
    /**
     * @param {{rowData: RowType, rowIndex: number, rowKey: RowKeyType}} rowData - row data
     */
    function resolveRowKey({ rowData, rowIndex, rowKey }) {
        if (typeof rowKey === 'function') {
            return `${rowKey({ rowData, rowIndex })}-row`;
        }
        else {
            // Arrays cannot have rowKeys by definition so we have to go by index there.
            if (!Array.isArray(rowData) && rowData[rowKey] === undefined) {
                // eslint-disable-next-line no-console
                console.warn('Table.Body - Missing valid rowKey!', rowData, rowKey);
            }
        }
        if (rowData[rowKey] === 0) {
            return `${rowData[rowKey]}-row`;
        }
        return `${rowData[rowKey] || rowIndex}-row`;
    }

    var baseIsEqual = _baseIsEqual;

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
    }

    var isEqualWith_1 = isEqualWith;

    var isEqualWith$1 = isEqualWith_1;

    /**
     * columns-are-equal.ts
     *
     * Forked from reactabular-table version 8.14.0
     * https://github.com/reactabular/reactabular/tree/v8.14.0/packages/reactabular-table/src
     */
    /**
     * @param {ColumnsType} oldColumns - previous columns
     * @param {ColumnsType} newColumns - new columns
     */
    function columnsAreEqual(oldColumns, newColumns) {
        return isEqualWith$1(oldColumns, newColumns, (a, b) => {
            if (typeof a === 'function' && typeof b === 'function') {
                return a === b;
            }
            return undefined;
        });
    }

    /**
     * body-row.tsx
     *
     * Forked from reactabular-table version 8.14.0
     * https://github.com/reactabular/reactabular/tree/v8.14.0/packages/reactabular-table/src
     */
    class BodyRow extends React__namespace.Component {
        shouldComponentUpdate(nextProps) {
            const { columns, rowData } = this.props;
            // Check for row based override.
            const { renderers } = nextProps;
            if (renderers && renderers.row && renderers.row.shouldComponentUpdate) {
                if (typeof renderers.row.shouldComponentUpdate === 'function') {
                    return renderers.row.shouldComponentUpdate.call(this, nextProps, {}, {});
                }
                return true;
            }
            return !(columnsAreEqual(columns, nextProps.columns) && isEqual_1(rowData, nextProps.rowData));
        }
        render() {
            const { columns, renderers, onRow, rowKey, rowIndex, rowData } = this.props;
            return React__namespace.createElement(renderers.row, onRow(rowData, { rowIndex, rowKey }), columns.map((column, columnIndex) => {
                const { property, cell, props } = column;
                const evaluatedProperty = (property || (cell && cell.property));
                const { transforms = [], formatters = [] } = cell || {};
                const extraParameters = {
                    columnIndex,
                    property: evaluatedProperty,
                    column,
                    rowData,
                    rowIndex,
                    rowKey
                };
                const transformed = evaluateTransforms(transforms, rowData[evaluatedProperty], extraParameters);
                if (!transformed) {
                    // eslint-disable-next-line no-console
                    console.warn('Table.Body - Failed to receive a transformed result');
                }
                let additionalFormaters = [];
                if (rowData[evaluatedProperty]) {
                    additionalFormaters = rowData[evaluatedProperty].formatters;
                }
                return React__namespace.createElement(renderers.cell, Object.assign({ key: `col-${columnIndex}-row-${rowIndex}` }, mergeProps(props, cell && cell.props, transformed)), (!rowData.fullWidth && transformed.children) ||
                    evaluateFormatters([...formatters, ...additionalFormaters])(rowData[`_${evaluatedProperty}`] || rowData[evaluatedProperty], extraParameters));
            }));
        }
    }
    BodyRow.displayName = 'BodyRow';
    BodyRow.defaultProps = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onRow: (...args) => ({})
    };

    class BaseBody extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.omitOnRow = (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const ret = __rest$2(props, ["onRow"]);
                return ret;
            };
        }
        shouldComponentUpdate(nextProps) {
            // Skip checking props against `onRow` since that can be bound at render().
            // That's not particularly good practice but you never know how the users
            // prefer to define the handler.
            // Check for wrapper based override.
            const { renderers } = nextProps;
            if (renderers &&
                renderers.body &&
                renderers.body.wrapper &&
                renderers.body.wrapper.shouldComponentUpdate) {
                if (typeof renderers.body.wrapper.shouldComponentUpdate === 'function') {
                    return renderers.body.wrapper.shouldComponentUpdate.call(this, nextProps, {}, {});
                }
                return true;
            }
            return !isEqual_1(this.omitOnRow(this.props), this.omitOnRow(nextProps));
        }
        render() {
            const _a = this.props, { onRow, rows, rowKey, columns, renderers } = _a, props = __rest$2(_a, ["onRow", "rows", "rowKey", "columns", "renderers"]);
            const children = rows.map((rowData, index) => {
                const key = resolveRowKey({ rowData, rowIndex: index, rowKey });
                return React__namespace.createElement(BodyRow, {
                    key,
                    renderers: renderers.body,
                    onRow,
                    rowKey: key,
                    rowIndex: index,
                    rowData,
                    columns
                });
            });
            return React__namespace.createElement(renderers.body.wrapper, props, children);
        }
    }
    BaseBody.defaultProps = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onRow: (...args) => ({})
    };
    const Body = (props) => (React__namespace.createElement(ProviderContext.Consumer, null, ({ columns, renderers }) => React__namespace.createElement(BaseBody, Object.assign({ columns: columns, renderers: renderers }, props))));

    const BodyCell = (_a) => {
        var { 'data-label': dataLabel = '', className = '', colSpan, component = 'td', isVisible, parentId, textCenter = false, tooltip: tooltipProp = '', onMouseEnter: onMouseEnterProp = () => { }, children, 
        /* eslint-disable @typescript-eslint/no-unused-vars */
        errorText, isValid, isOpen, ariaControls, editableValue, editableSelectProps, options, isSelectOpen, value, name } = _a, 
        /* eslint-enable @typescript-eslint/no-unused-vars */
        props = __rest$2(_a, ['data-label', "className", "colSpan", "component", "isVisible", "parentId", "textCenter", "tooltip", "onMouseEnter", "children", "errorText", "isValid", "isOpen", "ariaControls", "editableValue", "editableSelectProps", "options", "isSelectOpen", "value", "name"]);
        const [tooltip, setTooltip] = React__namespace.useState('');
        const onMouseEnter = (event) => {
            if (event.target.offsetWidth < event.target.scrollWidth) {
                if (tooltipProp) {
                    setTooltip(tooltipProp);
                }
                else if (typeof children === 'string') {
                    setTooltip(children);
                }
            }
            else {
                setTooltip('');
            }
            onMouseEnterProp(event);
        };
        let isEmptyStateCell = false;
        if (children) {
            isEmptyStateCell =
                (children.type === Bullseye &&
                    children.props.children &&
                    children.props.children.type === EmptyState) ||
                    children.type === EmptyState;
        }
        const cell = (React__namespace.createElement(Td, Object.assign({ className: className, component: component, dataLabel: dataLabel && parentId == null && !isEmptyStateCell ? dataLabel : null, onMouseEnter: onMouseEnter, textCenter: textCenter, colSpan: colSpan }, props), children));
        const bodyCell = tooltip !== '' ? (React__namespace.createElement(Tooltip, { content: tooltip, isVisible: true }, cell)) : (cell);
        return (parentId !== undefined && colSpan === undefined) || !isVisible ? null : bodyCell;
    };
    BodyCell.displayName = 'BodyCell';

    const HeaderCell = (_a) => {
        var { className = '', component = 'th', scope = '', textCenter = false, tooltip = '', onMouseEnter = () => { }, children, 
        /* eslint-disable @typescript-eslint/no-unused-vars */
        isVisible, dataLabel = '' } = _a, 
        /* eslint-enable @typescript-eslint/no-unused-vars */
        props = __rest$2(_a, ["className", "component", "scope", "textCenter", "tooltip", "onMouseEnter", "children", "isVisible", "dataLabel"]);
        return (React__namespace.createElement(Th, Object.assign({}, props, { scope: scope, tooltip: tooltip, onMouseEnter: onMouseEnter, textCenter: textCenter, component: component, className: className }), children));
    };
    HeaderCell.displayName = 'HeaderCell';

    class RowWrapper extends React__namespace.Component {
        constructor(props) {
            super(props);
            this.handleScroll = (event) => {
                if (!this._unmounted) {
                    this.props.onScroll(event);
                }
            };
            this.handleResize = (event) => {
                if (!this._unmounted) {
                    this.props.onResize(event);
                }
            };
            if (props.onScroll) {
                this.handleScroll = debounce$1(this.handleScroll, 100);
            }
            if (props.onResize) {
                this.handleResize = debounce$1(this.handleResize, 100);
            }
        }
        componentDidMount() {
            this._unmounted = false;
            if (canUseDOM) {
                if (this.props.onScroll) {
                    window.addEventListener('scroll', this.handleScroll);
                }
                if (this.props.onResize) {
                    window.addEventListener('resize', this.handleResize);
                }
            }
        }
        componentWillUnmount() {
            this._unmounted = true;
            if (canUseDOM) {
                if (this.props.onScroll) {
                    window.removeEventListener('scroll', this.handleScroll);
                }
                if (this.props.onResize) {
                    window.removeEventListener('resize', this.handleResize);
                }
            }
        }
        render() {
            const _a = this.props, { 
            /* eslint-disable @typescript-eslint/no-unused-vars */
            onScroll, onResize, row: { isExpanded, isEditable, isHoverable, isRowSelected }, rowProps, 
            /* eslint-enable @typescript-eslint/no-unused-vars */
            trRef, className, ouiaId } = _a, props = __rest$2(_a, ["onScroll", "onResize", "row", "rowProps", "trRef", "className", "ouiaId"]);
            return (React__namespace.createElement(Tr, Object.assign({}, props, { ref: trRef, isExpanded: isExpanded, isEditable: isEditable, className: className, ouiaId: ouiaId, isHoverable: isHoverable, isRowSelected: isRowSelected })));
        }
    }
    RowWrapper.displayName = 'RowWrapper';
    RowWrapper.defaultProps = {
        className: '',
        row: {
            isOpen: undefined,
            isExpanded: undefined,
            isHeightAuto: undefined,
            isEditable: undefined
        },
        rowProps: null
    };

    const emptyTD = () => ({
        component: 'td'
    });
    const scopeColTransformer = () => ({
        scope: 'col'
    });
    const emptyCol = (label) => (Object.assign({}, (label ? {} : { scope: '' })));
    const parentId = (_value, { rowData }) => ({
        parentId: rowData.parent
    });
    const mapProps = (_label, { property, rowData }) => (Object.assign({}, (rowData[property] && rowData[property].props)));

    const PencilAltIconConfig = {
      name: 'PencilAltIcon',
      height: 512,
      width: 512,
      svgPath: 'M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z',
      yOffset: 0,
      xOffset: 0,
    };

    const PencilAltIcon = createIcon(PencilAltIconConfig);

    var PencilAltIcon$1 = PencilAltIcon;

    const EditColumn = (_a) => {
        var { onClick = null, 
        /* eslint-disable @typescript-eslint/no-unused-vars */
        className = '', editing, valid, 
        /* eslint-enable @typescript-eslint/no-unused-vars */
        saveAriaLabel, cancelAriaLabel, editAriaLabel } = _a, props = __rest$2(_a, ["onClick", "className", "editing", "valid", "saveAriaLabel", "cancelAriaLabel", "editAriaLabel"]);
        return (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement("div", { className: css(inlineStyles.inlineEditGroup, inlineStyles.modifiers.iconGroup, 'pf-m-action-group') },
                React__namespace.createElement("div", { className: css(inlineStyles.inlineEditAction) },
                    React__namespace.createElement(Button, Object.assign({ "aria-label": saveAriaLabel }, props, { onClick: e => onClick(e, 'save'), variant: "plain" }),
                        React__namespace.createElement(CheckIcon$1, null))),
                React__namespace.createElement("div", { className: css(inlineStyles.inlineEditAction) },
                    React__namespace.createElement(Button, Object.assign({ "aria-label": cancelAriaLabel }, props, { onClick: e => onClick(e, 'cancel'), variant: "plain" }),
                        React__namespace.createElement(TimesIcon$1, null)))),
            React__namespace.createElement("div", { className: css(inlineStyles.inlineEditAction, inlineStyles.modifiers.enableEditable) },
                React__namespace.createElement(Button, Object.assign({ "aria-label": editAriaLabel }, props, { onClick: e => onClick(e, 'edit'), variant: "plain" }),
                    React__namespace.createElement(PencilAltIcon$1, null)))));
    };
    EditColumn.displayName = 'EditColumn';

    const editable = (label, { rowIndex, rowData, column }) => {
        const { extraParams: { onRowEdit } } = column;
        const toggleEditMode = (event, type) => {
            let validationErrors = {};
            if (type === 'save') {
                validationErrors =
                    rowData.rowEditValidationRules &&
                        rowData.rowEditValidationRules.reduce((acc, rule) => {
                            const invalidCells = rowData.cells.filter(cellData => {
                                const testValue = cellData.props.editableValue === '' ? '' : cellData.props.editableValue || cellData.props.value;
                                let failedValidation = false;
                                if (Array.isArray(testValue) && testValue.length) {
                                    // multiple values, like multiselect
                                    failedValidation = testValue.reduce((hasInvalidSelection, el) => {
                                        // if one value fails validation, the entire cell is invalid
                                        if (hasInvalidSelection === true) {
                                            return true;
                                        }
                                        return !rule.validator(el);
                                    }, failedValidation);
                                }
                                else if (Array.isArray(testValue) && !testValue.length) {
                                    // case where all values were dismissed in multiselect
                                    failedValidation = !rule.validator('');
                                }
                                else {
                                    // simple text fields
                                    failedValidation = !rule.validator(testValue);
                                }
                                if (failedValidation) {
                                    cellData.props.isValid = false;
                                }
                                return failedValidation;
                            });
                            if (invalidCells.length) {
                                acc[rule.name] = invalidCells.map(cell => cell.props.name);
                            }
                            return acc;
                        }, {});
            }
            // tslint:disable-next-line:no-unused-expression
            onRowEdit(event, type, rowData && rowData.isEditable, rowIndex, validationErrors);
        };
        /**
         * @param {number} identifier identifier used for the row
         * @param {RowEditType} actionType the type of row edit action
         */
        function getAriaLabelTxt(identifier, actionType) {
            let result;
            switch (actionType) {
                case 'cancel':
                    result = `Cancel row edits for row ${identifier}`;
                    break;
                case 'save':
                    result = `Save row edits for row ${identifier}`;
                    break;
                default:
                    result = `Place row ${identifier} in edit mode`;
            }
            return result;
        }
        return {
            className: styles$1.tableInlineEditAction,
            component: 'td',
            isVisible: true,
            children: (React__namespace.createElement(EditColumn, { saveAriaLabel: (rowData && rowData.rowSaveBtnAriaLabel && rowData.rowSaveBtnAriaLabel(rowIndex)) ||
                    getAriaLabelTxt(rowIndex, 'save'), cancelAriaLabel: (rowData && rowData.rowCancelBtnAriaLabel && rowData.rowCancelBtnAriaLabel(rowIndex)) ||
                    getAriaLabelTxt(rowIndex, 'cancel'), editAriaLabel: (rowData && rowData.rowEditBtnAriaLabel && rowData.rowEditBtnAriaLabel(rowIndex)) ||
                    getAriaLabelTxt(rowIndex, 'edit'), valid: rowData && rowData.isValid, editing: rowData && rowData.isEditable, onClick: toggleEditMode }))
        };
    };

    const breakWord = () => ({
        className: styles$1.modifiers.breakWord
    });
    const fitContent = () => ({
        className: styles$1.modifiers.fitContent
    });
    const nowrap = () => ({
        className: styles$1.modifiers.nowrap
    });
    const truncate = () => ({
        className: styles$1.modifiers.truncate
    });
    const wrappable = () => ({
        className: styles$1.modifiers.wrap
    });

    const textCenter = () => ({ textCenter: true });

    const headerCol = (id = 'simple-node') => {
        const headerColObj = (value, { rowIndex } = {}) => {
            const result = typeof value === 'object' ? value.title : value;
            return {
                component: 'th',
                children: React__namespace.createElement("div", { id: `${id}${rowIndex}` }, result)
            };
        };
        return headerColObj;
    };

    const defaultTitle = (data) => data && data.hasOwnProperty('title') ? data.title : data;

    /**
     * Generate header with transforms and formatters from custom header object.
     *
     * @param {*} header with transforms, formatters, columnTransforms, and rest of header object.
     * @param {*} title to be used as label in header config.
     * @returns {*} header, label, transforms: Array, formatters: Array.
     */
    const generateHeader = ({ transforms: origTransforms, formatters: origFormatters, columnTransforms, header }, title) => (Object.assign(Object.assign({}, header), { label: title, transforms: [
            scopeColTransformer,
            emptyCol,
            ...(origTransforms || []),
            ...(columnTransforms || []),
            ...(header && header.hasOwnProperty('transforms') ? header.transforms : [])
        ], formatters: [...(origFormatters || []), ...(header && header.hasOwnProperty('formatters') ? header.formatters : [])] }));
    /**
     * Function to generate cell for header config to change look of each cell.
     *
     * @param {*} customCell config with cellFormatters, cellTransforms, columnTransforms and rest of cell config.
     * @param {*} extra - extra
     * @returns {*} cell, transforms: Array, formatters: Array.
     */
    const generateCell = ({ cellFormatters, cellTransforms, columnTransforms, cell }, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extra) => (Object.assign(Object.assign({}, cell), { transforms: [
            ...(cellTransforms || []),
            ...(columnTransforms || []),
            ...(cell && cell.hasOwnProperty('transforms') ? cell.transforms : []),
            mapProps // This transform should be applied last so that props that are manually defined at the cell level will override all other transforms.
        ], formatters: [
            defaultTitle,
            ...(cellFormatters || []),
            ...(cell && cell.hasOwnProperty('formatters') ? cell.formatters : [])
        ] }));
    /**
     * Function to map custom simple object properties to expected format with property, header, cell, extra params
     * and props.
     *
     * @param {*} column to be shown in header - either string or object with title, transformers and formatters (for cells as well).
     * @param {*} extra additional object with callbacks for specific formatters.
     * @param {*} key cell key to be shown in data-key.
     * @param {*} props additional props for each cell.
     * @returns {*} object with property, extraParams, header, cell and props.
     */
    const mapHeader = (column, extra, key, ...props) => {
        const title = (column.hasOwnProperty('title') ? column.title : column);
        let dataLabel = `column-${key}`;
        if (column.hasOwnProperty('dataLabel')) {
            dataLabel = column.dataLabel;
        }
        else if (typeof title === 'string') {
            dataLabel = title;
        }
        return {
            property: (typeof title === 'string' &&
                title
                    .toLowerCase()
                    .trim()
                    .replace(/\s/g, '-')) ||
                `column-${key}`,
            extraParams: extra,
            data: column.data,
            header: generateHeader(column, title),
            cell: generateCell(column),
            props: Object.assign(Object.assign({ 'data-label': dataLabel, 'data-key': key }, (column.hasOwnProperty('props') ? column.props : {})), props)
        };
    };
    /**
     * Function to define select cell in first column.
     *
     * @param {*} extraObject with onSelect callback.
     * @returns {*} object with empty title, tranforms - Array, cellTransforms - Array.
     */
    const selectableTransforms = ({ onSelect, canSelectAll }) => [
        ...(onSelect
            ? [
                {
                    title: '',
                    transforms: (canSelectAll && [selectable]) || null,
                    cellTransforms: [selectable]
                }
            ]
            : [])
    ];
    /**
     * Function to define favorites cell in first column (or second column if rows are also selectable).
     *
     * @param {*} extraObject with onFavorite callback.
     * @returns {*} object with empty title, tranforms - Array, cellTransforms - Array.
     */
    const favoritesTransforms = ({ onFavorite, onSort, sortBy, canSortFavorites, firstUserColumnIndex }) => [
        ...(onFavorite
            ? [
                {
                    title: '',
                    transforms: onSort && canSortFavorites
                        ? [
                            sortableFavorites({
                                onSort,
                                // favorites should be just before the first user-defined column
                                columnIndex: firstUserColumnIndex - 1,
                                sortBy
                            })
                        ]
                        : [emptyTD],
                    cellTransforms: [favoritable]
                }
            ]
            : [])
    ];
    /**
     * Function to define actions in last column.
     *
     * @param {*} extraObject with actions array.
     * @returns {*} object with empty title, tranforms - Array, cellTransforms - Array.
     */
    const actionsTransforms = ({ actions, actionResolver, areActionsDisabled }) => [
        ...(actionResolver || actions
            ? [
                {
                    title: '',
                    transforms: [emptyTD],
                    cellTransforms: [cellActions(actions, actionResolver, areActionsDisabled)]
                }
            ]
            : [])
    ];
    /**
     * Function to define collapsible in first column.
     *
     * @param {*} header info with cellTransforms.
     * @param {*}  extraObject with onCollapse callback.
     * @returns {*} object with empty title, tranforms - Array, cellTransforms - Array.
     */
    const collapsibleTransforms = (header, { onCollapse, canCollapseAll }) => [
        ...(onCollapse
            ? [
                {
                    title: '',
                    transforms: (canCollapseAll && [collapsible]) || null,
                    cellTransforms: [collapsible, expandedRow(header.length)]
                }
            ]
            : [])
    ];
    /**
     * Function to add additional cell transforms to object.
     *
     * @param {*} cell to be expanded.
     * @param {*} additional thing to be added to cellTransforms.
     * @returns {*} object with title from cell and cellTransforms with additional in.
     */
    const addAdditionalCellTranforms = (cell, additional) => (Object.assign(Object.assign({}, (cell.hasOwnProperty('title') ? cell : { title: cell })), { cellTransforms: [...(cell.hasOwnProperty('cellTransforms') ? cell.cellTransforms : []), additional] }));
    /**
     * Function to change expanded row with additional transforms.
     *
     * @param {*} header info with cellTransforms.
     * @param {*} extra object with onCollapse/onExpand function.
     */
    const expandContent = (header, extra) => {
        if (!extra.onCollapse && !extra.onExpand) {
            return header;
        }
        return header.map((cell) => {
            const parentIdCell = addAdditionalCellTranforms(cell, parentId);
            return addAdditionalCellTranforms(parentIdCell, expandedRow(header.length));
        });
    };
    /**
     * Function to join parent and their children so they can be rendered in tbody.
     *
     * @param {*} rows raw data to find out if it's child or parent.
     * @param {*} children data to render (array of react children).
     */
    const mapOpenedRows = (rows, children) => rows.reduce((acc, curr, key) => {
        if (curr.hasOwnProperty('parent')) {
            const parent = acc.length > 0 && acc[acc.length - 1];
            if (parent) {
                acc[acc.length - 1].rows = [...acc[acc.length - 1].rows, children[key]];
                if (curr.hasOwnProperty('compoundParent')) {
                    // if this is compound expand, check for any open child cell
                    acc[acc.length - 1].isOpen = acc[acc.length - 1].rows.some((oneRow) => oneRow.props.rowData.cells.some((oneCell) => oneCell.props && oneCell.props.isOpen));
                }
            }
        }
        else {
            acc = [...acc, Object.assign(Object.assign({}, curr), { rows: [children[key]] })];
        }
        return acc;
    }, []);
    const rowEditTransforms = ({ onRowEdit }) => [
        ...(onRowEdit
            ? [
                {
                    title: '',
                    cellTransforms: [editable]
                }
            ]
            : [])
    ];
    /**
     * Function to calculate columns based on custom config.
     * It adds some custom cells for collapse, select, if expanded row and actions.
     *
     * @param {*} headerRows custom object with described table header cells.
     * @param {*} extra object with custom callbacks.
     * @returns {*} expected object for react tabular table.
     */
    const calculateColumns = (headerRows, extra) => headerRows &&
        [
            ...collapsibleTransforms(headerRows, extra),
            ...selectableTransforms(extra),
            ...favoritesTransforms(extra),
            ...expandContent(headerRows, extra),
            ...rowEditTransforms(extra),
            ...actionsTransforms(extra)
        ].map((oneCol, key) => (Object.assign({}, mapHeader(oneCol, extra, key))));

    const BodyWrapper = (_a) => {
        var { mappedRows, tbodyRef, 
        /* eslint-disable @typescript-eslint/no-unused-vars */
        rows = [], onCollapse, headerRows } = _a, 
        /* eslint-enable @typescript-eslint/no-unused-vars */
        props = __rest$2(_a, ["mappedRows", "tbodyRef", "rows", "onCollapse", "headerRows"]);
        if (mappedRows && mappedRows.some(row => row.hasOwnProperty('parent'))) {
            return (React__namespace.createElement(React__namespace.Fragment, null, mapOpenedRows(mappedRows, props.children).map((oneRow, key) => (React__namespace.createElement(Tbody, Object.assign({}, props, { isExpanded: oneRow.isOpen, key: `tbody-${key}`, ref: tbodyRef }), oneRow.rows)))));
        }
        return React__namespace.createElement(Tbody, Object.assign({}, props, { ref: tbodyRef }));
    };
    BodyWrapper.displayName = 'BodyWrapper';

    const TableContext = React__namespace.createContext({
        headerData: null,
        headerRows: null,
        rows: []
    });

    const Caption = (_a) => {
        var { children, className } = _a, props = __rest$2(_a, ["children", "className"]);
        return (React__namespace.createElement("caption", Object.assign({ className: className }, props), children));
    };
    Caption.displayName = 'Caption';

    const OuterScrollContainer = (_a) => {
        var { children, className } = _a, props = __rest$2(_a, ["children", "className"]);
        return (React__namespace.createElement("div", Object.assign({ className: css(className, styles.scrollOuterWrapper) }, props), children));
    };
    OuterScrollContainer.displayName = 'OuterScrollContainer';

    const InnerScrollContainer = (_a) => {
        var { children, className } = _a, props = __rest$2(_a, ["children", "className"]);
        return (React__namespace.createElement("div", Object.assign({ className: css(className, styles.scrollInnerWrapper) }, props), children));
    };
    InnerScrollContainer.displayName = 'InnerScrollContainer';

    const TreeRowWrapper = (_a) => {
        var { className, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        rowProps, row } = _a, props = __rest$2(_a, ["className", "rowProps", "row"]);
        const { 'aria-level': level, 'aria-posinset': posinset, 'aria-setsize': setsize, isExpanded, isDetailsExpanded, isHidden } = row.props;
        return (React__namespace.createElement(Tr, Object.assign({ "aria-level": level, "aria-posinset": posinset, "aria-setsize": setsize, "aria-expanded": !!isExpanded, isHidden: isHidden, className: css(className, isExpanded && styles$1.modifiers.expanded, isDetailsExpanded && stylesTreeView.modifiers.treeViewDetailsExpanded) }, props)));
    };
    TreeRowWrapper.displayName = 'TreeRowWrapper';

    class Table extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.state = {
                ouiaStateId: getDefaultOUIAId(Table.displayName)
            };
            this.isSelected = (row) => row.selected === true;
            this.areAllRowsSelected = (rows) => {
                if (rows === undefined || rows.length === 0) {
                    return false;
                }
                return rows.every(row => this.isSelected(row) || row.disableSelection || (row.hasOwnProperty('parent') && !row.showSelect));
            };
            this.areAllExpanded = (rows) => {
                if (rows === undefined || rows.length === 0) {
                    return false;
                }
                return rows.every(row => row.isOpen === undefined || row.isOpen);
            };
        }
        render() {
            const _a = this.props, { 'aria-label': ariaLabel, caption, header, onSort, onSelect, canSelectAll, canCollapseAll, isHeaderSelectDisabled, selectVariant, collapseAllAriaLabel, sortBy, children, actions, actionResolver, areActionsDisabled, onCollapse, onExpand, onRowEdit, rowLabeledBy, dropdownPosition, dropdownDirection, actionsToggle, contentId, expandId, variant, rows, cells, bodyWrapper, rowWrapper, role, borders, onFavorite, canSortFavorites } = _a, props = __rest$2(_a, ['aria-label', "caption", "header", "onSort", "onSelect", "canSelectAll", "canCollapseAll", "isHeaderSelectDisabled", "selectVariant", "collapseAllAriaLabel", "sortBy", "children", "actions", "actionResolver", "areActionsDisabled", "onCollapse", "onExpand", "onRowEdit", "rowLabeledBy", "dropdownPosition", "dropdownDirection", "actionsToggle", "contentId", "expandId", "variant", "rows", "cells", "bodyWrapper", "rowWrapper", "role", "borders", "onFavorite", "canSortFavorites"]);
            if (!ariaLabel && !caption && !header && role !== 'presentation') {
                // eslint-disable-next-line no-console
                console.error('Table: Specify at least one of: header, caption, aria-label');
            }
            const headerData = calculateColumns(cells, {
                sortBy,
                onSort,
                onSelect,
                canSelectAll: selectVariant === exports.RowSelectVariant.radio ? false : canSelectAll,
                canCollapseAll,
                isHeaderSelectDisabled,
                selectVariant,
                collapseAllAriaLabel,
                allRowsSelected: onSelect ? this.areAllRowsSelected(rows) : false,
                allRowsExpanded: onCollapse ? this.areAllExpanded(rows) : false,
                actions,
                actionResolver,
                areActionsDisabled,
                onCollapse,
                onRowEdit,
                onExpand,
                rowLabeledBy,
                expandId,
                contentId,
                dropdownPosition,
                dropdownDirection,
                actionsToggle,
                onFavorite,
                canSortFavorites,
                // order of columns: Collapsible | Selectable | Favoritable
                firstUserColumnIndex: [onCollapse, onSelect, onFavorite].filter(callback => callback).length
            });
            const table = (React__namespace.createElement(TableContext.Provider, { value: {
                    headerData,
                    headerRows: null,
                    rows
                } },
                header,
                React__namespace.createElement(Provider, Object.assign({}, props, { "aria-label": ariaLabel, renderers: {
                        body: {
                            wrapper: bodyWrapper || BodyWrapper,
                            row: rowWrapper || (this.props.isTreeTable ? TreeRowWrapper : RowWrapper),
                            cell: BodyCell
                        },
                        header: {
                            cell: HeaderCell
                        }
                    }, columns: headerData, role: role, variant: variant, borders: borders }),
                    caption && React__namespace.createElement("caption", null, caption),
                    children)));
            if (onRowEdit) {
                return React__namespace.createElement("form", { className: css(inlineStyles.inlineEdit) }, table);
            }
            return table;
        }
    }
    Table.displayName = 'Table';
    Table.hasWarnBeta = false;
    Table.defaultProps = {
        children: null,
        className: '',
        variant: null,
        borders: true,
        rowLabeledBy: 'simple-node',
        expandId: 'expandable-toggle',
        contentId: 'expanded-content',
        dropdownPosition: DropdownPosition.right,
        dropdownDirection: DropdownDirection.down,
        header: undefined,
        caption: undefined,
        'aria-label': undefined,
        gridBreakPoint: exports.TableGridBreakpoint.gridMd,
        role: 'grid',
        canSelectAll: true,
        canCollapseAll: false,
        isHeaderSelectDisabled: false,
        selectVariant: 'checkbox',
        collapseAllAriaLabel: '',
        ouiaSafe: true,
        isStickyHeader: false,
        canSortFavorites: true,
        isTreeTable: false,
        isNested: false
    };

    const flagVisibility = (rows) => {
        const visibleRows = rows.filter((oneRow) => !oneRow.parent || oneRow.isExpanded);
        if (visibleRows.length > 0) {
            visibleRows[0].isFirstVisible = true;
            visibleRows[visibleRows.length - 1].isLastVisible = true;
        }
    };
    class ContextBody extends React__namespace.Component {
        constructor() {
            super(...arguments);
            this.onRow = (row, rowProps) => {
                const { onRowClick, onRow } = this.props;
                const extendedRowProps = Object.assign(Object.assign({}, rowProps), (onRow ? onRow(row, rowProps) : {}));
                return {
                    row,
                    rowProps: extendedRowProps,
                    onClick: (event) => {
                        const tagName = event.target.tagName;
                        const computedData = {
                            isInput: tagName === 'INPUT',
                            isButton: tagName === 'BUTTON'
                        };
                        onRowClick(event, row, rowProps, computedData);
                    },
                    onKeyDown: (event) => {
                        const targetElement = event.target;
                        const tagName = targetElement.tagName;
                        const computedData = {
                            isInput: tagName === 'INPUT',
                            isButton: tagName === 'BUTTON'
                        };
                        if (event.key === 'Enter' || event.key === ' ') {
                            onRowClick(event, row, rowProps, computedData);
                            // prevent event default if space is typed while focusing on a hoverable row
                            // so that the page does not scroll when trying to use spacebar to select a row
                            if (event.key === ' ' && !!targetElement.closest('.pf-m-hoverable')) {
                                event.preventDefault();
                            }
                        }
                    }
                };
            };
            this.mapCells = (headerData, row, rowKey) => {
                // column indexes start after generated optional columns like collapsible or select column(s)
                const { firstUserColumnIndex } = headerData[0].extraParams;
                const isFullWidth = row && row.fullWidth;
                // typically you'd want to map each cell to its column header, but in the case of fullWidth
                // the first column could be the Select and/or Expandable column
                let additionalColsIndexShift = isFullWidth ? 0 : firstUserColumnIndex;
                return Object.assign({}, (row &&
                    (row.cells || row).reduce((acc, cell, cellIndex) => {
                        const isCellObject = cell === Object(cell);
                        const isCellFunction = cell && typeof cell.title === 'function';
                        let formatters = [];
                        if (isCellObject && cell.formatters) {
                            // give priority to formatters specified on the cell object
                            // expandable example:
                            // rows: [{ parent: 0, fullWidth: true, cells: [{ title: 'fullWidth, child - a', formatters: [expandable]}] }]
                            formatters = cell.formatters;
                        }
                        else if (isFullWidth && cellIndex < firstUserColumnIndex) {
                            // for backwards compatibility, map the cells that are not under user columns (like Select/Expandable)
                            // to the first user column's header formatters
                            formatters = headerData[firstUserColumnIndex].cell.formatters;
                        }
                        let mappedCellTitle = cell;
                        if (isCellObject && isCellFunction) {
                            mappedCellTitle = cell.title(cell.props.value, rowKey, cellIndex, cell.props);
                        }
                        else if (isCellObject) {
                            mappedCellTitle = cell.title;
                        }
                        const mappedCell = {
                            [headerData[cellIndex + additionalColsIndexShift].property]: {
                                title: mappedCellTitle,
                                formatters,
                                props: Object.assign({ isVisible: true }, (isCellObject ? cell.props : null))
                            }
                        };
                        // increment the shift index when a cell spans multiple columns
                        if (isCellObject && cell.props && cell.props.colSpan) {
                            additionalColsIndexShift += cell.props.colSpan - 1;
                        }
                        return Object.assign(Object.assign({}, acc), mappedCell);
                    }, { secretTableRowKeyId: row.id !== undefined ? row.id : rowKey })));
            };
        }
        render() {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _a = this.props, { className, headerData, rows, rowKey, children, onRowClick } = _a, props = __rest$2(_a, ["className", "headerData", "rows", "rowKey", "children", "onRowClick"]);
            let mappedRows;
            if (headerData.length > 0) {
                mappedRows = rows.map((oneRow, oneRowKey) => (Object.assign(Object.assign(Object.assign({}, oneRow), this.mapCells(headerData, oneRow, oneRowKey)), { isExpanded: isRowExpanded(oneRow, rows), isHeightAuto: oneRow.heightAuto || false, isFirst: oneRowKey === 0, isLast: oneRowKey === rows.length - 1, isFirstVisible: false, isLastVisible: false })));
                flagVisibility(mappedRows);
            }
            return (React__namespace.createElement(React__namespace.Fragment, null, mappedRows && (React__namespace.createElement(Body, Object.assign({}, props, { mappedRows: mappedRows, rows: mappedRows, onRow: this.onRow, rowKey: rowKey, className: className })))));
        }
    }
    const TableBody = (_a) => {
        var { className = '', children = null, rowKey = 'secretTableRowKeyId', 
        /* eslint-disable @typescript-eslint/no-unused-vars */
        onRow = (...args) => ({}), onRowClick = (event, row, rowProps, computedData) => 
        /* eslint-enable @typescript-eslint/no-unused-vars */
        undefined } = _a, props = __rest$2(_a, ["className", "children", "rowKey", "onRow", "onRowClick"]);
        return (React__namespace.createElement(TableContext.Consumer, null, (_a) => {
            var { headerData = [], rows = [] } = _a, rest = __rest$2(_a, ["headerData", "rows"]);
            return (React__namespace.createElement(ContextBody, Object.assign({ headerData: headerData, rows: rows, onRow: onRow, className: className, rowKey: rowKey, onRowClick: onRowClick }, props, rest), children));
        }));
    };

    const EditableSelectInputCell = ({ value, rowIndex, cellIndex, onSelect = () => { }, clearSelection, isOpen = false, onToggle = () => { }, selections = [''], options = [], props }) => {
        const onSelectHandler = (event, newValue, isPlaceholder) => {
            onSelect(newValue, event, rowIndex, cellIndex, isPlaceholder);
        };
        const onClear = (event) => {
            clearSelection(rowIndex, cellIndex, event);
        };
        const select = (React__namespace.createElement(Select, Object.assign({}, props.editableSelectProps, { onSelect: onSelectHandler }, (clearSelection && { onClear }), { isOpen: isOpen, onToggle: onToggle, selections: selections }), options));
        return (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement("div", { className: inlineStyles.inlineEditValue }, Array.isArray(value) ? value.join(', ') : value),
            React__namespace.createElement("div", { className: inlineStyles.inlineEditInput },
                select,
                React__namespace.createElement("div", { className: css(formStyles.formHelperText, formStyles.modifiers.error), "aria-live": "polite" }, props.errorText))));
    };
    EditableSelectInputCell.displayName = 'EditableSelectInputCell';

    const EditableTextCell = ({ value, rowIndex, cellIndex, props, handleTextInputChange, inputAriaLabel, isDisabled = false }) => (React__namespace.createElement(React__namespace.Fragment, null,
        React__namespace.createElement("div", { className: inlineStyles.inlineEditValue }, value),
        React__namespace.createElement("div", { className: inlineStyles.inlineEditInput },
            React__namespace.createElement(TextInput, { isDisabled: isDisabled, value: props.editableValue !== undefined ? props.editableValue : value, validated: props.isValid !== false ? 'default' : 'error', type: "text", onChange: (newValue, event) => {
                    handleTextInputChange(newValue, event, rowIndex, cellIndex);
                }, "aria-label": inputAriaLabel }),
            React__namespace.createElement("div", { className: css(formStyles.formHelperText, formStyles.modifiers.error), "aria-live": "polite" }, props.errorText))));
    EditableTextCell.displayName = 'EditableTextCell';

    const ContextHeader = (_a) => {
        var { className = '', headerRows = undefined } = _a, props = __rest$2(_a, ["className", "headerRows"]);
        return React__namespace.createElement(Header, Object.assign({}, props, { headerRows: headerRows, className: className }));
    };
    const TableHeader = (_a) => {
        var props = __rest$2(_a, []);
        return (React__namespace.createElement(TableContext.Consumer, null, ({ headerRows }) => React__namespace.createElement(ContextHeader, Object.assign({}, props, { headerRows: headerRows }))));
    };
    TableHeader.displayName = 'TableHeader';

    var bullseye = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var title = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var button = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var spinner = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var tooltip = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var formControl = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var dropdown = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var divider = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var badge = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var select = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var form = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var check = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var chipGroup = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var chip = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var popover = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var emptyState = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var inlineEdit = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var table = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var tableGrid = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var tableTreeView = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var tableScrollable = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    exports.ActionsColumn = ActionsColumn;
    exports.BodyCell = BodyCell;
    exports.BodyWrapper = BodyWrapper;
    exports.Caption = Caption;
    exports.CollapseColumn = CollapseColumn;
    exports.DraggableCell = DraggableCell;
    exports.EditableSelectInputCell = EditableSelectInputCell;
    exports.EditableTextCell = EditableTextCell;
    exports.ExpandableRowContent = ExpandableRowContent;
    exports.FavoritesCell = FavoritesCell;
    exports.HeaderCell = HeaderCell;
    exports.HeaderCellInfoWrapper = HeaderCellInfoWrapper;
    exports.InnerScrollContainer = InnerScrollContainer;
    exports.OuterScrollContainer = OuterScrollContainer;
    exports.RowWrapper = RowWrapper;
    exports.SelectColumn = SelectColumn;
    exports.SortColumn = SortColumn;
    exports.Table = Table;
    exports.TableBody = TableBody;
    exports.TableComposable = TableComposable;
    exports.TableContext = TableContext;
    exports.TableHeader = TableHeader;
    exports.TableText = TableText;
    exports.Tbody = Tbody;
    exports.Td = Td;
    exports.Th = Th;
    exports.Thead = Thead;
    exports.Tr = Tr;
    exports.TreeRowWrapper = TreeRowWrapper;
    exports.Visibility = Visibility;
    exports.applyCellEdits = applyCellEdits;
    exports.breakWord = breakWord;
    exports.calculateColumns = calculateColumns;
    exports.cancelCellEdits = cancelCellEdits;
    exports.capitalize = capitalize;
    exports.cellActions = cellActions;
    exports.cellWidth = cellWidth;
    exports.classNames = classNames;
    exports.collapsible = collapsible;
    exports.compoundExpand = compoundExpand;
    exports.defaultTitle = defaultTitle;
    exports.editable = editable;
    exports.emptyCol = emptyCol;
    exports.emptyTD = emptyTD;
    exports.expandable = expandable;
    exports.expandedRow = expandedRow;
    exports.favoritable = favoritable;
    exports.fitContent = fitContent;
    exports.getErrorTextByValidator = getErrorTextByValidator;
    exports.headerCol = headerCol;
    exports.info = info;
    exports.isRowExpanded = isRowExpanded;
    exports.mapOpenedRows = mapOpenedRows;
    exports.mapProps = mapProps;
    exports.nowrap = nowrap;
    exports.parentId = parentId;
    exports.scopeColTransformer = scopeColTransformer;
    exports.selectable = selectable;
    exports.sortable = sortable;
    exports.sortableFavorites = sortableFavorites;
    exports.textCenter = textCenter;
    exports.toCamel = toCamel;
    exports.treeRow = treeRow;
    exports.truncate = truncate;
    exports.validateCellEdits = validateCellEdits;
    exports.wrappable = wrappable;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
