const mongoose = require("mongoose");

const companyUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
});

const CompanyUpdate = mongoose.model("CompanyUpdate", companyUpdateSchema);

module.exports = CompanyUpdate;
