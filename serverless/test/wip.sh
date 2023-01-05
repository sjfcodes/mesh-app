#!/bin/bash

export AWS_PROFILE=mesh-app-deployer 
# NODE_OPTIONS=--experimental-vm-modules npx jest lambdas/<functionName>/index.test.js
# NODE_OPTIONS=--experimental-vm-modules npx jest lambdas/crudPlaidLink/index.test.js --watchAll
NODE_OPTIONS=--experimental-vm-modules npx jest lambdas/myFunction/index.test.js --watchAll