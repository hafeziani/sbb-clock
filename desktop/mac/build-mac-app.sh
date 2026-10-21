#!/bin/bash
# Builds "SBB Mini Clock.app" next to this script from sbb-mini-mac.js, with the SBB clock as its icon.
# Run it again after changing sbb-mini-mac.js. The app can then be moved to /Applications.
set -e
cd "$(dirname "$0")"
APP="SBB Mini Clock.app"

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp sbb-mini-mac.js "$APP/Contents/Resources/"

# The app's program: a shell script that becomes the clock process (exec), so macOS treats the clock as the app
cat > "$APP/Contents/MacOS/SBBMiniClock" <<'EOF'
#!/bin/bash
exec osascript -l JavaScript "$(dirname "$0")/../Resources/sbb-mini-mac.js"
EOF
chmod +x "$APP/Contents/MacOS/SBBMiniClock"

# LSUIElement: no Dock icon and no menu bar, like the clock itself
cat > "$APP/Contents/Info.plist" <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleName</key>			<string>SBB Mini Clock</string>
	<key>CFBundleIdentifier</key>		<string>local.sbb-mini-clock</string>
	<key>CFBundleExecutable</key>		<string>SBBMiniClock</string>
	<key>CFBundleIconFile</key>		<string>AppIcon</string>
	<key>CFBundlePackageType</key>		<string>APPL</string>
	<key>CFBundleShortVersionString</key>	<string>1.0</string>
	<key>LSUIElement</key>			<true/>
</dict>
</plist>
EOF

# Icon: the web app's clock picture on a black square that fills the whole 1024 px canvas. macOS rounds the
# corners itself; a picture with transparent corners would instead be put on a gray tile.
ICONSET="$(mktemp -d)/AppIcon.iconset"
mkdir "$ICONSET"
osascript -l JavaScript - "$PWD/../../files/icon-512x512.png" "$ICONSET/icon_512x512@2x.png" <<'EOF' >/dev/null
ObjC.import('Cocoa');
function run(argv) {
	var S = 1024, clock = 820;	// Canvas and clock size in px
	var rep = $.NSBitmapImageRep.alloc.initWithBitmapDataPlanesPixelsWidePixelsHighBitsPerSampleSamplesPerPixelHasAlphaIsPlanarColorSpaceNameBytesPerRowBitsPerPixel(
		null, S, S, 8, 4, true, false, 'NSCalibratedRGBColorSpace', 0, 0);
	$.NSGraphicsContext.saveGraphicsState;
	$.NSGraphicsContext.setCurrentContext($.NSGraphicsContext.graphicsContextWithBitmapImageRep(rep));
	$.NSColor.blackColor.setFill;
	$.NSRectFill($.NSMakeRect(0, 0, S, S));
	$.NSImage.alloc.initWithContentsOfFile(argv[0]).drawInRectFromRectOperationFraction(
		$.NSMakeRect((S - clock) / 2, (S - clock) / 2, clock, clock), $.NSZeroRect, 2, 1);	// 2: draw over the black
	$.NSGraphicsContext.restoreGraphicsState;
	rep.representationUsingTypeProperties(4, $()).writeToFileAtomically(argv[1], true);	// 4: PNG
}
EOF
# Scale the 1024 px picture to the other sizes macOS wants
for s in 16 32 128 256 512; do
	sips -z $s $s "$ICONSET/icon_512x512@2x.png" --out "$ICONSET/icon_${s}x${s}.png" >/dev/null
	[ $s = 512 ] || sips -z $((s * 2)) $((s * 2)) "$ICONSET/icon_512x512@2x.png" --out "$ICONSET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$ICONSET" -o "$APP/Contents/Resources/AppIcon.icns"
rm -rf "$(dirname "$ICONSET")"

touch "$APP"	# Make Finder pick up the new icon
echo "Built $PWD/$APP"
