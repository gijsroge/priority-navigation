# PriorityNavigation.js
PriorityNav is a lightweight pure javascript plugin that will move your menu items if they don't fit its parent.
![Priority Navigation demo](http://gijsroge.github.io/priority-nav.js/priority-nav-demo.gif)

##Take a look at the **[Demo](http://gijsroge.github.io/priority-nav.js/)** site.

----------

### Features
- **No dependencies**<br>The plugin is written in pure javascript making it fast and lean.
- **Smart calculation of available space**<br>It automaticly looks for the main navigation's siblings and calculates remaining space.
- **Non obstructive menu dropdown**<br>The dropdown menu can be closed by clicking outside and pressing escape.
- **Callbacks**<br>Callbacks are fired when an item is moved or moved back from the main navigation.

### Installation
Load plugin files

```html
<!DOCTYPE html>
<head>
    <link rel="stylesheet" href="priority-nav-core.css">
</head>

<body>
    <script async src=”priority-nav.js”></script>
</body>
```

Call plugin without any options.
```js
var priorityNav = priorityNav.init();
```
Ideal html structure
```html
<nav>
    <ul> <- needs to be inline-block
        <li>menu item</li>
        <li>menu item</li>
        <li>menu item</li>
        <li>menu item</li>
    </ul>
</nav>
```

### Options
```js
initClass:          "js-priorityNav", // Class that will be printed on html element to allow conditional css styling.
mainNavWrapper:     "nav", // mainnav wrapper selector (must be direct parent from navMenu)
mainNav:            "ul", // mainnav selector.
navDropdown:        ".nav__dropdown", // class used for the dropdown.
navDropdownToggle:  ".nav__dropdown-toggle", // class used for the dropdown toggle.
navDropdownLabel:   "more", // Text that is used for the dropdown toggle.
throttleDelay:      50, // this will throttle the calculating logic on resize because i'm a responsible dev.
offsetPixels:       0, // increase to decrease the time it takes to move an item.
count:              true, // prints the amount of items are moved to the attribute data-count.

//Callbacks
moved: function () {}, // executed when item is moved to dropdown
movedBack: function () {} // executed when item is moved back to main menu
```

### Package managers
- **npm:** `npm --install priority-nav.js`
- **bower:** `bower --install priority-nav.js`

### Building the source files
```
#cloning repository
git clone https://github.com/gijsroge/priority-navigation.git
cd priority-navigation

#dependencies
npm install

#build files to dist folder
grunt build
```

### IE9 Support
To support Internet Explorer 9 and lower [classList.js](https://github.com/remy/polyfills/blob/master/classList.js/) must be added your page.

```html
<!--[if lt IE 9]><script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/2.0.8/es5-shim.min.js"></script><![endif]-->
```

### IE8 Support
To support Internet Explorer 8, [es5-shim](https://github.com/kriskowal/es5-shim/) and classList.js from above must be added your page.

```html
<!--[if lt IE 9]><script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/2.0.8/es5-shim.min.js"></script><![endif]-->
```