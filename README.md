# Next.js Project

A modern Next.js application with TypeScript and Tailwind CSS.

## Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # Authentication related routes
│   ├── (dashboard)/       # Dashboard related routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   └── shared/           # Shared components
├── lib/                   # Utility functions and shared logic
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── styles/               # Global styles and Tailwind config
└── constants/            # Constants and configuration

public/                   # Static assets
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- ESLint

## Development Guidelines

- Use TypeScript for type safety
- Follow the established project structure
- Keep components modular and reusable
- Use Tailwind CSS for styling
- Follow ESLint rules for code consistency

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
