build=$1 # the path of the directory where the files and directories that need to be copied are located
bucket=$2 # the s3 bucket path

aws s3 cp  --recursive "$build" "$bucket" --profile mesh-app-deployer

echo "\n deployment complete:  https://www.mesh-app.net"

open https://www.mesh-app.net