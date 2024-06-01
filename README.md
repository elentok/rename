# Rename

Bulk rename CLI

## Installation

Clone this repository and run:

```
deno install -g \
  --allow-net --allow-write --allow-read --allow-run --allow-env \
  https://github.com/elentok/rename/raw/main/rename.ts
```

And make sure `~/.deno/bin` is in your PATH.

## Usage

```
rename <pattern> <replacement> <file...>
```

e.g.

```
rename hello world **/*.ts
```
