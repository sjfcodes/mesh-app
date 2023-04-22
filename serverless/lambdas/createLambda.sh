#!/bin/bash

# treat unset variables as arguments
set -o nounset

# get new version from user input
read -p 'Enter function name: ' functionName
pathToIntegrationTest="../../test/integration"

# functionName=$1

mkdir -p -v -- $functionName
cd $functionName

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
npm i

#########################
# Create index.js File #
#########################

echo "import config from './utils/config.js';

export const handler = async (event) => {
  let statusCode = 200;
  let response;
  const httpMethod = event.context['http-method'];

  try {
    switch (httpMethod) {
      case 'DELETE':
        response = httpMethod;
        break;
      case 'GET':
        response = httpMethod;
        break;
      case 'PUT':
        response = httpMethod;
        break;
      default:
        throw new Error('Unsupported httpMethod' + 'httpMethod');
    }
  } catch (err) {
    console.error(err);
    statusCode = 400;
    response = err.message;
  }

  return {
    body: response,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      'Content-Type': 'application/json',
    },
    path: event.path,
    status_code: statusCode,
  };
};
" >index.js

######################
# Create config file #
######################

mkdir -p -v -- "utils"
echo "const config = {
  region:'us-east-1',
};

export default config;
" >utils/config.js

#############################
# Create test payloads file #
#############################

mkdir -p -v -- $pathToIntegrationTest/$functionName
echo "import config from '../../config/dynamoDb.js';

const { TableName: { user }, params } = config;

export const getMyRequestPayload = {
  body: {
    path: null,
    payload: { hello: 'world' }
  },
  context: { ['http-method']: 'GET' },
  params,
};
" >$pathToIntegrationTest/$functionName/payloads.js

############################
# Create test modules file #
############################

echo "import { handler } from '../../../lambdas/$functionName/index.js';
import { getMyRequestPayload } from './payloads.js';

export const getMyRequest = async () => handler(getMyRequestPayload);
" >$pathToIntegrationTest/$functionName/modules.js

############################################
# Append test to awsLambdaDynamoDb.test.js #
############################################

echo "
// !!TEST ADDED BY ../../lambdas/createLambda.sh
import { getMyRequest } from './$functionName/modules.js';
import { getMyRequestPayload } from './$functionName/payloads.js';

describe('$functionName', () => {
  it('should return expected body', async () => {
    const { status_code, body } = await getMyRequest();

    expect(status_code).toBe(200);
    expect(body.hello).toBe(getMyRequestPayload.hello);
  });
});" >>"$pathToIntegrationTest/awsLambdaDynamoDb.test.js"

############################
# Create Function Deployer #
############################

echo "#!/bin/bash

functionName=$functionName

pathToJs=index.js
pathToZip=\$functionName.zip

npm ci

echo \"creating \$pathToZip\"
zip -r -q \$pathToZip .

aws lambda update-function-code     --region us-east-1     --function-name  \$functionName     --zip-file fileb://\$pathToZip     --no-cli-pager     --profile mesh-app-deployer

rm \$pathToZip
" >deploy.sh
chmod u+x deploy.sh

################################
# START INTEGRATION TEST SUITE # 
################################

cd ../../test
npm run test:it:local

##########################
# Create Function in AWS #
##########################
# https://awscli.amazonaws.com/v2/documentation/api/2.0.34/reference/lambda/create-function.html

# pwd

# pathToJs=index.js
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
