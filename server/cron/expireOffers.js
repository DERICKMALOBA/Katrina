// Cron Job to Update Offer Status
cron.schedule('0 * * * *', () => { // Runs every hour
  const currentDate = new Date();
  const queryActivate = "UPDATE offers SET offer = 'active' WHERE validFrom <= ? AND validTo >= ? AND offer != 'active'";
  const queryDeactivate = "UPDATE offers SET offer = 'inactive' WHERE validTo < ? AND offer = 'active'";

  db.query(queryActivate, [currentDate, currentDate], (err, result) => {
      if (err) {
          console.error("Error activating offers:", err);
      } else {
          console.log("Offers activated successfully.");
      }
  });

  db.query(queryDeactivate, [currentDate], (err, result) => {
      if (err) {
          console.error("Error deactivating offers:", err);
      } else {
          console.log("Expired offers deactivated.");
      }
  });
});

module.exports = router;
