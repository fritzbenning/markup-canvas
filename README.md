# 🤿 Markup Canvas

High-performance canvas-like container with pan and zoom capabilities for HTML content.

## 📦 Packages

This is a monorepo containing the following packages:

- **[@markup-canvas/core](./packages/core)** - Core library for vanilla JavaScript/TypeScript
- **[@markup-canvas/react](./packages/react)** - React components and hooks
- **[@markup-canvas/examples-vanilla](./packages/examples-vanilla)** - Vanilla JS examples
- **[@markup-canvas/examples-react](./packages/examples-react)** - React examples

## 🚀 Quick Start

### Vanilla JavaScript

```bash
npm install @markup-canvas/core
```

```javascript
import { MarkupCanvas } from '@markup-canvas/core';

const canvas = new MarkupCanvas(container, {
  width: 20000,
  height: 15000,
  enableZoom: true,
  enablePan: true,
});

canvas.on('zoom', (zoom) => console.log('Zoom:', zoom));
```

### React

```bash
npm install @markup-canvas/react @markup-canvas/core
```

```tsx
import { MarkupCanvas } from '@markup-canvas/react';

function App() {
  return (
    <MarkupCanvas
      width={20000}
      height={15000}
      enableZoom={true}
      enablePan={true}
    >
      <div>Your zoomable content here</div>
    </MarkupCanvas>
  );
}
```

## ✨ Features

- 🚀 **High Performance**: 60fps smooth animations with GPU acceleration
- 🎯 **Precise Control**: Zoom, pan, and navigate with mouse, keyboard, or touch
- 📏 **Rulers & Grid**: Optional rulers and grid overlay
- 🎨 **Pure HTML**: Use any HTML content or framework components
- 🔧 **Event System**: Built-in EventEmitter for reactive updates
- ⚛️ **React Support**: First-class React components and hooks
- 📦 **TypeScript**: Full TypeScript support with comprehensive types
- 🎪 **Framework Agnostic**: Core library works with any framework

## 🛠️ Development

This project uses [Turborepo](https://turbo.build/repo) for monorepo management and [pnpm](https://pnpm.io/) for package management.

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all packages in development mode
pnpm dev
```

### Package Scripts

```bash
# Build all packages
pnpm build

# Run development mode for all packages
pnpm dev

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean

# Format code
pnpm format
```

### Working with Packages

```bash
# Build only core package
cd packages/core && pnpm build

# Run React examples
cd packages/examples-react && pnpm dev

# Run vanilla JS examples
cd packages/examples-vanilla && pnpm dev
```

## 📖 Documentation

- [Core Library Documentation](./packages/core/README.md)
- [React Wrapper Documentation](./packages/react/README.md)
- [React Abstraction Guide](./REACT_ABSTRACTION_GUIDE.md)
- [Improvement Roadmap](./IMPROVEMENT_ROADMAP.md)
- [NPM Publishing Guide](./NPM_PUBLISHING_GUIDE.md)

## 🧪 Examples

### Vanilla JavaScript

See [packages/examples-vanilla](./packages/examples-vanilla) for vanilla JavaScript examples.

```bash
cd packages/examples-vanilla
pnpm dev
```

### React

See [packages/examples-react](./packages/examples-react) for React examples.

```bash
cd packages/examples-react
pnpm dev
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [GitHub Repository](https://github.com/your-repo/markup-canvas)
- [NPM - Core](https://www.npmjs.com/package/@markup-canvas/core)
- [NPM - React](https://www.npmjs.com/package/@markup-canvas/react)
