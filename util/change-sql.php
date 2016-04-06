<?

require_once "config.php";

$sql = new mysqli( HOST, USER, PASSWORD, DATABASE );

$jsonText = file_get_contents("filelist.json");

$json = json_decode($jsonText, true);

$type = 1; // FUSE

$prev = 0;

foreach ($json as $row) {
	

	$map = $row["name"];
	$thumb = str_replace("map", "thumb", $map);
	$id = intval($map.substr(0, 6));
	$posted = date("Y-m-d H:i:s", $row["posted"]);

	$sql->query( "INSERT INTO gallery values($id, '${map}', '${thumb}', $type, '${posted}', null)" );

	//echo "INSERT INTO gallery values($id, '${map}', '${thumb}', $type, '${posted}', null)";
	// echo "<br>";

	$prev = $id;


}

$sql->close();



?>