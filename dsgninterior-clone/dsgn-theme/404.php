<?php
/**
 * 404 error page.
 *
 * @package dsgn
 */
get_header();
?>
<main>
	<header class="sr"><h1><?php esc_html_e( 'Not found', 'dsgn' ); ?></h1></header>
	<article class="page-content">
		<h2><?php esc_html_e( 'Page not found', 'dsgn' ); ?></h2>
		<p><?php esc_html_e( 'The page you are looking for does not exist or has moved.', 'dsgn' ); ?></p>
		<p><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to home', 'dsgn' ); ?></a></p>
	</article>
</main>
<?php get_footer(); ?>
