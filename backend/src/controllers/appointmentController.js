const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { buscarEnderecoPorCep } = require("../services/cepService");
const { buscarPrevisaoTempo } = require("../services/weatherService");

const createAppointment = async (req, res) => {
  try {
    const { data, horario, observacoes, cep, numero, complemento } = req.body;

    const paciente = await User.findById(req.userId);
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: "Paciente não encontrado",
      });
    }

    const disponivel = await Appointment.verificarDisponibilidade(
      data,
      horario,
    );
    if (!disponivel) {
      return res.status(400).json({
        success: false,
        message: "Horário não disponível",
      });
    }

    let endereco = null;
    if (cep) {
      try {
        endereco = await buscarEnderecoPorCep(cep);
        endereco.numero = numero;
        endereco.complemento = complemento;
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }

    let previsaoTempo = null;
    if (paciente.endereco && paciente.endereco.cidade) {
      previsaoTempo = await buscarPrevisaoTempo(paciente.endereco.cidade, data);
    }

    const appointment = await Appointment.create({
      paciente: req.userId,
      data,
      horario,
      observacoes,
      previsaoTempo,
      enderecoConsulta: endereco || paciente.endereco,
    });

    res.status(201).json({
      success: true,
      message: "Agendamento criado com sucesso",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar agendamento",
      error: error.message,
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ paciente: req.userId }).sort({
      data: 1,
      horario: 1,
    });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar agendamentos",
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { status, data } = req.query;
    let query = {};

    if (status) query.status = status;
    if (data) query.data = data;

    const appointments = await Appointment.find(query)
      .populate("paciente", "nome email telefone")
      .sort({ data: 1, horario: 1 });

    res.json({
      success: true,
      count: appointment.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar agendamentos",
    });
  }
};

const updateAppointments = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "Agendamento não encontrado",
      });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      message: "Status atualizado com sucesso",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar agendamento",
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Agendamento não encontrado",
      });
    }

    if (appointment.paciente.toString() !== req.userID) {
      return res.status(403).json({
        success: false,
        message: "Você não tem permissão para cancelar este agendamento",
      });
    }

    if (!appointment.podeCancelar) {
      return res.status(400).json({
        success: false,
        message: "Só é possível cancelar com até 24 horas de antecedencia",
      });
    }

    appointment.status = "cancelado";
    await appointment.save();

    res.json({
      success: true,
      message: "Agendamento cancelado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao cancelar agendamento",
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointments,
  cancelAppointment,
};
