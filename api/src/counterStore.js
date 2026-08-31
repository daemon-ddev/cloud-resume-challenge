const { TableClient } = require('@azure/data-tables');

const TABLE_NAME = 'VisitorCounter';
const PARTITION_KEY = 'counter';
const ROW_KEY = 'site';
const MAX_RETRIES = 5;

function getClient() {
  return TableClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    TABLE_NAME
  );
}

async function getAndIncrementCount(client = getClient()) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let entity;
    try {
      entity = await client.getEntity(PARTITION_KEY, ROW_KEY);
    } catch (err) {
      if (err.statusCode !== 404) {
        throw err;
      }
      try {
        await client.createEntity({
          partitionKey: PARTITION_KEY,
          rowKey: ROW_KEY,
          count: 1,
        });
        return 1;
      } catch (createErr) {
        if (createErr.statusCode === 409) {
          continue;
        }
        throw createErr;
      }
    }

    const newCount = entity.count + 1;
    try {
      await client.updateEntity(
        { partitionKey: PARTITION_KEY, rowKey: ROW_KEY, count: newCount },
        'Merge',
        { etag: entity.etag }
      );
      return newCount;
    } catch (updateErr) {
      if (updateErr.statusCode !== 412) {
        throw updateErr;
      }
    }
  }

  throw new Error('Could not increment counter after multiple concurrent attempts');
}

module.exports = {
  getAndIncrementCount,
  getClient,
  TABLE_NAME,
  PARTITION_KEY,
  ROW_KEY,
};
