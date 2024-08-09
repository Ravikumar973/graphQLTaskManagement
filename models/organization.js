const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Organization = mongoose.model('Organization', OrganizationSchema);
module.exports = Organization;
