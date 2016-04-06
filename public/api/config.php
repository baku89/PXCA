<?

// detect localhost
$isRemote = !(substr($_SERVER['REMOTE_ADDR'], 0, 4) == '127.'
        		 || $_SERVER['REMOTE_ADDR'] == '::1'
          || substr($_SERVER['REMOTE_ADDR'], 0, 9) == 'localhost' );

//------------------------------------------------------------
// header, config

header('Access-Control-Allow-Origin: *');


// const
define('SITEROOT', 			$isRemote ? 'http://s.baku89.com/fuse' : 'http://localhost:3000');

define('ERROR_JSON', 		'{"status": "failed"}');

define('HOST', 					$isRemote ? 'mysql901.xserver.jp' : 'localhost');
define('USER', 					'suyarigasumi_mg');
define('PASSWORD', 			'Byakugunh4b2');
define('DATABASE', 			'suyarigasumi_fuse2');

define('SHARE_WIDTH', 	240);
define('SHARE_HEIGHT',	160);

?>