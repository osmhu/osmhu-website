# OpenStreetMap.hu weboldal

## Előszó

A leírás azt feltételezi, hogy Ubuntu Linux -ot használsz, de bármilyen Linuxon működnie kell.  
Az én gépemen `~/development/osmhu/` a projekt mappája, lehet hogy meg kell változtatnod, ahol használják a parancsok.

## A kód megszerzése

### Hozzáféréshez szükséges felhasználónév és jelszó

Felhasználónév és jelszó kell az SVN eléréshez. Kérj.

### A fájlok letöltése

```bash
cd ~/development
svn co https://bugs.wpsnet.hu/repos/osm/osmhu --username Fodi69
```

Beírod a jelszavad és letölt mindent.

## Verziókezelés

[Subversion (SVN)](https://subversion.apache.org/)

## Fejlesztés Vagrant alapú virtuális gép segítségével (ajánlott)

A projekt tartalmaz egy Vagrantfile állományt, ezzel egy olyan virtuális gép hozható létre, ami fejlesztéshez használható.
A Vagrant használata esetén a gazdagépre szükséges a vagrant telepítése:

[Vagrant letöltése](https://www.vagrantup.com/downloads.html)

A projekt könyvtárából a `vagrant up` parancs kiadásával létrejön és elindul a fejlesztői virtuális gép.
Ezután a `vagrant ssh` paranccsal vezérelhetjük a gépet ssh kapcsolaton keresztül. A létrejövő gép jelenleg Ubuntu 18.04 operációs rendszert tartalmaz.

```bash
cd ~/development/osmhu
vagrant up && vagrant ssh
```

### Virtuális gép felépítése

A vagrant virtuális gépen automatikusan szinkronizálva van a projekt könyvtára a `/var/www` mappába.  
Így a gazdagépen szerkesztett fájlok azonnal elérhetőek a virtuális gép számára és fordítva.  
Mivel minden változtatás szinkronizálva van, ezért a gazdagépen való minden szerkesztés azonnal tesztelhető ezen a címen.  
A virtuális gépre automatikusan feltelepítésre kerültek a szükséges webszerver, a MySQL és a PostgreSQL szerverek alapértelmezett jelszavakkal.
Ezek a jelszavak a `vagrant.sh` fájlban és a `Makefile`-ban szerkeszthetőek.

### Virtuális gép weboldalának elérése

Gazdagépen:  
[http://localhost:8080/](http://localhost:8080/)

### Gyakran használt parancsok

Az alábbi parancsokat **a virtuális gépen belül**, a `vagrant ssh` kapcsolaton keresztül kell kiadni.

#### Adatbázis feltöltése korábban exportált adatokkal

```bash
cd /var/www
make init-existing-db
```

#### JavaScript frontend fejlesztése (újrafordítás minden szerkesztésnél)

```bash
cd /var/www
npm run watch
```

#### Production build létrehozása

```bash
cd /var/www
npm run build
```

#### Mysql adatbázis létrehozása frissen letöltött osm adatokkal  

**Fontos!** Mielőtt elkezded a PostgreSQL adatbázis feltöltését, a virtuális gép memóriáját legalább 4GB méretűre kell növelni a [Vagrantfile](Vagrantfile) `vb.memory` beállítással.

```bash
cd /var/www
make init-from-scratch
```

Az adatbázis feltöltése és az adatok MySQL -be történő sikeres áttöltése után a virtális gép memóriája visszaállítható az alapértelmezett értékre.

#### Mysql export készítése a `mysqldump` használatával

```bash
cd /var/www
make mysql-export
```

### HTTPS használata fejlesztéshez

Fejlesztés közben a HTTPS bekapcsolásához **a host gépen** [self signed SSL kulcspár létrehozása](/development/self-signed-ssl/README.md) szükséges.
A kulcspár létrehozása után:

```bash
cd /var/www
make https-enable
```

HTTPS port gazdagépen:  
[http://localhost:8443/](http://localhost:8443/)

### [Település lakosság adatok hozzáadása](/development/nepessegi_adatok.md)

## Fejlesztés vagrant nélkül (nem friss leírás)
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
#### Webszerver
A kód az apache2 webszerverrel működik megbízhatóan.
Telepítése:
```
sudo apt-get install -y apache2 php5 libapache2-mod-php5 php5-mysql php5-pgsql
sudo a2enmod php5 # php fájlok futtatása
sudo a2enmod include # server side includes
sudo a2enmod rewrite # rewrite szabályok
```
A `development/apache2/osmhu-http.conf` és `development/apache2/osmhu-ssl.conf` fájlokban
át kell szerkeszteni a könyvtárakat a kívánt fejlesztési könyvtárnak megfelelően.
A `DocumentRoot` és a `Directory` sorra különösen figyelni kell, a többihez nem feltétlenül kell hozzányúlni.
```
nano ~/development/osmhu/development/apache2/osmhu-http.conf
nano ~/development/osmhu/development/apache2/osmhu-ssl.conf
```
Másoljuk az új virtuális hostot az apache2 sites könyvtárába:
```
sudo cp ~/development/osmhu/development/apache2/osmhu-http.conf /etc/apache2/sites-available/osmhu-http.conf
sudo cp ~/development/osmhu/development/apache2/osmhu-ssl.conf /etc/apache2/sites-available/osmhu-ssl.conf
```
Engedélyezzük az új virtuális hostokat:
```
sudo a2ensite osmhu-http
sudo a2ensite osmhu-ssl
```
Indítsuk újra az apache2 szervert, hogy figyelembe vegye az új beállításokat:
```
sudo service apache2 restart
```
#### Frontend fejlesztése
##### Node.js telepítése
A javascript csomag elkészítéséhez szükséges.
```
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```
[Forrás](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
##### Felhasznált külső modulok letöltése
```
cd ~/development/osmhu
npm i
```
##### Javascript csomag készítése
Hogy működjön a `build` és a `watch` parancs telepíteni kell a `browserify`-t és a `watchify`-t:
```
sudo npm install browserify watchify -g
```
###### Fejlesztés közben:
```
cd ~/development/osmhu
npm run watch
```
Eredmény: létrejön a `build/bundle.js` és kilépés helyett figyeli a `js/` mappát és minden változás esetén újragenerálja a létrehozott fájlt.  
Feljesztés közben általában folyamatosan futtatom, Ctrl + C -vel lehet kilépni belőle, ha abbahagytad a JavaScript kód módosítását.
###### Production fájl létrehozása:
```
cd ~/development/osmhu
npm run build
```
Eredmény: létrejön a `build/bundle.js`.

### Adatbázisok
#### MySQL telepítése
Telepítés:
```
sudo apt-get install -y mysql-server mysql-client
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
CREATE DATABASE osm_hu CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
GRANT ALL ON osm_hu.* TO 'osmhu'@'%' IDENTIFIED BY 'Eidoh5zo';
```
#### Adatok beszúrása
Lehetőségek:

1. Közvetlenül a MySQL adatbázisba importálni egy korábbi mentésből. (gyors)
2. Az OSM adatokat először le kell tölteni, azt beimportálni egy PostgreSQL adatbázisba, és onnan a `scripts/copydb.php` futtatásával átmásolni a MySQL adatbázisba.

#### 1. lehetőség: Importálni egy meglevő mentésből
Az adatbázist a `development/mysql/export.sql` fájlból importálhatod:
```
cd ~/development/osmhu/development/mysql
mysql -u osmhu -p osm_hu < export.sql
```
Írd be az osmhu felhasználó jelszavát: (ezt néhány sorral fentebb adtuk meg az GRANT parancsban)
```
Eidoh5zo
```
#### 2. lehetőség: Osm adatok letöltése
Az osm2pgsql `*.osm.pbf` fájlokat tud olvasni.
Az OSM adatokat le kell tölteni pl innen: http://download.geofabrik.de/europe/hungary.html
A letöltött fájl legyen olvasható mindenki számára:
```
chmod +r /home/ubuntu/hungary-latest.osm.pbf
```
##### Szükséges csomagok telepítése
```
sudo apt-get install -y postgresql-9.3 postgis postgresql-9.3-postgis-scripts osm2pgsql
```
##### Osm adatok betöltése a PostgreSQL adatbázisba
https://github.com/openstreetmap/osm2pgsql#usage

Az `osm2pgsql` futásakor legyen minnél több szabad memória, mert annál gyorsabb, illetve bizonyos memóriamennyiség alatt le sem fut.
```
sudo -u postgres -i
createdb gis
psql -d gis -c "CREATE USER osmhu PASSWORD 'Eidoh5zo';"
psql -d gis -c "GRANT ALL PRIVILEGES ON DATABASE gis TO osmhu;"
psql -d gis -c "CREATE EXTENSION postgis; CREATE EXTENSION hstore;"
osm2pgsql --create --database gis /home/ubuntu/hungary-latest.osm.pbf
```
Ha kevés memória miatt hibába ütközöl (pl `terminate called after throwing an instance of 'std::bad_alloc'`), lehetőség van `slim` módban futtatni: (jóval lassabb)
```
osm2pgsql -s --create --database gis /home/ubuntu/hungary-latest.osm.pbf
```
##### Üres MySQL adatbázis létrehozása
Futtasd le az adatbázison a `scripts/db.txt` tartalmát:
```
cd ~/development/osmhu/scripts
mysql -u osmhu -p osm_hu < db.txt
```
##### Adatok átkonvertálása PostgreSQL-ből MySQL-be
```
cd ~/development/osmhu/scripts
APPLICATION_ENV="development" php copydb.php
```
