/**
 *
 * Name v0.0.1
 * Priority+ pattern navigation that hides menu items based on the viewport width, by Gijs Roge.
 *
 * Free to use under the MIT License.
 * http://twitter.com/GijsRoge
 *
 */

(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define('priorityNav', factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.priorityNav = factory(root);
  }
})(window || this, function (root) {

  'use strict';

  //
  // Variables
  //

  var priorityNav = {}; // Object for public APIs
  var supports = !!document.querySelector && !!root.addEventListener; // Feature test
  var settings, breakpoints, navElement;

  // Default settings
  var defaults = {
    initClass: 'js-priorityNav',
    navDropdownClassName: 'nav__dropdown',
    navElement: 'nav',
    itemToDropdown: function () {},
    itemToNav: function () {}
  };


  //
  // Methods
  //

  /**
   * A simple forEach() implementation for Arrays, Objects and NodeLists
   * @private
   * @param {Array|Object|NodeList} collection Collection of items to iterate
   * @param {Function} callback Callback function for each iteration
   * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
   */
  var forEach = function (collection, callback, scope) {
    if (Object.prototype.toString.call(collection) === '[object Object]') {
      for (var prop in collection) {
        if (Object.prototype.hasOwnProperty.call(collection, prop)) {
          callback.call(scope, collection[prop], prop, collection);
        }
      }
    } else {
      for (var i = 0, len = collection.length; i < len; i++) {
        callback.call(scope, collection[i], i, collection);
      }
    }
  };


  /**
   * Merge defaults with user options
   * @private
   * @param {Object} defaults Default settings
   * @param {Object} options User options
   * @returns {Object} Merged values of defaults and options
   */
  var extend = function ( defaults, options ) {
    var extended = {};
    forEach(defaults, function (value, prop) {
      extended[prop] = defaults[prop];
    });
    forEach(options, function (value, prop) {
      extended[prop] = options[prop];
    });
    return extended;
  };


  /**
   * Get the closest matching element up the DOM tree
   * @param {Element} elem Starting element
   * @param {String} selector Selector to match against (class, ID, or data attribute)
   * @return {Boolean|Element} Returns false if not match found
   */
  var getClosest = function (elem, selector) {
    var firstChar = selector.charAt(0);
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if ( firstChar === '.' ) {
        if ( elem.classList.contains( selector.substr(1) ) ) {
          return elem;
        }
      } else if ( firstChar === '#' ) {
        if ( elem.id === selector.substr(1) ) {
          return elem;
        }
      } else if ( firstChar === '[' ) {
        if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
          return elem;
        }
      }
    }
    return false;
  };


  /**
   * Get siblings of an element
   * @private
   * @param  {Element} elem
   * @return {NodeList}
   */
  var getSiblings = function (elem) {
    var siblings = [];
    var sibling = elem.parentNode.firstChild;
    var skipMe = elem;
    for ( ; sibling; sibling = sibling.nextSibling ) {
      if ( sibling.nodeType == 1 && sibling != elem ) {
        siblings.push( sibling );
      }
    }
    return siblings;
  };


  /**
   * Insert after element
   * @param newElement
   * @param TargetElement
   */
  var insertAfter = function(newElement, targetElement){
    var parent = targetElement.parentNode;
    if(parent.lastChild == targetElement){
      parent.appendChild(newElement)
    }else{
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  }


  /**
   * Debounced resize to throttle execution
   * @param func
   * @param wait
   * @param immediate
   * @returns {Function}
   */
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  /**
   * Prepare html to put menu items in that don't fit.
   * @param navElement
   */
  var prepareHtml = function(navElement){
    // Create nav dropdown
    var dropdownElement = document.createElement("ul");
    dropdownElement.className = settings.navDropdownClassName;

    // Inject nav dropdown after menu
    navElement.appendChild(dropdownElement);
  };

  /**
   * Get width
   * @param elem
   * @returns {number}
   */
  var calculateWidths = debounce(function (el) {
    var navWidth = el.offsetWidth;
  },250);


  /**
   * Destroy the current initialization.
   * @public
   */
  priorityNav.destroy = function () {

    // If plugin isn't already initialized, stop
    if ( !settings ) return;

    // Remove feedback class
    document.documentElement.classList.remove( settings.initClass );

    // Remove settings
    settings = null;
  };


  /**
   * Initialize Plugin
   * @public
   * @param {Object} options User settings
   */
  priorityNav.init = function ( options ) {

    // feature test
    if ( !supports ) return;

    // Destroy any existing initializations
    priorityNav.destroy();

    // Merge user options with defaults
    settings = extend( defaults, options || {} );

    // Add class to HTML element to activate conditional CSS
    document.documentElement.classList.add( settings.initClass );

    // Nav element
    navElement = document.querySelector(settings.navElement); // Get the fixed header

    // Calculate navElement width when resizing browser
    window.addEventListener('resize', function(){calculateWidths(navElement)});

    // Start plugin by calculating navElement width
    calculateWidths(navElement);

    // Prepare html
    prepareHtml(navElement);

  };


  //
  // Public APIs
  //
  return priorityNav;

});