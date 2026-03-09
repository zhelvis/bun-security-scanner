# bun-security-scanner

Scanner for Bun's package installation process. Protects your projects from supply chain attacks.

## Features

- Real-time security scanning during package installation using [OSV API](https://google.github.io/osv.dev/api/)
- Native integration with [Bun's security scanner API](https://bun.sh/docs/pm/security-scanner-api)
- Optimized batch requests for fast scans


## Usage

1. Install scanner

```sh
bun add -D @zhelvis/bun-security-scanner
```

1. Add to your `bunfig.toml`
   
```toml
[install.security]
scanner = "@zhelvis/bun-security-scanner"
```

## Development

1. Install dependencies

```sh
bun install
```

1. Generate SDK from OSV API OpenAPI spec

```sh
bun run openapi-ts
```

1. Build ESM module

```sh
bun run build
```


