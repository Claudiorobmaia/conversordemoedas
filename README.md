# 💱 Conversor de Moedas com Bitcoin (BTC)

Um projeto simples e funcional desenvolvido com **HTML, CSS e JavaScript**, que permite converter valores entre várias moedas em **tempo real**, incluindo o **Bitcoin (BTC)**.  

O sistema busca automaticamente as **taxas de câmbio atualizadas** na internet e exibe o valor convertido na tela com o símbolo e o formato corretos.

---

## ⚙️ Como o sistema funciona

O núcleo do projeto está no arquivo **`script.js`**, responsável por toda a lógica de conversão.

🧠 **Passo a passo:**
1. O usuário digita um valor no campo de entrada.  
2. Escolhe a moeda de **origem** e a moeda de **destino**.  
3. O sistema consulta **APIs públicas de câmbio** para obter as taxas atualizadas.  
4. O valor é convertido automaticamente e mostrado na tela.  

Tudo acontece de forma instantânea, sem precisar atualizar a página.

---

## 🌍 API principal de câmbio

O projeto utiliza a API pública **ExchangeRate API**, que fornece as taxas das principais moedas do mundo:  

🔗 `https://api.exchangerate-api.com/v4/latest/`

Ela retorna informações como:
- 1 Dólar Americano (USD) = 5,60 Reais (BRL)
- 1 Euro (EUR) = 1,08 Dólares (USD)

Essas taxas são guardadas em um **objeto chamado `taxas`**, usado pelo sistema para calcular as conversões.

---

## 🪙 Adicionando o Bitcoin (BTC)

Como o Bitcoin não faz parte da API principal, o código utiliza uma **segunda API** chamada **CoinGecko**, para buscar o preço atualizado do BTC.

📡 Endereço usado:
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd

css
Copiar código

Essa API devolve algo assim:
```json
{
  "bitcoin": {
    "usd": 67000
  }
}
Isso significa que 1 Bitcoin = 67.000 Dólares Americanos (USD).
O código então calcula quanto vale 1 dólar em Bitcoin, fazendo a conta:

Copiar código
1 / 67000 = 0.0000149 BTC
Com essa taxa, o sistema consegue converter Bitcoin para qualquer moeda e vice-versa.

💻 O que acontece ao clicar em “Converter”
Quando o usuário clica no botão “Converter”, o JavaScript executa os seguintes passos:

Lê o valor digitado e as moedas selecionadas.

Usa as taxas armazenadas para calcular a conversão.

Formata o resultado com o símbolo e o padrão da moeda correta.

Exibe o resultado na tela de forma clara e visual.

Exemplo:

R$ 10,00 → $ 1.75

₿ 0.0001 → R$ 3.400,00

🖼️ Bandeiras e nomes das moedas
Além da conversão, o projeto atualiza dinamicamente os nomes e bandeiras das moedas conforme o usuário muda as opções.

Por exemplo:

Se escolher Euro, aparece o nome “Euro” e a bandeira da União Europeia.

Se escolher Bitcoin, aparece o logotipo do BTC.

Isso torna a interface mais intuitiva e agradável.

🧩 Principais funções do código
Função	O que faz
buscarTaxas()	Busca as taxas de câmbio atualizadas na internet e adiciona o Bitcoin.
convertValues()	Faz o cálculo da conversão entre as moedas selecionadas.
changeCurrency()	Atualiza nome e imagem da moeda de destino.
changeCurrency1()	Atualiza nome e imagem da moeda de origem.

💬 Explicação simples
Este conversor mostra que é possível criar uma aplicação funcional e interativa com JavaScript puro, sem depender de frameworks.

Ele se conecta diretamente a APIs reais de câmbio, atualiza as taxas e exibe os resultados com clareza, ideal para quem está aprendendo programação e quer entender como integrar dados reais em uma página web.

📸 Dica
Se quiser deixar o projeto ainda mais dinâmico:

Adicione uma função para converter automaticamente enquanto o usuário digita.

Mostre mensagens de erro mais amigáveis (ex: “Sem conexão com a internet”).

Personalize o design com animações suaves no CSS.

👨‍💻 Tecnologias usadas
HTML5

CSS3

JavaScript (ES6+)

ExchangeRate API

CoinGecko API

🧠 Autor
Claudio Maia
📍 São José dos Pinhais - PR
💼 Desenvolvedor em formação | Entusiasta em tecnologia e automação
📧 Contato: (adicione seu email ou LinkedIn aqui)
