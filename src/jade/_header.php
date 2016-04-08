<?
require_once "./api/config.php";

//------------------------------------------------------------
// check specified post exists in DB

// attributes
$id = null;
$map = null;
$thumb = 'default_thumb.png';

$title = 'S a n d p i x';
$page_title = 'S a n d p i x';
$url = SITEROOT;
$map_url = '';
$thumb_url = SITEROOT . "/img/ogp.jpg";

$description = 'Just a pixel sandbox';

//------------------------------------------------------------
// check specified post exists in DB

// parse url directory

/*
$dirs = explode('/', $_SERVER["REQUEST_URI"]);
$dirs = array_filter($dirs);
$dirs = array_slice($dirs, 0);

if (count($dirs) == 0 ) {

} else if (count($dirs) == 1) {

	$slug = $dirs[0];

	if (!isset($SYSTEM_INFO[$slug])) gotoBlankPage();

} else if (count($dirs) == 2) {

	$slug = $dirs[0];
	$id = intval($dirs[1]);

	if (!isset($SYSTEM_INFO[$slug])) gotoBlankPage();
	if ($id == 0) {
		header("Location: /${slug}");
		exit;
	}

	$system_info = $SYSTEM_INFO[$slug];

	// load data
	$sql = new mysqli(HOST, USER, PASSWORD, DATABASE) or gotoBlankPage();



	$result = $sql->query("SELECT * FROM gallery WHERE id=${id}") or gotoBlankPage();

	if ( empty($result) || $result->num_rows == 0) {
		header("Location: /${slug}");
		exit;
	}

	$col = $result->fetch_assoc();

	$type 	= $col['type'];
	$map 		= $col['map'];
	$thumb 	= $col['thumb'];

	if ($type != $system_info['type']) {
		// redirect
		$new_slug = $SYSTEM_SLUG[$type];
		header("Location: /${new_slug}/$id");
		exit;
	}

	$title			= $system_info['name'];
	$page_title	= "${title} #${id}";
	$url 				= SITEROOT . "/${slug}/${id}";
	$map_url		= DATA_URL . "/${map}";
	$thumb_url	= DATA_URL . "/${thumb}";

} else {
	gotoBlankPage();

}*/



//------------------------------------------------------------
// functions

function gotoBlankPage() {
	header('Location: /');
	exit;
}

?>