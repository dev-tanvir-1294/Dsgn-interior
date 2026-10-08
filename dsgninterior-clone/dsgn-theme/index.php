<?php
/**
 * Main fallback template (blog index and anything without a more specific template).
 *
 * @package dsgn
 */
get_header();
?>
<main>
<?php
if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();
		?>
		<article class="page-content">
			<h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
			<?php the_content(); ?>
		</article>
		<?php
	endwhile;
	the_posts_pagination();
else :
	?>
	<article class="page-content">
		<p><?php esc_html_e( 'Nothing found.', 'dsgn' ); ?></p>
	</article>
	<?php
endif;
?>
</main>
<?php get_footer(); ?>
