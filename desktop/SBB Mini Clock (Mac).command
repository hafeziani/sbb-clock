#!/bin/bash
# Double-click to start the SBB mini clock (see sbb-mini-mac.js). It keeps running after this Terminal window is closed.
nohup osascript -l JavaScript "$(dirname "$0")/sbb-mini-mac.js" >/dev/null 2>&1 &
disown
