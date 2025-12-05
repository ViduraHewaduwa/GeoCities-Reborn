---
name: "Auto-check Component on Save"
description: "Automatically check for TypeScript errors and suggest fixes when saving React components"
trigger: "onFileSave"
filePattern: "frontend/src/**/*.tsx"
enabled: true
---

# Auto-check Component on Save

When a React component is saved, automatically:

1. Check for TypeScript errors using getDiagnostics
2. If errors exist, suggest fixes
3. Check if corresponding CSS file exists, if not, ask if one should be created
4. Verify imports are correct
5. Check for common React issues (missing keys, unused state, etc.)

## Instructions

Run diagnostics on the saved file and report any issues found. If there are errors, provide specific fixes. If the component doesn't have a corresponding CSS file and uses className attributes, suggest creating one with the same name.
