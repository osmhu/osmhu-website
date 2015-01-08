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
Ha nem akarsz grafikus szerkesztőt használni, akkor elég a subversion csomag.
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
### MySQL
A MySQL szervert nem telepítettem fel a saját gépemre, hanem fejlesztés közben külön futtatom Docker segítségével. (Csak 64 bites rendszeren működik)  
Ezt az egész részt lehet másképp csinálni, a lényeg, hogy a `3306` porton fusson egy MySQL szerver.
#### Docker telepítés
```
curl -sSL https://get.docker.com/ubuntu/ | sudo sh
```
[Forrás](https://docs.docker.com/installation/ubuntulinux/#docker-maintained-package-installation)  
(Ha nem bízol a fenti parancsban, itt leírják a külön parancsokat egyesével)

Ellenőrizd, hogy települt-e:  
```
docker --version
```
#### Fig telepítés
http://www.fig.sh/install.html  
A hosszú parancsot kell kimásolni ezt után:
```
Next, install Fig:
curl ...
```
Ellenőrizd, hogy települt-e:
```
fig --version
```
#### MySQL szerver futtatása
```
cd ~/wwwroot/osmhu/development/mysql
fig up
```
Ez elindítja a MySQL szervert, ha már nem kell kiléphetsz belőle (Ctrl + C)
#### Importálni a meglevő adatokat
Először telepítsd a MySQL kliens parancsokat:
```
sudo apt-get install mysql-client -y
```
Importáld az adatbázist a `./development/mysql/export.sql` fájlból:
```
cd ~/wwwroot/osmhu/development/mysql
mysql -h 127.0.0.1 -u osmhu -p osm_hu < export.sql
```
Jelszó:
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
Hogy működjön a `build` és a `watch` parancs telepíteni kell a `browserify`-t.
#### Browserify telepítése:
```
sudo npm install browserify -g
```
#### Fejlesztés közben:
```
cd ~/wwwroot/osmhu
npm run watch
```
Eredmény: létrejön a `build/bundle.js`, figyeli a `js/` mappát és minden változás esetén újragenerálja a létrehozott fájlt.
#### Production fájl létrehozása:
```
cd ~/wwwroot/osmhu
npm run build
```
Eredmény: létrejön a `build/bundle.js`.
