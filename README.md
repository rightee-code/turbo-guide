# Andy's Bread — Wholesale Ordering

A Next.js app where wholesale customers (cafés, restaurants, grocers) place bread orders, and the bakery sees orders and a daily bake list.

## Customer flow

1. **Order sheet** (`/`): every product with its wholesale unit price, unit (loaf, dozen, half sheet…) and minimum quantity. Enter quantities directly or use +/−.
2. **Review order** (`/cart`): adjust quantities, see minimum-quantity and delivery-minimum warnings.
3. **Delivery details** (`/checkout`): business name, contact, PO number, delivery or pickup, address, date and delivery window, and notes.
4. **Confirmation** (`/order-confirmation`) with the order number.

## Ordering rules

Set in `src/lib/schedule.ts` and enforced in both the browser and the server:

- `LEAD_DAYS`: days of notice required (default 2)
- `CLOSED_DAYS`: days with no baking (default Sunday)
- `DELIVERY_MINIMUM`: minimum order value for delivery (default $100; pickup has no minimum)
- `DELIVERY_WINDOWS`: the delivery and pickup time slots

Products, prices, units and minimums live in `src/data/products.ts`. The server always prices orders from this catalog, so it never trusts totals sent by the browser.

## Bakery admin

`/admin` lists orders by delivery date, with a **bake list** that totals each product for the day. Set a password to turn it on:

```bash
ADMIN_PASSWORD=choose-something npm run dev
```

## Running with Docker

On any Linux machine with Docker and the Compose plugin:

```bash
git clone https://github.com/rightee-code/turbo-guide.git
cd turbo-guide
echo "ADMIN_PASSWORD=choose-something" > .env
docker compose up -d --build
```

Open `http://localhost:3000`, or `http://<server-ip>:3000` from another device on your network. The bakery view is at `/admin`.

- Orders are kept in the `orders` Docker volume, so they survive restarts and rebuilds. `docker compose down -v` deletes them.
- To update: `git pull && docker compose up -d --build`
- To see logs: `docker compose logs -f`
- To back up orders: `docker compose cp web:/app/data/orders.json ./orders-backup.json`
- To expose it on the internet, put it behind a reverse proxy with HTTPS (e.g. Caddy or nginx).

## Storage

Orders are saved to `data/orders.json` (gitignored). That's fine on a single server or VM, including the Docker setup above, but serverless hosts such as Vercel have ephemeral disks. Replace `listOrders` and `saveOrder` in `src/lib/orders.ts` with a database before deploying there.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```
