build=$1 # the path of the directory where the files and directories that need to be copied are located
bucket="mesh-app" # the s3 bucket path

aws s3 cp  --recursive "$build" "s3://$bucket" --profile mesh-app-deployer

echo "\n deployment complete:  https://$bucket.net"

sleep 10

open "https://$bucket.net"