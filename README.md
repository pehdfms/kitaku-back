To create the initial migration:
```
npx mikro-orm migration create --initial
```

To create a new migration after updating schema:
```
npx mikro-orm migration create
```

To synchronize migrations to the database:
```
npx mikro-orm migration up
```
