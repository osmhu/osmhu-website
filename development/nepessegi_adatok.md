# Település lakosság adatok hozzáadása

1. letölteni a [KSH legfrissebb adatbázisát](http://www.ksh.hu/apps/hntr.main)
2. törölni az összes munkalapot az elsőn kívül (Helységek)
    - a libreoffice-ban van egy alig észrevehető kijelölés Ctrl + egérrel ki lehet jelölni többet
3. törölni az oszlopokat úgy, hogy csak a
    - helység megnevezése
    - lakónépesség  
    oszlopok maradjanak a munkalapon
4. törölni a felső címsorokat (2)
5. törölni a legalsó sort (összesen)
6. `Ctrl + A` => Formátum / Közvetlen formázás törlése
7. első sorba beírni az oszlopneveket, sorrendben: `name`, `population`
8. elmenteni .csv fájlba alapbeállításokkal
9. importálni phpmyadmin-ban
    - legyen bekapcsolva `A fájl első sora tartalmazza a tábla oszlopneveit` beállítás
10. átnevezni a táblát `kshdata`-ra
11. a `kshdata` tábla illesztését beállítani a `places` táblával egyezőre
12. `kshdata` tábla szerkezetnél ellenőrizni a mezőket
    - `name`: illesztés `places.name` oszlopával egyező
    - `population`: típusa/hossza a `places.population` oszlopával egyező
13. lefuttatni az alábbi SQL parancsot:

    ```sql
    UPDATE places,kshdata SET places.population=kshdata.population WHERE places.name=kshdata.name
    ```
