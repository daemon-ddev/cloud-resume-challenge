const { app } = require('@azure/functions');
const { getAndIncrementCount } = require('../counterStore');

app.http('counter', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'counter',
  handler: async () => {
    const count = await getAndIncrementCount();
    return { jsonBody: { count } };
  },
});
