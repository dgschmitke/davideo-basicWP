<?php
/**
 * Visual Composer Divider
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

// Get and extract shortcode attributes
extract( vc_map_get_attributes( $this->getShortcode(), $atts ) );

// Sanitize data
$icon = vcex_get_icon_class( $atts, 'icon' );
$height = $height ? wpex_sanitize_data( $height, 'px' ) : '';
$icon_padding = ( $icon_height || $icon_width ) ? '' : $icon_padding;
$dotted_height = ( 'dotted' == $style ) ? $dotted_height : '';
$dotted_height = ( $icon ) ? '' : $dotted_height;

// Wrapper classes
$wrap_classes = array( 'vcex-divider' );
if ( $style ) {
	$wrap_classes[] = 'vcex-divider-'. $style;
}
if ( $css_animation ) {
	$wrap_classes[] = $this->getCSSAnimation( $css_animation );
}
if ( $el_class ) {
	$wrap_classes[] = $this->getExtraClass( $el_class );
}
if ( $align ) {
	$wrap_classes[] = 'vcex-divider-'. $align;
}
if ( $visibility ) {
	$wrap_classes[] = $visibility;
}
if ( $icon_height ) {
	$wrap_classes[] = 'vcex-divider-custom-icon-height';
}
if ( $icon_width ) {
	$wrap_classes[] = 'vcex-divider-custom-icon-width';
}
if ( $icon_bg ) {
	$wrap_classes[] = 'vcex-divider-icon-has-bg';
}
if ( 'dotted' == $style & ! $icon ) {
	$wrap_classes[] = 'repeat-bg';
}

// If icon exists
if ( $icon ) {

	// Add special class to wrapper
	$wrap_classes[] = 'vcex-divider-w-icon';

	// Load icon font family
	vc_icon_element_fonts_enqueue( $icon_type );

	// Icon style
	$icon_style = vcex_inline_style( array(
		'font_size'     => $icon_size,
		'border_radius' => $icon_border_radius,
		'color'         => $icon_color,
		'background'    => $icon_bg,
		'padding'       => $icon_padding,
		'height'        => $icon_height,
		'line_height'   => wpex_sanitize_data( $icon_height, 'px' ),
		'width'         => $icon_width,
	) );

	// Border style
	$vcex_inner_border_style = '';
	if ( 'dotted' != $style ) {
		$border_top_width   = ( 'double' == $style ) ? $height : '';
		$top_margin         = ( $height ) ? $height / 2 : '';
		$top_margin         = ( $height && 'double' == $style ) ? ( ( $height * 2 ) + 4 ) / 2 : $top_margin;
		$vcex_inner_border_style = vcex_inline_style( array(
			'border_color'        => $color,
			'border_bottom_width' => $height,
			'border_top_width'    => $border_top_width,
			'margin_top'          => - $top_margin,
		) );
	}

	// Reset vars if icon is defined so styles aren't duplicated in main wrapper
	$height = $color = '';

}

// Main style
$botttom_height = ( 'double' == $style ) ? $height : '';
$wrap_style = vcex_inline_style( array(
	'height'              => $dotted_height,
	'width'               => $width,
	'margin_top'          => $margin_top,
	'margin_bottom'       => $margin_bottom,
	'border_top_width'    => $height,
	'border_bottom_width' => $botttom_height,
	'border_color'        => $color,
) );

// Turn wrap classes into a string
$wrap_classes = implode( ' ', $wrap_classes ); ?>

<div class="<?php echo esc_attr( $wrap_classes ); ?>"<?php echo $wrap_style; ?>>
	<?php if ( $icon ) : ?>
		<div class="vcex-divider-icon">
			<?php if ( 'dotted' != $style ) { ?>
				<span class="vcex-divider-icon-before"<?php echo $vcex_inner_border_style; ?>></span>
			<?php } ?>
			<span class="vcex-icon-wrap"<?php echo $icon_style; ?>><span class="<?php echo $icon; ?>"></span></span>
			<?php if ( 'dotted' != $style ) { ?>
				<span class="vcex-divider-icon-after"<?php echo $vcex_inner_border_style; ?>></span>
			<?php } ?>
		</div><!-- .vcex-divider-icon -->
	<?php endif; ?>
</div><!-- .vcex-divider -->

<?php
// Clear float
if ( 'left' == $align || 'right' == $align ) echo '<div class="wpex-clear"></div>';