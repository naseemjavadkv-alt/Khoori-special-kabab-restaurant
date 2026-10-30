/* ==========================================================================
   RESTAURANT SETTINGS  –  change everything about the business here
   ========================================================================== */
window.RESTAURANT = {
  // ---- Branding ---------------------------------------------------------
  name: "Khoori Special Kabab Restaurant",
  shortName: "Khoori",
  tagline: "Persian kabab, stews and grills – order in minutes on WhatsApp.",
  logo: "images/logo.svg",          // your logo (square SVG or PNG works best)

  // ---- WhatsApp ordering --------------------------------------------------
  // Country code + number, digits only (no "+", spaces or dashes).
  // UAE example: +971 58 883 5200  ->  "971588835200"
  whatsappNumber: "971588835200",

  // ---- Contact details shown on the site ---------------------------------
  phoneDisplay: "+971 58 883 5200",
  phoneTel: "+971588835200",        // used for the "Call" button
  email: "",                        // optional, leave "" to hide
  address: "United Arab Emirates",  // EDIT: add your full street address
  mapsLink: "",                     // EDIT: paste your Google Maps link to show a "Get directions" button

  // ---- Opening hours -----------------------------------------------------
  // 24h format. If "close" is earlier than "open" the restaurant closes the NEXT day.
  // Current setting: open 9:00 AM, close 7:00 AM the next morning (22 hours).
  hours: { open: "09:00", close: "07:00" },
  timezone: "Asia/Dubai",           // used for the "Open now / Closed" badge

  // ---- Money -------------------------------------------------------------
  currency: "AED",                  // printed before every price, e.g. "AED 60.00"
  deliveryFee: 0,                   // added to the total when above 0
  minOrder: 0,                      // minimum item total; 0 = no minimum
  deliveryNote: "Delivery charges, if any, are confirmed by the restaurant on WhatsApp.",

  // ---- Technical ---------------------------------------------------------
  cartStorageKey: "khoori_cart_v1"  // change if you run several sites on one domain
};
