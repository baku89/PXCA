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

?><!DOCTYPE html>
<head>
  <base href="./">
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="description" content="undefined">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>
    <?php echo $title; ?>
  </title>
  <meta property="og:site_name" content="<?= $title ?>">
  <meta property="og:title" content="<?= $page_title ?>">
  <meta property="og:description" content="<?= $description ?>">
  <meta property="og:image" content="<?= $thumb_url ?>">
  <meta property="og:type" content="website">
  <meta property="og:url" content="<?= $url ?>">
  <meta name="twitter:card" content="photo">
  <meta name="twitter:site" content="_baku89">
  <meta name="twitter:title" content="<?= $page_title ?>">
  <meta name="twitter:description" content="<?= $description ?>">
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
<body>
  <div class="page-wrapper">
    <canvas id="canvas" class="is-hidden">
      <div class="test">UncoUnco</div>
    </canvas>
    <div class="loading"></div>
    <div class="palette"></div>
    <div class="layer layer--menu-darken"></div>
    <nav class="menu">
      <div class="menu__btn">
        <div class="l l1"></div>
        <div class="l l2"></div>
        <div class="l l3"></div>
      </div>
      <ul class="menu__lists">
        <li><a class="menu__clear">Clear</a></li>
        <li><a class="menu__share">Share</a></li>
        <li><a class="menu__gallery">Gallery</a></li>
        <li><a class="menu__help">?</a></li>
      </ul>
    </nav>
    <section class="help layer layer--help">
      <div class="help__container">
        <h2>Fuse</h2>
        <p>
          This demo simulates burning fuses and exploding bombs using a method of a sort of cellular automaton(CA). Click and drag to draw a line. Select parettes on top to change brush type(<span class="fuse">fuse</span>, <span class="bomb">bomb</span>, <span class="fire">fire</span>, <span class="wall">wall</span>, <span class="ersr">eraser</span> respectively from left to right). The CA program is mainly written in GLSL.
          
        </p>
        <h3 class="help__shortcut">Shortcuts</h3>
        <p class="help__shortcut-list">
          [1-5]: Change <span class="fuse">B</span><span class="bomb">r</span><span class="fire">u</span><span class="wall">s</span><span class="ersr">h</span><br>
          [↑↓ or right drag]: Change brush size<br>
          [space]: Toggle pause<br>
          [c]: Clear<br>
          [s]: Share<br>
          [g]: Gallery<br>
          
        </p>
        <p class="help__credit">
          created by <a href="http://baku89.com" target="_blank">baku</a>
          
          
        </p>
      </div>
    </section>
    <section class="paused layer layer--paused">
      <div class="paused__message">&gt; Click to Resume &lt;</div>
    </section>
    <section class="share layer layer--share">
      <div v-bind:class="{'show': show}" class="alert">
        <div v-show="result == 'succeed'" class="alert__wrapper--succeed">
          <div class="alert__content alert--succeed__content">
            <input type="text" value="{{url}}" class="alert__share-url">
            <div class="alert__tweet"><a class="alert__tweet-link">Tweet</a></div>
          </div>
          <div class="alert__choices">
            <button v-on:click.stop="showGallery()" class="alert__btn">See Others..</button>
            <button v-on:click="resume()" class="alert__btn">Resume</button>
          </div>
        </div>
        <div v-show="result == 'failed'" class="alert__wrapper--failed">
          <div class="alert__content alert--failed__content">{{message}}</div>
          <div class="alert__choices">
            <button v-on:click="resume()" class="alert__btn">Resume</button>
          </div>
        </div>
      </div>
    </section>
    <section v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="gallery layer layer--gallery">
      <ul class="gallery__list">
        <li v-for="item in items" v-on:click.stop="loadMap($event, item)" class="gallery-item">
          <div class="gallery-item__wrapper">
            <div class="gallery-item__id">{{item.id}}</div><img v-bind:src="item.thumb" src="" class="gallery-item__thumb">
          </div>
        </li>
      </ul>
    </section>
  </div>
  <script type="text/javascript">
    <? if (!is_null($id)) : ?>
    	window.initialMap = {
    		id: <?= $id ?>,
    		map: '<?= $map_url ?>'
    	}
    <? endif ?>
    
  </script>
  <script type="text/javascript" src="./bootstrap.js"></script>
</body>