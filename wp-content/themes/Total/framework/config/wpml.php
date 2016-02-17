<?php
/**
 * WPML Configuration Class
 *
 * @package Total WordPress Theme
 * @subpackage Configs
 */

global $wpml_config;

if ( ! class_exists( 'WPEX_WPML_Config' ) ) {

	class WPEX_WPML_Config {

		/**
		 * Start things up
		 *
		 * @since 1.6.0
		 */
		public function __construct() {

			// Add Actions
			add_action( 'admin_init', array( $this, 'register_strings' ) );
			add_filter( 'body_class', array( $this, 'body_class' ) );

			// Add Filters
			add_filter( 'upload_dir', array( $this, 'convert_base_url' ) );
			add_filter( 'wpex_toggle_bar_content_id', array( $this, 'toggle_bar_content_id' ) );

			// Register shortcodes
			add_shortcode( 'wpml_translate', array( $this, 'translate_shortcode' ) );
			add_shortcode( 'wpml_lang_selector', array( $this, 'switcher_shortcode' ) );

		}

		/**
		 * Registers theme_mod strings into WPML
		 *
		 * @since 1.6.0
		 */
		public function register_strings() {
			if ( function_exists( 'icl_register_string' ) && $strings = wpex_register_theme_mod_strings() ) {
				foreach( $strings as $string => $default ) {
					icl_register_string( 'Theme Mod', $string, get_theme_mod( $string, $default ) );
				}
			}
		}

		/**
		 * Registers theme_mod strings into WPML
		 *
		 * @since 3.0.0
		 */
		public function body_class( $classes ) {
			if ( defined( 'ICL_LANGUAGE_CODE' ) ) {
				$classes[] = 'wpml-language-'. ICL_LANGUAGE_CODE;
			}
			return $classes;
		}

		/**
		 * Fix for when users have the Language URL Option on "different domains"
		 * which causes cropped images to fail.
		 * Runs if 'WPML_SUNRISE_MULTISITE_DOMAINS' constant is defined
		 *
		 * @since 1.6.0
		 */
		public function convert_base_url( $param ) {

			// Check if WPML is set to multisite domains
			if ( defined( 'WPML_SUNRISE_MULTISITE_DOMAINS' ) ) {
				global $sitepress;
				if ( $sitepress ) {
					// Convert upload directory base URL to correct language 
					$param['baseurl'] = $sitepress->convert_url( $param['baseurl'] );
				}
			}

			// Return param
			return $param;

		}

		/**
		 * Converts toggle page ID to WPML compatible ID
		 *
		 * @since 1.6.0
		 */
		public function toggle_bar_content_id( $id ) {
			if ( function_exists( 'icl_object_id' ) && defined( 'ICL_LANGUAGE_CODE' ) ) {
				$id = icl_object_id( $id, 'page', false, ICL_LANGUAGE_CODE );
			}
			return $id;
		}

		/**
		 * WPML Translation Shortcode
		 *
		 * [wpml_translate lang=es]Hola[/wpml_translate]
		 * [wpml_translate lang=en]Hello[/wpml_translate]
		 *
		 * @since 1.6.0
		 */
		public function translate_shortcode( $atts, $content = null ) {
			extract( shortcode_atts( array(
				'lang'	=> '',
			), $atts ) );
			$lang_active = ICL_LANGUAGE_CODE;
			if ( $lang == $lang_active ) {
				return do_shortcode( $content );
			}
		}

		/**
		 * Language switcher plugin
		 *
		 * @since 1.6.0
		 */
		public function switcher_shortcode( $atts, $content = null ) {
			do_action( 'icl_language_selector' );
		}

	}
	
}
$wpml_config = new WPEX_WPML_Config();