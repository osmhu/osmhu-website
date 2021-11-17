# Hozzájárulás

Ha hozzá szeretnél járulni a weboldal tartalmához, azt Pull Request segítségével teheted meg.

Készíthetsz Issue-t is, ahol bedobhatod az ötleteidet, vagy megvitathatsz bármit.

[Hasznos általános leírás a Nyílt Forráskódú projektek működéséről.](https://opensource.guide/hu/how-to-contribute/)

## Fejlesztés

A továbbiakban elsősorban a forráskódok továbbfejlesztéshez szükséges eszközök leírása található.

### Fejlesztés Vagrant alapú virtuális gép segítségével

A Vagrant használata jelentősen megkönnyíti a fejlesztőkörnyezet telepítését, segítségével egy fejlesztéshez használható virtuális gép hozható létre.

> **A fejlesztési feladatok egy része csak Linux rendszeren végezhető el.**  
> Más rendszeren történő fejlesztés teljeskörű beüzemelése rendkívül fáradságos,
> ilyen esetben ajánlott inkább egy Virtuális gépet használni Ubuntu 20.04-el, majd vagrant használata helyett
> közvetlenül telepíteni az eszközöket a [vagrant.sh](/development/vagrant.sh) és [Makefile](/Makefile) segítségével.

A Vagrant használata esetén a gazdagépre szükséges a vagrant telepítése:

[Vagrant letöltése](https://www.vagrantup.com/downloads.html)

A projekt könyvtárában:

1. `vagrant up` parancs határása létrejön és elindul a fejlesztői virtuális gép

2. `vagrant ssh` paranccsal vezérelhetjük a gépet ssh kapcsolaton keresztül

#### Vagrant virtuális gép felépítése

A gazdagépen található projektkönyvtár automatikusan szinkronizálva van a vagrant virtuális gépen található `/var/www` mappába.  
Így a gazdagépen történt minden változtatás azonnal szinkronizálva van a virtuális gép számára és fordítva.  
A virtuális gépre automatikusan feltelepítésre kerültek a szükséges webszerver, a MySQL és a PostgreSQL szerverek alapértelmezett jelszavakkal.
Ezek a jelszavak a [vagrant.sh](/development/vagrant.sh) fájlban és a [Makefile](/Makefile)-ban szerkeszthetőek.

#### Vagrant virtuális gép által kiszolgált fejlesztési weboldal elérése

Gazdagépen:  
[http://localhost:8080/](http://localhost:8080/)

### Fejlesztés során gyakran használt parancsok

A projektben számos hasznos parancs található a [Makefile](/Makefile) -ban.

*Minden itt felsorolt parancsot a projekt gyökérkönyvtárában állva kell futtatni.*

> **Vagrant használata esetén:**
>
> - a virtuális gépen belül, a `vagrant ssh` kapcsolaton keresztül kell futtatni a parancsokat
> - a virtuális gépben található, folyamatosan szinkronizált `/var/www` könyvtárában állva kell futtatni

#### Production build létrehozása

```shell
make build
```

#### Fejlesztés (újrafordítás minden szerkesztésnél)

```shell
make watch
```

#### Adatbázis feltöltése korábban exportált adatokkal

```shell
make init-existing-db
```

#### JavaScript frontend tesztelése

```shell
npm run test
```

#### JavaScript tesztek futtatása fejlesztés közben (újrafuttatás minden szerkesztésnél)

```shell
npm run test-watch
```

#### JavaScript frontend kódjának ellenőrzése a kódolási szabályok szerint

```shell
npm run lint
```

*A JavaScript frontend [ESLint recommended](https://eslint.org/docs/rules/) és [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) -ot használ.*

### Mysql adatbázis létrehozása frissen letöltött osm adatokkal  

**Fontos!** Mielőtt elkezded a PostgreSQL adatbázis feltöltését, a virtuális gép memóriáját legalább 4GB méretűre kell növelni a [Vagrantfile](Vagrantfile) `vb.memory` beállítással.

Ha már korábban is futtattad, akkor a `development/hungary-latest.osm.pbf` törlésével kényszerítheted ki friss adatok letöltését.

```shell
make init-from-scratch
```

Az adatbázis feltöltése és az adatok MySQL -be történő sikeres áttöltése után a virtális gép memóriája visszaállítható az alapértelmezett értékre.

### Mysql export készítése a `mysqldump` használatával

```shell
make mysql-export
```

### HTTPS használata fejlesztéshez (Vagrant használata esetén)

Fejlesztés közben a HTTPS bekapcsolásához:

1. **gazdagépen** [self signed SSL kulcspár létrehozása](/development/self-signed-ssl/README.md)

2. **virtuális gépen**, a `vagrant ssh` kapcsolaton keresztül:

    ```shell
    make https-enable
    ```

*Gazdagép felé kiszolgált HTTPS port:  
[http://localhost:8443/](http://localhost:8443/)*

### [Település lakosság adatok hozzáadása](/development/nepessegi_adatok.md)
