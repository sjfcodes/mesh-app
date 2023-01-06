#!/bin/bash

export AWS_PROFILE=mesh-app-deployer 
NODE_OPTIONS=--experimental-vm-modules npx jest lambdas/crudPlaidLink/index.test.js --watchAll

