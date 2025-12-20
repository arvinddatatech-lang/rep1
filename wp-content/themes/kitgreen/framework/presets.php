<?php
function jwstheme_autoCompileLess($inputFile, $outputFile) {
    require_once( ABSPATH.'/wp-admin/includes/file.php' );	
	WP_Filesystem();
	global $wp_filesystem, $jwstheme_options;
    $less = new lessc();
    $less->setFormatter("classic");
    $less->setPreserveComments(true);
	/*Styling Options*/

    $cacheFile = $inputFile.".cache";
    if (file_exists($cacheFile)) {
            $cache = unserialize($wp_filesystem->get_contents($cacheFile));
    } else {
            $cache = $inputFile;
    }
    $newCache = $less->cachedCompile($inputFile);
    if (!is_array($cache) || $newCache["updated"] > $cache["updated"]) {
            $wp_filesystem->put_contents($cacheFile, serialize($newCache));
            $wp_filesystem->put_contents($outputFile, $newCache['compiled']);
    }
}
function jwstheme_addLessStyle() {
	$preset_color = 'default';
	
	try {
		$inputFile = ABS_PATH.'/assets/css/less/style.less';
		$outputFile = ABS_PATH.'/assets/css/presets/'.$preset_color.'.css';
		jwstheme_autoCompileLess($inputFile, $outputFile);
    } catch (Exception $e) {
        echo 'Caught exception: ', $e->getMessage(), "\n";
    }
}
add_action('wp_enqueue_scripts', 'jwstheme_addLessStyle');
/* End less*/
