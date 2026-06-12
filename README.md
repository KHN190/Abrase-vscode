# Abrase for VS Code

Syntax highlighting, simple completion, and debug commands for the
[Abrase](https://github.com/KHN190/Abrase) language (`.abe`).

## Features

- Syntax highlighting.
- Simple completion — static list of keywords, builtin types, and host
  natives (`synth_*`, `device_*`, `print`, math, …).
- Commands — driving the `abrase` CLI:
  - `Abrase: Check` — `abrase check`
  - `Abrase: Run` — `abrase run`
  - `Abrase: Disasm` — `abrase disasm`
  - `Abrase: Run with debug` — `abrase run --debug`, optionally with a
    `BREAK_AT=<fn>:<pc>` / `<file.abe>:<line>` host-side breakpoint.

## Requirements

The `abrase` CLI on `PATH` (or set `abrase.cli` to its path).

## Install (manual)

```sh
git clone https://github.com/KHN190/Abrase-vscode \
  "$HOME/.vscode/extensions/abrase"
```

Reload VS Code.

## License

MIT
