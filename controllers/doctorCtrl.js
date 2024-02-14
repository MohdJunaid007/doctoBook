const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

// update doc profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};

//get single docotor
const getDoctorByIdController = async (req, res) => {
  try {
    // console.log("hi --", req.body);
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    console.log(doctor, "fetched data");
    if (doctor) {
      res.status(200).send({
        success: true,
        message: "Sigle Doc Info Fetched",
        data: doctor,
      });
    } else {
      res.status(400).send({
        success: false,

        message: "no doctor found with the id",
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Erro in Single docot info",
    });
  }
};

const getDoctorByIdController2 = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log entire request body for debugging
    const { doctorId } = req.body;
    const doctor = await doctorModel.findOne({ _id: doctorId });
    console.log("Retrieved Doctor:", doctor);
    if (doctor) {
      res.status(200).send({
        success: true,
        message: "Single Doctor Info Fetched",
        data: doctor,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "No doctor found with the provided id",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in retrieving doctor information",
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });
    // console.log(appointments[0].userInfo);
    const userDetail = await userModel.findOne({ _id: appointments[0].userInfo });
    // console.log(userDetail);
    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch Successfully",
      data: { appointments, userDetail }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};

const doctorByTypeController = async (req, res) => {
  try {
    const typeOfDoc=req.body.specialization;
    const doctor = await doctorModel.find({ 
      specialization: typeOfDoc });
      if(doctor){
        res.status(200).send({
          success: true,
          message: "Doctor found successfully",
          data: doctor
        });
      }else{
        res.status(309).send({
          success: true,
          message: "No doctor found ",
          data: doctor
        });
      }
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notifcation = user.notifcation;
    notifcation.push({
      type: "status-updated",
      message: `your appointment has been updated ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
  getDoctorByIdController2,
  doctorByTypeController
};
