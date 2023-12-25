#!/bin/bash

# https://fonts.google.com/noto/specimen/Noto+Sans+JP

pyftsubset NotoSansJP-Medium.ttf \
  --text=┬└├│ \
  --layout-features="*" \
  --output-file=SlackChannelsGrounping-NotoSansJP-Medium.ttf
