#!/bin/bash

# treat unset variables as arguments
set -o nounset 

fn=$1 # function name

rm -rf $fn

echo $fn

mkdir -p -- "$fn"
cd -P -- "$fn"

mkdir -p -- "utils"
echo "export const config = {
    item1: 'value1',
}" > utils/config.mjs

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
};" > index.mjs

echo "import { handler } from './index.mjs';

describe('$fn', () => {
  it('should have body property', async () => {
    const response = await handler({ body: { hello: 'world' }});
    expect(response).toHaveProperty('body');
  });
});" > index.test.js

fnAsKebabCase=$(echo "$fn" \
| sed 's/\([^A-Z]\)\([A-Z0-9]\)/\1-\2/g' \
| sed 's/\([A-Z0-9]\)\([A-Z0-9]\)\([^A-Z]\)/\1-\2\3/g' \
| tr '[:upper:]' '[:lower:]'
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
  \"author\": \"\",
  \"license\": \"ISC\"
}" > package.json

npm i

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
" > deploy.sh

chmod u+x deploy.sh