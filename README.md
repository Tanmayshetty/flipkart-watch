Add new product and priceNotify amount via UI.

Refresh the product amount from Flipkart from the UI.

Run the following command to update the DB

```sh
node flipkart-sync.mjs

```

Add the above command as cron job on your device to update the current amount daily.

Bring up the UI by running the following command after _pnpm install_

```sh
pnpm dev
```

Application runs on http://localhost:5900
