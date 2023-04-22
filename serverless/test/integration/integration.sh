#!/bin/bash

exit_code=1

npm run test -- --group=db/create &&
    npm run test -- --group=db/item/create &&
    npm run test -- --group=db/read &&
    npm run test -- --group=app/main &&
    $exit_code=0

npm run test -- --group=db/destroy

exit $exit_code
