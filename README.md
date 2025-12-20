[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# React Demos

A collection of React demo components showcasing various patterns and techniques. Built with React 19, TypeScript, Vite, and Tailwind CSS 4.

## Purpose

Demonstrates modern React development practices including:

- DOM parsing and manipulation
- Separation of business logic from UI
- Immutable state patterns
- Component composition
- TypeScript best practices
- Tailwind CSS styling
- React Router patterns

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm

### Install Dependencies

```bash
npm install
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean build artifacts
npm run clean
```

The development server runs on `http://localhost:5173` by default.

### Code Quality

```bash
# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check code formatting
npm run format:check
```

## Demos

### Challenges

#### Flag Capture

A Capture The Flag challenge demonstrating:

- DOM parsing with DOMParser API
- Complex HTML structure traversal
- Data extraction from custom attributes
- Character-by-character animated reveal
- Error handling and loading states

**Route:** `/challenges/flag-capture`

### Games

#### Letter Guess

A word guessing game demonstrating:

- Separation of game logic from UI components
- Immutable state pattern with factory methods
- Random word selection from curated word list
- Dynamic difficulty scaling based on word length
- Component composition (keyboard, word display, status indicators)
- Character masking and progressive reveal
- Accessibility with ARIA live regions and labels
- Backend-ready architecture with shared types

**Route:** `/games/letter-guess`

**Features:**

- 30+ programming-themed words (3-20+ characters)
- Auto-calculated difficulty (5-12 attempts based on word length)
- Animated letter reveal on correct guesses
- Visual feedback for game status (in progress, won, lost)
- Responsive design with mobile-first approach

#### Tic-Tac-Toe

A classic game demonstrating:

- Separation of game logic from UI components
- Immutable state updates (game logic returns new instances)
- Win condition algorithms
- 3x3 board layout with Tailwind styling
- Click event handling and hover effects

**Route:** `/games/tic-tac-toe`

## Features

- ✅ **Type-safe**: TypeScript with strict mode and enhanced type checking
- ✅ **Modern React**: React 19 with hooks and functional components
- ✅ **Routing**: React Router DOM with centralized layout
- ✅ **Styled**: Tailwind CSS 4 with custom design tokens
- ✅ **Fast**: Vite for lightning-fast HMR and optimized builds
- ✅ **Clean Code**: ESLint + Prettier with auto-sorting and formatting
- ✅ **Responsive**: Mobile-first design with Tailwind utilities
- ✅ **Accessible**: Semantic HTML with ARIA attributes

## Architecture

### Component Structure

The project follows a clear separation of concerns:

**`src/components/`** - Reusable UI components

- `Layout` - Provides header/footer wrapper for all pages
- `Header` - "Back to Home" navigation (hidden on home page)
- `Footer` - Attribution and GitHub links
- `DemoCard` - Reusable card for linking to demos

**`src/demos/`** - Demo showcase components

- `demos/challenges/` - CTF and puzzle demos (e.g., FlagCapture)
- `demos/games/` - Game UI components (e.g., TicTacToe)

**`src/games/`** - Pure TypeScript game logic (no React)

- Immutable classes with factory methods
- Business logic separated from UI
- Example: `TicTacToe` class in `games/TicTacToe/game.ts`

**`src/pages/`** - Page components

- `Home` - Landing page with demo cards

### Game Architecture Pattern

Games separate business logic from UI:

- **Game Logic** (`src/games/`) - Pure TypeScript classes with immutable patterns (methods return new instances)
- **UI Components** (`src/demos/games/`) - React components that wrap game logic classes

Example: `TicTacToe` class handles game rules and logic, while `TicTacToe.tsx` manages component state and renders the UI.

### State Management

- Local state via `useState` (no global state library)
- Derived values via `useMemo`
- Memoized callbacks via `useCallback`
- Immutable game state (game logic returns new instances)

### Routing

The app uses React Router with a centralized Layout component:

- Home page (`/`) - Lists all available demos
- Demo pages (e.g., `/challenges/flag-capture`) - Individual demo components
- Layout provides header navigation and footer on all pages

To add a new demo:

1. Create component in `src/demos/challenges/` or `src/demos/games/`
2. Add route in `src/App.tsx`
3. Add DemoCard in `src/pages/Home.tsx`

## Technical Details

- **TypeScript**: Strict mode with enhanced checks (`noImplicitReturns`, `noUncheckedIndexedAccess`)
- **ESLint**: Flat config with type-aware linting and automatic import/prop sorting
- **Prettier**: Tailwind class sorting, double quotes, semicolons
- **Icons**: Lucide React for scalable, customizable icons
- **Font**: Inter from Google Fonts
- **Build Tool**: Vite 7 with React plugin

## Code Style

### Import Sorting

Enforced via ESLint (`eslint-plugin-simple-import-sort`). Run `npm run lint:fix` to auto-sort.

### JSX Props Sorting

Enforced via ESLint (`react/jsx-sort-props`):

- Reserved props (key, ref) first
- Regular props alphabetically
- Callbacks/event handlers last

### Prettier

Formats code with:

- 80 character line width
- Semicolons enabled
- Double quotes
- 2 space indentation
- Trailing commas (all)
- Arrow function parentheses (always)
- LF line endings (Unix-style)
- Tailwind class sorting via `prettier-plugin-tailwindcss`

## Configuration

### TypeScript

Project uses TypeScript project references:

- `tsconfig.app.json` - Application code config
- `tsconfig.node.json` - Build tooling config
- `tsconfig.json` - Root config referencing both

### npm

`.npmrc` ensures exact versions for deterministic builds:

```
save-exact=true
```

## License

MIT
