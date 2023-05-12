// data with null values removed
const tx = [
  {
    updated_at: '2023-05-11T01:50:05.102Z',
    transaction_id: 'DzjQQxoZXZHbeywA5qnMhN0xV5AwOpcR134E1',
    created_at: '2023-05-10',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-10',
      transaction_id: 'DzjQQxoZXZHbeywA5qnMhN0xV5AwOpcR134E1',
      amount: 186.16,
      merchant_name: 'Seattle Family Support',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '12009000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'SEATTLE FAMILY SUPPORT 3216 NE 45th PlaceSuiteSEATTLE W - Card Ending In 6409',
      category: ['Community', 'Government Departments and Agencies'],
      authorized_date: '2023-05-10',
    },
  },
  {
    updated_at: '2023-05-10T16:10:59.575Z',
    transaction_id: 'bzAKKwg0B0HeyBO4bQAETeBkz6KqZvfaEgMkRD',
    created_at: '2023-05-08',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::9p199xOkLkIvDrk6xnZnI51dbkMyqBUP4KzOk',
    transaction: {
      date: '2023-05-08',
      transaction_id: 'bzAKKwg0B0HeyBO4bQAETeBkz6KqZvfaEgMkRD',
      amount: 0,
      merchant_name: null,
      transaction_type: 'special',
      account_id: '9p199xOkLkIvDrk6xnZnI51dbkMyqBUP4KzOk',
      category_id: '21012000',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Transfer 30.00 from [checking-8790] to [checking-3892]',
      category: ['Transfer', 'Withdrawal'],
      authorized_date: '2023-05-08',
    },
  },
  {
    updated_at: '2023-05-08T05:42:01.816Z',
    transaction_id: '6p6BBeV3d3IeJM3nmzgNtJ9RXEML0VHZo8vN9p',
    created_at: '2023-05-08',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-08',
      transaction_id: '6p6BBeV3d3IeJM3nmzgNtJ9RXEML0VHZo8vN9p',
      amount: 32.97,
      merchant_name: 'Amazon',
      transaction_type: 'digital',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19019000',
      payment_channel: 'online',
      iso_currency_code: 'USD',
      name: 'AMAZON.COM SEATTLE WAUS - Card Ending In 4940',
      category: ['Shops', 'Digital Purchase'],
      authorized_date: '2023-05-08',
    },
  },
  {
    updated_at: '2023-05-10T16:10:59.575Z',
    transaction_id: 'Lz5mmqoOkOHLr4pdywaKHVDZ1AdB6zUjbmz5yL',
    created_at: '2023-05-08',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-08',
      transaction_id: 'Lz5mmqoOkOHLr4pdywaKHVDZ1AdB6zUjbmz5yL',
      amount: 1969.69,
      merchant_name: 'Flagstar',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '18020004',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'FLAGSTAR BANK - LOAN PYMT',
      category: ['Service', 'Financial', 'Loans and Mortgages'],
      authorized_date: '2023-05-08',
    },
  },
  {
    updated_at: '2023-05-10T16:10:59.575Z',
    transaction_id: 'Ozg00yoRaRHaZJk46Myvi9LZYw6g73fPdVnQje',
    created_at: '2023-05-08',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::VzwAAX5L1LHDY7aL3ngnCxzJo9gZjNIzYLDyz',
    transaction: {
      date: '2023-05-08',
      transaction_id: 'Ozg00yoRaRHaZJk46Myvi9LZYw6g73fPdVnQje',
      amount: 0,
      merchant_name: null,
      transaction_type: 'special',
      account_id: 'VzwAAX5L1LHDY7aL3ngnCxzJo9gZjNIzYLDyz',
      category_id: '21012000',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Transfer 200.00 from [savings-8865] to [checking-3892]',
      category: ['Transfer', 'Withdrawal'],
      authorized_date: '2023-05-08',
    },
  },
  {
    updated_at: '2023-05-07T17:11:37.661Z',
    transaction_id: 'Pz7ZZKoQ5QHa58A9LQb8hvQDRKwaoNIaMpA85',
    created_at: '2023-05-07',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-07',
      transaction_id: 'Pz7ZZKoQ5QHa58A9LQb8hvQDRKwaoNIaMpA85',
      amount: 109.15,
      merchant_name: 'Jiffy Lube',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '18006000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'Jiffy Lube',
      category: ['Service', 'Automotive'],
      authorized_date: '2023-05-07',
    },
  },
  {
    updated_at: '2023-05-07T17:11:37.661Z',
    transaction_id: 'azkbbd5vqvHZArBQ1nYrF50V8g9zZnf3Q4OePv',
    created_at: '2023-05-07',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-07',
      transaction_id: 'azkbbd5vqvHZArBQ1nYrF50V8g9zZnf3Q4OePv',
      amount: -40.76,
      merchant_name: "O'Reilly Auto Parts",
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19005006',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: "25958 O'REILLY AUTO P TACOMA WAUS - Card Ending In 4940",
      category: ['Shops', 'Automotive', 'Car Parts and Accessories'],
      authorized_date: '2023-05-07',
    },
  },
  {
    updated_at: '2023-05-06T22:17:41.491Z',
    transaction_id: 'Pz7ZZKoQ5QHa58A9LQbaCbxN8N0reZS11w88x',
    created_at: '2023-05-06',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-06',
      transaction_id: 'Pz7ZZKoQ5QHa58A9LQbaCbxN8N0reZS11w88x',
      amount: -70,
      merchant_name: null,
      transaction_type: 'special',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '21007000',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Online Banking Transfer from 3587440070 CK',
      category: ['Transfer', 'Deposit'],
      authorized_date: '2023-05-06',
    },
  },
  {
    updated_at: '2023-05-06T22:17:41.491Z',
    transaction_id: '3pMOOnVPZPI8qoPy1z38fazN4N6om5c77Djj8',
    created_at: '2023-05-06',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-06',
      transaction_id: '3pMOOnVPZPI8qoPy1z38fazN4N6om5c77Djj8',
      amount: 30.79,
      merchant_name: 'Fred Meyer',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19047000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'Fred Meyer',
      category: ['Shops', 'Supermarkets and Groceries'],
      authorized_date: '2023-05-06',
    },
  },
  {
    updated_at: '2023-05-06T22:17:41.491Z',
    transaction_id: 'KzZ99PoVEVHQzrp6md4Qt4V9w9Qjp3c11dBBp',
    created_at: '2023-05-06',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-06',
      transaction_id: 'KzZ99PoVEVHQzrp6md4Qt4V9w9Qjp3c11dBBp',
      amount: 7.14,
      merchant_name: 'Country Boy Market',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19047000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: '437003005885 COUNTRY BOY MARKET TACOMA WAUS - Card Ending In 4940',
      category: ['Shops', 'Supermarkets and Groceries'],
      authorized_date: '2023-05-06',
    },
  },
  {
    updated_at: '2023-05-07T05:26:43.321Z',
    transaction_id: 'rv977r1O0OFQONM8b9KNiL11nRnMeou5avv7v',
    created_at: '2023-05-06',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-06',
      transaction_id: 'rv977r1O0OFQONM8b9KNiL11nRnMeou5avv7v',
      amount: -2,
      merchant_name: null,
      transaction_type: 'special',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '10002000',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Refund-Out Of Network ATM Fee - 505',
      category: ['Bank Fees', 'ATM'],
      authorized_date: '2023-05-06',
    },
  },
  {
    updated_at: '2023-05-06T22:17:41.491Z',
    transaction_id: 'qA7wwrDVyVHQnLM8bYZQtoabrbQB5ZIBBNLLK',
    created_at: '2023-05-06',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-06',
      transaction_id: 'qA7wwrDVyVHQnLM8bYZQtoabrbQB5ZIBBNLLK',
      amount: 54.13,
      merchant_name: 'Fred Meyer Fuel Center',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '22009000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'FRED M FUEL #9265 Q76 1100 N. MERIDIAN PUYALLUP - Card Ending In 4940',
      category: ['Travel', 'Gas Stations'],
      authorized_date: '2023-05-06',
    },
  },
  {
    updated_at: '2023-05-06T22:17:41.491Z',
    transaction_id: 'kq8wwyX5B5UqPp4jx9oqfbeMoMkArdS339AAQ',
    created_at: '2023-05-06',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-06',
      transaction_id: 'kq8wwyX5B5UqPp4jx9oqfbeMoMkArdS339AAQ',
      amount: 42,
      merchant_name: null,
      transaction_type: 'special',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '21012002',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'PAI ISO TACOMA WAUS - Card Ending In 4940',
      category: ['Transfer', 'Withdrawal', 'ATM'],
      authorized_date: '2023-05-06',
    },
  },
  {
    updated_at: '2023-05-06T22:17:41.491Z',
    transaction_id: 'yJL774kdNdCJawMpb64JtRLrPrQZo4S33XnnN',
    created_at: '2023-05-06',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-06',
      transaction_id: 'yJL774kdNdCJawMpb64JtRLrPrQZo4S33XnnN',
      amount: 94.72,
      merchant_name: 'Cheesecake South Cente',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '13005000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'CHEESECAKE SOUTH CENTE 230 STRANDER BLVD TUKWILA W - Card Ending In 6409',
      category: ['Food and Drink', 'Restaurants'],
      authorized_date: '2023-05-06',
    },
  },
  {
    updated_at: '2023-05-06T22:17:41.491Z',
    transaction_id: 'BzvNNxpJZJHqZBJK196qf6j8z8yRd1Sdd400D',
    created_at: '2023-05-06',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-06',
      transaction_id: 'BzvNNxpJZJHqZBJK196qf6j8z8yRd1Sdd400D',
      amount: 128.8,
      merchant_name: 'Fred Meyer',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19047000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'Fred Meyer',
      category: ['Shops', 'Supermarkets and Groceries'],
      authorized_date: '2023-05-06',
    },
  },
  {
    updated_at: '2023-05-06T16:05:26.601Z',
    transaction_id: 'jPJdd35ZqZtPXkrqyzg7tz5EbJ6X8Nfjyxn88',
    created_at: '2023-05-05',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::9p199xOkLkIvDrk6xnZnI51dbkMyqBUP4KzOk',
    transaction: {
      date: '2023-05-05',
      transaction_id: 'jPJdd35ZqZtPXkrqyzg7tz5EbJ6X8Nfjyxn88',
      amount: 0,
      merchant_name: null,
      transaction_type: 'special',
      account_id: '9p199xOkLkIvDrk6xnZnI51dbkMyqBUP4KzOk',
      category_id: '21012000',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Transfer 1,400.00 from [checking-8790] to [checking-3892]',
      category: ['Transfer', 'Withdrawal'],
      authorized_date: '2023-05-05',
    },
  },
  {
    updated_at: '2023-05-06T16:05:26.601Z',
    transaction_id: 'rv977r1O0OFQONM8b9Kqcm19O3wPD5hwxXLd3',
    created_at: '2023-05-05',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::9p199xOkLkIvDrk6xnZnI51dbkMyqBUP4KzOk',
    transaction: {
      date: '2023-05-05',
      transaction_id: 'rv977r1O0OFQONM8b9Kqcm19O3wPD5hwxXLd3',
      amount: 0,
      merchant_name: null,
      transaction_type: 'special',
      account_id: '9p199xOkLkIvDrk6xnZnI51dbkMyqBUP4KzOk',
      category_id: '21012000',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Transfer 400.00 from [checking-8790] to [savings-8865]',
      category: ['Transfer', 'Withdrawal'],
      authorized_date: '2023-05-05',
    },
  },
  {
    updated_at: '2023-05-06T01:39:08.166Z',
    transaction_id: '1pVzznED5DI5qXDB9MjNIMd4Yy0wkySDvxjrY',
    created_at: '2023-05-05',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::9p199xOkLkIvDrk6xnZnI51dbkMyqBUP4KzOk',
    transaction: {
      date: '2023-05-05',
      transaction_id: '1pVzznED5DI5qXDB9MjNIMd4Yy0wkySDvxjrY',
      amount: -1859.52,
      merchant_name: null,
      transaction_type: 'special',
      account_id: '9p199xOkLkIvDrk6xnZnI51dbkMyqBUP4KzOk',
      category_id: '21009000',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Sinclair Televis - PAYROLL',
      category: ['Transfer', 'Payroll'],
      authorized_date: '2023-05-05',
    },
  },
  {
    updated_at: '2023-05-06T01:39:08.166Z',
    transaction_id: 'wawjjRynNnua9QMrb4Aku61BkB6YPDIRNAkj3',
    created_at: '2023-05-05',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-05',
      transaction_id: 'wawjjRynNnua9QMrb4Aku61BkB6YPDIRNAkj3',
      amount: -700,
      merchant_name: null,
      transaction_type: 'special',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '21007000',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Online Banking Transfer from 3587440070 CK',
      category: ['Transfer', 'Deposit'],
      authorized_date: '2023-05-05',
    },
  },
  {
    updated_at: '2023-05-06T01:39:08.166Z',
    transaction_id: 'YzDrrXQmBmHZYAOmkrLaib1a86QwkNUj6Mw7X',
    created_at: '2023-05-05',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-05',
      transaction_id: 'YzDrrXQmBmHZYAOmkrLaib1a86QwkNUj6Mw7X',
      amount: 5.5,
      merchant_name: 'Paramount+',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '18061000',
      payment_channel: 'online',
      iso_currency_code: 'USD',
      name: 'PARAMOUNT+ 235 2ND STREET SAN FRANCISCOCAUS - Card Ending In 6409',
      category: ['Service', 'Subscription'],
      authorized_date: '2023-05-05',
    },
  },
  {
    updated_at: '2023-05-06T16:05:26.601Z',
    transaction_id: 'azkbbd5vqvHZArBQ1nYNfNJ0jbXKM8U1L6Awx',
    created_at: '2023-05-05',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::VzwAAX5L1LHDY7aL3ngnCxzJo9gZjNIzYLDyz',
    transaction: {
      date: '2023-05-05',
      transaction_id: 'azkbbd5vqvHZArBQ1nYNfNJ0jbXKM8U1L6Awx',
      amount: 0,
      merchant_name: null,
      transaction_type: 'special',
      account_id: 'VzwAAX5L1LHDY7aL3ngnCxzJo9gZjNIzYLDyz',
      category_id: '21012000',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Transfer 200.00 from [savings-8865] to [checking-3892]',
      category: ['Transfer', 'Withdrawal'],
      authorized_date: '2023-05-05',
    },
  },
  {
    updated_at: '2023-05-04T15:52:26.700Z',
    transaction_id: 'Lz5mmqoOkOHLr4pdywamsqp66jOxodcN4yvNe',
    created_at: '2023-05-04',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-04',
      transaction_id: 'Lz5mmqoOkOHLr4pdywamsqp66jOxodcN4yvNe',
      amount: 25,
      merchant_name: 'Starbucks',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '13005043',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'Starbucks',
      category: ['Food and Drink', 'Restaurants', 'Coffee Shop'],
      authorized_date: '2023-05-04',
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: 'NzbQQ3oE5EH4VeK5wOv8to7OE1xq7et334PR0',
    created_at: '2023-05-03',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-03',
      transaction_id: 'NzbQQ3oE5EH4VeK5wOv8to7OE1xq7et334PR0',
      amount: 103.98,
      merchant_name: null,
      transaction_type: 'unresolved',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: null,
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'WASTE CONNECTION - WEB_PAY',
      ion_id: null,
      category: ['~'],
      authorized_date: null,
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: 'pkgddxL9N9cQ3LMJbqmwCVa7nv0MaOCaaRVJ6',
    created_at: '2023-05-03',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-03',
      transaction_id: 'pkgddxL9N9cQ3LMJbqmwCVa7nv0MaOCaaRVJ6',
      amount: 7.69,
      merchant_name: null,
      transaction_type: 'unresolved',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: null,
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Prime Video*HM2HN5BQ2 440 Terry Ave N WA - Card Ending In 4940',
      ion_id: null,
      category: ['~'],
      authorized_date: null,
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: 'XzLMMX51q1HanVJ1KR5LUdw1jE49wqH669p4K',
    created_at: '2023-05-03',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-03',
      transaction_id: 'XzLMMX51q1HanVJ1KR5LUdw1jE49wqH669p4K',
      amount: 10.99,
      merchant_name: null,
      transaction_type: 'unresolved',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: null,
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: 'Kindle Unltd*HM1X38871 440 Terry Ave N W - Card Ending In 4940',
      ion_id: null,
      category: ['~'],
      authorized_date: null,
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: 'ewjKKDz464Swb1k3v65RInbA7LyDbOFaaRVdo',
    created_at: '2023-05-02',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-05-02',
      transaction_id: 'ewjKKDz464Swb1k3v65RInbA7LyDbOFaaRVdo',
      amount: 48.14,
      merchant_name: null,
      transaction_type: 'unresolved',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: null,
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: '266472306882 FOREVER SUSHI (PUYALLU PUYALLUP WAUS - Card Ending In 4940',
      ion_id: null,
      category: ['~'],
      authorized_date: null,
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: 'jPJdd35ZqZtPXkrqyzgxHbpOmQLgJjue3Qj8b',
    created_at: '2023-04-30',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-04-30',
      transaction_id: 'jPJdd35ZqZtPXkrqyzgxHbpOmQLgJjue3Qj8b',
      amount: 101.9,
      merchant_name: "Trader Joe's",
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19047000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: "Trader Joe's",
      category: ['Shops', 'Supermarkets and Groceries'],
      authorized_date: '2023-04-30',
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: 'AzAmm8Vx7xH6EqxXKk9os6PKgrmNOEuMjZn8j',
    created_at: '2023-04-30',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-04-30',
      transaction_id: 'AzAmm8Vx7xH6EqxXKk9os6PKgrmNOEuMjZn8j',
      amount: 26.39,
      merchant_name: 'Fred Meyer',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19047000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'Fred Meyer',
      category: ['Shops', 'Supermarkets and Groceries'],
      authorized_date: '2023-04-30',
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: '0p9EEneLKLI6pjLqQMYVsBM3xvEe1puAJxvPj',
    created_at: '2023-04-30',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-04-30',
      transaction_id: '0p9EEneLKLI6pjLqQMYVsBM3xvEe1puAJxvPj',
      amount: 32.58,
      merchant_name: 'Tacoma Goodwill Indust',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19050000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'Goodwill',
      category: ['Shops', 'Vintage and Thrift'],
      authorized_date: '2023-04-30',
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: 'v4doog3QYQHQ9zMrb70YsNQE0n4BJMhVgY0Oz',
    created_at: '2023-04-30',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-04-30',
      transaction_id: 'v4doog3QYQHQ9zMrb70YsNQE0n4BJMhVgY0Oz',
      amount: 96.33,
      merchant_name: 'Fred Meyer',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19047000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'Fred Meyer',
      category: ['Shops', 'Supermarkets and Groceries'],
      authorized_date: '2023-04-30',
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: 'rv977r1O0OFQONM8b9KXsOy4K0vJ3MtVbKwd7',
    created_at: '2023-04-30',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-04-30',
      transaction_id: 'rv977r1O0OFQONM8b9KXsOy4K0vJ3MtVbKwd7',
      amount: 64.09,
      merchant_name: 'Fred Meyer',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '19047000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'Fred Meyer',
      category: ['Shops', 'Supermarkets and Groceries'],
      authorized_date: '2023-04-30',
    },
  },
  {
    updated_at: '2023-05-08T05:42:01.816Z',
    transaction_id: 'KzZ99PoVEVHQzrp6md4KFAXna4wzBPTK4Z50wL',
    created_at: '2023-04-29',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-04-29',
      transaction_id: 'KzZ99PoVEVHQzrp6md4KFAXna4wzBPTK4Z50wL',
      amount: 43,
      merchant_name: null,
      transaction_type: 'special',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '21012002',
      payment_channel: 'other',
      iso_currency_code: 'USD',
      name: '222464 Zips Cannabis 106th Re Tacoma WAUS - Card Ending In 4940',
      category: ['Transfer', 'Withdrawal', 'ATM'],
      authorized_date: '2023-04-29',
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: '3pMOOnVPZPI8qoPy1z3gFzodD1YPNDHMbpdRZL',
    created_at: '2023-04-27',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-04-27',
      transaction_id: '3pMOOnVPZPI8qoPy1z3gFzodD1YPNDHMbpdRZL',
      amount: 85.08,
      merchant_name: 'Banfield Pet Hospital',
      transaction_type: 'place',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '18069000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: 'BANFIELD-PET*WPPAYMENT 18101 SE 6TH WAY VANCOUVER W - Card Ending In 4940',
      category: ['Service', 'Veterinarians'],
      authorized_date: '2023-04-27',
    },
  },
  {
    updated_at: '2023-05-04T04:20:04.149Z',
    transaction_id: 'yJL774kdNdCJawMpb64rsLZNOqmvrOfP0NYv19',
    created_at: '2023-04-27',
    'item_id::account_id':
      'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k::gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
    transaction: {
      date: '2023-04-27',
      transaction_id: 'yJL774kdNdCJawMpb64rsLZNOqmvrOfP0NYv19',
      amount: 50.23,
      merchant_name: 'Metropolitan Mk',
      transaction_type: 'special',
      account_id: 'gL4AAPMxDxHLqPvdDjxjIBbvPe6EqmUMaD906',
      category_id: '21012000',
      payment_channel: 'in store',
      iso_currency_code: 'USD',
      name: '449084 METROPOLITAN MK TACOMA WAUS - Card Ending In 4940',
      category: ['Transfer', 'Withdrawal'],
      authorized_date: '2023-04-27',
    },
  },
];

console.log(tx[0].transaction);

/**
 * reducer function fo get { txName: amount } key pairs if desired
 *
 * @param {{ transactionName: number}} obj
 * @param {{transaction: { amount: number, name: string }}} param1
 * @returns {{ transactionName: number}}
 */
const kvpCategoryExpense = (obj, { transaction: tx }) => {
  if (tx.amount < 0) return obj;
  tx.name in obj
    ? (obj[tx.name] = tx.amount + obj[tx.name])
    : (obj[tx.name] = tx.amount);
  return obj;
};
// console.log(tx.reduce(kvpCategoryExpense, {}));

/**
 * reducer function to get unuque categories for transactions
 *
 * @param {string[]} prev
 * @param {{ transaction: { category: string[]}}} param1
 * @returns {string[]}
 */
const getUniqueCategories = (prev, { transaction: { category } }) => [
  ...prev,
  ...category.filter((category) => !prev.includes(category)),
];

/**
 * sort function for two strings
 * @param {string} a - string to sort
 * @param {string} b - string to sort
 * @returns {number} - difference between charCodes
 */
const alphabetically = (a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0);
const categoryList = tx.reduce(getUniqueCategories, []).sort(alphabetically);

/**
 * find first list in a data set where category is listed already
 *
 * @param {[string[], string[]]} dataSet
 * @param {string[]} txCatList
 * @param {string} txCat
 * @param {string} accountIdTxId
 * @returns {boolean} if txData is added to dataSet
 */
const findFirstMatchedCategoryList = (
  dataSet,
  txCatList,
  txCat,
  accountIdTxId
) => {
  let isAdded = false;

  // loop through dataset lists
  for (let i = 0; i < dataSet.length; i++) {
    const [dataSetCatList, dataSetTxList] = dataSet[i];

    // if current dataset list includes txCat
    if (dataSetCatList.includes(txCat)) {
      // merge a copy of list
      dataSetCatList.push(
        ...txCatList.filter((txCat) => !dataSetCatList.includes(txCat))
      );

      // if key is not yet in tx list, add to list
      if (!dataSetTxList.includes(accountIdTxId))
        dataSetTxList.push(accountIdTxId);
      isAdded = true;
    }
  }
  return isAdded;
};

/**
 *
 * @param {[string[], string[]]} dataSet
 * @param {{transaction: object}} param1
 * @returns {[string[], string[]]} mutated dataset
 */
const groupTxsByCategories = (dataSet, { transaction }) => {
  const {
    account_id: txAccounttId,
    category: txCatList,
    date,
    transaction_id: txId,
  } = transaction;
  let isAdded = false;

  // key to find target transaction
  const accountIdTxId = date + '::' + txAccounttId + '::' + txId;

  // if first dataset is empty, init to current dataset
  if (dataSet[0][0].length === 0) return [[...txCatList], [accountIdTxId]];

  // do work for each txCat in transaction
  txCatList.forEach((txCat) => {
    isAdded = findFirstMatchedCategoryList(
      dataSet,
      txCatList,
      txCat,
      accountIdTxId
    );
  });

  if (!isAdded) dataSet.push([[...txCatList], [accountIdTxId]]);

  return dataSet;
};

/**
 * @type {[string[], string[]]}
 */
const groupedByCat = tx.reduce(groupTxsByCategories, [[[], []]]);

console.log(categoryList.length);
console.log(JSON.stringify(groupedByCat, null, 2));

console.log(
  /*categoryList.length === */ groupedByCat.reduce((prev, curr, i) => {
    return prev + curr[0].length;
  }, 0)
);
