<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest Cli instalado
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```

5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. LLenar las variables de entorno definidas en el ```.env```


7. Ejecutar la aplicasion
```
 yarn start:dev
```

8. Reconstruir la base de datos con el endPoint Seed

```
http://localhost:3000/api/v2/seed
```


https://mega.nz/file/Zr93SAxZ#KVOrGaJsFx4i9KW9A_Dgty7uQSbIkEPoxWoGDrDDiUs


## Stack usado
* MonogDB
* Nest
