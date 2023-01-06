#!/bin/bash

export AWS_PROFILE=mesh-app-deployer 
NODE_OPTIONS=--experimental-vm-modules npx jest lambdas/testFunction/index.test.js --watchAll

