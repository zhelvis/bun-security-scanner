# bun-security-scanner

Scanner for Bun's package installation process. Protects your projects from supply chain attacks.

## Features

- Real-time security scanning during package installation using [OSV API](https://google.github.io/osv.dev/api/)
- Native integration with [Bun's security scanner API](https://bun.sh/docs/pm/security-scanner-api)
- Optimized batch requests for fast scans
- Configurable package exclusions

## Usage

1. Install scanner

```sh
bun add -D @zhelvis/bun-security-scanner
```

2. Add to your `bunfig.toml`

```toml
[install.security]
scanner = "@zhelvis/bun-security-scanner"
```

## Configuration

Create `bun-security-scanner.json` in your project root to exclude packages from scanning:

```json
{
  "excludes": [
    {
      "name": "package-name",
      "version": "1.0.0"
    }
  ]
}
```

By default, config is loaded from `./bun-security-scanner.json`. You can specify a custom path via the `BSS_CONFIG_PATH` environment variable:

```sh
BSS_CONFIG_PATH=./path/to/config.json bun install
```

If no config file exists, the scanner runs without exclusions.

## Development

1. Install dependencies

```sh
bun install
```

2. Generate SDK from OSV API OpenAPI spec

```sh
bun run openapi-ts
```

3. Build ESM module

```sh
bun run build
```

4. Lint code

```sh
bun run lint
```

5. Format code

```sh
bun run fmt
```
