<?php
/**
 * Project archive — grid of projects using each project's featured image.
 * Reuses the design system's `.works-grid` / `.work-link` / `.work-title`.
 *
 * @package dsgn
 */
get_header();
?>
<main>
	<header class="sr"><h1><?php post_type_archive_title(); ?></h1></header>
	<ul class="works-grid projects-grid">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<li>
			<a href="<?php the_permalink(); ?>" class="work-link">
				<?php if ( has_post_thumbnail() ) : ?>
				<div class="project-thumb">
					<?php the_post_thumbnail( 'large' ); ?>
				</div>
				<?php endif; ?>
				<h2 class="work-title"><span><?php the_title(); ?></span></h2>
			</a>
		</li>
		<?php
	endwhile;
	?>
	</ul>
	<?php the_posts_pagination(); ?>
</main>
<?php get_footer(); ?>
