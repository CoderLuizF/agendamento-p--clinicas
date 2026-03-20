const axios = require("axios");

const buscarEnderecoPorCep = async (cep) => {
  try {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      throw new Error("CEP deve ter 8 dígitos");
    }

    const response = await axios.get(
      `https://viacep.com.br/ws/${cepLimpo}/json/`,
    );

    if (response.data.erro) {
      throw new Error("CEP não encontrado");
    }

    return {
      cep: response.data.cep,
      logradouro: response.data.logradouro,
      bairro: response.data.bairro,
      cidade: response.data.cidade,
      estado: response.data.estado,
      complemento: response.data.complemento,
    };
  } catch (error) {
    throw new Error(`Erro ao buscar CEP: ${error.message}`);
  }
};

module.exports = { buscarEnderecoPorCep };
