# Extended API SDK

Unofficial TypeScript SDK for the Extended Exchange API.

## Features

- 🔒 **Type-safe**: Full TypeScript support with comprehensive type definitions
- 🛡️ **Runtime validation**: Zod schemas for all API responses
- 🚀 **Modern**: Built with modern JavaScript/TypeScript tooling
- 📦 **Tree-shakable**: Only import what you need
- 🧪 **Well-tested**: Comprehensive test suite with real API integration

## 🚀 Development Status

This SDK is currently in **active development**! We've completed all public info endpoints and are working on additional features. We welcome contributions from the open source community to help make this SDK even better.

**✅ Completed:**
- All public info endpoints (markets, stats, order book, trades, candles, funding, open interest)
- Comprehensive TypeScript types and Zod validation
- Full test coverage with real API integration

**🔄 In Progress:**
- Additional features and improvements
- Performance optimizations
- Enhanced error handling

**📋 Planned:**
- Private endpoints support
- WebSocket transport for real-time data
- Additional utility functions

## Installation

```bash
npm install @rokitgg/extended
# or
pnpm add @rokitgg/extended
# or
yarn add @rokitgg/extended
```

## Quick Start

### Basic Usage

```ts
import { HttpTransport } from "@rokitgg/extended/transports";
import { InfoClient } from "@rokitgg/extended/clients";

const transport = new HttpTransport();
const infoClient = new InfoClient({ transport });

// Get all markets
const allMarkets = await infoClient.markets();

// Get specific market (using query parameters)
const btcMarket = await infoClient.markets({ market: "BTC-USD" });

// Get multiple markets (using query parameters)
const markets = await infoClient.markets({ market: ["BTC-USD", "ETH-USD"] });
```

### Market Statistics

```ts
// Get market statistics
const stats = await infoClient.marketStats("BTC-USD");
console.log(stats.lastPrice); // Last traded price
console.log(stats.volume24h); // 24-hour volume
console.log(stats.fundingRate); // Current funding rate
```

### Order Book

```ts
// Get market order book
const orderBook = await infoClient.marketOrderBook("BTC-USD");
console.log(orderBook.bid); // Array of bid orders
console.log(orderBook.ask); // Array of ask orders
```

### Recent Trades

```ts
// Get recent trades
const trades = await infoClient.marketTrades("BTC-USD");
console.log(trades[0].p); // Trade price
console.log(trades[0].q); // Trade quantity
console.log(trades[0].S); // Trade side (BUY/SELL)
```

### Candles History

```ts
// Get candles history
const candles = await infoClient.candles("BTC-USD", "trades", "1m", 1000);
console.log(candles[0].o); // Open price
console.log(candles[0].h); // High price
console.log(candles[0].l); // Low price
console.log(candles[0].c); // Close price
console.log(candles[0].v); // Volume
```

### Funding History

```ts
// Get funding history
const endTime = Date.now();
const startTime = endTime - 7 * 24 * 60 * 60 * 1000; // 7 days ago

const fundingHistory = await infoClient.funding("BTC-USD", startTime, endTime);
console.log(fundingHistory.data); // Array of funding rates
console.log(fundingHistory.pagination); // Pagination info
```

### Open Interest History

```ts
// Get open interest history
const endTime = Date.now();
const startTime = endTime - 7 * 24 * 60 * 60 * 1000; // 7 days ago

const openInterest = await infoClient.openInterest("BTC-USD", "P1D", startTime, endTime);
console.log(openInterest[0].i); // Open interest in USD
console.log(openInterest[0].I); // Open interest in synthetic asset
console.log(openInterest[0].t); // Timestamp
```

## API Reference

### Transports

#### HttpTransport

The HTTP transport for making REST API calls.

```ts
import { HttpTransport } from "@rokitgg/extended/transports";

const transport = new HttpTransport({
  isTestnet: false, // Use testnet API
  timeout: 10000, // Request timeout in ms
});
```

### Clients

#### InfoClient

Client for accessing public market information.

```ts
import { InfoClient } from "@rokitgg/extended/clients";

const client = new InfoClient({ transport });

// Available methods:
await client.markets(); // Get all markets
await client.marketStats("BTC-USD"); // Get market statistics
await client.marketOrderBook("BTC-USD"); // Get order book
await client.marketTrades("BTC-USD"); // Get recent trades
await client.candles("BTC-USD", "trades", "1m", 1000); // Get candles
await client.funding("BTC-USD", startTime, endTime); // Get funding history
await client.openInterest("BTC-USD", "P1D", startTime, endTime); // Get open interest
```

### Types

All TypeScript types are available for import:

```ts
import type { 
  ExtendedMarketData,
  MarketStats,
  MarketOrderBook,
  MarketTrade,
  Candle,
  FundingRate,
  OpenInterest
} from "@rokitgg/extended/types";
```

### Schemas

Zod schemas for runtime validation:

```ts
import { 
  ExtendedMarketDataSchema,
  MarketStatsSchema,
  MarketOrderBookSchema,
  MarketTradeSchema,
  CandleSchema,
  FundingRateSchema,
  OpenInterestSchema
} from "@rokitgg/extended/schemas";
```

### Errors

Error classes for handling API errors:

```ts
import { 
  InvalidInputError,
  HttpRequestError,
  TransportError
} from "@rokitgg/extended/errors";
```

## 🤝 Contributing

We love contributions from the open source community! This SDK is actively under development and we welcome:

- 🐛 **Bug fixes** and improvements
- ✨ **New features** and API endpoint support
- 📚 **Documentation** improvements
- 🧪 **Test coverage** enhancements
- 🔧 **Code quality** improvements

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** and set up the development environment
3. **Create a feature branch** for your changes
4. **Make your changes** following our coding standards
5. **Run tests** to ensure everything works
6. **Submit a pull request** with a clear description

For detailed contribution guidelines, see our [CONTRIBUTING.md](CONTRIBUTING.md) file.

### Development Setup

```bash
git clone https://github.com/rokitgg/extended-sdk.git
cd extended-sdk/packages/sdk
pnpm install
pnpm test  # Run tests to verify setup
```

## Development

### Setup

```bash
git clone https://github.com/rokitgg/extended-sdk.git
cd extended-sdk/packages/sdk
pnpm install
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Lint

```bash
pnpm lint
pnpm lint:fix
```

## License

MIT