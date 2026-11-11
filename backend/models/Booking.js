
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  destination: {
    type: String,
    required: true,
  },

  travelDate: {
    type: Date,
    required: true,
  },

  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
  },

  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
