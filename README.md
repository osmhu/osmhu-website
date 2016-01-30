# OpenStreetMap.hu weboldal
--------------------------
## Fejlesztése
A leírás azt feltételezi, hogy Ubuntu Linux -ot használsz.  
Az én gépemen `~/wwwroot/osmhu/` a projekt mappája, lehet hogy meg kell változtatnod, ahol használják a parancsok.
### A kód megszerzése
#### Hozzáféréshez szükséges felhasználónév és jelszó
Felhasználónév és jelszó kell az SVN eléréshez. Kérj.
#### Grafikus SVN verziókezelő
Az SVN-hez sok grafikus szerkesztő van, én a `kdesvn` nevű verziókezelőt használom. Telepítése:
```
sudo apt-get install subversion kdesvn -y
```
Ha nem akarsz grafikus szerkesztőt használni, akkor elég a subversion csomag:
```
sudo apt-get install subversion -y
```
#### A fájlok letöltése
```
cd ~/wwwroot/osmhu
svn co https://bugs.wpsnet.hu/repos/osm/osmhu --username Fodi69
```
Beírod a jelszavad és letölt mindent.
### Virtuális host
Megnyitottam az `/etc/hosts` fájlt, például így:
```
gksudo gedit /etc/hosts
```
Hozzáadom a legtetejéhez:
```
127.0.0.1 osmhu.lan
```
A kód néhány helyen használja ezt a címet, így ne változtasd meg, ha nincs rá különösebb okod.
### Nginx webszerver
TODO: erről csinálni egy leírást, jelenleg nagyon kaotikus
### MDB2
A terkep.php fájl (és bármely fájl ami a lib.php -t használja) futtatásához szükséges az MDB2 telepítése.
Ezt a PEAR adatbázisból lehet megtenni a következő paranccsal:
```
sudo apt-get install php-pear
sudo pear install MDB2 MDB2#mysql MDB2#pgsql
```
### MySQL
A keresőben az automatikus kiegészítés a MySQL szerverről kapott adatokat használ, így szükséges a MySQL telepítése:
```
sudo apt-get install mysql-server mysql-client -y
```
Állítsd be az adminisztrátor jelszót, ez lehet erős vagy gyenge jelszó, attól függően, hogy a géped mennyire szeretnéd biztonságban tudni. Ezt a jelszót fejlesztés közben nem fogod használni, de azért ne veszítsd el. A parancs:
```
sudo mysqladmin -u root password 'jelszavam'
```
Állítsd be, hogy be lehessen lépni a MySQL szerverre osmhu felhasználónévvel:
```
mysql -u root -p
```
Írd be az adminisztrátor jelszót, pl `jelszavam`.  
Ha sikerült csatlakozni, várni fogja a parancsot.  
Létrehozzuk az `osm_hu` adatbázist és megadjuk az `osmhu` felhasználó jelszavát:
```
CREATE DATABASE osm_hu;
GRANT ALL ON osm_hu.* TO osmhu@localhost IDENTIFIED BY 'Eidoh5zo';
```
#### Importálni a meglevő adatokat
Az adatbázist a `./development/mysql/export.sql` fájlból importálhatod:
```
cd ~/wwwroot/osmhu/development/mysql
mysql -u osmhu -p osm_hu < export.sql
```
Írd be az osmhu felhasználó jelszavát: (ezt néhány sorral fentebb adtuk meg az GRANT parancsban)
```
Eidoh5zo
```
### Node.js telepítése
A külső modulok letöltéséhez és a `browserify` használatához szükséges.
```
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
```
[Forrás](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions)
### Felhasznált külső modulok letöltése
```
cd ~/wwwroot/osmhu
npm i
```
### Javascript csomag készítése
Hogy működjön a `build` és a `watch` parancs telepíteni kell a `browserify`-t és a `watchify`-t.
#### Browserify és watchify telepítése:
```
sudo npm install browserify watchify -g
```
#### Fejlesztés közben:
```
cd ~/wwwroot/osmhu
npm run watch
```
Eredmény: létrejön a `build/bundle.js`, figyeli a `js/` mappát és minden változás esetén újragenerálja a létrehozott fájlt.  
Feljesztés közben általában folyamatosan futtatom, Ctrl + C -vel lehet kilépni belőle, ha abbahagytad a JavaScript kód módosítását.
#### Production fájl létrehozása:
```
cd ~/wwwroot/osmhu
npm run build
```
Eredmény: létrejön a `build/bundle.js`.

## Adatbázisok
Az OSM adatokat először le kell tölteni, azt beimportálni egy PostgreSQL adatbázisba, és onnan a `scripts/copydb.php` futtatásával átmásolni a MySQL adatbázisba.
### Osm adatok letöltése
Az osm2pgsql `*.osm.pbf` fájlokat tud olvasni.
Az OSM adatokat le kell tölteni pl innen: http://download.geofabrik.de/europe/hungary.html
### Szükséges csomagok telepítése
```
sudo apt-get install -y postgresql-9.3 postgis postgresql-9.3-postgis-scripts osm2pgsql
```
### Osm adatok betöltése a PostgreSQL adatbázisba
https://github.com/openstreetmap/osm2pgsql#usage

Az `osm2pgsql` futásakor legyen minnél több szabad memória, mert annál gyorsabb, illetve bizonyos memóriamennyiség alatt le sem fut.
```
sudo -u postgres -i
createdb gis
psql -d gis
\password postgres
// Írd be a postgresql felhasználó új jelszavát (enélkül nem érhető el kívülről) (kilépés: \q)
psql -d gis -c 'CREATE EXTENSION postgis; CREATE EXTENSION hstore;'
osm2pgsql --create --database gis /home/ubuntu/hungary-latest.osm.pbf
```
### PostgreSQL adatbázis adatok átkonvertálása a MySQL adatbázisba

#### Fejlesztéskor
```
cd scripts
APPLICATION_ENV="development" php copydb.php
```
#### Szerveren
```
cd scripts
php copydb.php
```
