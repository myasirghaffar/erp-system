# UI Implementation Guide

This document defines the workflow for creating or updating UI components and pages using raw code provided by the user.

## Workflow Overview

When the user provides raw code (pasted or uploaded) for a component or page, follow these steps:

### 1. Icon Extraction & Management
**Rule:** Never leave raw `<svg>` tags in the component code.

1.  **Extract SVGs**: Locate all `<svg>` elements in the provided raw code.
2.  **Save to Icons Library**:
    -   Open `src/assets/icons/icons.jsx`.
    -   Create a new named export component for each SVG.
    -   **Pattern**:
        ```jsx
        export const NewIconName = ({ className, ...props }) => (
          <svg className={className} {...props} viewBox="..." ... >
            {/* SVG Content */}
          </svg>
        );
        ```
    -   *Note*: Ensure `className` and `...props` are passed to the svg element to allow styling flexibility.
3.  **Replace in Component**:
    -   Import the generated icon component in your target file.
        -   Example: `import { NewIconName } from "@/assets/icons/icons";` (or relative path).
    -   Replace the `<svg>` tag with the component usage: `<NewIconName className="..." />`.

### 2. Component/Page Implementation
1.  **File Creation**: Create or overwrite the target file in the appropriate directory (e.g., `src/pages/` or `src/components/`).
2.  **Code Adaptation**:
    -   Paste the user's code (with SVGs replaced).
    -   **Imports/Exports**: Fix all import paths and ensure the component is exported correctly.
    -   **Environment Adaptation**: Adjust any project-specific settings (styles, utility functions).

### 3. Routing & Integration
-   **If creating a new Page**:
    -   Automatically register the new route in the main routing file (e.g., `App.jsx`, `routes.jsx`, or similar).
    -   Ensure correct pathing and layout wrapping if necessary.

### 4. Verification
-   Verify that the implementation matches the visual design of the provided code.
-   Ensure build tools (e.g., Vite/Webpack) do not throw errors regarding missing imports.
