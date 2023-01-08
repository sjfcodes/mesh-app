#!/bin/bash

# treat unset variables as arguments
set -o nounset

# get new version from user input
read -p 'Enter function name: ' functionName

# functionName=$1

mkdir -p -v -- $functionName
cd $functionName

#############################
# Create test payloads file #
#############################

mkdir -p -v -- "test"
echo "import { handler } from '../index.mjs';

export const getRequestPayload = {
  httpMethod: 'GET',
  body: { hello: 'world' },
};" >test/payloads.mjs

echo "import { handler } from '../index.mjs';
import {
  getRequestPayload,
} from './payloads.mjs';

export const getRequest = async () => handler(getRequestPayload);
" >test/modules.mjs

######################
# Create config file #
######################

mkdir -p -v -- "utils"
echo "const config = {
  region:'us-east-1',
};

export default config;

" >utils/config.mjs

#########################
# Create index.mjs File #
#########################

echo "import config from './utils/config.mjs';

export const handler = async (event) => {
  //   console.log('Received event:', JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: {
      ...event,
      ...config
    },
  };
};
" >index.mjs

########################
# Create index.test.js #
########################

echo "import { getRequest } from './test/modules.mjs';
import { getRequestPayload } from './test/payloads.mjs';
import config from './utils/config.mjs';

describe('$functionName', () => {
  it('should return expected body', async () => {
    const { statusCode, body } = await getRequest();

    expect(statusCode).toBe(200);
    expect(body.hello).toBe(getRequestPayload.hello);
    expect(body.awsRegion).toBe(config.awsRegion);
  });
});
" >index.test.js

#######################
# Create package.json #
#######################

functionNameAsKebabCase=$(
  echo "$functionName" |
    sed 's/\([^A-Z]\)\([A-Z0-9]\)/\1-\2/g' |
    sed 's/\([A-Z0-9]\)\([A-Z0-9]\)\([^A-Z]\)/\1-\2\3/g' |
    tr '[:upper:]' '[:lower:]'
)

echo "{
  \"name\": \"$functionNameAsKebabCase\",
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

functionName=$functionName

pathToJs=index.mjs
pathToZip=\$functionName.zip

npm ci

echo \"creating \$pathToZip\"
zip -r -q \$pathToZip .

aws lambda update-function-code     --region us-east-1     --function-name  \$functionName     --zip-file fileb://\$pathToZip     --no-cli-pager     --profile mesh-app-deployer

rm \$pathToZip
" >deploy.sh

chmod u+x deploy.sh

npm i

cd ../../test

echo "#!/bin/bash

export AWS_PROFILE=mesh-app-deployer 
NODE_OPTIONS=--experimental-vm-modules npx jest lambdas/$functionName/index.test.js --watchAll
" >wip.sh

chmod u+x wip.sh

##########################
# Create Function in AWS #
##########################
# https://awscli.amazonaws.com/v2/documentation/api/2.0.34/reference/lambda/create-function.html

# pwd

# pathToJs=index.mjs
# pathToZip=$functionName.zip

# npm i

# zip -r $pathToZip .

# aws lambda create-function \
#   --region us-east-1 \
#   --function-name $functionName \
#   --runtime nodejs12.x \
#   --zip-file fileb://$pathToZip \
#   --handler $functionName.handler \
#   --role arn:aws:iam::118185547444:role/service-role/plaidfunctions \
#   --profile mesh-app-deployer

npm run test:wip