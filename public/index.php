<?

require __DIR__ . "/vendor/autoload.php";

require_once './api/config.php';

//------------------------------------------------------------
// 1. router

$router = new AltoRouter();

$router->map('GET', '/', function() {
	loadMain(null, null);
});

$router->map('GET', '/[fuse|pfw:type]', function($type) {
	loadMain($type, null);
});

$router->map('GET', '/[fuse|pfw:type]/[i:id]', function($type, $id) {
	loadMain($type, $id);
});


//------------------------------------------------------------
// 2. resolve matched

$match = $router->match();

if ($match && is_callable($match['target'])) {
	call_user_func_array($match['target'], $match['params']); 

} else {
	// no route was matched
	header( $_SERVER["SERVER_PROTOCOL"] . ' 404 Not Found');
}

//------------------------------------------------------------
// functions

function loadMain($_type, $_id) {

	global $SYSTEM_INFO;

	$type = $_type;
	$id = intval($_id) == 0 ? null : intval($_id);
	$map = null;
	$thumb = SITEROOT . '/img/ogp.jpg';

	$url = SITEROOT;
	$title = 'S a n d p i x';
	$page_title = 'S a n d p i x';
	$description = 'Just a pixel sandbox';

	if (!is_null($type)) {
		$title = $SYSTEM_INFO[$type]['title'];
		$url = SITEROOT . "/${type}";
	}

	if (!is_null($id)) {

		$col = getColumn($id);

		// redirect blank page if id is not exists
		if (is_null($col)) {
			redirect("/");
		}

		// redirect if type is wrong
		if ($type != $col['type']) {
			$type = $col['type'];
			redirect("/" . $col['type'] . "/${id}");
		}

		$type = $col['type'];
		$id = $col['id'];
		$url = SITEROOT . "/${type}/${id}";
		$map = DATA_URL . "/" . $col['map'];
		$thumb = DATA_URL . "/" . $col['thumb'];
		$page_title = "${title} #{$id}";
	}

	require './main.php';

}

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

function redirect($url) {
	header("Location: ${url}");
}

?>