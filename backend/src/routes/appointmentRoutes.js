const express = require("express");
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { protect, secretarioOnly } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.post("/", createAppointment);
router.get("/", getMyAppointments);
router.get("/all", secretarioOnly, getAllAppointments);
router.put("/:id", secretarioOnly, updateAppointmentStatus);
router.delete("/:id", cancelAppointment);

module.exports = router;
