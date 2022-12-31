fn=$1 # the path of the directory where the files and directories that need to be copied are located

fileName=index.mjs

dirPath=./lambdas/$fn
pathToJs=$dirPath/$fileName
pathToZip=$dirPath/$fn.zip

cd "$(pwd)/lambdas/$fn"

pwd

zip -r $fn.zip .

aws lambda update-function-code \
    --profile mesh-app-deployer \
    --region us-east-1 \
    --function-name  $fn \
    --zip-file fileb://$fn.zip

rm $fn.zip