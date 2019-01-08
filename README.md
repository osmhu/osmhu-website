OpenStreetMap.hu weboldal
===
# Fejlesztése
A leírás azt feltételezi, hogy Ubuntu Linux -ot használsz.  
Az én gépemen `~/development/osmhu/` a projekt mappája, lehet hogy meg kell változtatnod, ahol használják a parancsok.
## A kód megszerzése
### Hozzáféréshez szükséges felhasználónév és jelszó
Felhasználónév és jelszó kell az SVN eléréshez. Kérj.
### A fájlok letöltése
```
cd ~/development
svn co https://bugs.wpsnet.hu/repos/osm/osmhu --username Fodi69
```
Beírod a jelszavad és letölt mindent.
## Verziókezelés
Az SVN-hez sok grafikus szerkesztő van, én a `kdesvn` nevű verziókezelőt használom. Telepítése:
```
sudo apt-get install subversion kdesvn -y
```
Ha nem akarsz grafikus szerkesztőt használni, akkor elég a subversion csomag:
```
sudo apt-get install subversion -y
```
## Fejlesztés
### Vagrant alapú fejlesztői virtuális gép segítségével (ajánlott)
A projekt tartalmaz egy Vagrantfile állományt, ezzel egy olyan virtuális gép hozható létre, ami fejlesztéshez használható.
A Vagrant használata esetén a gazdagépre szükséges a vagrant csomag telepítése:
https://www.vagrantup.com/downloads.html

A projekt könyvtárából a `vagrant up` parancs kiadásával létrejön és elindul a fejlesztői virtuális gép.
Ezután a `vagrant ssh` paranccsal vezérelhetjük a gépet ssh kapcsolaton keresztül. A létrejövő gép jelenleg Ubuntu 16.04 operációs rendszert tartalmaz.
```
cd ~/development/osmhu
vagrant up
vagrant ssh
```
#### Vagrant információk
A vagrant virtuális gépen automatikusan szinkronizálva van a projekt könyvtára a `/var/www` mappába.  
Így a gazdagépen szerkesztett fájlok azonnal elérhetőek a virtuális gép számára és fordítva.  
A virtuális gépen található egy webszerver, amit a gazdagépről a http://localhost:8080/ és a
https://localhost:8443/ címeken érhetünk el.  
Mivel minden változtatás szinkronizálva van, ezért a gazdagépen való minden szerkesztés azonnal tesztelhető ezen a címen.  
A vagrant képfájlba automatikusan feltelepítésre kerültek a MySQL és a PostgreSQL szerverek alapértelmezett jelszavakkal.
Ezek a jelszavak a `vagrant.sh` fájlban és a `Makefile`-ban szerkeszthetőek.
#### Vagrant - mysql adatbázis feltöltése friss osm adatokkal
```
vagrant up
vagrant ssh
cd /var/www
make all
```
#### Vagrant - mysql export készítése a `mysqldump` használatával
```
vagrant up
vagrant ssh
cd /var/www
make export-mysql
```
#### Vagrant - frontend fejlesztése
```
vagrant up
vagrant ssh
cd /var/www
npm run watch
```
#### Vagrant - Production fájl létrehozása
```
vagrant up
vagrant ssh
cd /var/www
npm run build
```

### Fejlesztés közben HTTPS használata
Fejlesztés közben HTTPS használatához [self signed SSL kulcspár létrehozása](/development/self-signed-ssl/README.md) szükséges.

### Fejlesztés vagrant nélkül
#### Virtuális host
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
sudo apt-get install apache2 php5 libapache2-mod-php5 php5-mysql php5-pgsql -y
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
##### Népesség adatok hozzáadása
Lásd `development/nepessegi_adatok.txt`
