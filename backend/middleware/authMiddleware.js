const { requireAuth } = require("@clerk/express");

const authenticateUser = requireAuth();

module.exports = authenticateUser;
