build="./build" # the path of the directory where the files and directories that need to be copied are located
bucket="mesh-app" # the s3 bucket path

aws s3 cp  --recursive "$build" "s3://$bucket" --profile mesh-app-deployer

echo "\nbrowse: https://$bucket.net"

rm -rf $build