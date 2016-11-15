#!/usr/bin/env bash
echo "building css"
lessc --clean-css ./public/css/bigAss.less ./dist/css/index.css
echo "finished css"
echo "building js"
webpack -d -p --progress
echo "finished js"
echo done