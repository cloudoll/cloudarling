#!/bin/bash

export NODE_ENV=product
# dir=$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
node index.js
# pm2 start index.js --name=cloudarling