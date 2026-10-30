# Khoori Special Kabab Restaurant – online ordering site

Frontend only (HTML + CSS + JavaScript). No server, database, login or payment.
Customers browse the menu, fill a cart, enter delivery details and the site opens
**WhatsApp with the order already written**. The order is only placed when the
customer taps **Send** in WhatsApp.

## Run it

**Quickest:** double-click `index.html`. Menu, cart, search, validation and the
WhatsApp link all work.

**Recommended (also enables "Use my current location"):** browsers only allow
location sharing on `https://` pages or `localhost`.

    cd khoori-restaurant
    python3 -m http.server 8000      # then open http://localhost:8000

**Put it online (free):** drag the whole folder onto https://app.netlify.com/drop,
or upload it to GitHub Pages / Cloudflare Pages. These give you an https address,
so location sharing works for customers.

## Change things (3 files)

| What | Where |
|------|-------|
| WhatsApp number, phone, address, Google Maps link, opening hours, currency, delivery fee, minimum order | `js/config.js` |
| Dishes, prices, descriptions, photos, categories, "popular" dishes | `js/menu.js` |
| Colours (brand blue, saffron button colour …) | top of `css/style.css` (`:root { … }`) |
| Logo | replace `images/logo.svg` / `images/logo.png` (square image) and `images/favicon.png` (small browser-tab icon) |
| Photos on the home-page hero | the three `<img>` tags in `index.html` (class `plate`) |

### WhatsApp number
In `js/config.js`: `whatsappNumber: "971588835200"` – country code + number,
digits only (no `+`, spaces or dashes). Currently set to +971 58 883 5200.

### Opening hours
`hours: { open: "09:00", close: "07:00" }` – when `close` is earlier than `open`
the restaurant closes the next day. The "Open now / Closed" badge uses
`timezone: "Asia/Dubai"`. Customers can still order while closed; they see a note.

### Add or edit a dish (`js/menu.js`)
Copy any line in `MENU_ITEMS`, change the text and price:

    { id: "my-new-dish", category: "kabab", name: "My New Dish",
      description: "Short text", price: 45, image: "images/menu/my-new-dish.jpg" },

* `id` must be unique and have no spaces.
* `category` must match an `id` in `MENU_CATEGORIES` (add your own categories there).
* No photo yet? Use `image: null` – a branded placeholder is shown.
* Size-based prices (like pizza): `sizes: [{label:"Small", price:30}, …]` instead of `price`.
* Temporarily unavailable: add `soldOut: true`.

### IMPORTANT – pizza prices
Your menu file only said "Price by size" with no amounts. The Small 30 / Medium 45 /
Large 60 prices in `PIZZA_SIZES` (top of `js/menu.js`) are **placeholders**. Replace
them with your real prices before going live.

## Notes
* The cart is kept in the browser (`localStorage`), so it survives a page refresh.
  Name, phone, address and notes are also remembered on that device until the
  customer taps "I've sent it, start a new order".
* The contact form also opens WhatsApp with the message pre-filled; it is only
  delivered when the visitor taps Send.
* Fonts (Reem Kufi, Figtree) load from Google Fonts when online and fall back to
  system fonts when offline.
* Dishes marked "Illustration" use a photo of a similar dish until you add the real one (delete `illustrative: true` in `js/menu.js` after replacing the image).
* Menu photos were cut from your PDF screenshots (about 214 × 145 px originals), so
  they look best at card size. For sharper photos, drop higher-resolution files into
  `images/menu/` using the same file names.
