Remove empty directories with the power of Bun!

Usage:

```
red <directory path>
```

Notes:

- Will simply fail if it does not have permission to access any subdirectory. (limitation of Bun.Glob)
  - As an alternative on Windows, download `lstree.exe` from https://github.com/ericchase/cxx--mini-tools and use `redx.exe`.
