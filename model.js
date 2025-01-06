
const mongoose = require("mongoose");

const shikshaSchema = new mongoose.Schema({
  nameOfSurveyor: String,
  state: String,
  village: String,
  gramPanchayat: String,
  taluk: String,
  district: String,
  pincode: String,
  population: {
    males: Number,
    females: Number,
    houses: Number,
    families:Number,
    total: Number
  },
  govtSchool: {
    exists: Boolean,
    category: String,
    medium: String,
    name: String,
    students: {
      girls: Number,
      boys: Number
    },
    classes: {
      fourth: Number,
      fifth: Number,
      eighth: Number,
      tenth: Number
    },
    principal: {
      name: String,
      contact: String
    },
    smcMember: {
      name: String,
      contact: String
    }
  },
  pvtSchool: {
    exists: Boolean,
    category: String,
    medium: String,
    name: String,
    students: {
      girls: Number,
      boys: Number
    },
    classes: {
      fourth: Number,
      fifth: Number,
      eighth: Number,
      tenth: Number
    },
    principal: {
      name: String,
      contact: String
    },
    smcMember: {
      name: String,
      contact: String
    }
  },
  asm: {
    exists: Boolean,
    category: String,
    medium: String,
    name: String,
    students: {
      girls: Number,
      boys: Number
    },
    classes: {
      fourth: Number,
      fifth: Number,
      eighth: Number,
      tenth: Number
    },
    principal: {
      name: String,
      contact: String
    },
    smcMember: {
      name: String,
      contact: String
    }
  },
  villageStudents: {
    sixthToEighth: {
      girls: Number,
      boys: Number
    }
  }
});

module.exports = mongoose.model("Shiksha", shikshaSchema);

