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

```sh
go install github.com/f3xp/bubblegit/cmd/bubblegit@latest
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

Each view is a pair of panes.

| Key | View |
| --- | --- |
| `1` | [Working tree](/views/working-tree/): files on the left, the diff of the selected file on the right |
| `2` | [Log](/views/log/): commits with a graph column on the left, the selected commit on the right |
| `3` | [Branches](/views/branches/): local branches on the left, the tip commit of the selected branch on the right |

## Moving around

| Key | Action |
| --- | --- |
| `j` `k` | move the cursor |
| `g` `G` | jump to the ends |
| `ctrl+d` `ctrl+u` | half-page |
| `tab` | switch pane |
| `q` `ctrl+c` | quit |

The full list is on the [keybindings](/keybindings/) page.
