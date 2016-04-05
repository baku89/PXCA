<?
require_once "config.php";

define('POST_PER_PAGE', 12);

//------------------------------------------------------------
// calc

$page = empty( $_GET['page'] ) ? 0 : $_GET['page'];

$idFrom = $page * POST_PER_PAGE;
$idTo   = ($page + 1) * POST_PER_PAGE;


//------------------------------------------------------------
// access database

$sql = new mysqli( HOST, USER, PASSWORD, DATABASE ) or die( ERROR_JSON );

$result = $sql->query("SELECT * FROM gallery ORDER BY id DESC LIMIT ${idFrom}, ${idTo}") or die( ERROR_JSON );

$content = [];

while ( $row = $result->fetch_object() ) {

	array_push( $content, $row);
}

$result->close();
$sql->close();

//------------------------------------------------------------
// format data

$data = [
	'status' => ( count($content) == 0 ) ? 'empty' : 'OK',
	'content' => $content
];

//------------------------------------------------------------
// Display part

echo json_encode( $data );
?>