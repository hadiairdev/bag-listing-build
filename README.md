# Secondhand Bag Listing — build review

A working demo of the **Secondhand Bag Listing Page** phase, for exercising the Airdev portal's
build review flow. Dummy data throughout; nothing here is a product.

Open `index.html`, or use the Pages URL.

## What actually works

- **Search & filter by brand/model** — free text over brand and model, plus brand, condition and
  price filters. They combine, and each active filter is its own removable chip.
- **Wishlist / save for later** — toggling persists in `localStorage`, survives reload, and has a
  *Saved only* view. The count in the results line reads both numbers.

## What is deliberately not built here

Seller verification, condition grading as an authoring step, the authenticity badge as a paid flow,
price suggestion, messaging, escrow checkout, shipping labels and ratings. Those are in the scope
prototype — this repo is the build half, and a reviewer should expect to find them absent rather
than broken.

## Two things worth knowing before reviewing

- **The brand list is derived from the data**, not hardcoded, so the filter cannot drift from what
  is listed.
- **`localStorage` reads and writes are wrapped.** In a private window or with site data blocked the
  accessor itself throws, and an unreadable wishlist renders as an empty one rather than a broken
  page.
