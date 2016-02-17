<?php
/**
 * Visual Composer Portfolio Carousel
 *
 * @package Total WordPress Theme
 * @subpackage VC Templates
 * @version 3.0.0
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

// Define attributes
$atts['post_type'] = 'portfolio';
$atts['taxonomy']  = 'portfolio_category';
$atts['tax_query'] = '';

// Build the WordPress query
$wpex_query = vcex_build_wp_query( $atts );

//Output posts
if ( $wpex_query->have_posts() ) :

	// Extract attributes
	extract( $atts );

	// IMPORTANT: Fallback required from VC update when params are defined as empty
	// AKA - set things to enabled by default
	$media   = ( ! $media ) ? 'true' : $media;
	$title   = ( ! $title ) ? 'true' : $title;
	$excerpt = ( ! $excerpt ) ? 'true' : $excerpt;

	// Load scripts
	$inline_js = array( 'carousel' );
	if ( 'lightbox' == $thumbnail_link ) {
		vcex_enque_style( 'ilightbox' );
		$inline_js[] = 'ilightbox';
	}
	vcex_inline_js( $inline_js );

	// Disable auto play if there is only 1 post
	if ( '1' == count( $wpex_query->posts ) ) {
		$auto_play = false;
	}

	// Prevent auto play in visual composer
	if ( vc_is_inline() ) {
		$auto_play = 'false';
	}

	// Item Margin
	if ( 'no-margins' == $style ) {
		$items_margin = '0';
	}

	// Items to scroll fallback for old setting
	if ( 'page' == $items_scroll ) {
		$items_scroll = $items;
	}

	// Main Classes
	$wrap_classes = array( 'wpex-carousel', 'wpex-carousel-portfolio', 'clr', 'owl-carousel' );
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
	$wrap_classes = implode( ' ', $wrap_classes );

	// Entry media classes
	$media_classes = array( 'wpex-carousel-entry-media', 'clr' );
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
		'font_size'  => $content_font_size,
		'color'      => $content_color,
		'opacity'    => $content_opacity,
		'text_align' => $content_alignment,
	) );

	// Title design
	$heading_style = vcex_inline_style( array(
		'margin'         => $content_heading_margin,
		'text_transform' => $content_heading_transform,
		'font_size'      => $content_heading_size,
		'font_weight'    => $content_heading_weight,
		'line_height'    => $content_heading_line_height,
	) );

	// Heading color
	$content_heading_color = vcex_inline_style( array(
		'color' => $content_heading_color,
	) );

	// Sanitize carousel data to prevent errors
	$items                  = $items ? $items : 4;
	$items_scroll           = $items_scroll ? $items_scroll : 1;
	$arrows                 = $arrows ? $arrows : 'true';
	$dots                   = $dots ? $dots : 'false';
	$auto_play              = $auto_play ? $auto_play : 'false';
	$infinite_loop          = $infinite_loop ? $infinite_loop : 'true';
	$timeout_duration       = $timeout_duration ? $timeout_duration : 5000;
	$center                 = $center ? $center : 'false';
	$items_margin           = $items_margin ? absint( $items_margin ) : 15;
	$items_margin           = 'no-margins' == $style ? 0 : $items_margin;
	$tablet_items           = $tablet_items ? $tablet_items : 3;
	$mobile_landscape_items = $mobile_landscape_items ? $mobile_landscape_items : 2;
	$mobile_portrait_items  = $mobile_portrait_items ? $mobile_portrait_items : 1;
	$animation_speed        = $animation_speed ? absint( $animation_speed ) : 150; ?>

	<div class="<?php echo $wrap_classes; ?>"<?php vcex_unique_id( $unique_id ); ?> data-items="<?php echo $items; ?>" data-slideby="<?php echo $items_scroll; ?>" data-nav="<?php echo $arrows; ?>" data-dots="<?php echo $dots; ?>" data-autoplay="<?php echo $auto_play; ?>" data-loop="<?php echo $infinite_loop; ?>" data-autoplay-timeout="<?php echo $timeout_duration ?>" data-center="<?php echo $center; ?>" data-margin="<?php echo intval( $items_margin ); ?>" data-items-tablet="<?php echo $tablet_items; ?>" data-items-mobile-landscape="<?php echo $mobile_landscape_items; ?>" data-items-mobile-portrait="<?php echo $mobile_portrait_items; ?>" data-smart-speed="<?php echo $animation_speed; ?>">
		<?php
		// Start loop
		while ( $wpex_query->have_posts() ) :

			// Get post from query
			$wpex_query->the_post();

			// Create new post object
			$post = new stdClass();

			// Get post data
			$get_post = get_post();
		
			// Post VARS
			$post->ID        = $get_post->ID;
			$post->permalink = wpex_get_permalink( $post->ID );
			$post->the_title = get_the_title( $post->ID ); ?>

			<div class="wpex-carousel-slide">

				<?php
				// Display media
				if ( 'true' == $media && has_post_thumbnail() ) : ?>
					
					<?php
					// Image html
					$img_html = wpex_get_post_thumbnail( array(
						'size'   => $img_size,
						'crop'   => $img_crop,
						'width'  => $img_width,
						'height' => $img_height,
						'alt'    => wpex_get_esc_title(),
					) ); ?>

					<div class="<?php echo $media_classes; ?>">

						<?php
						// No links
						if ( 'none' == $thumbnail_link ) : ?>

							<?php echo $img_html; ?>

						<?php
						// Lightbox
						elseif ( 'lightbox' == $thumbnail_link ) : ?>
							<a href="<?php wpex_lightbox_image(); ?>" title="<?php wpex_esc_title(); ?>" class="wpex-carousel-entry-img wpex-lightbox">

								<?php echo $img_html; ?>

						<?php
						// Link to post
						else : ?>

							<a href="<?php echo $post->permalink; ?>" title="<?php wpex_esc_title(); ?>" class="wpex-carousel-entry-img">

								<?php echo $img_html; ?>

						<?php endif; ?>

						<?php
						// Overlay & close link
						if ( 'none' != $thumbnail_link ) {
							// Inner Overlay
							if ( $overlay_style ) {
								wpex_overlay( 'inside_link', $overlay_style, $atts );
							}
							// Close link
							echo '</a><!-- .wpex-carousel-entry-img -->';
							// Outside Overlay
							if ( $overlay_style ) {
								wpex_overlay( 'outside_link', $overlay_style, $atts );
							}
						} ?>

					</div><!-- .wpex-carousel-entry-media -->

				<?php endif; ?>

				<?php if ( 'true' == $title || 'true' == $excerpt ) : ?>

					<div class="wpex-carousel-entry-details clr"<?php echo $content_style; ?>>

						<?php
						// Title
						if ( 'true' == $title && $post->the_title ) : ?>

							<div class="wpex-carousel-entry-title entry-title"<?php echo $heading_style; ?>>
								<a href="<?php echo $post->permalink; ?>" title="<?php wpex_esc_title(); ?>"<?php echo $content_heading_color; ?>><?php echo $post->the_title; ?></a>
							</div><!-- .wpex-carousel-entry-title -->

						<?php endif; ?>

						<?php
						// Excerpt
						if ( 'true' == $excerpt ) :

							// Generate excerpt
							$post->excerpt = wpex_get_excerpt( array (
								'length' => intval( $excerpt_length ),
							) );

							if ( $post->excerpt ) { ?>

								<div class="wpex-carousel-entry-excerpt clr">
									<?php echo $post->excerpt; ?>
								</div><!-- .wpex-carousel-entry-excerpt -->

							<?php } ?>

						<?php endif; ?>

					</div><!-- .wpex-carousel-entry-details -->

				<?php endif; ?>

			</div><!-- .wpex-carousel-slide -->

		<?php endwhile; ?>

	</div><!-- .wpex-carousel -->

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