<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Jegyzet létrehozva</title>
</head>
<body>
	<h1>Szia <?php echo $oauth_user['display_name'] ?>!</h1>

	<h2>Jegyzet létrehozva</h2>
	<p>Nézd meg itt:</p>
	<p><a href="http://master.apis.dev.openstreetmap.org/#map=19/<?php echo $_POST['coordinates'] ?>&layers=N">Openstreetmap dev szerver</a></p>

	<a href="end.php">Kijelentkezés</a>
</body>
</html>
