// SBB Mini Clock for macOS: a small, frameless SBB clock that stays on top of all windows.
// Start it with "SBB Mini Clock (Mac).command", or in Terminal: osascript -l JavaScript sbb-mini-mac.js
// Drag to move, right-click for sizes and Quit. Position and size are remembered.
// Written in JavaScript for Automation (JXA): $.Name is the macOS class or function "Name", and
// Objective-C methods are called with their parts joined, e.g. initWithFrameConfiguration(a, b).
ObjC.import('Cocoa');	// Windows, views, menus
ObjC.import('WebKit');	// WKWebView, which draws the clock

var NAME = 'SBBMiniClock';	// Key under which macOS saves the window's position and size
var SIZES = [48, 64, 96, 128, 192, 256];	// Clock sizes (px) offered in the right-click menu

// The clock face: an SVG of the SBB clock plus a script that turns the hands. The second hand sweeps
// round in 58.5 s and waits at 12; the minute and hour hands jump with a small bounce (ease) each minute.
var HTML = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }svg { display: block; width: 100vmin; height: 100vmin; }</style></head><body><svg viewBox=\"0 0 112 112\"><circle fill=\"#ffffff\" cx=\"56\" cy=\"56\" r=\"52.5\"/><path fill=\"#767676\" d=\"M56,3.5c28.995,0,52.5,23.505,52.5,52.5S84.995,108.5,56,108.5S3.5,84.995,3.5,56 S27.005,3.5,56,3.5 M56,2C26.224,2,2,26.224,2,56s24.224,54,54,54s54-24.224,54-54S85.776,2,56,2L56,2z\"/><path fill=\"#1e1e1e\" d=\"M51.627,7.693l0.366,3.481L50.6,11.32l-0.366-3.481L51.627,7.693z M54.25,19.5h3.5v-12h-3.5V19.5z M54.25,104.5h3.5v-12h-3.5V104.5z M72.734,23.515l3.031,1.75l6-10.392l-3.031-1.75L72.734,23.515z M30.234,97.127l3.031,1.75 l6-10.392l-3.031-1.75L30.234,97.127z M88.485,39.266l10.392-6l-1.75-3.031l-10.392,6L88.485,39.266z M23.515,72.734l-10.392,6 l1.75,3.031l10.392-6L23.515,72.734z M92.5,54.25v3.5h12v-3.5H92.5z M19.5,54.25h-12v3.5h12V54.25z M86.735,75.766l10.392,6 l1.75-3.031l-10.392-6L86.735,75.766z M25.265,36.234l-10.392-6l-1.75,3.031l10.392,6L25.265,36.234z M72.734,88.485l6,10.392 l3.031-1.75l-6-10.392L72.734,88.485z M30.234,14.873l6,10.392l3.031-1.75l-6-10.392L30.234,14.873z M60.008,11.173L61.4,11.32 l0.366-3.481l-1.392-0.146L60.008,11.173z M50.234,104.161l1.392,0.146l0.366-3.481L50.6,100.68L50.234,104.161z M64.671,11.838 l1.369,0.291l0.728-3.424l-1.369-0.291L64.671,11.838z M45.232,103.295l1.369,0.291l0.728-3.424l-1.369-0.291L45.232,103.295z M69.24,12.986l1.331,0.433l1.082-3.329l-1.331-0.433L69.24,12.986z M40.347,101.91l1.331,0.433l1.082-3.329l-1.331-0.433 L40.347,101.91z M76.366,11.978l-1.279-0.569l-1.424,3.197l1.279,0.569L76.366,11.978z M35.634,100.022l1.279,0.569l1.424-3.197 l-1.279-0.569L35.634,100.022z M81.884,19.183l1.133,0.823l2.057-2.832l-1.133-0.823L81.884,19.183z M26.926,94.826l1.133,0.823 l2.057-2.832l-1.133-0.823L26.926,94.826z M88.973,20.426l-1.04-0.937l-2.342,2.601l1.04,0.937L88.973,20.426z M23.027,91.574 l1.04,0.937l2.342-2.601l-1.04-0.937L23.027,91.574z M92.511,24.067l-0.937-1.04l-2.601,2.342l0.937,1.04L92.511,24.067z M19.489,87.933l0.937,1.04l2.601-2.342l-0.937-1.04L19.489,87.933z M92.817,30.116l2.832-2.057l-0.823-1.133l-2.832,2.057 L92.817,30.116z M19.183,81.884l-2.832,2.057l0.823,1.133l2.832-2.057L19.183,81.884z M97.394,38.336l3.197-1.424l-0.569-1.279 l-3.197,1.424L97.394,38.336z M14.606,73.664l-3.197,1.424l0.569,1.279l3.197-1.424L14.606,73.664z M99.014,42.76l3.329-1.082 l-0.433-1.331l-3.329,1.082L99.014,42.76z M12.986,69.24l-3.329,1.082l0.433,1.331l3.329-1.082L12.986,69.24z M100.162,47.329 l3.424-0.728l-0.291-1.369l-3.424,0.728L100.162,47.329z M11.838,64.671l-3.424,0.728l0.291,1.369l3.424-0.728L11.838,64.671z M100.827,51.992l3.481-0.366l-0.146-1.392L100.68,50.6L100.827,51.992z M11.173,60.008l-3.481,0.366l0.146,1.392L11.32,61.4 L11.173,60.008z M100.68,61.4l3.481,0.366l0.146-1.392l-3.481-0.366L100.68,61.4z M11.32,50.6l-3.481-0.366l-0.146,1.392 l3.481,0.366L11.32,50.6z M99.871,66.041l3.424,0.728l0.291-1.369l-3.424-0.728L99.871,66.041z M12.129,45.959l-3.424-0.728 l-0.291,1.369l3.424,0.728L12.129,45.959z M98.581,70.571l3.329,1.082l0.433-1.331l-3.329-1.082L98.581,70.571z M13.419,41.428 l-3.329-1.082l-0.433,1.331l3.329,1.082L13.419,41.428z M96.825,74.943l3.197,1.424l0.569-1.279l-3.197-1.424L96.825,74.943z M15.175,37.057l-3.197-1.424l-0.569,1.279l3.197,1.424L15.175,37.057z M91.994,83.017l2.832,2.057l0.823-1.133l-2.832-2.057 L91.994,83.017z M20.006,28.983l-2.832-2.057l-0.823,1.133l2.832,2.057L20.006,28.983z M88.973,86.631l2.601,2.342l0.937-1.04 l-2.601-2.342L88.973,86.631z M23.027,25.369l-2.601-2.342l-0.937,1.04l2.601,2.342L23.027,25.369z M85.591,89.91l2.342,2.601 l1.04-0.937l-2.342-2.601L85.591,89.91z M23.027,20.426l2.342,2.601l1.04-0.937l-2.342-2.601L23.027,20.426z M81.884,92.817 l2.057,2.832l1.133-0.823l-2.057-2.832L81.884,92.817z M26.926,17.174l2.057,2.832l1.133-0.823l-2.057-2.832L26.926,17.174z M73.664,97.394l1.424,3.197l1.279-0.569l-1.424-3.197L73.664,97.394z M38.336,14.606l-1.424-3.197l-1.279,0.569l1.424,3.197 L38.336,14.606z M69.24,99.014l1.082,3.329l1.331-0.433l-1.082-3.329L69.24,99.014z M40.347,10.09l1.082,3.329l1.331-0.433 l-1.082-3.329L40.347,10.09z M64.671,100.162l0.728,3.424l1.369-0.291l-0.728-3.424L64.671,100.162z M45.232,8.705l0.728,3.424 l1.369-0.291l-0.728-3.424L45.232,8.705z M60.008,100.827l0.366,3.481l1.392-0.146L61.4,100.68L60.008,100.827z\"/><polygon id=\"h\" fill=\"#000000\" points=\"59.2,68 52.8,68 53.4,24 58.6,24\"/><polygon id=\"m\" fill=\"#000000\" points=\"58.6,68 53.4,68 54.2,10 57.8,10\"/><path id=\"s\" fill=\"#eb0000\" d=\"M61.25,24.8c0-2.899-2.351-5.25-5.25-5.25s-5.25,2.351-5.25,5.25c0,2.66,1.985,4.834,4.55,5.179V72.5h1.4V29.979C59.265,29.634,61.25,27.46,61.25,24.8z\"/></svg><script>function ease(t, b, c, d) { t /= d; return t < 1 ? c * Math.pow(2, -10 * t) * Math.sin((t * d - 2) * (2 * Math.PI) / 300) * 1.5 + c + b : b + c; }function rot(id, deg) { document.getElementById(id).setAttribute(\"transform\", \"rotate(\" + deg + \" 56 56)\"); }function tick() { var d = new Date(), mss = d.getSeconds() * 1000 + d.getMilliseconds(); rot(\"s\", Math.min(d.getSeconds() * (360 / 58.5) + d.getMilliseconds() * .006, 360)); rot(\"m\", ease(mss, d.getMinutes() * 6 - 6, 6, 2000)); rot(\"h\", ease(mss, d.getHours() * 30 + d.getMinutes() / 2 - .5, .5, 2000)); setTimeout(tick, 33);}tick();</script></body></html>";

// --- App ---
var app = $.NSApplication.sharedApplication;
app.setActivationPolicy(1);	// Accessory: no Dock icon, no menu bar

// --- Window ---
// Default position: top-right corner of the main screen, 16 px from the edges. macOS counts y from the
// bottom of the screen, so a bigger y is higher up. visibleFrame leaves out the menu bar and the Dock.
var screen = $.NSScreen.mainScreen.visibleFrame;
var size = 96;	// Default size in px (the clock is always square)
var win = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(
	$.NSMakeRect(screen.origin.x + screen.size.width - size - 16, screen.origin.y + screen.size.height - size - 16, size, size),
	0, 2, false);	// Borderless, buffered
win.setOpaque(false);	// Together with the clear background: only the round clock is visible
win.setBackgroundColor($.NSColor.clearColor);
win.setHasShadow(false);
win.setLevel(3);	// Floating: above normal windows
win.setCollectionBehavior(1 | 256);	// On all Spaces, also next to full-screen apps
win.setMovableByWindowBackground(true);
win.setReleasedWhenClosed(false);
win.setFrameUsingName(NAME);	// Restore saved position and size (these win over the defaults above)
win.setFrameAutosaveName(NAME);	// Save them whenever the window moves or resizes

// --- Clock face ---
var bounds = win.contentView.bounds;	// The window's inside area, as (0, 0, width, height)
var web = $.WKWebView.alloc.initWithFrameConfiguration(bounds, $.WKWebViewConfiguration.alloc.init);
web.setValueForKey($.NSNumber.numberWithBool(false), 'drawsBackground');	// Transparent page background
web.setAutoresizingMask(18);	// Follow the window's width and height
web.loadHTMLStringBaseURL(HTML, $.NSURL.URLWithString('about:blank'));	// JS null would become NSNull and crash WebKit
win.contentView.addSubview(web);

// --- Mouse ---
// Transparent view on top of the clock: dragging it moves the window, right-click opens the menu
ObjC.registerSubclass({	// A new NSView class whose mouse handling is written in JavaScript
	name: 'SBBMiniClockDragView',
	superclass: 'NSView',
	methods: {
		'mouseDown:': { types: ['void', ['id']], implementation: function(event) { win.performWindowDragWithEvent(event); } },	// Left button down: move the window while the mouse moves
		'acceptsFirstMouse:': { types: ['bool', ['id']], implementation: function(event) { return true; } }	// Drag on the first click, even while another app is active
	}
});
var overlay = $.SBBMiniClockDragView.alloc.initWithFrame(bounds);
overlay.setAutoresizingMask(18);	// Cover the whole window at every size
win.contentView.addSubview(overlay);	// Added last, so it lies on top of the web view and gets the clicks

// --- Right-click menu ---
function resize(s) {	// Resize around the clock's center
	var f = win.frame;
	win.setFrameDisplay($.NSMakeRect(f.origin.x + (f.size.width - s) / 2, f.origin.y + (f.size.height - s) / 2, s, s), true);
}
ObjC.registerSubclass({	// Object that receives the clicks on the size items
	name: 'SBBMiniClockMenuTarget',
	methods: {
		'setClockSize:': { types: ['void', ['id']], implementation: function(item) { resize(item.tag); } }	// Each item stores its size in its tag
	}
});
var target = $.SBBMiniClockMenuTarget.alloc.init;
var menu = $.NSMenu.alloc.initWithTitle('SBB Uhr');
SIZES.forEach(function(s) {	// One item per size: "48 px", "64 px", ...
	var item = $.NSMenuItem.alloc.initWithTitleActionKeyEquivalent(s + ' px', 'setClockSize:', '');
	item.setTarget(target);
	item.setTag(s);
	menu.addItem(item);
});
menu.addItem($.NSMenuItem.separatorItem);
menu.addItem($.NSMenuItem.alloc.initWithTitleActionKeyEquivalent('Quit', 'terminate:', 'q'));	// terminate: goes to the app, which quits
overlay.setMenu(menu);	// NSView shows its menu on right-click (and Ctrl-click)

// --- Start ---
win.orderFrontRegardless;	// Show the window without making the app active
app.run;	// Handle events until Quit
