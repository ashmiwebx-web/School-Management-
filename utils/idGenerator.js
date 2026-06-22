const generateId = (prefix, id, length = 4) => {
  return `${prefix}${String(id).padStart(length, "0")}`;
};

module.exports = generateId;