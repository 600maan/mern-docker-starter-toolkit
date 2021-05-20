/* eslint-disable no-console */
require('dotenv').config();

const { adminUserBody } = require('../config/key');
const AdminModel = require('../models/Admin');
// let User = require("mongoose").model("user");
// let License = require("mongoose").model("license");
const mongoose = require('../models/Connection');

mongoose.connectDB();

const insertUser = async () => {
  const seedUserExists = await AdminModel.findOne({
    email: adminUserBody.email,
  });
  if (seedUserExists) {
    mongoose.closeDB();
    return console.log('seed already exists');
  }
  const userData = new AdminModel(adminUserBody);
  const result = await userData.save();
  if (!result) {
    mongoose.closeDB();
    return console.log('cannot seed now');
  }
  mongoose.closeDB();
  return console.log('admin successfully created !');
};

insertUser();
