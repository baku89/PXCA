<?
require_once "config.php";

//------------------------------------------------------------
// Functions

function save_image($data, $filename, $baseColorHex, $isThumb) {

	list($type, $data) = explode(';', $data);
	list(, $data)      = explode(',', $data);
	$data = base64_decode($data);

	$dstImg  = imagecreatetruecolor(SHARE_WIDTH, SHARE_HEIGHT);
	$sendImg = imagecreatefromstring($data);

	$r = 0xFF & ($baseColorHex >> 0x10);
  $g =0xFF & ($baseColorHex >> 0x8);
  $b =0xFF & $baseColorHex;
	
	$fillColor = imagecolorallocate($dstImg, $r, $g, $b);
	imagefill($dstImg, 0, 0, $fillColor);

	// copy image
	$offsetX = floor( (imagesx( $dstImg ) - imagesx( $sendImg )) / 2 );
	$offsetY = floor( (imagesy( $dstImg ) - imagesy( $sendImg )) / 2 );

	imagecopy( $dstImg, $sendImg, $offsetX, $offsetY,
		0, 0, imagesx( $sendImg ), imagesy( $sendImg ));

	// flip image ( webgl coord origin begins with bottom-left )
	imageflip($dstImg, IMG_FLIP_VERTICAL);

	if ($isThumb) {

		imageflip($dstImg, IMG_FLIP_VERTICAL);
		$dstImg = imagescale($dstImg, SHARE_WIDTH * 4, SHARE_HEIGHT * 4, IMG_NEAREST_NEIGHBOUR);
	}

	// save
	$dstPath = DATA_DIR . '/' . $filename;
	$result = imagepng($dstImg, $dstPath);

	imagedestroy( $dstImg );
	imagedestroy( $sendImg );

	return $result;
}

//------------------------------------------------------------
// 0.validate


if ( empty($_POST['type']) 
	|| empty($_POST['map']) 
	|| empty($_POST['thumb'])
	|| empty($_POST['base_color']) ) {

	die(ERROR_JSON);
}

$sql = new mysqli(HOST, USER, PASSWORD, DATABASE) or die(ERROR_JSON);

$result = $sql->query( "SHOW TABLE status LIKE 'gallery'" );
$row = $result->fetch_array();

// create row data
$id = $row['Auto_increment'];
$type = $_POST['type'];
$posted = date('Y-m-d H:i:s');
$parent_id = !empty($_POST['parent_id']) ? $_POST['parent_id'] : 'null';
$point = 0;

$baseColorHex = $_POST['base_color'];

//------------------------------------------------------------
// 1. save to PNG

$filenameMap = str_pad($id, 6, "0", STR_PAD_LEFT) . '_map.png';
$filenameThumb = str_pad($id, 6, "0", STR_PAD_LEFT) . '_thumb.png';

$result =  save_image($_POST['map']  , $filenameMap  , 0x000000, false);
$result &= save_image($_POST['thumb'], $filenameThumb, $baseColorHex, true);

if ( !$result ) {
	die(ERROR_JSON);
}

//------------------------------------------------------------
// 1. insert DB

$sql->query( "INSERT INTO gallery values(null, $type, '{$posted}', '${filenameMap}', '${filenameThumb}', $parent_id, $point)" ) or die (ERROR_JSON);
$sql->close();

//------------------------------------------------------------
// Display Part
?>
{
	"status": "OK",
	"id": <?= $id ?>,
	"url": "<?= SITEROOT . "/?n=$id" ?>"
}