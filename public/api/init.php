<?
require_once "config.php";

$POST_PER_PAGE = 24;

//------------------------------------------------------------
// calc

$page = empty( $_GET['page'] ) ? 0 : $_GET['page'];

$idFrom = $page * $POST_PER_PAGE;
$idTo   = ($page + 1) * $POST_PER_PAGE;

//------------------------------------------------------------
// access database

$sql = new mysqli( HOST, USER, PASSWORD, DATABASE ) or die( ERROR_JSON );

$result = $sql->query("SELECT * FROM gallery ORDER BY id DESC LIMIT ${idFrom}, ${POST_PER_PAGE}") or die( ERROR_JSON );

$items = [];

while ( $row = $result->fetch_assoc() ) {

	$row['map'] = DATA_URL . "/" . $row['map'];
	$row['thumb'] = DATA_URL . "/" . $row['thumb'];
	array_push($items, $row);
}

$result->close();
$sql->close();

//------------------------------------------------------------
// format data

$data = [
	'next' => SITEROOT . "/api/gallery.php?page=" . ($page+1),
	'items' => $items
];

//------------------------------------------------------------
// Display part

echo json_encode( $data );
?>