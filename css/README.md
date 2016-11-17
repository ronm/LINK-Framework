Waybetter
=========

Easy to use plugin to fire events when elements come into frame. Not much js skills needed. A better replacement for jQuery Waypoints.


Requirements 
------------

jQuery 1.2.3+


Usage
------

First include the `waybetter.min.js` in your document, towards the bottom...right? Then call `$elem.waybetter()`.

```html
<script type="text/javascript" src="waybetter.min.js"></script>
<script type="text/javascript">
	$("#item").waybetter();
</script>
```

This would result in the below when `#item` scrolled into the viewport.

```html
<div id="item" data-waybetter>Lorem ipsum...</div>
```

Tip: you can also tell waybetter to watch elements on load by adding the attribute ```data-waybetter-watch``` to any element.



Options
-------

Options can be passed to the waybetter function at initialization, otherwise it must be followed by the refresh method.

```
$("#item").waybetter({ direction : "horizontal" });
```

later...

```
$("#item").waybetter({ threshold : 50 }).waybetter('refresh');
```

### debounce=0

`number`

How often during scrolling and resizing should waybetter reprocess the DOM. Default zero is no debounce, otherwise integer is milliseconds.



### direction=vertical

`string`

Possible values: *vertical* or *horizontal*



### threshold=0

`number`

A positive value will cause the function to wait to trigger until that many pixels after the element has reached the viewport.

Conversely a negative value will cause the function to trigger that many pixels before the element has reached the viewport.



### viewport=window

`DOM Element` or `jQuery Element` or `string selector`

This is the viewport that the position of the scrolling element is compared to. This will typically remain as window.



Methods
-------

### destroy

This method stops all waybetter points within the document

```
$(document).waybetter('destroy');
```

### inview

Check whether a given item is within the viewport.  

```
$("#item").waybetter('inview');
```

returns `boolean`


### refresh

This will refresh all matched waybetter points. This is useful if you want to set different options after initialization.  

```
$("#item").waybetter('refresh');
```

