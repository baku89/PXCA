<?
require_once "config.php";

//------------------------------------------------------------
// Functions

function save_image($data, $filename, $fillColor, $isRetina) {

	list($type, $data) = explode(';', $data);
	list(, $data)      = explode(',', $data);
	$data = base64_decode($data);

	$dstImg  = imagecreatetruecolor( SHARE_WIDTH, SHARE_HEIGHT );
	$sendImg = imagecreatefromstring( $data );

	$rgb = [
		0xFF & ($fillColor >> 0x10),
    	0xFF & ($fillColor >> 0x8),
    	0xFF & $fillColor
	];

	$fillColor = imagecolorallocate( $dstImg, $rgb[0], $rgb[1], $rgb[2]);

	if ( imagesx( $sendImg ) < imagesy( $sendImg ) ) {

		$sendImg = imagerotate( $sendImg, 90, $fillColor );
	}

	// copy image
	$offsetX = floor( (imagesx( $dstImg ) - imagesx( $sendImg )) / 2 );
	$offsetY = floor( (imagesy( $dstImg ) - imagesy( $sendImg )) / 2 );

	imagefill( $dstImg, 0, 0, $fillColor );

	imagecopy( $dstImg, $sendImg, $offsetX, $offsetY,
		0, 0, imagesx( $sendImg ), imagesy( $sendImg ));

	// flip image ( webgl coord origin begins with bottom-left )
	imageflip( $dstImg, IMG_FLIP_VERTICAL );

	// retina
	if ( $isRetina ) {

		$dstImg = imagescale( $dstImg, SHARE_WIDTH * 2, SHARE_HEIGHT * 2, IMG_NEAREST_NEIGHBOUR );
	}

	// save
	$dstPath = $_SERVER['DOCUMENT_ROOT'] . DATA_DIR . $filename;
	$result = imagepng($dstImg, $dstPath);

	imagedestroy( $dstImg );
	imagedestroy( $sendImg );

	return $result;
}

//------------------------------------------------------------
// 0.validate


if ( empty( $_POST['map'] ) ) die( ERROR_JSON );
if ( empty( $_POST['thumb'] ) ) die( ERROR_JSON );

$sql = new mysqli( HOST, USER, PASSWORD, DATABASE ) or die( ERROR_JSON );

$result = $sql->query( "SHOW TABLE status LIKE 'gallery'" );
$row = $result->fetch_array();
$id = $row['Auto_increment'];


//------------------------------------------------------------
// 1. save to PNG

$filenameMap = str_pad($id, 6, "0", STR_PAD_LEFT) . '_map.png';
$filenameThumb = str_pad($id, 6, "0", STR_PAD_LEFT) . '_thumb.png';

$result =  save_image( $_POST['map']  , $filenameMap  , 0x000000, false );
$result &= save_image( $_POST['thumb'], $filenameThumb, 0x474d52, true );

if ( !$result ) {
	die( ERROR_JSON );
}

//------------------------------------------------------------
// 1. insert DB

$sql->query( "INSERT INTO gallery values(null, '${filenameMap}', '${filenameThumb}')" ) or die ( ERROR_JSON );

$sql->close();

//------------------------------------------------------------
// Display Part
?>
{
	"status": "OK",
	"id": <?= $id ?>,
	"map": "<?= $filenameMap ?>",
	"thumb": "<?= $filenameThumb ?>"
}