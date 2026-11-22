# Crystal City

A single-player pixel-art browser game set in Mosswick. Explore a multi-tile city, collect crystals, and trade them for visibly wearable clothing at three shops with timed assortments.

## Run locally

Requires Node.js 24 or newer (tested with Node 24).

```sh
npm ci
npm run dev
```

Open the printed local URL. WASD or arrow keys move, E browses a nearby shop, I opens the wardrobe, M opens the town map, Space pauses, and Escape closes menus. Touch movement buttons appear on narrow screens. Sound is optional.

Run `npm run build` to write the production files to `_site/`. Run `npm start` to preview that build locally.

## Publish to GitHub Pages and itch.io

In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. Save the `btbroot` [itch.io API key](https://itch.io/user/settings/api-keys) as the `ITCHIO_API_KEY` [repository secret](https://github.com/btbroot/crystal-city/settings/secrets/actions).

The publishing workflow runs on pushes to `main`. It runs the engine tests and checks TypeScript before building the game once, then deploys the same files to [GitHub Pages](https://btbroot.github.io/crystal-city/) and to the `html5` channel on [itch.io](https://btbroot.itch.io/crystal-city).

After the first itch.io upload, edit the project and set **Kind of project** to **HTML**. Check **This file will be played in the browser** for the `html5` upload and save. Future runs update that upload through the same channel.

The files in `_site/` use relative asset URLs so they can be served over HTTP at a domain root, under a project path, or in the itch.io player. For a manual itch.io upload, ZIP the contents of `_site/` with `index.html` at the archive root.

Progress stays in each browser's local storage. Saves from another domain do not transfer automatically.

## Verify

```sh
npm test
npm run build
```

The engine tests cover crystal values, collision, normalized movement, reachable shops, purchases, equipment, restocking, persistence, invalid saves, and walkable spawn positions.

## Game structure

- `game/engine.ts` owns world geometry, collision, rarity and product definitions, simulation, commerce, and versioned save data.
- `game/render.ts` draws original pixel artwork, layered character clothing, and the town map on Canvas.
- `app/crystal-city.tsx` runs the game loop and keyboard/touch input and provides accessible shop and wardrobe dialogs.

Each crystal awards a shared balance: common 1, uncommon 5, rare 15, legendary 50. Shops offer four products and refresh on each minute boundary, including while menus are open. A purchase equips the item immediately. Four clothing slots can be changed independently, and wardrobe items can be removed.

Progress is saved to this browser’s local storage under `crystal-city-v1`, with a fresh game as the fallback for invalid data. Save failures do not interrupt play.
