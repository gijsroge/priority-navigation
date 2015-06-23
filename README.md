# PriorityNavigation.js
PriorityNav is a lightweight pure javascript plugin that will move your menu items if they don't fit its parent.
![Priority Navigation demo](http://gijsroge.github.io/priority-nav.js/priority-nav-demo.gif)



Take a look at the **[Demo](http://gijsroge.github.io/priority-nav.js/)** site.


----------


### Features
- **No dependencies**<br>The plugin is written in pure javascript making it fast and lean.
- **Smart calculation of available space**<br>It automaticly looks for the main navigation's siblings and calculates remaining space.
- **Non obstructive menu dropdown**<br>The dropdown menu can be closed by clicking outside and pressing escape.
- **Callbacks**<br>Callbacks are fired when an item is moved or moved back from the main navigation.

### Installation
Download and load plugin files
```html
<!DOCTYPE html>
<head>
    <link rel="stylesheet" href="priority-nav-core.css">
</head>

<body>
    <script async src=”priority-nav.js”></script>
</body>
```
**npm:** `npm --install priority-nav.js`
**bower:** `bower --install priority-nav.js`

Call plugin without options
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

To support Internet Explorer 8, [es5-shim](https://github.com/kriskowal/es5-shim/) must be added your page.

```html
<!--[if lt IE 9]><script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/2.0.8/es5-shim.min.js"></script><![endif]-->
```