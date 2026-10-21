#!/bin/bash
# Double-click to close the SBB mini clock started by "SBB Mini Clock (Mac).command".
# This Terminal window closes by itself after a moment.

# Run a command detached from this Terminal window, so Terminal closes the window without asking
detach() { perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' "$@" >/dev/null 2>&1 & }

if pkill -f 'osascript -l JavaScript (.*/)?sbb-mini-mac[.]js'; then echo "SBB mini clock closed."; else echo "SBB mini clock is not running."; fi

# Close this window two seconds after this script has ended, so the message above can be read
detach osascript -e 'delay 2' -e "tell application \"Terminal\" to close (every window whose tty of selected tab is \"$(tty)\")"
