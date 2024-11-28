const moment = require("moment");

const validateRequest = (body) => {
  const { packageId, startDate, numberOfTravelers, customerDetails } = body;

  if (!packageId || !startDate || !numberOfTravelers || !customerDetails) {
    return "All fileds are required";
  }

  if (!moment(startDate, "YYYY-MM-DD", true).isValid()) {
    return "invalid date formate";
  }

  if (numberOfTravelers <= 0) {
    return "Traveler number should be greater then zero";
  }

  const { name, email, contactNumber } = customerDetails;
  if ((!email || !name, !contactNumber)) {
    return "customer details is incomplite";
  }

  // no error
  return null;
};

const checkAvailability = (tourPackage, startDate, numberOfTravelers) => {
  const { capacity, pricePerPerson, bookings } = tourPackage;

  // checking free bookings
  const conflictingBooking = bookings.find(
    (booking) =>
      booking.startDate === startDate && booking.status === "provisional"
  );

  if (conflictingBooking) {
    return {
      isAvailable: false,
      error: "The package is not available",
    };
  }

  // capacity
  if (numberOfTravelers > capacity) {
    return {
      isAvailable: false,
      error: "Not enough capacity for the request",
    };
  }

  const price = numberOfTravelers * pricePerPerson;

  return { isAvailable: true, price };
};

module.exports = { validateRequest, checkAvailability };
