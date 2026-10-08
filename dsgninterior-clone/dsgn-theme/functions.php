<?php
/**
 * dsgn interior — theme functions.
 *
 * Registers menus and theme support, enqueues the design system (CSS + JS + fonts),
 * and wires up WooCommerce. The interaction bundle (assets/dsgn-app.js) already
 * contains Swiper, GSAP and Lenis, so smooth scroll and animations work out of
 * the box once the markup matches — which these templates do.
 *
 * @package dsgn
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DSGN_VERSION', '1.0.0' );

/**
 * Base URL for the site's media (images + videos).
 *
 * Media is bundled inside this theme at `assets/media/`, so every `/media/…`
 * reference in the hero and page content is rewritten to it automatically —
 * no separate media upload needed.
 *
 * To host the media elsewhere (a CDN, a separate /media/ folder, or uploads),
 * define the constant in wp-config.php:
 *
 *   define( 'DSGN_MEDIA_URL', 'https://cdn.yoursite.com/media/' );
 */
function dsgn_media_base() {
	if ( defined( 'DSGN_MEDIA_URL' ) && DSGN_MEDIA_URL ) {
		return trailingslashit( DSGN_MEDIA_URL );
	}
	return trailingslashit( get_template_directory_uri() . '/assets/media' );
}

/**
 * Theme setup.
 */
function dsgn_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );

	// WooCommerce.
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );

	register_nav_menus(
		array(
			'primary' => __( 'Primary menu', 'dsgn' ),
		)
	);
}
add_action( 'after_setup_theme', 'dsgn_setup' );

/**
 * Register the "Project" custom post type.
 *
 * Add projects from WP Admin → Projects, upload a Featured Image, and they
 * render in a grid on /projects/ (archive) and /projects/<slug>/ (single).
 * Images come from the Media Library, so no /media/ path is needed for them.
 */
function dsgn_register_projects() {
	register_post_type(
		'project',
		array(
			'labels'        => array(
				'name'          => __( 'Projects', 'dsgn' ),
				'singular_name' => __( 'Project', 'dsgn' ),
				'add_new_item'  => __( 'Add New Project', 'dsgn' ),
				'edit_item'     => __( 'Edit Project', 'dsgn' ),
				'featured_image' => __( 'Cover image', 'dsgn' ),
				'set_featured_image' => __( 'Set cover image', 'dsgn' ),
			),
			'public'        => true,
			'has_archive'   => true,
			'menu_position' => 5,
			'menu_icon'     => 'dashicons-portfolio',
			'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
			'rewrite'       => array( 'slug' => 'projects', 'with_front' => false ),
			'show_in_rest'  => true,
		)
	);
}
add_action( 'init', 'dsgn_register_projects' );

/**
 * Enqueue the design system.
 */
function dsgn_assets() {
	$uri = get_template_directory_uri() . '/assets/';

	wp_enqueue_style( 'dsgn-styles', $uri . 'dsgn-styles.css', array(), DSGN_VERSION );
	wp_enqueue_style( 'dsgn-standalone', $uri . 'dsgn-standalone.css', array( 'dsgn-styles' ), DSGN_VERSION );

	if ( class_exists( 'WooCommerce' ) ) {
		wp_enqueue_style( 'dsgn-woocommerce', $uri . 'dsgn-woocommerce.css', array( 'dsgn-standalone' ), DSGN_VERSION );
	}

	// The interaction bundle (Swiper + GSAP + Lenis + menu toggle) is a plain,
	// self-contained script (no import/export), so load it in the footer.
	wp_enqueue_script( 'dsgn-app', $uri . 'dsgn-app.js', array(), DSGN_VERSION, true );

	// CPT grid styles (grayscale -> colour hover cards).
	wp_enqueue_style( 'dsgn-projects', $uri . 'dsgn-projects.css', array( 'dsgn-styles' ), DSGN_VERSION );
}
add_action( 'wp_enqueue_scripts', 'dsgn_assets' );

/**
 * Add the design's `.active` class to the current menu item's <a>.
 */
add_filter(
	'nav_menu_link_attributes',
	function ( $atts, $item ) {
		$current = array_intersect( array( 'current-menu-item', 'current-page-item', 'current_page_item', 'current_page_ancestor' ), (array) $item->classes );
		if ( ! empty( $current ) ) {
			$atts['class'] = isset( $atts['class'] ) ? $atts['class'] . ' active' : 'active';
		}
		return $atts;
	},
	10,
	2
);

/**
 * Menu fallback: the dsgn links, shown until a menu is assigned in
 * Appearance → Menus.
 */
function dsgn_menu_fallback() {
	$home = esc_url( home_url( '/' ) );
	echo '<ul class="menu-links">';
	foreach ( array(
		'shop'        => '/shop/',
		'projects'    => '/projects/',
		'dsgn-archive' => '/dsgn-archive/',
		'office'      => '/office/',
	) as $label => $path ) {
		printf(
			'<li><a href="%s"><span>%s</span></a></li>',
			esc_url( $home . $path ),
			esc_html( $label )
		);
	}
	echo '</ul>';
}

/**
 * Rewrite every `/media/…` reference (images + videos in the hero and page
 * content) to DSGN_MEDIA_URL. Keeps the markup identical to the original while
 * letting you point the media at any location via one constant.
 */
add_action(
	'template_redirect',
	function () {
		if ( is_admin() ) {
			return;
		}
		ob_start(
			function ( $html ) {
				return str_replace( '/media/', dsgn_media_base(), $html );
			}
		);
	}
);
