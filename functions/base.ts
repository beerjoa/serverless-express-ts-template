const base = {
  handler: 'src/index.handler',
  events: [
    {
      http: {
        path: '/api-docs/{proxy+}',
        method: 'GET',
        cors: {
          origin: '*'
        }
      }
    },
    {
      http: {
        path: '/api/{proxy+}',
        method: 'ANY',
        cors: {
          origin: '*'
        }
      }
    }
  ]
};

export default base;
