#!/bin/bash

functionName=crudDynamoDbTable

pathToJs=index.mjs
pathToZip=$functionName.zip

npm ci

echo "creating $pathToZip"
zip -r $pathToZip .

aws lambda update-function-code     --region us-east-1     --function-name  $functionName     --zip-file fileb://$pathToZip     --no-cli-pager     --profile mesh-app-deployer

rm $pathToZip
