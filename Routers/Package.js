const express = require("express");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const {
  validateRequest,
  checkAvailability,
} = require("../validation/validation.js");

const router = express.Router();

router.post("/check-availability", (req, res) => {
  const {
    packageId,
    startDate,
    numberOfTravelers,
    customerDetails,
    specialRequirements,
  } = req.body;

  const tourPackage = validateRequest.find(
    (package) => package.packageId === packageId
  );
  if (!tourPackage) {
    return res.status(404).send({ message: "package not found" });
  }

  const availableResult = checkAvailability(
    tourPackage,
    startDate,
    numberOfTravelers
  );
  if (!availableResult.isAvailable) {
    return res.status(400).send({
      message: "not available",
      error: result.error,
    });
  }

  const expireDate = moment().add(30, "minutes").toISOString();
  const bookingReference = `TR-${moment().format("YYYY")}-${uuidv4()
    .slice(0, 6)
    .toUpperCase()}`;

  // mongoDb methods
  tourPackage.booking.push({
    bookingReference,
    startDate,
    numberOfTravelers,
    customerDetails,
    specialRequirements,
    expireDate,
    status: "provisional",
  });

  // success message
  return res.status(200).json({
    bookingReference,
    packageDetails: {
      name: tourPackage.name,
      location: tourPackage.location,
      duration: tourPackage.duration,
    },
    provisionalBooking: {
      expireDate,
      totalPrice: price,
      status: "provisional",
    },
  });
});

module.exports = router;
