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
    if (result === null) {
      return res.status(404).json({ message: "no stock found for this id" });
    }
    res.status(200).json({ stock: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/trade/new", (req, res) => {
  let newTrade = req.body;
  const result = addNewTrade(newTrade);
  res.status(200).json({ trade: result });
});

app.get("/trades", async (req, res) => {
  const result = await getAllTrades();
  res.status(200).json({ trades: result });
});

app.listen(3000, () => {
  console.log("Express server initialized");
});

module.exports = { app };
