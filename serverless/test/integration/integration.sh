#!/bin/bash

exit_code=1

test() {
    npm run test -- --group=$1
}

# run suites in desired order
test db/create &&
    test db/item/create &&
    test db/item/read &&
    test db/read &&
    test app/main &&
    exit_code=0

# run cleanup
test db/destroy

# exit with code
exit $exit_code
