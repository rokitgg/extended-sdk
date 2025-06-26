# Contributing to Extended API SDK

Thank you for your interest in contributing to the Extended API SDK! This is an unofficial TypeScript SDK for the Extended Exchange API that's actively under development. We welcome contributions from the open source community.

## 🚀 Development Status

This SDK is currently in **active development** and we're working on:

- ✅ **Completed**: All public info endpoints (markets, stats, order book, trades, candles, funding, open interest)
- 🔄 **In Progress**: Additional features and improvements
- 📋 **Planned**: Private (exchange) endpoints, WebSocket support, and more

We'd love your help in making this SDK even better!

## 🤝 How to Contribute

### Before You Start

1. **Check existing issues** - Look for existing issues or discussions that might be related to your contribution
2. **Open an issue first** - For new features or significant changes, please open an issue to discuss the approach
3. **Keep it focused** - Try to keep your changes focused on a single feature or bug fix

### Types of Contributions We Welcome

- 🐛 **Bug fixes** - Help us squash bugs and improve reliability
- ✨ **New features** - Add support for new API endpoints or functionality
- 📚 **Documentation** - Improve docs, add examples, or clarify usage
- 🧪 **Tests** - Add or improve test coverage
- 🔧 **Code quality** - Refactoring, performance improvements, or code style fixes
- 🌐 **Translations** - Help translate documentation to other languages

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Getting Started

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/extended-sdk.git
   cd extended-sdk
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the development environment**
   ```bash
   cd packages/sdk
   pnpm install
   ```

4. **Run tests to ensure everything works**
   ```bash
   pnpm test
   ```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes
   git checkout -b fix/your-bug-description
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Add tests for new functionality
   - Update documentation as needed

3. **Run the development tools**
   ```bash
   pnpm lint          # Check code style
   pnpm lint:fix      # Fix code style issues
   pnpm test          # Run tests
   pnpm build         # Build the package
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Prefer `const` over `let` when possible
- Use explicit return types for public functions
- Use interfaces for object shapes, types for unions/primitives

### Code Style

We use [Biome](https://biomejs.dev/) for code formatting and linting:

```bash
pnpm lint          # Check for issues
pnpm lint:fix      # Fix automatically fixable issues
pnpm format        # Format code
```

### Testing

- Write tests for all new functionality
- Use [Vitest](https://vitest.dev/) for testing
- Follow the existing test patterns in the codebase
- Tests should be integration tests using real API calls (no mocks)

Example test structure:
```typescript
describe("Feature Name", () => {
  let client: InfoClient;

  beforeAll(() => {
    const transport = new HttpTransport({ isTestnet: false });
    client = new InfoClient({ transport });
  });

  it("should do something", async () => {
    const result = await client.someMethod();
    expect(result).toBeDefined();
  });
});
```

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for new API endpoint
fix: handle edge case in market validation
docs: update README with new examples
test: add tests for funding history pagination
```

## 🏗️ Project Structure

```
packages/sdk/
├── src/
│   ├── clients/          # API clients (InfoClient, etc.)
│   ├── transports/       # Transport implementations (HTTP, WebSocket)
│   ├── types/           # TypeScript type definitions
│   ├── schemas/         # Zod validation schemas
│   ├── errors/          # Custom error classes
│   └── index.ts         # Main entry point
├── tests/               # Test files
├── dist/               # Build output (generated)
└── package.json        # Package configuration
```

## 🔧 Adding New Features

### Adding a New API Endpoint

1. **Create Zod schemas** in `src/schemas/info/market/` or appropriate location
2. **Add TypeScript types** in `src/types/info/` or appropriate location
3. **Implement the client method** in `src/clients/info.ts`
4. **Write comprehensive tests** in `tests/clients/info/`
5. **Update documentation** in README.md

### Example: Adding a New Endpoint

```typescript
// 1. Add schema (src/schemas/info/market/new-endpoint.ts)
export const NewEndpointSchema = z.object({
  // ... schema definition
});

// 2. Add types (src/types/info/new-endpoint.ts)
export type NewEndpointData = z.infer<typeof NewEndpointSchema>;

// 3. Add client method (src/clients/info.ts)
async newEndpoint(market: string): Promise<NewEndpointData[]> {
  // ... implementation
}

// 4. Add tests (tests/clients/info/new-endpoint.test.ts)
describe("New Endpoint", () => {
  it("should return data", async () => {
    // ... test implementation
  });
});
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Environment details**: Node.js version, OS, package manager
2. **Steps to reproduce**: Clear, step-by-step instructions
3. **Expected behavior**: What you expected to happen
4. **Actual behavior**: What actually happened
5. **Error messages**: Full error messages and stack traces
6. **Code example**: Minimal code that reproduces the issue

## 💡 Feature Requests

When requesting features:

1. **Describe the problem** you're trying to solve
2. **Explain why** this feature would be useful
3. **Provide examples** of how you'd use it
4. **Consider alternatives** that might already exist

## 🔍 Code Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **Code review** by maintainers
3. **Discussion** of any concerns or suggestions
4. **Merge** once approved

## 📝 Documentation

When contributing documentation:

- Keep it clear and concise
- Include code examples
- Update both README.md and inline JSDoc comments
- Test your examples to ensure they work

## 🎉 Recognition

Contributors will be recognized in:

- The project's README.md
- Release notes
- GitHub contributors list

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions and general chat
- **Code of Conduct**: Please be respectful and inclusive

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Extended API SDK! 🚀 