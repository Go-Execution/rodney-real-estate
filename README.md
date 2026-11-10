# Rodney Peete | Luxury Real Estate & Architectural Advisory
> **Dreams R Real &bull; Southern California Real Estate Advisory**  
> Complete Architectural Revamp Inspired by **BCG Building Design** (`https://www.bcgbuildingdesign.com.au`)

---

## 🌟 Executive Overview

This project is a complete, ground-up architectural revamp of **Rodney Peete's Real Estate** website (`https://rodneypeeterealestate.com/`), transforming the former generic template into an ultra-luxury, award-winning architectural web experience modeled directly on the design system, kinetic typography, and physics-based animations of **BCG Building Design** (`https://www.bcgbuildingdesign.com.au`).

The new website honors Rodney Peete's 25+ years of real estate leadership, his analytical background in mathematics and human resource management, his micro-market farming center of gravity in Carson and Southern California (including the Inglewood sports & entertainment corridor near SoFi Stadium & Intuit Dome), and his philanthropic stewardship with **Smart Choices 501(c)(3)**.

---

## 📐 Design & Animation Parity (BCG Building Design Benchmark)

Every micro-interaction, scrolling animation, and aesthetic choice from the reference site has been engineered with precision:

| Feature / Animation | Reference Design (BCG) | Rodney Peete Revamp Implementation |
| :--- | :--- | :--- |
| **Smooth Scroll Engine** | Lenis (`lerp: 0.1`, `wheelMultiplier: 0.75`) | Integrated `@studio-freight/lenis` v1.1.18 bound to `gsap.ticker` with zero lag |
| **Kinetic Preloader** | Character-staggered typography slide & line mask exit | Full-screen carbon overlay with letter-by-letter stagger (`RODNEY PEETE`), progress indicator, slide-up exit (`yPercent: -100`), logo drop, and hero reveal |
| **Dynamic Navbar Color Inversion** | Switches colors when scrolling over `[data-navbar-dark="true"]` | Live viewport intersection detection that smoothly inverts navbar text, logo, and borders between dark and light themes |
| **Live Time & Location Ticker** | Brisbane, Australia live local clock | Real-time Los Angeles clock ticker (`LOS ANGELES, CA • HH:MM:SS PDT`) with pulsing green advisory status indicator |
| **Link Sibling Dimming** | `[data-link-wrap]:hover [data-link]` | Hovering any navigation link keeps it 100% and gracefully dims siblings to 40% opacity |
| **Horizontal Pinned Scroll Track** | `.horiz_sticky-track` pinned row sliding horizontally with scrub | Pinned viewport container with ScrollTrigger `scrub: 1`, horizontal gliding track of 4 architectural cards, per-card line-mask text reveals, and progress fill |
| **Featured Works / Portfolio** | Sticky image preview with ordinal numbering and hover/scroll swap | Split-layout with ordinal numbers (`01` to `06`), active divider line indicator (`featured-divider-active`), and sticky preview frame with instant crossfade on hover/scroll |
| **The Approach Section** | Pinned sticky left sidebar with scrolling narrative cards | Dark theme section (`data-navbar-dark="true"`), sticky left heading, and scrolling right cards with high-resolution imagery zoom |
| **Client Words (Testimonials)** | Dual-image split carousel with SplitText line masks | Dual-frame layout (large architectural photography + client thumbnail), slide counter (`01 / 04`), arrow navigation, and line-by-line reveal |
| **Footer Giant Typography** | Massive brand letters staggered entrance + expanding hairline | Full-width `RODNEY PEETE` architectural lettering with staggered upward entrance (`opacity: 0, yPercent: 110 -> 1, 0`) and expanding hairline rule (`scaleX: 0 -> 1`) |
| **Custom Cursor** | Smooth trailing cursor | Fluid custom cursor with magnetic hover expansion over links and cards |
| **Tactile Texture** | Subtle Swiss grain | 2% SVG fractal noise film grain overlay across the entire viewport |

---

## 🏛️ Content & Real Estate Portfolio

All information from Rodney Peete's original website and career has been curated and elevated:

### 1. The Broker Associate Profile
- **Licensed Experience**: Over 25 years as a California Real Estate Agent, Broker Associate, and Consultant.
- **Academic Foundation**: Associate Degree in Mathematics from Southwest College, Bachelor of Applied Science (B.A.Sc.) in Business Administration with concentration in Human Resource Management.
- **Center of Gravity**: Born & raised in Carson, California; specialized micro-market farming across Los Angeles, Orange, Riverside, and San Diego counties.
- **High-Profile Corridors**: Inglewood near SoFi Stadium, Intuit Dome, and the LA Sparks facility in El Segundo; Carson; Downey; Whittier; Long Beach; Bellflower; Moreno Valley; Rancho Belago.
- **Philanthropy**: Founder of Smart Choices 501(c)(3) youth literacy and empowerment initiative (*Dreams R Real*).

### 2. Curated Featured Properties
1. **The Ruthelen Modern Estate** &bull; 11513 Ruthelen St, Los Angeles, CA &bull; `$3,450,000` &bull; 5 Beds, 5.5 Baths, 4,850 SF
2. **Carson Heritage Residence** &bull; 361 E 224th St, Carson, CA &bull; `$1,850,000` &bull; 4 Beds, 3 Baths, 2,920 SF
3. **The Inglewood Sports District Compound** &bull; 100 Long St, Inglewood, CA &bull; `$4,200,000` &bull; 6 Beds, 6.5 Baths, 5,600 SF
4. **Rancho Belago Hillside Vista** &bull; Rancho Belago Foothills, CA &bull; `$2,950,000` &bull; 5 Beds, 6 Baths, 6,100 SF
5. **Via Del Sol Sanctuary** &bull; 13020 Via Del Sol Ave, Whittier, CA &bull; `$2,400,000` &bull; 4 Beds, 4 Baths, 3,800 SF
6. **Leahy Avenue Luxury Residence** &bull; 15116 Leahy Ave, Bellflower, CA &bull; `$1,650,000` &bull; 4 Beds, 3.5 Baths, 3,100 SF

### 3. Comprehensive Practice Areas
- Luxury Residential Sales & Dispositions
- Commercial Real Estate & Multi-Family Investments
- Strategic Zip Code Farming & Quantitative Market Forecasting
- Turnkey Mortgage Loan Advisory & Capital Structuring
- Certified State-Commissioned Notary Public & Living Trust Transfers
- Sports, Entertainment & Executive Relocation Concierge

---

## 🚀 Running the Website Locally

The website is fully built and self-contained with zero required build steps or complex dependencies:

```bash
# Start the built-in HTTP server
node server.js
```

Then open your browser to:
```
http://localhost:3000/
```

### File Hierarchy
```
rodney-real-estate/
├── index.html          # Main luxury architectural webpage
├── css/
│   └── main.css        # Complete architectural design system & animations
├── js/
│   └── app.js          # Lenis, GSAP ScrollTrigger, SplitText, Modals & Logic
├── server.js           # Lightweight production-ready static server
├── package.json        # Project metadata
├── vercel.json         # Static deployment configuration for Vercel
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

---

## 💎 Production Deployment
This codebase can be deployed directly to any static host:
- **Vercel**: Run `vercel` or connect the Git repository.
- **Netlify**: Drag and drop the folder or connect Git.
- **Firebase Hosting**: Run `firebase deploy`.
- **GitHub Pages**: Push to `gh-pages` or `main` branch.
