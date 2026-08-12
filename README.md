# Droplert admin

The control plane and public HTTP feed for durable in-product campaigns.

Droplert stores campaigns in PostgreSQL and serves them through a versioned, cacheable feed. Customer pages use the `droplert` React package: there is no permanent WebSocket, browser secret, or customer-side API route.

## Local development

Use Node 24 and npm 11.

```bash
npm install
npx prisma migrate deploy
npm run dev
```

Required environment variables follow the existing `.env` shape. Never commit credentials.

## Quality gates

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Delivery model

- Publishing is session-authenticated and transactional.
- Each verified site has an unguessable public feed ID and exact-origin CORS policy.
- Feeds use schema version 1, ETags, shared-cache headers, scheduled campaigns, and route rules.
- The React client fetches on startup, revalidates visible pages every 15 minutes, backs off on failure, coordinates tabs, and caches the last valid feed.
- Impression, click, and dismissal events are stored independently from delivery.

See [`../ARCHITECTURE.md`](../ARCHITECTURE.md) for the full system decision.
