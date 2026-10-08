<?php
/**
 * dsgn interior — WooCommerce integration.
 *
 * Paste this into your child theme's functions.php (or require it from there).
 * It declares WooCommerce support and enqueues the design system + shop skin,
 * in the correct order, on top of WooCommerce's own styles.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 1. Declare WooCommerce theme support.
 */
add_action( 'after_setup_theme', function () {
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
} );

/**
 * 2. Enqueue the design system and the WooCommerce skin.
 *
 * Order matters:
 *   dsgn-styles.css      -> the whole design system (Cera Pro, tokens, components)
 *   dsgn-standalone.css  -> makes blocks visible without the site JS
 *   dsgn-woocommerce.css -> skins WooCommerce (this kit)
 *
 * WooCommerce loads its own styles automatically once support is declared; we
 * depend on 'woocommerce-general' so our skin always wins.
 */
add_action( 'wp_enqueue_scripts', function () {
	$dir = get_stylesheet_directory_uri() . '/dsgn/';

	wp_enqueue_style( 'dsgn', $dir . 'dsgn-styles.css', array(), null );
	wp_enqueue_style( 'dsgn-standalone', $dir . 'dsgn-standalone.css', array( 'dsgn' ), null );
	wp_enqueue_style(
		'dsgn-woocommerce',
		$dir . 'dsgn-woocommerce.css',
		array( 'dsgn-standalone', 'woocommerce-general' ),
		null
	);

	// OPTIONAL — only if you want the animated home slider / scroll effects.
	// wp_enqueue_script_module( 'dsgn', $dir . 'dsgn-app.js', array(), null );
} );

/**
 * 3. Wrap WooCommerce content so the design system's layout applies.
 *
 * Elementor renders its own <div class="page …"> wrapper; on WooCommerce's own
 * pages (shop/cart/checkout) we add the same root classes so the header/footer
 * and spacing behave identically.
 */
add_action( 'template_redirect', function () {
	if ( ! function_exists( 'is_woocommerce' ) || ! is_woocommerce() ) {
		return;
	}

	add_filter( 'body_class', function ( $classes ) {
		$classes[] = 'page';
		$classes[] = 'page-shop';
		return $classes;
	} );
} );
