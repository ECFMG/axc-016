const { randomUUID } = require('node:crypto');
exports.v4 = function v4() {
  return randomUUID();
};
