# Localization Implementation Status

## Overview
The project has been successfully integrated with `react-i18next` for internationalization. The admin pages, specifically Dashboard, Workplace Form, and Attendance Report, have been localized into English (en) and Czech (cs).

## Configuration
- **Configuration File**: `src/i18n.js`
- **Supported Languages**: English (`en`) - Default, Czech (`cs`)
- **Translation Storage**:
  - `src/locales/en/translation.json`: English translations
  - `src/locales/cs/translation.json`: Czech translations

## Localized Components
The following key components have been updated to support localization:

1.  **Global Layout**:
    -   `src/global/AppLayout/Header.jsx`: Includes language switcher and translated menu items.
    -   `src/global/AppLayout/Sidebar.jsx`: Translated navigation links.

2.  **Dashboard**:
    -   `src/pages/adminRole/dashboard/index.jsx`: Localized welcome message and titles.
    -   `src/pages/adminRole/dashboard/features/dashboardCard.jsx`: Localized card titles and descriptions.
    -   `src/pages/adminRole/dashboard/features/reportExport.jsx`: Localized all export options, labels, and buttons.

3.  **Workplace Management**:
    -   `src/pages/adminRole/manageWorkplaces/features/workPlaceForm.jsx`: Localized form labels, placeholders, and action buttons.

4.  **Attendance**:
    -   `src/pages/adminRole/attandance/features/attandanceReport.jsx`: Localized table headers, filters, and report summaries.

## How to Add New Translations

1.  **Identify the Text**: Find the string you want to translate in your component.
2.  **Add Keys**:
    -   Open `src/locales/en/translation.json` and add a new key-value pair in the appropriate section (or create a new section).
    -   Open `src/locales/cs/translation.json` and add the same key with the Czech translation.
3.  **Implement in Component**:
    -   Import the hook: `import { useTranslation } from "react-i18next";`
    -   Initialize: `const { t } = useTranslation();`
    -   Replace text: `{t('section.yourKey')}`

## Example
**JSON:**
```json
"common": {
  "submit": "Submit"
}
```

**Component:**
```jsx
<button>{t('common.submit')}</button>
```
