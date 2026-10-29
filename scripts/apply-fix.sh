#!/bin/sh
# Swaps the fixed bottom-tabs animated map into the installed expo-router build.
#   scripts/apply-fix.sh        apply the fix from fix/useAnimatedHashMap.js
#   scripts/apply-fix.sh undo   put the published 58.0.28 file back
TARGET=node_modules/expo-router/build/react-navigation/bottom-tabs/utils/useAnimatedHashMap.js
if [ "$1" = "undo" ]; then
  cp fix/useAnimatedHashMap.published.js "$TARGET" && echo "restored the published build"
else
  cp fix/useAnimatedHashMap.js "$TARGET" && echo "applied the fix"
fi
