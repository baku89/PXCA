<?

// detect localhost
$isRemote = !(substr($_SERVER['REMOTE_ADDR'], 0, 4) == '127.'
        		 || $_SERVER['REMOTE_ADDR'] == '::1'
          || substr($_SERVER['REMOTE_ADDR'], 0, 9) == 'localhost' );

//------------------------------------------------------------
// header, config

header('Access-Control-Allow-Origin: *');

// const
define('SITEROOT', 			$isRemote ? 'http://px.baku89.com' : 'http://192.168.0.2:3000');
define('DATA_DIR',			$_SERVER['DOCUMENT_ROOT'] . '/data');
define('DATA_URL',			SITEROOT . '/data');

define('ERROR_JSON', 		'{"status": "failed", "content": {"message": "Error on server side."}}');

define('HOST', 					$isRemote ? 'mysql901.xserver.jp' : 'localhost');
define('USER', 					'suyarigasumi_mg');
define('PASSWORD', 			'Byakugunh4b2');
define('DATABASE', 			'suyarigasumi_px');

define('SHARE_WIDTH', 	240);
define('SHARE_HEIGHT',	160);


$SYSTEM_INFO = [
	'fuse' 	=> ['title' => 'F u s e'],
	'tri' 	=> ['title' => '🌳 vs 🔥 vs 💧'],
	'photon'=> ['title' => 'P h o t o n'],
];

?>