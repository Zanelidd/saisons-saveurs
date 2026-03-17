# 🌿 Saisons & Saveurs

A seasonal meal planner that generates balanced weekly menus based on vegetables available in the current month. Built with React, TypeScript, and the Spoonacular API.

---

## Overview

Saisons & Saveurs lets you generate weekly menus by selecting vegetables in season for any given month. Each meal displays its nutritional information and provides access to the full recipe. Favourite menus are saved locally and persist across sessions.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Vite](https://vitejs.dev) + React 18 | Bundler and UI framework |
| TypeScript | Static typing |
| [TanStack Query v5](https://tanstack.com/query) | Data fetching, caching and persistence |
| [Spoonacular API](https://spoonacular.com/food-api) | Recipes and nutritional data |
| CSS Modules | Scoped component styles |

---

## Project Structure

```
src/
├── types/                     # Centralised TypeScript types
│   ├── veggie.types.ts         # Veggie, Season, MonthNumber
│   ├── menu.types.ts           # DayMenu, MealEntry, Macros
│   ├── recipe.types.ts         # RecipeDetail
│   ├── user.types.ts           # Diet, UserPrefs
│   ├── fav.types.ts            # FavItem
│   └── api.types.ts            # Raw Spoonacular response types
│
├── data/
│   └── veggies.data.ts         # 40 vegetables with monthly availability
│
├── services/
│   ├── spoonacular.service.ts  # Spoonacular API calls
│   └── menu.service.ts         # Raw data transformation
│
├── lib/
│   └── queryClient.ts          # TanStack Query config + localStorage persistence
│
├── hooks/
│   ├── useMenu.ts              # Menu generation via Spoonacular
│   ├── useRecipe.ts            # Single recipe detail
│   └── useFavs.ts              # Favourites management (localStorage)
│
├── components/
│   ├── PlannerTab.tsx          # Main tab — selection and generation
│   ├── DayCard.tsx             # Day card with nutrition breakdown
│   ├── RecipePanel.tsx         # Collapsible recipe panel
│   └── FavsTab.tsx             # Favourites tab
│
├── styles/
│   ├── global.css              # Reset, CSS tokens, animations
│   ├── App.module.css
│   ├── PlannerTab.module.css
│   ├── DayCard.module.css
│   ├── RecipePanel.module.css
│   └── FavsTab.module.css
│
├── App.tsx                     # Root — tabs + favourites state
└── main.tsx                    # Entry point — QueryClientProvider
```

---

## Prerequisites

- Node.js 18+
- A [Spoonacular](https://spoonacular.com/food-api) account (free tier — 150 points/day)

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/saisons-saveurs.git
cd saisons-saveurs

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in VITE_SPOONACULAR_API_KEY in .env

# 4. Start the development server
npm run dev
```

---

## Environment Variables

Create a `.env` file at the project root:

```env
VITE_SPOONACULAR_API_KEY=your_key_here
```

> ⚠️ Never commit this file. It is already listed in `.gitignore`.

---

## Features

### Menu Planner
- Month selector with automatic detection of the current month
- 40 seasonal vegetables with a 12-month availability calendar
- Filters: diet type, number of people, duration (3, 5, or 7 days)
- Menu generation via Spoonacular based on selected vegetables

### Nutrition
- Calories and macros (protein, carbs, fat) per meal
- Visual macro breakdown bar per day
- Daily calorie total

### Recipes
- Full recipe on click (ingredients + steps)
- Scrollable panel with fixed height
- Link to the original source
- Persistent cache — a recipe already loaded is never re-fetched

### Favourites
- Save any day's menu with one click (❤️ / 🤍)
- Persisted in localStorage
- Dedicated tab with individual deletion

---

## Caching Strategy

TanStack Query is configured with `staleTime: Infinity` and `gcTime: Infinity` on all queries. The cache is persisted to localStorage via `@tanstack/query-sync-storage-persister` with a 30-day TTL.

**Practical result**: the same combination of (month + vegetables + diet + people + days) will only ever trigger one API call, even across separate sessions.

---

## API Quota

Spoonacular free tier: **150 points/day**

| Action | Points used |
|---|---|
| Menu generation (complexSearch) | ~1 pt |
| Recipe detail load | ~1 pt |
| Result served from cache | 0 pt |

---

## Known Technical Debt

- [ ] Recipes are in English — translation layer (DeepL or Claude API) to be added
- [ ] No allergen filtering
- [ ] Mobile responsive layout to be refined

---

## Development

```bash
npm run dev      # Development server with HMR
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

[React Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools) are enabled in development mode — a panel at the bottom of the screen lets you inspect the cache in real time.

---

## License

MIT