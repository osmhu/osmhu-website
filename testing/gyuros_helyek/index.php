<!DOCTYPE html>
<html lang="hu">
<head>
	<meta charset="utf-8">
	<title>Egyféle helyek - OSM</title>
	<meta name="description" content="!!!">
	<link rel="shortcut icon" href="/favicon.ico">

	<!-- normalize.css -->
	<link rel="stylesheet" href="//cdn.jsdelivr.net/normalize/3.0.1/normalize.min.css">
	<!-- Map stylesheet -->
	<link rel="stylesheet" href="/css/map.css">
	<!-- Search results stylesheet -->
	<link rel="stylesheet" href="/css/search-results.css">
	<!-- Search results stylesheet -->
	<link rel="stylesheet" href="/css/poi-popup.css">
	<!-- Leaflet stylesheet -->
	<link rel="stylesheet" href="/vendor/leaflet-0.7.3/leaflet.css">
	<!-- Leaflet.Locate stylesheet -->
	<link rel="stylesheet" href="/vendor/leaflet-locatecontrol/L.Control.Locate.css">
	<!--[if lt IE 9]>
	  <link rel="stylesheet" href="/vendor/leaflet-locatecontrol/L.Control.Locate.ie.css">
	<![endif]-->
	<!-- Saját stylesheet -->
	<link rel="stylesheet" href="main.css">
</head>
<body>
	<div class="header">
		<h1>Valamiféle map teszt</h1>
	</div>
	<div id="map-container">
		<noscript>
			<p>A weboldal használatához JavaScript szükséges.</p>
			<p><a href="http://www.enable-javascript.com/hu/" target="_blank">Itt találhat segítséget, hogy hogyan engedélyezheti a JavaScriptet böngészőjében.</a></p>
		</noscript>
		<div id="map"></div>
	</div>

	<div id="description" class="panel">
		<div class="description">
			<h1>Üdvözöllek itt!</h1>
			<p>Ez egy sima panel.</p>
			<p>A térképen alapból a MapQuest réteg jelenik meg, de Mapnikra is át lehet váltani.</p>
			<p><a href="http://mapicons.nicolasmollet.com/markers/sports/relaxing-sports/fitness-center/">Egyedi marker ikont használ</a></p>
		</div>
		<form id="search">
			<input type="text" id="search" placeholder="Keresés...">
			<button type="submit">Keresés</button>
		</form>
		<div id="search-results">
			<a class="close">×</a>
			<p>Keresés eredménye</p>
			<div class="results-container">
				<div class="no-results">
					<p>Nincsenek találatok.</p>
					<p>Ellenőrizd a keresőszót!</p>
				</div>
				<div class="results">
				</div>
			</div>
		</div>
	</div>


	<!-- jQuery -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<!-- jQuery cookie plugin -->
	<script src="//cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.min.js"></script>
	<!-- Leaflet library -->
	<script src="/vendor/leaflet-0.7.3/leaflet.js"></script>
	<!-- Leaflet.Locate plugin -->
	<script src="/vendor/leaflet-locatecontrol/L.Control.Locate.js"></script>
	<!-- Leaflet.RestoreView plugin -->
	<script src="/vendor/leaflet.restoreview.js"></script>
	<!-- Leaflet Layer OverPass plugin -->
	<script src="/vendor/leaflet-layer-overpass/OverPassLayer.js"></script>
	<!-- osmhu js -->
	<script>
		window.osmhu = {};
	</script>
	<script src="/js/control-minZoomIdenticator.js"></script>
	<script src="/js/helpers.js"></script>
	<script src="/js/layers.js"></script>
	<script src="/js/leaflet.js"></script>
	<script src="/js/marker.js"></script>
	<script src="/js/popup.js"></script>
	<script src="/js/search.js"></script>
	<script src="/js/overpass.js"></script>

	<!-- Saját inicializáló -->
	<script src="map.js"></script>
</body>
</html>
