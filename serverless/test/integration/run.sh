#!/bin/bash
exit_code=1

# run npm test comand with provided group
test() {
    npm run test -- --group=$1
}

# run suites in desired order
test db/item/create &&
    test db/item/read &&
    # test db/item/destroy &&
    exit_code=0

# exit with code
exit $exit_code
