---
title: Getting started
description: Install bubblegit, open a repository and learn the three views.
---

## Requirements

- Go 1.27+
- git 2.30+
- A terminal with truecolor

Mouse support and the kitty keyboard protocol are used where available. Without them things degrade cleanly.

## Install

bubblegit is in beta: it works, but commands and keybindings can still change between releases. The current release is [v0.2.0](https://github.com/f3xp/bubblegit/releases/tag/v0.2.0).

```sh
go install github.com/f3xp/bubblegit/cmd/bubblegit@v0.2.0
```

Or download an archive for your platform from the [releases page](https://github.com/f3xp/bubblegit/releases), extract it, and put the `bubblegit` binary on your `PATH`. Checksums are in `checksums.txt`. The macOS binaries are unsigned, so Gatekeeper needs one pass through:

```sh
xattr -d com.apple.quarantine ./bubblegit
```

Or run it from a clone of the repository:

```sh
go run ./cmd/bubblegit
```

## Run

```sh
bubblegit
```

Run it from anywhere inside a git repository.

## The three views

Each view is a pair of panes: the document on the left, the list on the right.

| Key | View |
| --- | --- |
| `1` | [Working tree](/views/working-tree/): the diff of the selected file on the left, files on the right |
| `2` | [Log](/views/log/): the selected commit on the left, commits with a graph column on the right |
| `3` | [Branches](/views/branches/): the tip commit of the selected branch on the left, local branches on the right |

## Moving around

| Key | Action |
| --- | --- |
| `j` `k` | move the cursor |
| `g` `G` | jump to the ends |
| `ctrl+d` `ctrl+u` | half-page |
| `tab` | switch pane |
| `?` | show every keybinding in a popup |
| `q` `ctrl+c` | quit |

The full list is on the [keybindings](/keybindings/) page.
