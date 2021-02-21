#!/bin/bash

export NODE_ENV=production

cd /opt/deckdb

npx browserslist@latest --update-db

## https://nextjs.org/telemetry
npx next telemetry disable

npx next start

