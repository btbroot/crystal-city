# Crystal City

A single-player pixel-art browser game set in Mosswick. Explore a multi-tile city, collect crystals, and trade them for visibly wearable clothing at three shops with timed assortments.

## Run locally

Requires Node.js 22.13+ (Node 24 recommended).

```sh
npm run install:ci
npm run dev
```

Open the printed local URL. WASD or arrow keys move, E browses a nearby shop, I opens the wardrobe, M opens the town map, Space pauses, and Escape closes menus. Touch movement buttons appear on narrow screens. Sound is optional.

## Verify

```sh
node --test --test-isolation=none tests/engine.test.mjs
npx tsc --noEmit
npm run build
```

The engine tests cover crystal values, collision, normalized movement, reachable shops, purchases, equipment, restocking, persistence, invalid saves, and walkable spawn positions.

## Game structure

- `game/engine.ts` owns world geometry, collision, rarity and product definitions, simulation, commerce, and versioned save data.
- `game/render.ts` draws original pixel artwork, layered character clothing, and the town map on Canvas.
- `app/page.tsx` runs the game loop and keyboard/touch input and provides accessible shop and wardrobe dialogs.

Each crystal awards a shared balance: common 1, uncommon 5, rare 15, legendary 50. Shops offer four products and refresh on each minute boundary, including while menus are open. A purchase equips the item immediately. Four clothing slots can be changed independently, and wardrobe items can be removed.

Progress is saved to this browser’s local storage under `crystal-city-v1`, with a fresh game as the fallback for invalid data. Save failures do not interrupt play. No account, backend, or database is needed for game state. Hosting uses the Sites Vinext starter and its standard Cloudflare Worker build integration.
