let _pool = null;

const setPool = (pool) => {
  _pool = pool;
};

const getPool = () => {
  if (!_pool) throw new Error("Database pool not initialized");
  return _pool;
};

module.exports = { setPool, getPool };
