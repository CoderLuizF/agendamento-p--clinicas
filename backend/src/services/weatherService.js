const axios = require("axios");

const buscarPrevisaoTempo = async (cidade, data) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cidade}&limit=1&appid=${apiKey}`,
    );

    if (!geoResponse.data.length) {
      throw new Error("Cidade não encontrada");
    }

    const { lat, lon } = geoResponse.data[0];

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`,
    );

    const dataConsulta = new Date(data).toISOString().split("T")[0];

    const previsao = weatherResponse.data.list.find((item) => {
      return item.dt_txt.startsWith(dataConsulta);
    });

    if (!previsao) {
      return null;
    }

    const chuva = previsao.rain
      ? previsao.rain["3h"] > 0
      : previsao.weather[0].description.toLowerCase().includes("chuva");

    return {
      temperatura: Math.round(previsao.main.temp),
      condicao: previsao.weather[0].description,
      icone: previsao.weather[0].icon,
      chuva: chuva,
      umidade: previsao.main.humidity,
      vento: previsao.wind.speed,
    };
  } catch (error) {
    console.error("Erro ao buscar previsão do tempo", error);
    return null;
  }
};

module.exports = { buscarPrevisaoTempo };
