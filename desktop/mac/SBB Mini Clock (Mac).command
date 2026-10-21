#!/bin/bash
# Double-click to start the SBB mini clock (see sbb-mini-mac.js). If it is already running, it is restarted.
# This Terminal window closes by itself; the clock keeps running.
cd "$(dirname "$0")"

# Run a command detached from this Terminal window (in its own session), so closing the window
# neither stops it nor makes Terminal ask "Do you want to terminate running processes?"
detach() { perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' "$@" >/dev/null 2>&1 & }

pkill -f 'osascript -l JavaScript (.*/)?sbb-mini-mac[.]js'	# Restart instead of opening a second clock
detach osascript -l JavaScript sbb-mini-mac.js

# Close this window one second after this script has ended (found by its terminal device, e.g. /dev/ttys003)
detach osascript -e 'delay 1' -e "tell application \"Terminal\" to close (every window whose tty of selected tab is \"$(tty)\")"
