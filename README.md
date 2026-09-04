# bubblegit-website

Documentation site for [bubblegit](https://github.com/f3xp/bubblegit), built with Astro Starlight.

```sh
npm install
npm run dev      # generates src/generated/ then serves
npm run build
```

## Refreshing screenshots and keybindings

`goldens/` holds copies of bubblegit's golden test renders and its keymap. `scripts/goldens.mjs`
runs before `dev` and `build` and turns them into HTML fragments and the keybindings table.
When the TUI changes, copy them again from a sibling checkout:

```sh
cp ../bubblegit/internal/ui/testdata/*.golden ../bubblegit/internal/ui/keys/keys.go goldens/
```

A key added to `keys.Default()` without a description in the script fails the build on purpose.
