# 🐍 Snake AI Auto-Play

Watch AI algorithms play Snake automatically with multiple pathfinding strategies!

## 🚀 Features

- **4 AI Algorithms**: BFS, A*, Greedy BFS, Greedy A*
- **Speed Control**: 10ms-2000ms per tick (up to 100 ticks/sec)
- **Grid Sizes**: 10x10 to 30x30
- **Real-time Stats**: FPS, AI compute time, memory usage
- **Persistent Data**: High scores and settings saved locally

## 🛠️ Tech Stack

- **React 19** / **TypeScript 5.8** / **Vite 6**
- **Zustand 5** (state management)
- **Tailwind CSS 4** (styling)

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

### Option 3: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Connect your GitHub repository
4. Deploy automatically on every push

## 📊 AI Algorithms

| Algorithm | Speed | Accuracy | Best For |
|-----------|-------|----------|----------|
| **BFS** | Medium | ⭐⭐⭐⭐⭐ | Shortest path guarantee |
| **A*** | Medium | ⭐⭐⭐⭐⭐ | Balanced performance |
| **Greedy BFS** | Fast | ⭐⭐⭐ | Speed over accuracy |
| **Greedy A*** | Fast | ⭐⭐⭐⭐ | Good balance |

## 🎮 Controls

- **Start/Resume**: Begin or continue game
- **Pause**: Pause current game
- **Reset**: Reset game (keeps speed/algorithm settings)
- **AI Algorithm**: Select pathfinding algorithm
- **Game Speed**: Adjust tick rate (0-100%)
- **Grid Size**: Change board size (10-30)

## 📈 Performance Targets

- **60 FPS** rendering
- **<10ms** AI compute time
- **<500kB** bundle size (gzipped)
- **<200ms** INP (Interaction to Next Paint)

## 📝 License

MIT
