const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

 status: {
  type: String,
  enum: ["Pending", "Actioning", "Resolved"],
  default: "Pending"
},

adminReason: {
  type: String,
  default: ""
},


  remarks: {
  type: String,
  default: ""
},

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Incident", incidentSchema);
