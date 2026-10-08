<?php
/**
 * Single project.
 *
 * @package dsgn
 */
get_header();
?>
<main>
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<article class="page-content">
			<?php if ( has_post_thumbnail() ) : ?>
			<div class="project-hero">
				<?php the_post_thumbnail( 'large' ); ?>
			</div>
			<?php endif; ?>
			<h1><?php the_title(); ?></h1>
			<?php the_content(); ?>
		</article>
		<?php
	endwhile;
	?>
</main>
<?php get_footer(); ?>
