---
description: Update project dependencies
---

1. Update packages (respecting version ranges in package.json)

   ```bash
   make update-packages
   ```

2. Or update packages to absolute latest (ignoring version ranges)

   ```bash
   make update-packages-latest
   ```

3. Update lockfile (if separate step needed, usually handled by update-packages or separate target)
   ```bash
   make update-lock
   ```
