const { getAndIncrementCount } = require('../src/counterStore');

function makeFakeClient(initialCount) {
  const state = { count: initialCount };
  return {
    getEntity: jest.fn(async () => {
      if (state.count === null) {
        const err = new Error('not found');
        err.statusCode = 404;
        throw err;
      }
      return { count: state.count };
    }),
    upsertEntity: jest.fn(async (entity) => {
      state.count = entity.count;
    }),
  };
}

test('increments count from an existing value', async () => {
  const client = makeFakeClient(5);
  const result = await getAndIncrementCount(client);
  expect(result).toBe(6);
  expect(client.upsertEntity).toHaveBeenCalledWith(
    expect.objectContaining({ count: 6 })
  );
});

test('starts at 1 when no entity exists yet', async () => {
  const client = makeFakeClient(null);
  const result = await getAndIncrementCount(client);
  expect(result).toBe(1);
});

test('propagates non-404 errors from getEntity', async () => {
  const client = {
    getEntity: jest.fn(async () => {
      throw Object.assign(new Error('boom'), { statusCode: 500 });
    }),
    upsertEntity: jest.fn(),
  };
  await expect(getAndIncrementCount(client)).rejects.toThrow('boom');
  expect(client.upsertEntity).not.toHaveBeenCalled();
});
