const log = (message, meta) => {
  const timestamp = new Date().toISOString();

  if (meta) {
    console.log(`[${timestamp}] ${message}`, meta);
    return;
  }

  console.log(`[${timestamp}] ${message}`);
};

const error = (message, meta) => {
  const timestamp = new Date().toISOString();

  if (meta) {
    console.error(`[${timestamp}] ${message}`, meta);
    return;
  }

  console.error(`[${timestamp}] ${message}`);
};

module.exports = { log, error };
