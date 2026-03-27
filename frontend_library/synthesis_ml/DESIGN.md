# Design System Document

## 1. Overview & Creative North Star: "The Insight Curator"

This design system is engineered to transform complex machine learning data into a high-end, editorial experience. Moving away from the generic "dashboard-in-a-box" aesthetic, we embrace a philosophy called **"The Insight Curator."** 

The Creative North Star focuses on clarity through depth and intentional white space. By utilizing a sophisticated interplay of slate tones and vibrant salmon accents, the UI feels like a premium data journal. We break the traditional grid through asymmetric card distributions, staggered typography scales, and a departure from the "boxed-in" look. This is not just a tool; it is an authoritative environment for strategic decision-making.

---

## 2. Colors

The palette is anchored in professional stability with high-energy "Coral/Salmon" moments that guide the eye to critical ML insights.

### Tonal Foundations
*   **Primary (#ffb4a4):** Used for critical conversion and brand identity.
*   **Secondary (#adc9eb):** Our "Slate Blue" core, used for grounding elements and navigation.
*   **Tertiary (#67d9c9):** An accent for success states and secondary data paths.
*   **Neutral/Surface (#111317):** The canvas. In dark mode, this provides the "void" that allows data to pop.

### The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders are prohibited for sectioning.** Do not use lines to separate a sidebar from a main content area or to define card edges. Boundaries must be established exclusively through:
*   **Background Shifts:** Placing a `surface-container-low` section against a `surface` background.
*   **Tonal Transitions:** Using the hierarchy of `surface-container` tokens to create natural separation.

### The "Glass & Gradient" Rule
Floating elements (modals, popovers, navigation) should utilize **Glassmorphism**. Use semi-transparent surface colors with a `backdrop-blur` of 12px-20px. 
*   **Signature Textures:** Main CTAs should not be flat. Apply a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to provide depth and "soul."

---

## 3. Typography

The typographic system utilizes a dual-font approach to balance technical precision with editorial authority.

*   **Display & Headlines (Manrope):** We use Manrope for large scale information. Its geometric but warm construction feels "Modern Sans-Serif" and high-tech.
    *   *Display-LG (3.5rem):* Reserved for hero metrics or welcome headers.
*   **Title & Body (Inter):** Inter is our workhorse for data tables and analytics. It is optimized for legibility at small sizes.
    *   *Title-MD (1.125rem):* Used for card headers to provide a clear entry point.
    *   *Label-SM (0.6875rem):* For micro-data and chart legends.

**Hierarchy Strategy:** Use `on_surface_variant` (C3C6CE) for secondary text and labels to reduce visual noise, keeping the `on_surface` (E2E2E7) for critical data points and headers.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are often a crutch for poor layout. In this system, we achieve depth through a physical stacking model.

### The Layering Principle
Think of the UI as sheets of material. 
1.  **Level 0 (Base):** `surface` (#111317)
2.  **Level 1 (Sections):** `surface_container_low` (#1A1C20)
3.  **Level 2 (Cards/Interaction):** `surface_container` (#1E2024)
4.  **Level 3 (Floating/Active):** `surface_container_highest` (#333539)

### Ambient Shadows
Shadows are only permitted for "Floating" elements (Modals or active Tooltips). 
*   **Specs:** `Blur: 40px`, `Spread: -10px`, `Opacity: 6%`. 
*   **Color:** The shadow must be a tinted version of `on_surface` rather than pure black, creating a natural ambient light bleed.

### The "Ghost Border" Fallback
If high-density data requires a container but background shifts are insufficient, use a **Ghost Border**: 
*   **Token:** `outline_variant` (#43474D) 
*   **Opacity:** 15%. This creates a suggestion of a boundary without interrupting the visual flow.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `xl` roundedness (0.75rem), white-space padding `4` (1rem) horiz.
*   **Secondary:** No background. `outline_variant` ghost border (20% opacity).
*   **Tertiary:** Text-only with `primary` color and `label-md` weight.

### Data Tables
*   **Rule:** Forbid the use of horizontal or vertical divider lines.
*   **Styling:** Use `surface_container_low` for the header row. Use vertical white space (Spacing `4`) to separate rows. Hover states use a subtle shift to `surface_container_high`.

### Interactive Charts
*   **ML Line Graphs:** Use `primary` (Coral/Salmon) for the data line. Apply a vertical gradient fill below the line that fades from `primary` (20% opacity) to `transparent`.
*   **Nodes/Markers:** Use `tertiary` for success/predicted points to differentiate from historical data.

### Card-Based Layouts
*   **Rounding:** Always `xl` (0.75rem) or `lg` (0.5rem) to soften the analytical nature of the content.
*   **Asymmetry:** In dashboards, vary card widths using a 60/40 or 70/30 split rather than a perfectly centered grid to create an editorial "magazine" feel.

### Input Fields
*   **State:** Unfocused fields should use `surface_container_highest` background with no border. On focus, apply a `primary` ghost border (20% opacity) and a subtle inner glow.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use `20` (5rem) or `24` (6rem) spacing for major section breaks to let the ML models "breathe."
*   **Do** use Glassmorphism for the Sidebar Navigation to allow background chart colors to bleed through subtly.
*   **Do** treat typography as a UI element; use large `display-md` headers to anchor pages.

### Don't
*   **Don't** use 100% opaque borders. It makes the platform feel like legacy enterprise software.
*   **Don't** use pure black or grey shadows. They muddy the sophisticated Slate Blue and Salmon palette.
*   **Don't** use dividers in lists. Rely on the Spacing Scale (specifically `2` and `3`) to create grouped associations.
*   **Don't** clutter the dashboard. If a metric isn't essential to the "Insight Curator" story, move it to a secondary drill-down layer.