Run the following command to update the DB

```sh
node .\flipkart-sync.mjs  && jq '.products[]|select(.shouldNotify == true)' src/app/db.json
```
