<?php
/**
 * Used for generating custom layouts CSS
 *
 * @package Total WordPress Theme
 * @subpackage Framework
 * @version 3.3.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Start Class
if ( ! class_exists( 'WPEX_Advanced_Styling' ) ) {
	
	class WPEX_Advanced_Styling {

		/**
		 * Main constructor
		 *
		 * @since 2.0.0
		 */
		public function __construct() {
			add_filter( 'wpex_head_css', array( $this, 'generate' ), 999 );
		}

		/**
		 * Generates the CSS output
		 *
		 * @since 2.0.0
		 */
		public static function generate( $output ) {

			// Define main variables
			$css = '';

			// Fix for Fonts In the Visual Composer
			if ( wpex_global_obj( 'vc_is_inline' ) ) {
				$css .='.wpb_row .fa:before { box-sizing:content-box!important; -moz-box-sizing:content-box!important; -webkit-box-sizing:content-box!important; }';
			}

			// Fixes for full-width layout when custom background is added
			if ( 'full-width' == wpex_global_obj( 'main_layout' )
				&& ( wpex_get_mod( 'background_color' ) || wpex_get_mod( 'background_image' ) )
			) {
				$css .= '.wpex-sticky-header-holder{background:none;}';
			}

			// Remove header border if custom color is set
			if ( wpex_get_mod( 'header_background' ) ) {
				$css .='.is-sticky #site-header{border-color:transparent;}';
			}

			// Overlay Header font size
			if ( wpex_global_obj( 'has_overlay_header' )
				&& $font_size = get_post_meta( wpex_global_obj( 'post_id' ), 'wpex_overlay_header_font_size', true ) 
			) {
				$css .='#site-navigation, #site-navigation .dropdown-menu a{font-size:'. intval( $font_size ) .'px;}';
			}
			
			/*-----------------------------------------------------------------------------------*/
			/*  - Return CSS
			/*-----------------------------------------------------------------------------------*/
			if ( ! empty( $css ) ) {
				$output .= '/*ADVANCED STYLING CSS*/'. $css;
			}

			// Return output css
			return $output;

		}

	}

}
new WPEX_Advanced_Styling();