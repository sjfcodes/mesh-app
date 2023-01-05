#!/bin/bash

pathToJs=index.mjs
pathToZip=crudDynamoDbTable.zip

npm ci

zip -r $pathToZip .

aws lambda update-function-code     --region us-east-1     --function-name  crudDynamoDbTable     --zip-file fileb://$pathToZip     --no-cli-pager     --profile mesh-app-deployer

rm $pathToZip

