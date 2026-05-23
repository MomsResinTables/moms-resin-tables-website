# Mom's Resin Tables 🪵

**Handcrafted resin and wood tabletops built one at a time in Safety Harbor, Florida.**

Every piece is a one-of-one. No mass production. No two tables are alike.

🌐 **Live site:** [momsresintables.com](https://momsresintables.com)

## Source of Truth

- This repository root is the production source of truth for the site.
- On the local machine, `E:\MomEcommerce` is only a parent container. The actual Git repo and deploy root is `E:\MomEcommerce\Moms Table Tops\Ecommerce`.
- The live domain currently serves from GitHub Pages for this repository. Vercel is not the active production host for `momsresintables.com`.

---

## What We Build

- **River channel tabletops** — live-edge wood with flowing resin rivers
- **Pigmented art pours** — bold color, deep gloss, statement pieces
- **Layered depth pours** — 3D visual depth locked in epoxy
- **Custom commissions** — fully spec'd to your dimensions, wood species, resin style, embeds, and base

All pieces ship nationwide from Safety Harbor, FL.

---

## Custom Builder

Customers can price and spec their own build at [momsresintables.com/custom.html](https://momsresintables.com/custom.html). The builder supports:

- Tabletop dimensions (width × depth × thickness)
- 12 wood species with real-grain photo previews
- 4 resin styles + pour depth
- 8 decorative embed options (figurines, glow powder, LED, etc.)
- 14 base styles (hairpin, A-frame, waterfall, drawer configurations, and more)
- Finish tier selection
- Reference image upload

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla HTML, CSS, JS (ES modules) |
| Payments | Stripe payment links + custom cart / checkout UI |
| Auth | Firebase |
| Hosting | GitHub Pages |
| Forms | Formspree |

---

## Project Structure

```
  index.html              # Homepage
  shop.html               # Product catalog
  product.html            # Product detail
  custom.html             # Custom Build configurator
  contact.html            # Contact
  about.html              # About
  styles.css              # Global stylesheet
  scripts/
    common.js             # Shared header, cart, checkout overlay, and account/auth logic
    main.js               # Homepage
    customizer.js         # Custom builder logic
    products.js           # Product rendering
  assets/
    images/               # Product + hero images
    woods/                # Wood species reference photos
    bases/                # Base style reference photos
    icons/                # Favicons and logo variants
```

---

## Contact

- 📧 support@momsresintables.com
- 📍 Safety Harbor, Florida
- 🇺🇸 Nationwide shipping

---

*Built with ❤️ for Mom.*
