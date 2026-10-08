<?php
/**
 * Archive (blog / category / tag / date).
 *
 * @package dsgn
 */
get_header();
?>
<main>
	<header class="sr"><h1><?php the_archive_title(); ?></h1></header>
<?php
if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();
		?>
		<article class="page-content">
			<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
			<?php the_excerpt(); ?>
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
