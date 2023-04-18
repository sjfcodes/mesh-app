#!/bin/bash

npm run deploy:ddb-table:$1
npm run deploy:ddb-table-item:$1
npm run deploy:plaid-link:$1