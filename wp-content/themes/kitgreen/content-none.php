<div class="no-results col-lg-12">
	<h1 class="page-title"><?php _e( 'Nothing Found', 'kitgreen' ); ?></h1>
    <p class="none_des"><?php esc_html_e("Sorry, but nothing matched your search terms. Please try again with some different keywords.","kitgreen") ?></p>
	<form method="get" id="searchform" class="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <div>
        <input type="text" value="<?php echo get_search_query(); ?>" name="s" id="s" placeholder="Search ..." />
        <button id="searchsubmit" type="submit"><span class="ion-ios-search"></span></button>
    </div>
    </form>
</div>