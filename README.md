# Lux Financial

Landing page for [lux.financial](https://lux.financial) — the regulated multi-jurisdiction financial platform covering fiat, crypto, stablecoins, and digital securities.

## Deploy

Served on lux-k8s via `hanzoai/spa` from `ghcr.io/luxfi/lux-financial:latest`.

Manifests: [`lux/universe/k8s/lux-k8s/financial/`](https://github.com/luxfi/universe/tree/main/k8s/lux-k8s/financial)

## Development

```sh
pnpm install
pnpm --filter @luxbank/brand build
cd app/site
pnpm dev
```

## Docker

```sh
docker buildx build --platform linux/amd64 -t ghcr.io/luxfi/lux-financial:latest --push .
```

## License

All Rights Reserved. See [LICENSE](LICENSE) and [LICENSING.md](LICENSING.md) — this repository belongs to the patent-protected tier of the Lux three-tier IP strategy. For licensing inquiries, contact `licensing@lux.network`.
