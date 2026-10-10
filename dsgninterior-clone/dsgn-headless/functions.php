<?php
/**
 * dsgn interior — headless theme functions.
 *
 * This theme turns WordPress into a content backend for the Next.js frontend:
 *
 *  - Registers the "Project" custom post type (REST-enabled).
 *  - Registers structured Project meta (location, area, year, photo credit,
 *    featured flag, gallery) exposed through the REST API.
 *  - Adds a `dsgn_media` REST field that resolves the cover + gallery images
 *    into URLs with their registered sizes (so the frontend can build srcsets).
 *  - Exposes the primary menu and site settings at custom REST endpoints.
 *  - Adds permissive CORS headers (for client-side/dev requests).
 *  - Optionally redirects the public site to the Next.js app.
 *
 * @package dsgn-headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DSGN_HEADLESS_VERSION', '1.0.0' );

/**
 * Project custom post type + structured meta.
 */
function dsgn_headless_register_projects() {
	register_post_type(
		'project',
		array(
			'labels'              => array(
				'name'               => __( 'Projects', 'dsgn-headless' ),
				'singular_name'      => __( 'Project', 'dsgn-headless' ),
				'add_new_item'       => __( 'Add New Project', 'dsgn-headless' ),
				'edit_item'          => __( 'Edit Project', 'dsgn-headless' ),
				'featured_image'     => __( 'Cover image', 'dsgn-headless' ),
				'set_featured_image' => __( 'Set cover image', 'dsgn-headless' ),
			),
			'public'              => true,
			'has_archive'         => true,
			'menu_position'       => 5,
			'menu_icon'           => 'dashicons-portfolio',
			'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
			'rewrite'             => array( 'slug' => 'projects', 'with_front' => false ),
			'show_in_rest'        => true,
			'rest_base'           => 'projects',
		)
	);

	// Structured fields. Each is editable in the block editor (REST meta box)
	// and returned in the REST response under `meta`.
	register_post_meta(
		'project',
		'dsgn_location',
		array(
			'type'              => 'string',
			'single'            => true,
			'default'           => '',
			'show_in_rest'       => true,
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	register_post_meta(
		'project',
		'dsgn_area',
		array(
			'type'              => 'string',
			'single'            => true,
			'default'           => '',
			'show_in_rest'       => true,
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	register_post_meta(
		'project',
		'dsgn_year',
		array(
			'type'              => 'string',
			'single'            => true,
			'default'           => '',
			'show_in_rest'       => true,
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	register_post_meta(
		'project',
		'dsgn_photo_credit',
		array(
			'type'              => 'string',
			'single'            => true,
			'default'           => '',
			'show_in_rest'       => true,
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	register_post_meta(
		'project',
		'dsgn_featured',
		array(
			'type'              => 'boolean',
			'single'            => true,
			'default'           => false,
			'show_in_rest'       => true,
			'sanitize_callback' => 'rest_sanitize_boolean',
		)
	);
	register_post_meta(
		'project',
		'dsgn_gallery',
		array(
			'type'              => 'array',
			'single'            => true,
			'default'           => array(),
			'show_in_rest'       => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array( 'type' => 'integer' ),
				),
			),
			'sanitize_callback' => function ( $value ) {
				if ( ! is_array( $value ) ) {
					return array();
				}
				return array_values( array_filter( array_map( 'absint', $value ) ) );
			},
		)
	);
}
add_action( 'init', 'dsgn_headless_register_projects' );

/**
 * Build a clean media payload (URL + registered sizes) for an attachment id.
 */
function dsgn_headless_media_payload( $attachment_id ) {
	$attachment_id = absint( $attachment_id );
	if ( ! $attachment_id ) {
		return null;
	}

	$full = wp_get_attachment_image_src( $attachment_id, 'full' );
	if ( ! $full ) {
		return null;
	}

	$sizes = array();
	foreach ( array( 'thumbnail', 'medium', 'medium_large', 'large', 'full' ) as $name ) {
		$src = wp_get_attachment_image_src( $attachment_id, $name );
		if ( $src ) {
			$sizes[ $name ] = array(
				'url'    => $src[0],
				'width'  => $src[1],
				'height' => $src[2],
			);
		}
	}

	return array(
		'id'     => $attachment_id,
		'url'    => $full[0],
		'width'  => $full[1],
		'height' => $full[2],
		'alt'    => (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
		'sizes'  => $sizes,
	);
}

/**
 * Resolve the cover + gallery into URLs via a `dsgn_media` REST field.
 */
function dsgn_headless_register_rest_fields() {
	register_rest_field(
		'project',
		'dsgn_media',
		array(
			'get_callback'    => function ( $object ) {
				$post_id = isset( $object['id'] ) ? absint( $object['id'] ) : 0;

				$cover_id = (int) get_post_thumbnail_id( $post_id );
				$gallery  = get_post_meta( $post_id, 'dsgn_gallery', true );
				if ( ! is_array( $gallery ) ) {
					$gallery = array();
				}

				$payload = array( 'cover' => null, 'gallery' => array() );
				if ( $cover_id ) {
					$payload['cover'] = dsgn_headless_media_payload( $cover_id );
				}
				foreach ( array_values( array_filter( array_map( 'absint', $gallery ) ) ) as $id ) {
					$item = dsgn_headless_media_payload( $id );
					if ( $item ) {
						$payload['gallery'][] = $item;
					}
				}
				return $payload;
			},
			'update_callback' => null,
			'schema'          => null,
		)
	);
}
add_action( 'rest_api_init', 'dsgn_headless_register_rest_fields' );

/**
 * Primary menu as a simple, flat list.
 *
 *   GET /wp-json/dsgn/v1/menu
 */
function dsgn_headless_register_menu_route() {
	register_rest_route(
		'dsgn/v1',
		'/menu',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => function () {
				$locations = get_nav_menu_locations();
				$menu_id   = isset( $locations['primary'] ) ? absint( $locations['primary'] ) : 0;

				if ( ! $menu_id ) {
					return array();
				}

				$items = wp_get_nav_menu_items( $menu_id );
				$out   = array();
				foreach ( (array) $items as $item ) {
					$out[] = array(
						'id'     => $item->ID,
						'title'  => $item->title,
						'url'    => $item->url,
						'target' => $item->target,
					);
				}
				return $out;
			},
		)
	);
}

/**
 * Site settings (header/footer text) as editable options with sensible defaults.
 *
 *   GET /wp-json/dsgn/v1/site
 */
function dsgn_headless_register_site_route() {
	register_rest_route(
		'dsgn/v1',
		'/site',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => function () {
				return array(
					'name'           => get_bloginfo( 'name' ),
					'description'    => get_bloginfo( 'description' ),
					'contact_email'  => get_option( 'dsgn_contact_email', 'info@dsgninterior.se' ),
					'phone'          => get_option( 'dsgn_phone', '+46 040 26 26 40' ),
					'address_line_1' => get_option( 'dsgn_address_line_1', 'Tessins väg 14' ),
					'address_line_2' => get_option( 'dsgn_address_line_2', '217 58 Malmö' ),
					'instagram'      => get_option( 'dsgn_instagram', 'https://www.instagram.com/dsgn_interior_tm/' ),
					'linkedin'       => get_option( 'dsgn_linkedin', 'https://www.linkedin.com/company/dsgninterior/' ),
				);
			},
		)
	);
}

/**
 * Permissive CORS for the REST API (useful for client-side / dev requests).
 * The Next.js app normally fetches server-side, so this is optional but harmless.
 */
function dsgn_headless_cors_headers() {
	$origin = get_http_origin();

	header( 'Access-Control-Allow-Origin: ' . ( $origin ? $origin : '*' ) );
	header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
	header( 'Access-Control-Allow-Headers: Authorization, Content-Type' );
	header( 'Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages, Link' );

	if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
		status_header( 200 );
		exit;
	}
}
add_action( 'rest_api_init', 'dsgn_headless_register_menu_route' );
add_action( 'rest_api_init', 'dsgn_headless_register_site_route' );
add_action( 'rest_api_init', 'dsgn_headless_cors_headers' );

/**
 * Redirect the public front-end to the Next.js app.
 *
 * Only active when DSGN_FRONTEND_URL is defined in wp-config.php, e.g.:
 *
 *   define( 'DSGN_FRONTEND_URL', 'https://app.yoursite.se' );
 *
 * The request path is preserved so Next.js handles routing.
 */
function dsgn_headless_redirect_to_frontend() {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return;
	}
	if ( is_robots() || is_feed() ) {
		return;
	}
	if ( ! defined( 'DSGN_FRONTEND_URL' ) || ! DSGN_FRONTEND_URL ) {
		return;
	}

	$path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ) : '/';
	$path = '/' . ltrim( (string) $path, '/' );

	wp_safe_redirect( trailingslashit( DSGN_FRONTEND_URL ) . ltrim( $path, '/' ), 302 );
	exit;
}
add_action( 'template_redirect', 'dsgn_headless_redirect_to_frontend' );
