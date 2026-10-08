<?php
/**
 * Header — opens the page wrapper and outputs the fixed header.
 * The wrapper class differs: the front page is full-bleed (`.homepage`),
 * everything else uses `.page`.
 *
 * @package dsgn
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php
if ( is_front_page() ) {
	$dsgn_wrapper = 'homepage welcome page-home';
	$dsgn_header  = 'header transparent';
} else {
	$dsgn_wrapper = 'page';
	$dsgn_header  = 'header';
}
?>
<div class="<?php echo esc_attr( $dsgn_wrapper ); ?>">
<header class="<?php echo esc_attr( $dsgn_header ); ?>">
  <div class="header-logo"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><strong>dsgn</strong> interior</a></div>
  <button class="menu-toggle" aria-expanded="false" aria-controls="menu" aria-label="<?php esc_attr_e( 'Menu', 'dsgn' ); ?>"><span class="menu-toggle-open"><?php esc_html_e( 'Menu', 'dsgn' ); ?></span><span class="menu-toggle-close" aria-hidden="true"><?php esc_html_e( 'Close', 'dsgn' ); ?></span></button>
  <nav class="menu" id="menu">
    <?php
    wp_nav_menu(
        array(
            'theme_location' => 'primary',
            'container'      => false,
            'menu_class'     => 'menu-links',
            'items_wrap'     => '<ul class="%2$s">%3$s</ul>',
            'link_before'    => '<span>',
            'link_after'     => '</span>',
            'fallback_cb'    => 'dsgn_menu_fallback',
        )
    );
    ?>
    <div class="languages">
      <a hreflang="sv" href="<?php echo esc_url( home_url( '/sv/' ) ); ?>" aria-label="<?php esc_attr_e( 'Svenska', 'dsgn' ); ?>">SV</a>
      <a hreflang="en" href="<?php echo esc_url( home_url( '/en/' ) ); ?>" aria-label="<?php esc_attr_e( 'English', 'dsgn' ); ?>" aria-current="true">EN</a>
    </div>
  </nav>
</header>
