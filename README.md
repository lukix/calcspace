# Math Notes

Start app by running:
```
docker-compose up -d
```

Stop app:
```
docker-compose down
```

Rebuild docker images:
```
docker-compose up -d --build --force-recreate --remove-orphans
```

See logs:
```
docker-compose logs -f
```

Setup DB structure:
```
sudo docker exec -it mathnotes_server_1 yarn run setupDb
```
