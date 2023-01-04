# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Project TODOs:

- [ ] setup database
- [ ] setup database table: users
- [ ] setup database table: items
- [ ] setup database table: transactions
- [ ] setup Plaid integration
- [ ] save user
- [ ] save bank account item
- [ ] save account transactions
- [ ] display tx's for authenticated user
- [ ] get new tx' on page load for authenticated user
- [ ] add additional bank account item
- [ ] save transactions for additional bank account
- [ ] display merged transactions for authenticated user

ui route examples:

- /[username]/[accounts]
- /[username]/[accounts]/[account]?tx=[tx_id]
- /[username]/all

api route examples:

- /account
  - GET: get accounts
  - POST: create account
  - DELETE: delete account
  - PUT: edit account

models:

user
```js
{
    id: string,
    name: string,
    email: string,
    created_at: iso date string
}
```

account
```js
{
    // follow data structure from plaid?
  id: string;,
  alias: string,
  at: iso date string,
  created_at: iso date string
}
```

transaction
```js
{
    // follow data structure from plaid?
}
```

budget
```js
{
    id
    name: string,
    recurring: number /* seconds to repeat */,
    created_at: iso date string,
}
```