
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const User = require("../models/User");

const router = express.Router();

// Travel package prices per person
const packagePrices = {
  Bali: 25000,
  Dubai: 30000,
  Switzerland: 75000,
  Maldives: 45000,
  Paris: 65000,
  Manali: 12000,
  Goa: 10000,
  Japan: 85000,
  Kerala: 18000,
};

// Verify user login
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please log in first",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// Verify administrator role
async function verifyAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Could not verify admin access",
    });
  }
}

// Create a booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      destination,
      travelDate,
      numberOfPeople,
    } = req.body;

    const people = Number(numberOfPeople);
    const date = new Date(travelDate);

    if (
      typeof destination !== "string" ||
      !destination.trim() ||
      !Number.isInteger(people) ||
      people < 1 ||
      !travelDate ||
      Number.isNaN(date.getTime())
    ) {
      return res.status(400).json({
        message: "Please provide valid booking details",
      });
    }

    if (date < new Date()) {
      return res.status(400).json({
        message: "Travel date must be in the future",
      });
    }

    const cleanDestination = destination.trim();
    const pricePerPerson =
      packagePrices[cleanDestination];

    if (pricePerPerson === undefined) {
      return res.status(400).json({
        message: "Invalid travel destination",
      });
    }

    const booking = await Booking.create({
      user: req.userId,
      destination: cleanDestination,
      travelDate: date,
      numberOfPeople: people,
      totalPrice: people * pricePerPerson,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);

    res.status(500).json({
      message: "Could not create booking",
    });
  }
});

// ADMIN: Get all customer bookings
router.get(
  "/admin/all",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      console.error("Admin bookings error:", error);

      res.status(500).json({
        message: "Could not fetch all bookings",
      });
    }
  }
);

// ADMIN: Confirm a pending booking
router.patch(
  "/admin/:id/confirm",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid booking ID",
        });
      }

      const booking = await Booking.findById(
        req.params.id
      );

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      if (booking.status !== "Pending") {
        return res.status(400).json({
          message:
            "Only pending bookings can be confirmed",
        });
      }

      booking.status = "Confirmed";
      await booking.save();

      res.json({
        message: "Booking confirmed successfully",
        booking,
      });
    } catch (error) {
      console.error("Confirm booking error:", error);

      res.status(500).json({
        message: "Could not confirm booking",
      });
    }
  }
);

// Get bookings for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);

    res.status(500).json({
      message: "Could not fetch bookings",
    });
  }
});

// Cancel a booking
router.patch(
  "/:id/cancel",
  verifyToken,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid booking ID",
        });
      }

      const booking = await Booking.findOne({
        _id: req.params.id,
        user: req.userId,
      });

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      if (booking.status === "Cancelled") {
        return res.status(400).json({
          message: "Booking is already cancelled",
        });
      }

      booking.status = "Cancelled";
      await booking.save();

      res.json({
        message: "Booking cancelled successfully",
        booking,
      });
    } catch (error) {
      console.error("Cancel booking error:", error);

      res.status(500).json({
        message: "Could not cancel booking",
      });
    }
  }
);


 // Admin: Cancel any customer's booking
router.patch(
  "/admin/:id/cancel",
  verifyToken,
  async (req, res) => {
    try {
      // Check admin permissions using the database
      const User = require("../models/User");

      const admin = await User.findById(req.userId);

      if (!admin || admin.role !== "admin") {
        return res.status(403).json({
          message: "Admin access required",
        });
      }

      // Validate the booking ID
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid booking ID",
        });
      }

      // Cancel only a booking that is not already cancelled
      const booking = await Booking.findOneAndUpdate(
        {
          _id: req.params.id,
          status: { $in: ["Pending", "Confirmed"] },
        },
        { $set: { status: "Cancelled" } },
        { new: true, runValidators: true }
      );

      if (!booking) {
        return res.status(404).json({
          message:
            "Booking not found or already cancelled",
        });
      }

      res.json({
        message: "Booking cancelled by admin",
        booking,
      });
    } catch (error) {
      console.error("Admin cancel error:", error);

      res.status(500).json({
        message: "Could not cancel booking",
      });
    }
  }
);


module.exports = router;
