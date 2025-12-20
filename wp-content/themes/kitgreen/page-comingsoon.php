<?php
/*
Template Name: Coming Soon Template
*/
get_header('comingsoon'); 
?>
<div class="main-content">
	<div class="main-content ro-container coming-soon">
		<?php while ( have_posts() ) : the_post(); ?>

			<?php the_content(); ?>

		<?php endwhile; // end of the loop. ?>
	</div>
</div>
<?php get_footer('comingsoon'); ?>