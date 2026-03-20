import api from "./api";

export const cepService = {
  async buscar(cep) {
    // Usar o backend como proxy para não expor chaves
    const response = await api.get(`/cep/${cep}`);
    return response.data;
  },
};

export const buscarCepDireto = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) return null;

  try {
    const response = await axios.get(
      `https://viacep.com.br/ws/${cepLimpo}/json/`,
    );
    if (response.data.erro) return null;
    return response.data;
  } catch (error) {
    return null;
  }
};
