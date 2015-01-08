<html>
    <meta http-equiv="Content-Type" content="text/html;" charset="UTF-8">
    <STYLE type="text/css">
        td {border-width: 1px; border-style: solid; text-align: center}
    </STYLE>
	<title>Magyarországi CLC Területhasználati adatok (erdők stb) OpenStreetMap szerkesztéshez</title>
<head />
<body>
	<p><a href="http://www.openstreetmap.hu/">&lt;&lt;-- openstreetmap.hu</a></p>
    <h1><img src="clc.png" style="float: left; margin-right: 1em; display: block;" />Magyarországi 
	CLC Területhasználati adatok (erdők stb) OpenStreetMap szerkesztéshez</h1>
    
	<p><strong>Figyelem!! Már nem importáunk további CLC-t.</strong> 
	Úgy tűnik, hogy a EU-s Corine adatok alapján történő rajzolás SEMMILYEN előnnyel nem jár olyan területen ahol Bing műholdkép látható! Ott a műholdképről felismerhető területeket rajzoljuk meg! Ahol már importálva van a CLC, ott hozzá kell igazítani a Binghez, amennyiben aktuálisabbnak tűnik! Lásd <a href="http://wiki.openstreetmap.org/wiki/WikiProject_Hungary/Ter%C3%BCletfunkci%C3%B3">Területfunkciók és felüetbordítás térképezése</a>.
	</p>
    <p>Az oldal célja, hogy a rendelkezésre álló CLC adatok feldolgozását könnyebbé tegye. 
	A kiválasztott település CLC adatai, az OSM adatbázisban már megtalálható adatokkal 
	összefűzve tölthetők le.</p>
	<p>Így amikor egy újabb település berajzolását kezdenéd, a környező 
	települések már meglévő - CLC-ből importált - csatlakozó vonalaival egy
	kapcsolatba szervezve kapod meg azokat a vonalakat is, amiket épp importálni
	szerednél A meglévő multipoligon kapcsolatokba való befűzés CLC:id 
	alapján történik, azaz, ugyannanak a területvonalnak a folytatása 
	automatikusan a már meglévő területvonal folytatása lesz, ha 
	innen töltöd le az adatokat.</p>

 	<p>A linken pedig "nyers" CLC adatok tölthetők le, ezekben nincsenek benne a környék OSM adatai sem és
	a multipoligonok sincsenek egyesítve a környék már importált adataival.
	Mentéshez használd a jobb egérgomb, <em>Link mentése másként...</em> menüt</p>
	<ul>
    <li><a href="http://wiki.openstreetmap.org/wiki/CLC_feldolgoz%C3%A1si_seg%C3%A9dlet">Útmutató szerkesztéshez</a></li>
<li><a href="http://wiki.openstreetmap.org/wiki/WikiProject_Hungary/Import%C3%A1l%C3%A1s/Corine_Land_Cover_2006">CLC importálás projekt</a></li>
<li>Összes nyers adat letöltése egyben (Linux): <a href="all_v0.2.1.tgz">all_v0.2.1.tgz</a></li>
<li>Összes nyers adat letöltése egyben (Win/Mac): <a href="all_v0.2.1.7z">all_v0.2.1.7z</a></li>
<li>Darabolatlan, optimalizált, nyers adatok egyben: <a href="clc_hungary_optimized_v0.2.1.tgz">clc_hungary_optimized_v0.2.1.tgz</a></li>
</ul>
<h2>Változások:</h2>
<pre>
v0.2.1 (2012.11.05):
	- Vonalvezetés optimalizálva: a geometrián nem igazán változtató pontok törölve (0.000011)
v0.2.0 (2012.08.07):
	- Bugfix: Határokon néhol 1 pontból álló vonalak jöttek létre
	- Bugfix: Néhol egymást fedő vonalak jöttek létre
v0.1.9 (2012.08.01):
	-Az egy zárt vonalból területek a vonalon vannak címkézve, nincs relation
v0.1.8:
	-Bugfix: Tagek nélküli vonalak megfelelő relációba foglalása
	-Bugfix: inner/outer role-ok pótlása a relációkban
</pre> 
<h2>Letöltés</h2>
    <table cellpadding="2" cellspacing="0">
        <tr>
            <th>Nyers adatok</th>
<!--            <th>Csak szűrt adatok</th>-->
            <th>Letöltés</th>
        </tr>
    <?php
        include_once 'settings.php';
        //read dir
	$dir =CLC_DATA_FOLDER;
	$files = scandir($dir);
	
	//set locale for sort method
	setlocale (LC_COLLATE, 'hu_HU', 'hun_HUN', 'hun');  
	
	sort($files,SORT_LOCALE_STRING);
		
	foreach ($files as &$entry){
                $settlementName = $entry; //iconv(CLC_DATA_CHARSET, "UTF-8", $entry);
                $settlementName = str_replace(".osm","",$settlementName);
                
		if(preg_match("/.osm$/", $entry)){
                    echo '<tr><form action="merge.php" method="post" accept-charset="'.CLC_DATA_CHARSET.'">'.
                         "<td><a href=\"$settlementName.osm\">$settlementName</a></td>".                         
                         //'<td><input type="checkbox" name="fd" value="true" /></td>'.
                         '<td><input type="submit" value="Letöltés" /></td>'.
                         '<input type="hidden" name="sn" value="'.$settlementName.'"/>'.
                         "</form>\n</tr>";
		}
	}
    ?>
    </table>
</body>
    
</html>
