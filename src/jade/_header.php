<?
require_once "./api/config.php";

//------------------------------------------------------------
// check specified post exists in DB

// attributes
$id = 0;
$map = null;
$thumb = 'default_thumb.png';
$type = '';

$title = 'S a n d p i x';
$page_title = 'S a n d p i x';
$url = SITEROOT;
$map_url = '';
$thumb_url = SITEROOT . "/img/ogp.jpg";

$description = 'Just a pixel sandbox';

//------------------------------------------------------------
// check specified post exists in DB


// parse url directory

$path = $_SERVER['REQUEST_URI'];

if ($path == '/') {

} else if ( preg_match('/^\/([a-z]+)$/', $path, $matches) ) {
	
	$type = $matches[1];
	if (!isset($SYSTEM_INFO[$type])) {
		notFound();
	}

	$title = $SYSTEM_INFO[$type]['title'];

} else if ( preg_match('/^\/([a-z]+)\/([0-9]+)$/', $path, $matches) ) {

	$type = $matches[1];
	if (!isset($SYSTEM_INFO[$type])) {
		notFound();
	}
	$id = intval($matches[2]);

	if ($id != 0) {

		$col = getColumn($id);

		if ($col == null) {
			gotoBlankPage();
		}

		$type 	= $col['type'];
		$map 		= $col['map'];
		$thumb 	= $col['thumb'];

		$title			= $SYSTEM_INFO[$type]['title'];
		$page_title	= "${title} #${id}";
		$url 				= SITEROOT . "/${type}/${id}";
		$map_url		= DATA_URL . "/" . $col['map'];
		$thumb_url	= DATA_URL . "/" . $col['thumb'];
	}

} else {
	notFound();

}

//------------------------------------------------------------
// functions

function getColumn($id) {
	if (!($sql = new mysqli(HOST, USER, PASSWORD, DATABASE))) {
		return null;
	}

	if (!($result = $sql->query("SELECT * FROM gallery WHERE id=${id}"))) {
		return null;
	}

	if (empty($result) || $result->num_rows == 0) {
		return null;
	}

	return $result->fetch_assoc();
}

function notFound() {
	header('HTTP/1.0 404 Not Found');
	echo "Not Found";
	exit;
}

function gotoBlankPage() {
	header('Location: /');
	exit;
}


?>