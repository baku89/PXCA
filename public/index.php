<?
require_once "./api/config.php";

//------------------------------------------------------------
// check specified post exists in DB

// attributes
$id = null;
$map = null;
$thumb = 'default_thumb.png';

$title = 'Fuse';
$url = SITEROOT;
$map_url = '';
$thumb_url = SITEROOT . "/img/ogp.jpg";

//------------------------------------------------------------
// check specified post exists in DB

if ( isset($_GET['n']) ) {

	$id = $_GET['n'];
	$sql = new mysqli(HOST, USER, PASSWORD, DATABASE) or gotoBlankPage();

	$result = $sql->query("SELECT * FROM gallery WHERE id=${id}") or gotoBlankPage();

	if ( !( !empty($result) && $result->num_rows > 0 ) ) {
		gotoBlankPage();
	}

	$col = $result->fetch_assoc();

	$id 		= $col['id'];
	$map 		= $col['map'];
	$thumb 	= $col['thumb'];

	$title			= "Fuse #${id}";
	$url 				= SITEROOT . "/?n=${id}";
	$map_url		= SITEROOT . "/data/${map}";
	$thumb_url	= SITEROOT . "/data/${thumb}";

}

function gotoBlankPage() {
	header('Location: .');
	exit;
}

?><!DOCTYPE html>
<head>
  <base href="./">
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="description" content="undefined">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>F u s e</title>
  <meta property="og:site_name" content="Fuse">
  <meta property="og:title" content="<?= $title ?>">
  <meta property="og:description" content="WebGL cellular automaton">
  <meta property="og:image" content="<?= $thumb_url ?>">
  <meta property="og:type" content="website">
  <meta property="og:url" content="<?= $url ?>">
  <meta name="twitter:card" content="photo">
  <meta name="twitter:site" content="_baku89">
  <meta name="twitter:title" content="<?= $title ?>">
  <meta name="twitter:description" content="WebGL cellular automaton">
  <meta name="twitter:image" content="<?= $thumb_url ?>">
  <meta name="twitter:url" content="<?= $url ?>">
  <link href="http://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css">
  <link rel="stylesheet" type="text/css" href="style.css">
  <script type="text/javascript">
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
     
    ga('create', 'UA-57785251-1', 'auto');
    ga('send', 'pageview');
  </script>
</head>
<body data-id="<?= is_null($id) ? "" : $id ?>" data-map="<?= $map_url ?>">
  <div class="page-wrapper">
    <canvas id="canvas"></canvas>
    <div class="loading canvas--loading"></div>
    <div class="palette-wrapper">
      <div class="palette"></div>
    </div>
    <nav class="menu">
      <div class="menu__btn">
        <div class="l l1"></div>
        <div class="l l2"></div>
        <div class="l l3"></div>
      </div>
      <ul class="menu__lists">
        <li><a class="menu__help">?</a></li>
        <li><a class="menu__gallery">Gallery</a></li>
        <li><a class="menu__share">Share</a></li>
        <li><a class="menu__clear">Clear</a></li>
      </ul>
    </nav>
    <div class="layer layer--menu-darken"></div>
    <section class="layer layer--help">
      <div class="layer--help__container">
        <h2>Fuse</h2>
        <p>
          This demo simulates burning fuses and exploding bombs using a method of a sort of cellular automaton(CA). Click and drag to draw a line. Select parettes on top to change brush type(<span class="fuse">fuse</span>, <span class="bomb">bomb</span>, <span class="fire">fire</span>, <span class="wall">wall</span>, <span class="ersr">eraser</span> respectively from left to right). The CA program is mainly written in GLSL.
          
        </p>
        <h3 class="layer--help__shortcut">Shortcuts</h3>
        <p class="layer--help__shortcut layer--help__shortcut--left">
          [1]: <span class="fuse">Fuse</span><br>
          [2]: <span class="bomb">Bomb</span><br>
          [3]: <span class="fire">Fire</span><br>
          [4]: <span class="wall">Wall</span><br>
          [5]: <span class="ersr">Eraser</span>
          
        </p>
        <p class="layer--help__shortcut layer--help__shortcut--right">
          [s]: Share<br>
          [↑]: Increasing brush size<br>
          [↓]: Decreasing brush size<br>
          [space]: Toggle pause
          
        </p>
        <p class="layer--help__credit">
          created by <a href="http://baku89.com" target="_blank">baku</a>
          
          
        </p>
      </div>
    </section>
    <section class="layer layer--paused">
      <div class="layer--paused__message">&gt; Click to Resume &lt;</div>
    </section>
    <section class="layer layer--share">
      <div class="is-passthru share-frame share-frame--top"></div>
      <div class="is-passthru share-frame share-frame--right"></div>
      <div class="is-passthru share-frame share-frame--bottom"></div>
      <div class="is-passthru share-frame share-frame--left"></div>
      <div class="loading layer--share__loading"></div>
    </section>
    <div class="alert">
    </div>
    <section class="layer layer--gallery">
      <ul class="layer--gallery__list is-passthru"></ul>
      <div class="loading layer--gallery__loading"></div>
    </section>
  </div>
  <div class="unsupported"><img src="./img/unsupported.gif">
    <h3>Not Supported on Your Browser</h3>
    <p>
      Please visit from your pc<br>
      with a latest browser supporting WebGL.
      
    </p>
    <p class="unsupported__credit">
      created by <a href="http://baku89.com/" target="_blank">baku</a>
      
    </p>
  </div>
  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.js"></script>
  <script type="text/javascript" src="./js/Detector.js"></script>
  <script type="text/javascript" src="./js/main.js"></script>
</body>