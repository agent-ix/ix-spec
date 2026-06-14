---
description: Add packages to the project
---

1. Determine if the packages are development dependencies (e.g., `@types/*`, `eslint*`, `jest*`, `webpack*`, `typescript`, etc.) or production dependencies.

2. Run the appropriate make target:

   **For Development Packages:**

   ```bash
   # usage: make add-dev-packages PACKAGES="package1 package2"
   make add-dev-packages PACKAGES="{{ packages }}"
   ```

   **For Production Packages:**

   ```bash
   # usage: make add-packages PACKAGES="package1 package2"
   make add-packages PACKAGES="{{ packages }}"
   ```

3. Update the lockfile to ensure consistency:
   ```bash
   make update-lock
   ```
