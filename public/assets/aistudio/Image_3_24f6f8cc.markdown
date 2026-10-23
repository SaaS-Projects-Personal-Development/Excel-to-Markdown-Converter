---
name: Precision Canvas
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#45dfa4'
  on-secondary: '#003825'
  secondary-container: '#00bd85'
  on-secondary-container: '#00452e'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#68fcbf'
  secondary-fixed-dim: '#45dfa4'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

The design system embodies a developer-first, hyper-focused technical aesthetic rooted in precision, density, and spatial control. Drawing from the visual language of high-performance desktop utilities and modern engineering platforms, it rejects decorative clutter in favor of structural clarity, instant keyboard readability, and low-latency feedback.

### Emotional Response & Personality
- **Focused & Unobtrusive:** The interface recedes entirely, allowing user data, code, and operational workflows to claim visual priority.
- **Engineered & Precise:** 1px hairline dividers, razor-sharp alignment, and microscopic radius values convey reliability and computational rigor.
- **Fluid & Responsive:** Subtle micro-interactions and low-latency states reward power users with instant tactile confidence.

### Design Movement
The visual style operates at the intersection of **Minimalist Precision** and **Technical Utilitarianism**, augmented by restrained **dark-mode glassmorphic chrome** for floating commands, palettes, and HUD elements.

## Colors

The palette is engineered specifically for OLED and deep-dark environments, prioritizing prolonged eye comfort and extreme structural contrast.

### Palette Architecture
- **Primary (`#6366f1` / Indigo 500):** Used strictly for focused interaction points, active navigation segments, primary commit actions, and glowing state indicators.
- **Secondary (`#34d399` / Emerald 400):** Reserved for telemetry validations, successful pipelines, active daemon status, and diff additions.
- **Base Surfaces (`#09090b`, `#18181b`, `#27272a`):** Deep zinc shades compose the canvas layers. `#09090b` anchors the lowest background viewport, while `#18181b` elevates structural panels and table layers.
- **Borders & Dividers (`#27272a`, `#3f3f46`):** Precision 1px dividers separate zones without visual weight.

### Contrast & State Rules
- Pure white (`#fafafa`) is reserved strictly for headlines, terminal prompts, and active text values.
- Muted secondary typography uses zinc-400 (`#a1a1aa`), falling back to zinc-500 (`#71717a`) for inactive metadata and keyboard shortcut hints.
- Accent colors must never be applied across large surface fills; they operate purely as micro-accents, strokes, dot badges, and cursor highlights.

## Typography

The typographic hierarchy prioritizes legibility in compact vertical distributions, high data density, and strict baseline alignment.

### Font Roles
- **Headlines (`Geist`):** Delivers clean geometry with compact ascenders and tight tracking, ideal for dense software headers, pane splitters, and modal titles.
- **Body & Data (`Inter`):** Selected for its neutral character shapes and exceptional readability at 12px and 13px sizes across dense data grids and inspection panels.
- **Code & Telemetry (`JetBrains Mono`):** Applied to log streams, git hashes, terminal views, JSON attributes, and inline keyboard shortcuts (`Kbd`).

### Hierarchy & Letter Spacing
Negative tracking is applied systematically to larger Geist headings (`-0.03em` to `-0.02em`) to maintain geometric cohesion. Small labels and code tokens receive neutral or slightly positive tracking to maintain immediate letter separation in high-density consoles.

## Layout & Spacing

The layout model is governed by a high-density, multi-pane workbench structure based on a 4px/8px incremental grid.

### Layout Philosophy
- **Split-Pane Workbench:** The primary screen is treated as a unified canvas subdivided by resizable horizontal and vertical panes, rather than isolated floating cards.
- **Viewport Optimization:** Content defaults to a 100vh fluid model with localized scrollable regions (lists, diffs, code viewers) rather than full-page window scrolling.
- **Dense Component Gaps:** Inner component padding defaults to `space-sm` (8px) and `space-md` (12px), keeping interactive controls compact and inline with developer tooling norms.

### Responsive Reflow
- **Desktop (HL
NŠŠˆ][KXÛÛ[[ˆÛÜšØ™[˜Ú
ÚYX˜\ˆ˜]šYØ][Û‹š[H™YKš[X\HÛÜšÜÜXÙK[[Y]KÜ›Ü\Y\È[œÜXİÜŠKˆİ]\œÈš^Y]\™[X‚‹H
Š•X›]
ÍHLÎ\
NŠŠˆÛÛ\Ù\ÈÙXÛÛ™\H[œÜXİÜˆ[Èİ™\›^H˜]Ù\œÎÈÚYX˜\ˆÚYÈÈÛÛ\ÙYXÛÛ‹[Û›H˜]šYØ][Ûˆ˜Z[‚‹H
Š“[Øš[H
Í
NŠŠˆ[™X\ˆİXÚÙYšY]ÈÚ]˜]Ù\‹X˜\ÙYÛÛ[X[™˜\ˆ
ÛY
ÚØ
K[]ÚYØ\™Ë[™›İÛHXİ[ÛˆÚY]È›Üˆ[œÜXİÜˆ]šX]\ËˆX\™Ú[œÈÛÛ\™\ÜÈÈ\™[X‚‚ˆÈÈ[]˜][Ûˆ	ˆ\‚•š\İX[Y\˜\˜ÚHÙ\È›İ™[HÛˆX]K^H›ÜÚYİÜËˆ[œİXY\\ÈXÚY]™Y›İYÚ
ŠÛ˜[^Y\š[™ÊŠ‹
ŠŒ\Üš\ÜZ\›[™H›Ü™\œÊŠ‹[™
Š™œ›ÜİY˜[œÛXÙ[˜ŞJŠ‹‚‚ˆÈÈÈ^Y\š[™Èİ˜]YŞBŒKˆ
Š˜\ÙH^Y\ˆ
]™[HÌLL˜
NŠŠˆHš[X\H\XØ][ÛˆØ[˜\È[™˜XÚÙÜ›İ[™›Üˆ\ÜÚ]™HÛÜšÈ\™X\Ë‚Œ‹ˆ
Š”İX‹T[™\È	ˆX›\È
]™[HHÌLŒLŒMX
NŠŠˆÚYX˜\œËØİ[Y[[™[Ë[™™YH˜]šYØ]ÜœÈÙ\\˜]YH\ÛÛY™Ø˜JMKMKMKŒ
X‚ŒËˆ
ŠØ\™È	ˆ[œ]šY[È
]™[ˆHÌNNX˜
NŠŠˆXİ]™H[[Y[È™\İ[™ÈÚ][ˆ]™[H[™\Ëİ[YÚ]İXH[œÙ]YÚ[™Îˆ›Ş\ÚYİÎˆ[œÙ]\™Ø˜JMKMKMKŒJX‚ˆ
Š‘›Ø][™Èİ™\›^\È	ˆÛÛ[X[™˜\œÈ
]™[ÈHÌNNX‹ÎXÚ]˜XÚÙ›ÜYš[\ŠNŠŠˆ[Ù[ËÙX\˜Ú[]\Ë[™ÛÛ^Y[\È›Ø]İ™\ˆHØ[˜\È\Ú[™È˜XÚÙ›ÜYš[\ˆ›\ŠLœ
X[™HX[ÚYİÎ‚ˆHİ]\ˆÛİÎˆ\™Ø˜JMKMKMKŒJXˆH\™Xİ[Û˜[ÚYİÎˆMœÌœN™Ø˜JŠKLœ™Ø˜J
X‚ˆÈÈÈ›Øİ\È	ˆXİ]™H[]˜][Û‚‘›Øİ\ÙY[\˜Xİ]™HÛÛ›ÛÈ[[Z[˜]HX]Hš[™ÜÈ[ˆ˜]›ÜˆÙˆHÚ\œ\[XİšXÈ[™YÛÈYÚYÚ
ÍŒÍ™ŒX
HXØÛÛ\[šYYHHİXHœ[™YÛË][YÛİÈ
™Ø˜JNKL‹KŒJX
K‚‚ˆÈÈÚ\\Â‚•H\ÚYÛˆŞ\İ[H[™›Ü˜Ù\ÈH\ØÚ\[™YYÚÛÜ›™\ˆİ\˜]\™H
›İ[™Y™\ÜÎˆX
Kˆ\™ÙHÚ\˜İ[\ˆ›Ü™\ˆ˜Y]\Ù\È\™H›ÚXš]YÈ™]Z[ˆHšYÛÜ›İ\ÈÛÙØ\™KZ[œİ[Y[™Y[‚‚ˆÈÈÈÛÜ›™\ˆ˜YZHİZY[[™\Â‹H
Š˜\ÙHÛÛ\Û™[È
Œ\™[HÈ
NŠŠˆ\YYÈ[œ]Ë]ÛœËÚ\ËY[H][\ËX›HÙ[İ™\ˆYÚYÚË[™ÛÙHYÜË‚‹H
ŠÛÛZ[™\œÈ	ˆ[™[È
\™[HÈ
NŠŠˆ\YYÈÙXÛÛ™\HØ\™ËİX‹]Ú[™İÜË[™›Ø][™ÈÛÛ[X[™X[ÙÜË‚‹H
Š‘[TØÜ™Y[ˆİ™\›^\È	ˆÚY]È
Í\™[HÈLœ
NŠŠˆ™\Ù\™Y›ÜˆÜ[]™[›Ø][™ÈÜİ™\œÈ[™\XØ][Û‹[]™[[Ù[Ë‚‹H
Š”[ÈÈ[˜Y]\ÎŠŠˆİšXİH›Ü˜šY[ˆ^Ù\›ÜˆœÚ\˜İ[\ˆ™X[][YHİ]\ÈİÈ
K™Ë‹Ü™Y[ˆXİ]™HÙ\™\ˆ[™XØ]ÜŠK‚‚ˆÈÈÛÛ\Û™[Â‚ˆÈÈÈ]ÛœÂ‹H
Š”š[X\NŠŠˆ˜XÚÙÜ›İ[™ÍŒÍ™ŒX^Ù™™™™™˜›Ü™\ˆ\ÛÛY™Ø˜JMKMKMKŒMJXˆÛˆİ™\ˆÍ™MXÚ]HİXHÜYÙHYÚYÚˆZYÚˆ
ÛÛ\Xİ
HÜˆÌœ
İ[™\™
K‚‹H
Š”ÙXÛÛ™\HÈÚÜİŠŠˆ˜XÚÙÜ›İ[™™Ø˜JMKMKMKŒ
X›Ü™\ˆ\ÛÛY™Ø˜JMKMKMKŒ
X^ÙˆÛˆİ™\ˆ˜XÚÙÜ›İ[™™Ø˜JMKMKMKŒ
X^Ù™™™™™˜‚‹H
Š’Ù^X›Ø\™ÚÜİ]Y™›Ü™[˜ÙNŠŠˆ]ÛœÈ\Ü^H[›[™HÙ^HYÜÈ
8£&Ø8¡­X
H™[™\™Y[ˆ™]œ˜Z[œÈ[Û›Ø]LÚ]™Ø˜JMKMKMKŒŠX˜XÚÙÜ›İ[™Ë‚‚ˆÈÈÈ[œ]È	ˆÙX\˜Ú˜\œÂ‹H˜XÚÙÜ›İ[™ÌLŒLŒMX›Ü™\ˆ\ÛÛY™Ø˜JMKMKMKŒJX‚‹H^Ù˜Y˜Y˜XXÙZÛ\ˆÍÌMÌMØX‚‹H›Øİ\Èİ]Nˆ›Ü™\ˆÛÛÜˆÍŒÍ™ŒXİ][™H\ÛÛYÍŒÍ™ŒX‚‹HÛÛ\XİÌœZYÚÚ]YX[YÛ™Y[Û›ÜÜXÙYXÛÛœÈÜˆÛÛ[X[™›Û\È
’à ¢2226†—2b&FvW0¢ÒVÇG&Ö6ö×7BFF–æs¢'‚g‚âföçB6—¦S¢‚¦WD'&–ç2Ööæöà¢Ò&6¶w&÷VæB&v&ƒ#SRÂ#SRÂ#SRÂãR–Â&÷&FW"‚6öÆ–B&v&ƒ#SRÂ#SRÂ#SRÂã‚–à¢Ò7FGW2f&–çG2W6RÆ÷r×6GW&F–öâG&ç7&VçBf–ÆÇ3 ¢Ò¤7F—fRô†VÇF‡“¢¢VÖW&ÆB&6¶w&÷VæB&v&ƒS"Â#ÂS2Âã–ÂFW‡B33FC3“–Â&÷&FW"&v&ƒS"Â#ÂS2Âã"–à¢Ò¥&ö6W76–æs¢¢–æF–vò&6¶w&÷VæB&v&ƒ“’Â"Â#CÂã–ÂFW‡B3ƒ†6c†Â&÷&FW"&v&ƒ“’Â"Â#CÂã"–à ¢222Æ—7G2bFF&÷w0¢Ò¦W&òÖvÆ—7B&÷w2v—F‚‚&÷&FW"F—f–FW'2†&v&ƒ#SRÂ#SRÂ#SRÂãb–’à¢Ò†÷fW"7FFS¢gVÆÂ&÷r&6¶w&÷VæB6†ævW2Fò&v&ƒ#SRÂ#SRÂ#SRÂã2–v—F‚æò&÷&FW"&F—W2'&V²à¢ÒÆVgBÖVFvR–æF–6F÷#¢'‚fW'F–6Â&"–â3c3cfcV'2öâ7F—fR6VÆV7F–öâà ¢2226†V6¶&÷†W2b&F–÷0¢Ò6—¦S¢G‚‚G‚7V&R†6†V6¶&÷‚’÷"6—&6ÆR‡&F–ò’à¢ÒFVfVÇC¢&÷&FW"‚6öÆ–B&v&ƒ#SRÂ#SRÂ#SRÂã"–Â&6¶w&÷VæB3ƒƒ&à¢Ò6†V6¶VC¢&÷&FW"3c3cfcÂ&6¶w&÷VæB3c3cfcÂv†—FRF–6²–6öâà ¢2226&G2bæVÇ0¢Ò&6¶w&÷VæB3ƒƒ&Â&÷&FW"‚6öÆ–B&v&ƒ#SRÂ#SRÂ#SRÂã‚–à¢Ò†VFW"6V7F–öâ6W&FVB'’â–çFW&æÂ‚F—f–FW"Æ–æS²F—FÆR6WB–â7‚ÖVF—VÒvV—7Bv—F‚G&–Æ–ærÖWFFF÷"7FGW2–ÆÂà ¢2226öÖÖæBÆWGFR†6ÖB´¶¢Ò6VçFW&VBÖöFÂæ6†÷&VBBF÷#Röbf–Ww÷'Bà¢Òg&÷7FVBF&²vÆ73¢3ƒƒ"ó“Â&6¶G&÷&ÇW"g‚Â‚W&–ÖWFW"&÷&FW"36c6cCfà¢Ò–ç7FçB&V7F—fRf–ÇFW&–ærÆ—7Bv—F‚'&÷rÖ¶W’æf–vF–öâ†–v†Æ–v‡C¢&6¶w&÷VæC¢&v&ƒ“’Â"Â#CÂãR–