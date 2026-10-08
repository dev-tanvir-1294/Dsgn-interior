<?php
/**
 * Static pages — used by Elementor and regular pages alike.
 * Content is rendered via the_content(); build pages with Elementor and paste
 * the content sections from the elementor kit (header/footer are handled here).
 *
 * @package dsgn
 */
get_header();
?>
<main>
<?php
while ( have_posts() ) :
	the_post();
	the_content();
endwhile;
?>
</main>
<?php get_footer(); ?>
