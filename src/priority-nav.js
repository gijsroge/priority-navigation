/**
 *
 * Name v0.0.1
 * Priority+ pattern navigation that hides menu items based on the viewport width.
 *
 * Structure based on https://github.com/cferdinandi UMD boilerplate
 * Code inspired by http://codepen.io/lukejacksonn/pen/PwmwWV
 *
 * Free to use under the MIT License.
 * http://twitter.com/GijsRoge
 *
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('priorityNav', factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.priorityNav = factory(root);
    }
})(window || this, function (root) {

    'use strict';

    /**
     * Variables
     */
    var priorityNav = {}; // Object for public APIs
    var breaks = []; // Array to store menu item's that don't fit.
    var supports = !!document.querySelector && !!root.addEventListener; // Feature test
    var settings = {};
    var navWrapper, totalWidth, restWidth, navMenu, navDropdown, navDropdownToggle;


    /**
     * Default settings
     * @type {{initClass: string, navDropdownClassName: string, navDropdownToggle: string, navWrapper: string, itemToDropdown: Function, itemToNav: Function}}
     */
    var defaults = {
        initClass: 'js-priorityNav',
        navDropdownClassName: 'nav__dropdown',
        navDropdownToggle: 'nav__dropdown-toggle',
        throttleDelay: 250,
        navWrapper: 'nav',
        navMenu: 'nav__menu',
        itemToDropdown: function () {
        },
        itemToNav: function () {
        }
    };


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
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function (defaults, options) {
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
     * Debounced resize to throttle execution
     * @param func
     * @param wait
     * @param immediate
     * @returns {Function}
     */
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
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
     * Toggle class on element
     * @param el
     * @param className
     */
    var toggleClass = function(el, className) {
        if (el.classList) {
            el.classList.toggle(className);
        } else {
            var classes = el.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1); else
                classes.push(className);

            el.className = classes.join(' ');
        }
    };


    /**
     * Check if dropdown ul is already on page before creating it
     * @param navWrapper
     */
    var prepareHtml = function () {
        if (!document.querySelector('.' + settings.navDropdownClassName)) {
            // Create nav dropdown if it doesn't already exist
            navDropdown = document.createElement("ul");
            navDropdown.className = settings.navDropdownClassName;
            // Inject dropdown ul after navigation
            navWrapper.appendChild(navDropdown);
        }
    };


    /**
     * Get width
     * @param elem
     * @returns {number}
     */
    var calculateWidths = function () {
        totalWidth = navWrapper.offsetWidth;
        restWidth = getChildrenWidth(navWrapper) - totalWidth;
    };


    /**
     * Move item to array
     * @param item
     */
    var doesItFit = debounce(function (item) {

        // Update width
        calculateWidths();

        // Keep executing until all menu items that are overflowing are moved
        while (totalWidth < restWidth) {
            //move item to dropdown
            priorityNav.toDropdown();
            //recalculate widths
            calculateWidths()
        }

        // Keep executing until all menu items that are able to move back or moved
        while (totalWidth > breaks[breaks.length - 1]) {
            //move item to menu
            priorityNav.toMenu();
        }

        // Show or hide toggle
        if(breaks.length < 1){
            navDropdownToggle.classList.add('is-hidden');
            navDropdownToggle.classList.remove('is-visible');
        }else{
            navDropdownToggle.classList.add('is-visible');
            navDropdownToggle.classList.remove('is-hidden');
        }

    },50);


    /**
     * Move item to dropdown
     */
    priorityNav.toDropdown = function () {
        //move last child of navigation menu to dropdown
        if(navDropdown.firstChild && navMenu.children.length > 0){
            console.log('first');
            navDropdown.insertBefore(navMenu.lastElementChild,navDropdown.firstChild);
        }
        else if(navMenu.children.length > 0){
            console.log('second');
            navDropdown.appendChild(navMenu.lastElementChild);
        }
        //record breakpoints to restore items
        breaks.push(restWidth);
        //callback
        settings.itemToDropdown();
    }


    /**
     * Move item to menu
     */
    priorityNav.toMenu = function () {
        //move last child of navigation menu to dropdown
        if(navDropdown.children.length > 0) navMenu.appendChild(navDropdown.firstElementChild);
        //remove last breakpoint
        breaks.pop();
        //callback
        settings.itemToNav();
    }


    /**
     * Count width of children and return the value
     * @param e
     */
    var getChildrenWidth = function (e) {
        var children = e.childNodes;
        var sum = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeType != 3) {
                var sum = sum + children[i].offsetWidth;
            }
        }
        return sum;
    }


    /**
     * Bind eventlisteners
     */
    var listeners = function () {
        // Check if an item needs to move
        window.addEventListener('resize', doesItFit);
        // Toggle dropdown
        navDropdownToggle.addEventListener('click', function(){
            toggleClass(navDropdown, 'show');
        });


        /*
         * Remove when clicked outside dropdown
         */
        document.addEventListener('click', function (event) {
            if(!getClosest(event.target, '.'+settings.navDropdownClassName) && event.target !== navDropdownToggle){
                navDropdown.classList.remove('show');
            }
        });
    };


    /**
     * Destroy the current initialization.
     * @public
     */
    priorityNav.destroy = function () {
        // If plugin isn't already initialized, stop
        if (!settings) return;
        // Remove feedback class
        document.documentElement.classList.remove(settings.initClass);
        // Remove settings
        settings = null;

        delete priorityNav.init;
    };


    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    priorityNav.init = function (options) {
        // Feature test.
        if (!supports) return;
        // Destroy any existing initializations
        priorityNav.destroy();
        // Merge user options with defaults
        settings = extend(defaults, options || {});
        // Add class to HTML element to activate conditional CSS
        document.documentElement.classList.add(settings.initClass);

        // Store html element
        navWrapper = document.querySelector(settings.navWrapper);
        navMenu = document.querySelector('.' + settings.navMenu);
        navDropdown = document.querySelector('.' + settings.navDropdownClassName);
        navDropdownToggle = document.querySelector('.' + settings.navDropdownToggle);

        // Generated the needed html if it doesn't exist yet.
        prepareHtml();
        // Event listeners
        listeners();
        // Start plugin by checking if menu items fits
        doesItFit();
    };


    /**
     * Public APIs
     */
    return priorityNav;

});