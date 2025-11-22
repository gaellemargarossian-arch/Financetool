# Budget App - Web Version

A minimal working web application built with Next.js 14+, Tailwind CSS, and shadcn UI.

## Features

- ✅ Next.js 14+ with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ shadcn UI components
- ✅ Responsive design
- ✅ Dark mode support (ready)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Budget/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles with Tailwind
├── components/
│   └── ui/              # shadcn UI components
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   └── utils.ts         # Utility functions (cn helper)
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Available Components

- **Button** - Multiple variants (default, secondary, outline, ghost, etc.)
- **Card** - Card component with header, title, description, content, footer

## Adding More shadcn UI Components

To add more shadcn UI components, you can use the shadcn CLI:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

## Customization

- **Colors**: Edit `app/globals.css` to customize the color scheme
- **Theme**: Modify `tailwind.config.ts` for theme customization
- **Components**: All UI components are in `components/ui/` and can be customized

## Next Steps

1. Add more pages and routes
2. Integrate with your backend/API
3. Add more shadcn UI components as needed
4. Implement authentication
5. Add data fetching and state management

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn UI Documentation](https://ui.shadcn.com/)

