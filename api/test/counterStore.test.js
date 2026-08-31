const { getAndIncrementCount } = require('../src/counterStore');

function makeFakeClient(initialCount) {
  const state = { count: initialCount, etag: initialCount === null ? null : 'etag-0' };
  let etagCounter = 0;

  return {
    state,
    getEntity: jest.fn(async () => {
      if (state.count === null) {
        const err = new Error('not found');
        err.statusCode = 404;
        throw err;
      }
      return { count: state.count, etag: state.etag };
    }),
    createEntity: jest.fn(async (entity) => {
      if (state.count !== null) {
        const err = new Error('conflict');
        err.statusCode = 409;
        throw err;
      }
      state.count = entity.count;
      state.etag = `etag-${++etagCounter}`;
    }),
    updateEntity: jest.fn(async (entity, _mode, options) => {
      if (options.etag !== state.etag) {
        const err = new Error('precondition failed');
        err.statusCode = 412;
        throw err;
      }
      state.count = entity.count;
      state.etag = `etag-${++etagCounter}`;
    }),
  };
}

test('increments count from an existing value', async () => {
  const client = makeFakeClient(5);
  const result = await getAndIncrementCount(client);
  expect(result).toBe(6);
  expect(client.updateEntity).toHaveBeenCalledWith(
    expect.objectContaining({ count: 6 }),
    'Merge',
    expect.objectContaining({ etag: 'etag-0' })
  );
});

test('starts at 1 when no entity exists yet', async () => {
  const client = makeFakeClient(null);
  const result = await getAndIncrementCount(client);
  expect(result).toBe(1);
  expect(client.createEntity).toHaveBeenCalledWith(
    expect.objectContaining({ count: 1 })
  );
});

test('propagates non-404 errors from getEntity', async () => {
  const client = {
    getEntity: jest.fn(async () => {
      throw Object.assign(new Error('boom'), { statusCode: 500 });
    }),
    createEntity: jest.fn(),
    updateEntity: jest.fn(),
  };
  await expect(getAndIncrementCount(client)).rejects.toThrow('boom');
  expect(client.createEntity).not.toHaveBeenCalled();
  expect(client.updateEntity).not.toHaveBeenCalled();
});

test('retries when a concurrent request wins the update race', async () => {
  const client = makeFakeClient(5);
  const originalUpdate = client.updateEntity;
  let calls = 0;
  client.updateEntity = jest.fn(async (entity, mode, options) => {
    calls += 1;
    if (calls === 1) {
      client.state.count = 6;
      client.state.etag = 'etag-concurrent';
      const err = new Error('precondition failed');
      err.statusCode = 412;
      throw err;
    }
    return originalUpdate(entity, mode, options);
  });

  const result = await getAndIncrementCount(client);
  expect(result).toBe(7);
  expect(client.getEntity).toHaveBeenCalledTimes(2);
});

test('retries when a concurrent request wins the first-create race', async () => {
  const client = makeFakeClient(null);
  const originalCreate = client.createEntity;
  let calls = 0;
  client.createEntity = jest.fn(async (entity) => {
    calls += 1;
    if (calls === 1) {
      client.state.count = 1;
      client.state.etag = 'etag-concurrent';
      const err = new Error('conflict');
      err.statusCode = 409;
      throw err;
    }
    return originalCreate(entity);
  });

  const result = await getAndIncrementCount(client);
  expect(result).toBe(2);
});
