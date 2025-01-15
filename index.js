let express = require("express");
let {
  getAllStocks,
  getStocksByTicker,
  addNewTrade,
  getAllTrades,
} = require("./controllers");
const app = express();
app.use(express.json());
app.use(express.static("static"));

app.get("/stocks", async (req, res) => {
  const result = await getAllStocks();
  res.json({ stocks: result });
});

app.get("/stocks/ticker/:ticker", async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const result = await getStocksByTicker(ticker);
    if (!result) {
      return res.status(404).json({ message: "no stock found for this id" });
    }
    res.status(200).json({ stock: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*app.post("/trade/new", async (req, res) => {
  let newTrade = req.body;
  const result = await addNewTrade(newTrade);
  res.status(200).json({ trade: result });
});*/

async function validateTrade(trade) {
  if (!trade.stockId || typeof trade.stockId !== "number") {
    return "stockId is required and must be a number";
  }
  if (!trade.quantity || typeof trade.quantity !== "number") {
    return "quantity is required and must be a number";
  }
  if (!trade.tradeType || typeof trade.tradeType !== "string") {
    return "tradeType is required and must be a string";
  }
  if (!trade.tradeDate || typeof trade.tradeDate !== "string") {
    return "tradeDate is required and must be a string";
  }
}

app.post("/trade/new", async (req, res) => {
  try {
    let newTrade = req.body;
    let error = await validateTrade(newTrade);
    if (error) {
      return res.status(400).send(error);
    }
    const result = await addNewTrade(newTrade);
    res.status(200).json({ trade: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/trades", async (req, res) => {
  const result = await getAllTrades();
  res.status(200).json({ trades: result });
});

app.listen(3000, () => {
  console.log("Express server initialized");
});

module.exports = { app };
