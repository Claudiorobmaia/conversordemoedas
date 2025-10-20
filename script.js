// ------------------------------
// script.js
// ------------------------------
// Todas as linhas abaixo têm comentários explicativos em português.
// Comentários explicam o que cada linha / bloco faz, para aprendizado.
// ------------------------------


/* Seleciona o botão de converter na página.
   querySelector retorna o primeiro elemento que combina com o seletor CSS. */
const convertButton = document.querySelector(".convert-button");

/* Seleciona o select da moeda destino (ex: USD, EUR, BRL).
   Usado para saber para qual moeda converter. */
const currencySelect = document.querySelector(".currency-select");

/* Seleciona o select da moeda origem (aquela que o usuário tem).
   Usado para saber de qual moeda o valor será convertido. */
const currencySelect1 = document.querySelector(".currency-select1");

/* Variável global que armazenará as taxas de câmbio recebidas da API.
   Será um objeto onde cada chave é uma sigla de moeda (ex: USD, BRL) e o valor é a taxa. */
let taxas = {};

/* Função assíncrona que busca as taxas de câmbio em uma API pública.
   Agora também inclui o Bitcoin, usando uma segunda API específica (CoinDesk). */
async function buscarTaxas(base = "USD") {
  try {
    // Faz requisição principal para obter taxas de câmbio baseadas em 'base' (ex: USD)
    const resposta = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
    const dados = await resposta.json();

    // Guarda o objeto com as taxas das moedas comuns (USD, BRL, EUR, GBP, JPY, etc.)
    taxas = dados.rates;

    // ----------------------------
    // 🪙 BLOCO EXTRA: adiciona Bitcoin (BTC)
    // ----------------------------
   try {
  const respostaBTC = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );
  const dadosBTC = await respostaBTC.json();

  // Valor atual de 1 BTC em USD
  const taxaBTCemUSD = dadosBTC.bitcoin.usd;

  // Calcula quanto 1 USD vale em BTC (mantendo compatibilidade com as outras moedas)
  taxas.BTC = 1 / taxaBTCemUSD;

  console.log("✅ Taxa BTC adicionada (via CoinGecko):", taxas.BTC);
} catch (erroBTC) {
  console.warn("⚠️ Não foi possível carregar taxa do Bitcoin (CoinGecko):", erroBTC);
}

    // Log completo no console para confirmar que as taxas estão OK
    console.log("✅ Taxas atualizadas com base em:", base, taxas);

  } catch (erro) {
    // Se algo der errado (ex: sem internet ou API fora do ar)
    console.error("❌ Erro ao buscar taxas:", erro);
  }
}


/* Chama a função para buscar taxas quando a página carrega.
   Aqui pegamos taxas com base no USD por padrão. */
buscarTaxas("USD");


/* Função que executa a conversão quando o usuário clica no botão.
   Ela lê o valor digitado, as moedas selecionadas e calcula o valor convertido. */
function convertValues() {
  // Pega o valor digitado pelo usuário no input (string).
  const inputCurrencyValueRaw = document.querySelector(".input-currency").value;

  // Converte a string para número de ponto flutuante (float). trim() remove espaços.
  const inputCurrencyValue = parseFloat(inputCurrencyValueRaw.trim());

  // Elemento que mostra o valor na moeda de origem (antes da conversão).
  const currencyValueToConvert = document.querySelector(".currency-value-to-convert");

  // Elemento que mostra o valor convertido (resultado final).
  const currencyValueConverted = document.querySelector(".currency-value");

  // Se o valor digitado não for um número válido, mostra mensagem e sai da função.
  if (isNaN(inputCurrencyValue)) {
    currencyValueConverted.innerHTML = "Digite um valor válido";
    return;
  }

  // Lê as siglas das moedas selecionadas (origem e destino) e transforma em maiúsculas.
  const from = currencySelect1.value.toUpperCase(); // moeda de origem (ex: USD)
  const to = currencySelect.value.toUpperCase();     // moeda de destino (ex: BRL)

  /* Checa se o objeto 'taxas' está disponível e se contem as chaves necessárias.
     Se faltar alguma taxa, mostra mensagem de carregamento/erro e encerra. */
  if (!taxas || typeof taxas !== "object" || !taxas[from] || !taxas[to]) {
    currencyValueConverted.innerHTML = "Carregando taxas...";
    // Observação: se você quiser garantir máxima precisão, poderia chamar buscarTaxas(from)
    // aqui para atualizar as taxas com 'from' como base. Mantive comportamento simples.
    return;
  }

  /* Cálculo da conversão:
     - 'taxas' contém taxas relativas a uma BASE (no nosso caso usamos USD por padrão).
     - A fórmula abaixo converte o valor de 'from' para 'to' usando as taxas disponíveis.
     Fórmula: valorConvertido = (input / taxas[from]) * taxas[to]
     Isso funciona quando taxas[X] é o valor de 1 BASE em X. */
  const valorConvertido = (inputCurrencyValue / taxas[from]) * taxas[to];

  /* Definições de formatos regionais para formatação das moedas.
     A chave é a sigla da moeda e o valor é o locale (padrão de formatação). */
  const formatos = {
    BRL: "pt-BR",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
    BTC: "en-US" // Bitcoin não tem um locale específico, usamos en-US como fallback
  };

  /* Cria formatadores de moeda (Intl.NumberFormat) para exibir os valores bonitinhos.
     Se não houver um locale definido para a moeda, usamos 'en-US' como fallback. */
  const formatadorOrigem = new Intl.NumberFormat(formatos[from] || "en-US", {
    style: "currency",
    currency: from
  });

  const formatadorDestino = new Intl.NumberFormat(formatos[to] || "en-US", {
    style: "currency",
    currency: to
  });

  // Exibe o valor original formatado (ex: "R$ 10,00") no elemento correspondente.
  currencyValueToConvert.innerHTML = formatadorOrigem.format(inputCurrencyValue);

  // Exibe o valor convertido formatado (ex: "$ 2.00") no elemento correspondente.
  currencyValueConverted.innerHTML = formatadorDestino.format(valorConvertido);
}


/* Função chamada quando o select da moeda destino (currencySelect) muda.
   Atualiza o texto do nome da moeda e a imagem exibida — para ficar visual. */
function changeCurrency() {
  // Seleciona novamente (pode remover se usar as constantes globais, mas deixei para clareza)
  const currencySelect = document.querySelector(".currency-select");

  // Elemento que mostra o nome por extenso da moeda destino (ex: "Dólar Americano").
  const currencyName = document.getElementById("currency-name");

  // Elemento <img> que exibe a bandeira/ícone da moeda destino.
  const currencyImg = document.querySelector(".currency-img");


  // Para cada opção, atualizamos o nome e a imagem.
  if (currencySelect.value == "USD") {
    currencyName.innerHTML = "Dólar Americano";
    currencyImg.src = "./assets/dolar.png";
  }

  if (currencySelect.value == "EUR") {
    currencyName.innerHTML = "Euro";
    currencyImg.src = "./assets/euro.png";
  }

  if (currencySelect.value == "GBP") {
    currencyName.innerHTML = "Libra";
    currencyImg.src = "./assets/libra.png";
  }

  if (currencySelect.value == "JPY") {
    currencyName.innerHTML = "Iene";
    currencyImg.src = "./assets/iene.png";
  }

  if (currencySelect.value == "BRL") {
    currencyName.innerHTML = "Real Brasileiro";
    currencyImg.src = "./assets/real.png";
  }
   if (currencySelect.value == "BTC") {
    currencyName.innerHTML = "Bitcoin";
    currencyImg.src = "./assets/bitcoin.png";
  }

  // Após trocar a apresentação visual, rodamos a conversão novamente para atualizar os valores.
  convertValues();
}


/* Função chamada quando o select da moeda de origem (currencySelect1) muda.
   Atualiza o nome, a imagem e também um placeholder do valor que será convertido. */
function changeCurrency1() {
  // Seleciona elementos necessários.
  const currencySelect1 = document.querySelector(".currency-select1");
  const currencyName1 = document.getElementById("currency-name1");
  const currencyImg1 = document.querySelector(".currency-img1");
  const currencyValueToConvert = document.querySelector(".currency-value-to-convert");

  // Log para facilitar o debug caso necessário (mostra qual moeda foi selecionada).
  console.log("Moeda origem selecionada:", currencySelect1.value);


  // Atualiza nome, imagem e placeholder do valor de acordo com a moeda origem.
  if (currencySelect1.value == "USD") {
    currencyName1.innerHTML = "Dólar Americano";
    currencyImg1.src = "./assets/dolar.png";
    currencyValueToConvert.innerHTML = "$ 0.00";
  }

  if (currencySelect1.value == "BRL") {
    currencyName1.innerHTML = "Real Brasileiro";
    currencyImg1.src = "./assets/real.png";
    currencyValueToConvert.innerHTML = "R$ 0.00";
  }

  if (currencySelect1.value == "EUR") {
    currencyName1.innerHTML = "Euro";
    currencyImg1.src = "./assets/euro.png";
    currencyValueToConvert.innerHTML = "€ 0,00";
  }

  if (currencySelect1.value == "GBP") {
    currencyName1.innerHTML = "Libra";
    currencyImg1.src = "./assets/libra.png";
    currencyValueToConvert.innerHTML = "£ 0.00";
  }

  if (currencySelect1.value == "JPY") {
    currencyName1.innerHTML = "Iene";
    currencyImg1.src = "./assets/iene.png";
    currencyValueToConvert.innerHTML = "¥ 0";
  }

  if (currencySelect1.value == "BTC") {
    currencyName1.innerHTML = "Bitcoin";
    currencyImg1.src = "./assets/bitcoin.png";
    currencyValueToConvert.innerHTML = "₿ 0.00000000";
  }

  // Opcional: atualiza as taxas com base na moeda de origem para evitar pequenas imprecisões.
  // Comentado por padrão (não obrigatório), mas está aqui como sugestão:
  // buscarTaxas(currencySelect1.value); // atualiza 'taxas' usando a moeda de origem como base

  // Atualiza a conversão exibida (caso já exista um valor digitado).
  convertValues();
}


/* Adiciona os listeners aos elementos se eles existirem no DOM.
   Isso evita erros caso o script seja carregado em uma página que não tenha esses elementos. */
if (currencySelect) {
  currencySelect.addEventListener("change", changeCurrency);
}

if (currencySelect1) {
  currencySelect1.addEventListener("change", changeCurrency1);
}

if (convertButton) {
  convertButton.addEventListener("click", convertValues);
}

/* FIM do arquivo
   Observações / dicas:
   1) A API usada retorna taxas com base em uma moeda 'base'. Se quiser máxima precisão ao converter
      de X para Y, você pode chamar buscarTaxas(X) antes de converter, garantindo que taxas[X] === 1.
   2) Verifique se os arquivos de imagem (./assets/*.png) existem e os ids/classes do HTML batem com este script.
   3) Para produção, trate erros de rede com mensagens visíveis ao usuário (não só console).
   4) Se quiser conversões em "tempo real" conforme o usuário digita, adicione um listener 'input' no campo
      .input-currency e chame convertValues() com debounce (evitar muitas requisições).
*/
