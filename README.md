# sbbUhr
A java script version of the famous SBB Clock for digital usage. 
## Initialisation
In your html header add `<script src="path/to/sbbUhr-1.3.js"></script>`

In the html body define a `<div></div>` Tag with a unique id where the clock will be hosted. 

In a seperate script create a new clock `var myClock = new sbbUhr(container, background, fps);`

`container (string or element)` is the id of the defined div container (or the element itself), where the clock will be hosted. 

optional `background (boolean)` true = clock will be placed on a dark background, false = clock will be placed on a white background. 

optional `fps` set the refreshrate of the clock. Must be higher than 10 frames/second to get a smooth pointer movement. If not set, the clock will be rendered with every frame.

## Methods
`myClock.start()` will start the clock. 

`myClock.stop()` will stop the clock.

`myClock.angles(date)` returns the hand angles `{s, m, h}` in degrees for the given `Date`.

## Picture-in-Picture
`index.html` has a Picture-in-Picture button (bottom right, or press `P`). The clock is drawn on a canvas and shown as a video PiP, a small always-on-top window without a title bar; browsers without video PiP fall back to a Document PiP window. The button is hidden in browsers that support neither (e.g. Firefox).

## Install as an app
The page has a web app manifest, so it can be installed (Chrome: ⋮ → Cast, save and share → Install page as app; Edge: ⋯ → Apps → Install this site as an app). The installed clock opens in its own window that can be resized much smaller than a PiP window, and the clock fills it. On Windows, PowerToys *Always On Top* (Win + Ctrl + T) keeps it above other windows.

## Mini desktop clock
The `desktop` folder has a tiny frameless clock that stays on top of all windows and can be made smaller than any browser window (drag to move, right-click for sizes and Quit).

- Mac: double-click `SBB Mini Clock (Mac).command` (the first time: right-click → Open).
- Windows: double-click `SBB Mini Clock (Windows).cmd`. Needs PowerShell in full language mode, so it won't run on PCs where a company policy restricts PowerShell.
