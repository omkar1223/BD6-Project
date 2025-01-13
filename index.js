let express = require("express");
let { getAllStocks } = require("./controllers");
const app = express();
app.use(express.json());
app.use(express.static("static"));

app.get("/stocks", async (req, res) => {
  const result = await getAllStocks();
  res.json({ stocks: result });
});

app.listen(3000, () => {
  console.log("Express server initialized");
});
