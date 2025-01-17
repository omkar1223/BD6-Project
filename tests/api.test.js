let request = require("supertest");
let http = require("http");
let {
  getAllStocks,
  getStocksByTicker,
  addNewTrade,
} = require("../controllers");
let { app } = require("../index");

jest.mock("../index", () => ({
  ...jest.requireActual("../index"),
  getAllStocks: jest.fn(),
  getStocksByTicker: jest.fn(),
  addNewTrade: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3002, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API endpoint test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("GET /stocks - all stocks", async () => {
    const result = await request(server).get("/stocks");
    expect(result.statusCode).toBe(200);
    expect(result.body.stocks).toEqual([
      { stockId: 1, ticker: "AAPL", companyName: "Apple Inc.", price: 150.75 },
      {
        stockId: 2,
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        price: 2750.1,
      },
      { stockId: 3, ticker: "TSLA", companyName: "Tesla, Inc.", price: 695.5 },
    ]);
  });

  it("GET /stocks/ticker/:ticker - stock by ticker", async () => {
    const response = await request(server).get("/stocks/ticker/AAPL");
    expect(response.statusCode).toBe(200);
    expect(response.body.stock).toEqual({
      stockId: 1,
      ticker: "AAPL",
      companyName: "Apple Inc.",
      price: 150.75,
    });
  });

  it("POST /trade/new - new trade", async () => {
    const response = await request(server).post("/trade/new").send({
      stockId: 1,
      quantity: 15,
      tradeType: "buy",
      tradeDate: "2024-08-08",
    });
    expect(response.status).toEqual(200);
    expect(response.body.trade).toEqual({
      tradeId: 4,
      stockId: 1,
      quantity: 15,
      tradeType: "buy",
      tradeDate: "2024-08-08",
    });
  });
});
describe("API error handling", () => {
  it("should return 404 for invalid ticker", async () => {
    const response = await request(server).get("/stocks/ticker/UULI");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("no stock found for this id");
  });

  it("should return 400 for invalid stockId input", async () => {
    const response = await request(server).post("/trade/new").send({
      stockId: "omkar",
      quantity: 15,
      tradeType: "buy",
      tradeDate: "2024-08-08",
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe("stockId is required and must be a number");
  });
});

describe("Mock function testing", () => {
  test("should return the new trade data", async () => {
    const mockTrade = {
      stockId: 1,
      quantity: 15,
      tradeType: "buy",
      tradeDate: "2024-08-08",
    };
    addNewTrade = jest.fn().mockReturnValue(mockTrade);
    const result = await addNewTrade(mockTrade);
    expect(result).toEqual(mockTrade);
    expect(addNewTrade).toHaveBeenCalledWith(mockTrade);
  });
});
