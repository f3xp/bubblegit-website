---
title: Mouse and layout
description: Move the splitter, work in small terminals and use the mouse.
---

## Splitter

`h` and `l` move the splitter one column. You can also drag it: it is the two border columns where the panes meet.

Each view keeps its own split as a fraction, so a terminal resize keeps the proportion. Neither pane goes below 24 columns.

The keys work where a drag cannot, such as a terminal too short to show the pane chrome.

## Small terminals

Below 48 columns there is only room for one pane. `tab` swaps which one is visible, and the splitter does nothing.

## Mouse

A left click focuses the pane it lands on and puts that pane's cursor on the row under it. In the diff, that is the line `space` then stages.

The wheel scrolls the pane under the pointer without moving focus. It moves the cursor, not a scroll offset.

Clicking the empty space below a list selects nothing. The middle and right buttons are left to the terminal for paste and its own menu.

## Text selection

Mouse tracking costs you the terminal's own text selection. Most terminals still select while shift is held.
