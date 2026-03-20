const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: Date,
      required: [true, "Data da consulta é obrigatória"],
    },
    horario: {
      type: String,
      required: [true, "Horário da consulta é obrigatório"],
      validator: function (v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
    },
    status: {
      type: String,
      enum: ["agendado", "confirmado", "cancelado", "realizado"],
      default: "agendado",
    },
    observacoes: {
      type: String,
      maxlength: [500, "Observações não podem ter mais de 500 caracteres"],
    },
    previsaoTempo: {
      temperatura: Number,
      condicao: String,
      icone: String,
      chuva: Boolean,
    },
    enderecoConsulta: {
      cep: String,
      logradouro: String,
      numero: String,
      complemento: String,
      bairro: String,
      cidade: String,
      estado: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

appointmentSchema.index({ data: 1, horario: 1 }, { unique: true });

appointmentSchema.virtual("podeCancelar").get(function () {
  const dataConsulta = new Date(this.data);
  dataConsulta.setHours(this.horario.split(":")[0], this.horario.split(":")[1]);

  const agora = new Date();
  const diffHoras = (dataConsulta - agora) / (1000 * 60 * 60);

  return diffHoras > 24 && this.status === "agendado";
});

appointmentSchema.statics.verificarDisponibilidade = async function (
  data,
  horario,
) {
  const agendamentoExistente = await this.findOne({ data, horario });
  return !agendamentoExistente;
};

module.exports = mongoose.model("Appointment", appointmentSchema);
