<?php
/**
 * Visual Composer WooCommerce Carousel
 *
 * @package Total WordPress Theme
 * @subpackage VC Templates
 * @version 3.3.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Not needed in admin ever
if ( is_admin() ) {
    return;
}

// Deprecated Attributes
if ( ! empty( $atts['term_slug'] ) ) {
	$atts['include_categories'] = $atts['term_slug'];
}

// Get and extract shortcode attributes
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );

// Define vars
$atts['post_type'] = 'product';
$atts['taxonomy']  = 'product_cat';
$atts['tax_query'] = '';

// Extract attributes
extract( $atts );

// Build the WordPress query
$wpex_query = vcex_build_wp_query( $atts );

// Output posts
if ( $wpex_query->have_posts() ) :

	// Disable auto play if there is only 1 post
	if ( '1' == count( $wpex_query->posts ) ) {
		$auto_play = false;
	}

	// Output js for front-end editor
	vcex_inline_js( 'carousel' );

	// Load lightbox skin
	if ( 'lightbox' == $thumbnail_link ) {
		vcex_enque_style( 'ilightbox' );
	}

	// Prevent auto play in visual composer
	if ( wpex_is_front_end_composer() ) {
		$auto_play = 'false';
	}

	// Overlay Style
	if ( empty( $overlay_style ) ) {
		$overlay_style = 'none';
	} else {
		$overlay_style = $overlay_style;
	}

	// Item Margin
	if ( 'no-margins' == $style ) {
		$items_margin = '0';
	}

	// Items to scroll fallback for old setting
	if ( 'page' == $items_scroll ) {
		$items_scroll = $items;
	}

	// Wrap Classes
	$wrap_classes = array( 'wpex-carousel', 'wpex-carousel-woocommerce', 'owl-carousel', 'clr' );
	if ( $style ) {
		$wrap_classes[] = $style;
	}
	if ( $visibility ) {
		$wrap_classes[] = $visibility;
	}
	if ( $css_animation ) {
		$wrap_classes[] = $this->getCSSAnimation( $css_animation );
	}
	if ( $classes ) {
		$wrap_classes[] = $this->getExtraClass( $classes );
	}
	if ( $entry_output == 'woocommerce' ) {
		$wrap_classes[] = 'products';
	}
	$wrap_classes = implode( ' ', $wrap_classes );

	// Entry media classes
	$media_classes = array( 'wpex-carousel-entry-media', 'clr' );
	if ( $img_filter ) {
		$media_classes[] = wpex_image_filter_class( $img_filter );
	}
	if ( $img_hover_style ) {
		$media_classes[] = wpex_image_hover_classes( $img_hover_style );
	}
	if ( $overlay_style ) {
		$media_classes[] = wpex_overlay_classes( $overlay_style );
	}
	$media_classes = implode( ' ', $media_classes );

	// Content Design
	$content_style = vcex_inline_style( array(
		'background' => $content_background,
		'padding'    => $content_padding,
		'margin'     => $content_margin,
		'border'     => $content_border,
		//'opacity'    => $content_opacity, Removed due to bugs
		'text_align' => $content_alignment,
	) );

	// Price style
	if ( 'true' == $price ) {
		$price_style = vcex_inline_style( array(
			'font_size' => $content_font_size,
			'color'     => $content_color,
		) );
	}

	// Title design
	if ( $title ) {
		$heading_style = vcex_inline_style( array(
			'margin'         => $content_heading_margin,
			'font_size'      => $content_heading_size,
			'font_weight'    => $content_heading_weight,
			'text_transform' => $content_heading_transform,
			'line_height'    => $content_heading_line_height,
			'color'          => $content_heading_color,
		) );
		$heading_link_style = vcex_inline_style( array(
			'color' => $content_heading_color,
		) );
	} ?>

	<?php
	// Open WooCommerce wrap
	if ( $entry_output == 'woocommerce' ) : ?>
		<div class="woocommerce clr">
	<?php endif; ?>

	<?php
	// Sanitize carousel data to prevent errors
	$items                  = $items ? $items : 4;
	$items_scroll           = $items_scroll ? $items_scroll : 1;
	$arrows                 = $arrows ? $arrows : 'true';
	$dots                   = $dots ? $dots : 'false';
	$auto_play              = $auto_play ? $auto_play : 'false';
	$infinite_loop          = $infinite_loop ? $infinite_loop : 'true';
	$timeout_duration       = $timeout_duration ? $timeout_duration : 5000;
	$center                 = $center ? $center : 'false';
	$items_margin           = $items_margin ? $items_margin : 15;
	$items_margin           = 'no-margins' == $style ? '0' : $items_margin;
	$tablet_items           = $tablet_items ? $tablet_items : 3;
	$mobile_landscape_items = $mobile_landscape_items ? $mobile_landscape_items : 2;
	$mobile_portrait_items  = $mobile_portrait_items ? $mobile_portrait_items : 1;
	$animation_speed        = $animation_speed ? $animation_speed : 150; ?>

	<ul class="woocommerce <?php echo $wrap_classes; ?>"<?php vcex_unique_id( $unique_id ); ?> data-items="<?php echo $items; ?>" data-slideby="<?php echo $items_scroll; ?>" data-nav="<?php echo $arrows; ?>" data-dots="<?php echo $dots; ?>" data-autoplay="<?php echo $auto_play; ?>" data-smart-speed="<?php echo $animation_speed; ?>" data-loop="<?php echo $infinite_loop; ?>" data-autoplay-timeout="<?php echo $timeout_duration; ?>" data-center="<?php echo $center; ?>" data-margin="<?php echo intval( $items_margin ); ?>" data-items-tablet="<?php echo $tablet_items; ?>" data-items-mobile-landscape="<?php echo $mobile_landscape_items; ?>" data-items-mobile-portrait="<?php echo $mobile_portrait_items; ?>" data-smart-speed="<?php echo $animation_speed; ?>">

		<?php
		// Loop through posts
		while ( $wpex_query->have_posts() ) :

			// Get post from query
			$wpex_query->the_post();

			// Create new post object.
			$post = new stdClass();

			// Get post data
			$get_post = get_post(); ?>

			<div class="wpex-carousel-slide">

				<?php
				// Display standard woo style posts
				if ( $entry_output == 'woocommerce' ) : ?>

					<?php
					// Get woocommerce template part
					woocommerce_get_template_part( 'content', 'product' ); ?>

				<?php
				// Custom output (default)
				else : ?>

					<?php
					// Post VARS
					$post->ID        = $get_post->ID;
					$post->title     = $get_post->post_title;
					$post->permalink = wpex_get_permalink( $post->ID );

					// Generate thumbnail
					$post->thumbnail = wpex_get_post_thumbnail( array(
						'size'   => $img_size,
						'crop'   => $img_crop,
						'width'  => $img_width,
						'height' => $img_height,
						'alt'    => wpex_get_esc_title(),
					) );

					// Check if onsale
					$is_on_sale = false;
					if ( class_exists( 'WC_Product' ) ) {
						$product = new WC_Product( $post->ID );
						if (  $product->is_on_sale() ) {
							$is_on_sale = true;
						}
					} ?>

					<?php
					// Media Wrap
					if ( has_post_thumbnail() ) : ?>

						<div class="<?php echo $media_classes; ?>">

							<?php
							// Onsale text
							if ( $is_on_sale ) : ?>

								<?php echo apply_filters( 'woocommerce_sale_flash', '<span class="onsale">' . esc_html__( 'Sale', 'total' ) . '</span>', $post, $product ); ?>

							<?php endif; ?>

							<?php
							// No links
							if ( 'none' == $thumbnail_link) : ?>

								<?php echo $post->thumbnail; ?>

							<?php
							// Lightbox
							elseif ( 'lightbox' == $thumbnail_link ) : ?>

								<a href="<?php wpex_lightbox_image(); ?>" title="<?php wpex_esc_title(); ?>" class="wpex-carousel-entry-img wpex-lightbox">

									<?php echo $post->thumbnail; ?>

							<?php
							// Link to post
							else : ?>

								<a href="<?php echo $post->permalink; ?>" title="<?php wpex_esc_title(); ?>" class="wpex-carousel-entry-img">
									
									<?php echo $post->thumbnail; ?>

							<?php endif; ?>

							<?php
							// Overlay & close link
							if ( ! in_array( $thumbnail_link, array( 'none', 'nowhere' ) ) ) : ?>

								<?php
								// Inner Overlay
								if ( $overlay_style ) : ?>

									<?php wpex_overlay( 'inside_link', $overlay_style ); ?>

								<?php endif; ?>

								<?php
								// Close link
								echo '</a><!-- .wpex-carousel-entry-img -->'; ?>

								<?php
								// Outside Overlay
								if ( $overlay_style ) : ?>

									<?php wpex_overlay( 'outside_link', $overlay_style ); ?>

								<?php endif ?>

							<?php endif; ?>

						</div><!-- .wpex-carousel-entry-media -->

					<?php endif; // Thumbnail check ?>

					<?php
					// Title
					if ( 'true' == $title || 'true' == $price ) : ?>

						<div class="wpex-carousel-entry-details textcenter clr"<?php echo $content_style; ?>>

							<?php
							// Title
							if ( 'true' == $title && $post->title ) : ?>

								<div class="wpex-carousel-entry-title entry-title"<?php echo $heading_style; ?>>
									<a href="<?php echo $post->permalink; ?>" title="<?php wpex_esc_title(); ?>"<?php echo $heading_link_style; ?>><?php echo $post->title; ?></a>
								</div><!-- .wpex-carousel-entry-title -->

							<?php endif; ?>

							<?php
							// Excerpt
							if ( 'true' == $price && $get_price = wpex_get_woo_product_price() ) : ?>
								
								<div class="wpex-carousel-entry-price price clr"<?php echo $price_style; ?>>
									<?php echo $get_price; ?>
								</div><!-- .wpex-carousel-entry-price -->

							<?php endif; ?>

						</div><!-- .wpex-carousel-entry-details -->

					<?php endif; ?>

				<?php endif; ?>

			</div><!-- .wpex-carousel-slide -->

		<?php endwhile; ?>

	</ul><!-- .wpex-carousel -->

	<?php
	// Close WooCommerce wrap
	if ( $entry_output == 'woocommerce' ) echo '</div>'; ?>

	<?php
	// Remove post object from memory
	$post = null;

	// Reset the post data to prevent conflicts with WP globals
	wp_reset_postdata(); ?>

<?php
// If no posts are found display message
else : ?>

	<?php
	// Display no posts found error if function exists
	echo vcex_no_posts_found_message( $atts ); ?>

<?php
// End post check
endif; ?>