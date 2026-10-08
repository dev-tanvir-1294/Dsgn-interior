<?php
/**
 * WooCommerce wrapper — renders the shop content inside a <main> so the
 * design's spacing applies. dsgn-woocommerce.css (enqueued in functions.php)
 * skins the products, cart and checkout.
 *
 * @package dsgn
 */
get_header();
?>
<main>
<?php woocommerce_content(); ?>
</main>
<?php get_footer(); ?>
