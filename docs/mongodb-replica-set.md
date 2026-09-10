# MongoDB Replica Set (Local Dev)

This project uses MongoDB multi-document transactions via `DbTransactionsService.exec()`. Transactions require a replica set — even a **single-node** one — because they use the oplog. A standalone `mongod` will fail with errors such as `Transaction numbers are only allowed on a replica set`.

**Expected replica set name:** `rs0`

Connection strings in `backend/config/*.ts` already include it:

```
mongodb://localhost/nest-angular-starter?replicaSet=rs0&retryWrites=true
```

## Convert a standalone instance

Typical local Linux install (`/etc/mongod.conf`). Existing data is kept.

1. Add (or uncomment) replication:

   ```yaml
   replication:
     replSetName: rs0
   ```

2. Restart MongoDB:

   ```bash
   sudo systemctl restart mongod
   ```

3. Initiate the replica set once (`mongosh`):

   ```js
   rs.initiate({
     _id: 'rs0',
     members: [{ _id: 0, host: 'localhost:27017' }],
   });
   ```

   The `host` must match how clients connect. If `bindIp` is `127.0.0.1`, use `localhost:27017`.

4. Confirm you have a primary with one member:

   ```js
   rs.status();
   ```

## Docker

Start `mongod` with `--replSet rs0`, then run the same `rs.initiate` as above:

```bash
docker run -d --name mongo -p 27017:27017 mongo:8 --replSet rs0
docker exec -it mongo mongosh --eval 'rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "localhost:27017" }] })'
```

If the container hostname is not `localhost`, use that hostname in `members[0].host`.

## Atlas / existing replica sets

Already a replica set. Use the Atlas SRV URI, or a standard URI with `replicaSet=` matching the cluster. No `rs.initiate` needed.

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `Transaction numbers are only allowed on a replica set` | Replica set not initiated, or URI missing `replicaSet=rs0` |
| `not a replica set` / connection hangs | `replSetName` in config does not match the URI, or `rs.initiate` was never run |
| Writes work but transactions fail | Connected with `directConnection=true` — that skips replica-set discovery. Remove it |

## Last updated

2026-09-10
