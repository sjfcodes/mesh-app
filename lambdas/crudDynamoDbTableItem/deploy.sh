#!/bin/bash

pathToJs=index.mjs
pathToZip=crudDynamoDbTableItem.zip

npm ci

zip -r $pathToZip .

aws lambda update-function-code     --region us-east-1     --function-name  crudDynamoDbTableItem     --zip-file fileb://$pathToZip     --no-cli-pager     --profile mesh-app-deployer

rm $pathToZip

