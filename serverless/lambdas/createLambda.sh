#!/bin/bash

# treat unset variables as arguments
set -o nounset

fn=$1 # function name

rm -rf $fn

echo $fn

mkdir -p -- "$fn"
cd -P -- "$fn"

#############################
# Create test payloads file #
#############################

mkdir -p -- "test"
echo "import { handler } from \"../index.mjs\";
" >test/payloads.mjs

######################
# Create config file #
######################

mkdir -p -- "utils"
echo "export const config = {
    item1: 'value1',
}" >utils/config.mjs

#########################
# Create index.mjs File #
#########################

echo "import { config } from './utils/config.mjs';

export const handler = async (event) => {
  //   console.log('Received event:', JSON.stringify(event, null, 2));

  const body = {
    config,
  };

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body,
  };
};" >index.mjs

#######################
# Create package.json #
#######################

fnAsKebabCase=$(
  echo "$fn" |
    sed 's/\([^A-Z]\)\([A-Z0-9]\)/\1-\2/g' |
    sed 's/\([A-Z0-9]\)\([A-Z0-9]\)\([^A-Z]\)/\1-\2\3/g' |
    tr '[:upper:]' '[:lower:]'
)

echo "{
  \"name\": \"$fnAsKebabCase\",
  \"version\": \"1.0.0\",
  \"description\": \"lambda function\",
  \"type\": \"module\",
  \"main\": \"index.test.js\",
  \"scripts\": {
    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\",
    \"deploy\": \"./deploy.sh\"
  },
  \"keywords\": [],
  \"author\": \"$(git config user.email)\",
  \"license\": \"ISC\"
}" >package.json

############################
# Create Function Deployer #
############################

echo "#!/bin/bash

pathToJs=index.mjs
pathToZip=$fn.zip

npm ci

zip -r \$pathToZip .

aws lambda update-function-code \
    --region us-east-1 \
    --function-name  $fn \
    --zip-file fileb://\$pathToZip \
    --no-cli-pager \
    --profile mesh-app-deployer

rm \$pathToZip
" >deploy.sh

chmod u+x deploy.sh

##########################
# Create Function in AWS #
##########################
# https://awscli.amazonaws.com/v2/documentation/api/2.0.34/reference/lambda/create-function.html

# pwd

# pathToJs=index.mjs
# pathToZip=$fn.zip

# npm i

# zip -r $pathToZip .

# aws lambda create-function \
#   --region us-east-1 \
#   --function-name $fn \
#   --runtime nodejs12.x \
#   --zip-file fileb://$pathToZip \
#   --handler $fn.handler \
#   --role arn:aws:iam::118185547444:role/service-role/plaidfunctions \
#   --profile mesh-app-deployer
