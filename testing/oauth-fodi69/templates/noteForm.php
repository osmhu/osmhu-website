<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Jegyzet létrehozva</title>
</head>
<body>
	<h1>Szia <?php echo $oauth_user['display_name'] ?>!</h1>

	<form method="post">
		<p>Ide kérem a note-ot: </p>
		<p><input type="text" name="coordinates" value="46.90727/19.69308"></p>
		<p>Szöveg: </p>
		<p><input type="text" name="text" value="Test note... please delete"></p>
		<p><input type="submit" value="Létrehozás"></p>
	</form>
</body>
</html>
