const { TableClient } = require('@azure/data-tables');

const TABLE_NAME = 'VisitorCounter';
const PARTITION_KEY = 'counter';
const ROW_KEY = 'site';

function getClient() {
  return TableClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    TABLE_NAME
  );
}

async function getAndIncrementCount(client = getClient()) {
  let entity;
  try {
    entity = await client.getEntity(PARTITION_KEY, ROW_KEY);
  } catch (err) {
    if (err.statusCode === 404) {
      entity = { count: 0 };
    } else {
      throw err;
    }
  }

  const newCount = entity.count + 1;
  await client.upsertEntity({
    partitionKey: PARTITION_KEY,
    rowKey: ROW_KEY,
    count: newCount,
  });

  return newCount;
}

module.exports = {
  getAndIncrementCount,
  getClient,
  TABLE_NAME,
  PARTITION_KEY,
  ROW_KEY,
};
