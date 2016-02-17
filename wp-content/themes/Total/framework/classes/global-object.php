<?php
/**
 * Creates a global object for the theme's main function, layout, design, etc.
 *
 * @package Total WordPress Theme
 * @subpackage Framework
 * @version 3.3.2
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Class
 *
 * @since 3.0.0
 */
class WPEX_Global_Theme_Object {

	/**
	 * vc_css_ids variable
	 *
	 * Save array of post ids that need fetching to load VC css classes
	 *
	 * @since 3.0.0
	 */
	public $vc_css_ids = array();

	/**
	 *  Constructor
	 *
	 * @since 3.0.0
	 */
	public function __construct() {

		// Loop through methods and save vars
		$methods = get_class_methods( $this );
		foreach ( $methods as $method ) {
			if ( '__construct' != $method ) {
				$this->$method = $this->$method();
			}
		}

		// Apply filters to $vc_css_ids after loop
		$this->vc_css_ids = apply_filters( 'wpex_vc_css_ids', $this->vc_css_ids );
	}

	/**
	 * Store current post ID
	 *
	 * @since 3.0.0
	 */
	private function post_id() {

		// If singular get_the_ID
		if ( is_singular() ) {
			return get_the_ID();
		}

		// Get ID of WooCommerce product archive
		elseif ( WPEX_WOOCOMMERCE_ACTIVE && is_shop() ) {
			$shop_id = wc_get_page_id( 'shop' );
			if ( isset( $shop_id ) ) {
				return $shop_id;
			}
		}

		// Posts page
		elseif ( is_home() && $page_for_posts = get_option( 'page_for_posts' ) ) {
			return $page_for_posts;
		}

		// Return nothing
		else {
			return NULL;
		}

	}

	/**
	 * Returns correct theme skin
	 *
	 * @since 3.0.0
	 */
	private function skin() {
		if ( function_exists( 'wpex_active_skin' ) ) {
			return wpex_active_skin();
		}
	}

	/**
	 * Checks if the current post/page is using the Visual Composer
	 *
	 * @since 3.0.0
	 */
	private function has_composer() {
		if ( WPEX_VC_ACTIVE && $this->post_id ) {
			$post_content = get_post_field( 'post_content', $this->post_id );
			if ( $post_content && strpos( $post_content, 'vc_row' ) ) {
				return true;
			} else {
				return false;
			}
		}
	}

	/**
	 * Checks if we are in the front-end composer mode
	 *
	 * @since 3.0.0
	 */
	private function vc_is_inline() {
		if ( function_exists( 'vc_is_inline' ) ) {
			return vc_is_inline();
		}
	}

	/**
	 * Checks if retina is enabled
	 *
	 * @since 3.0.0
	 */
	private function retina() {
		if ( wpex_get_mod( 'image_resizing', true ) ) {
			return wpex_get_mod( 'retina' );
		}
	}

	/**
	 * Main Layout Style
	 *
	 * @since 3.0.0
	 */
	private function main_layout() {

		// Check URL
		if ( ! empty( $_GET['site_layout'] ) ) {
			return $_GET['site_layout'];
		}

		// Get layout
		$layout = wpex_get_mod( 'main_layout_style' );
		$layout = $layout ? $layout : 'full-width';
		$meta   = get_post_meta( $this->post_id, 'wpex_main_layout', true );
		$layout = $meta ? $meta : $layout;

		// Apply filters and return
		return apply_filters( 'wpex_main_layout', $layout );

	}

	/**
	 * Checks if responsive is enabled
	 *
	 * @since 3.0.0
	 */
	private function responsive() {
		return wpex_get_mod( 'responsive', true );
	}

	/**
	 * Returns correct post layout
	 *
	 * @since 3.0.0
	 */
	private function post_layout() {

		// Check URL
		if ( ! empty( $_GET['post_layout'] ) ) {
			return $_GET['post_layout'];
		}

		// Define variables
		$class  = 'right-sidebar';
		$meta   = get_post_meta( $this->post_id, 'wpex_post_layout', true );

		// Check meta first to override and return (prevents filters from overriding meta)
		if ( $meta ) {
			return $meta;
		}

		// Singular Page
		if ( is_page() ) {

			// Blog template
			if ( is_page_template( 'templates/blog.php' ) ) {
				$class = wpex_get_mod( 'blog_archives_layout', 'right-sidebar' );
			}

			// Landing Page
			if ( is_page_template( 'templates/landing-page.php' ) ) {
				$class = 'full-width';
			}

			// Attachment
			elseif ( is_attachment() ) {
				$class = 'full-width';
			}

			// All other pages
			else {
				$class = wpex_get_mod( 'page_single_layout', 'right-sidebar' );
			}

		}

		// Singular Post
		elseif ( is_singular( 'post' ) ) {

			$class = wpex_get_mod( 'blog_single_layout', 'right-sidebar' );

		}

		// Attachment
		elseif ( is_singular( 'attachment' ) ) {

			 $class = 'full-width';

		}

		// Home
		elseif ( is_home() ) {
			$class = wpex_get_mod( 'blog_archives_layout', 'right-sidebar' );
		}

		// Search
		elseif ( is_search() ) {
			$class = get_theme_mod( 'search_layout', 'right-sidebar' );
		}

		// Standard Categories
		elseif ( is_category() ) {
			$class     = wpex_get_mod( 'blog_archives_layout', 'right-sidebar' );
			$term      = get_query_var( 'cat' );
			$term_data = get_option( "category_$term" );
			if ( $term_data ) {
				if( ! empty( $term_data['wpex_term_layout'] ) ) {
					$class = $term_data['wpex_term_layout'];
				}
			}
		}

		// Archives
		elseif ( wpex_is_blog_query() ) {
			$class = wpex_get_mod( 'blog_archives_layout', 'right-sidebar' );
		}
		
		// 404 page
		elseif ( is_404() ) {
			$class = 'full-width';
		}

		// All else
		else {
			$class = 'right-sidebar';
		}

		// Class should never be empty
		if ( empty( $class ) ) {
			$class = 'right-sidebar';
		}

		// Apply filters and return
		return apply_filters( 'wpex_post_layout_class', $class );

	} // End post_layout

	/**
	 * Checks if header is enabled
	 *
	 * @since 3.0.0
	 */
	private function has_header() {

		// Return true by default
		$return = true;

		// Check if disabled via meta option
		if ( 'on' == get_post_meta( $this->post_id, 'wpex_disable_header', true ) ) {
			$return = false;
		}

		// Apply filters and return
		return apply_filters( 'wpex_display_header', $return );

	}

	/**
	 * Checks if header overlay is enabled
	 *
	 * @since 3.0.0
	 */
	private function has_overlay_header() {

		// Return false if header is disabled
		if ( ! $this->has_header ) {
			return false;
		}

		// Return false by default
		$return = false;

		// Return true if enabled via the post meta
		if ( $this->post_id && 'on' == get_post_meta( $this->post_id, 'wpex_overlay_header', true ) ) {
			$return = true;
		}

		// Apply filters and return
		return apply_filters( 'wpex_has_overlay_header', $return );

	}

	/**
	 * Header overlay style
	 *
	 * @since 3.0.0
	 */
	private function header_overlay_style() {
		return get_post_meta( $this->post_id, 'wpex_overlay_header_style', true );
	}
	
	/**
	 * Returns header style
	 *
	 * @since 3.0.0
	 */
	private function header_style() {

		// Check URL
		if ( ! empty( $_GET['header_style'] ) ) {
			return $_GET['header_style'];
		}

		// Get header style from customizer setting
		$style = wpex_get_mod( 'header_style', 'one' );

		// Overlay header only supports header styles 1 and five
		if ( $this->has_overlay_header && $style !== 'five' ) {
			$style = 'one';
		}

		// Check for custom header style defined in meta options => Overrides all
		if ( $meta = get_post_meta( $this->post_id, 'wpex_header_style', true ) ) {
			$style = $meta;
		}

		// Sanitize style to make sure it isn't empty
		$style = $style ? $style : 'one';

		// Apply filters and return
		return apply_filters( 'wpex_header_style', $style );

	}

	/**
	 * Returns header logo
	 *
	 * @since 3.0.0
	 */
	private function header_logo() {
		$logo = wpex_get_translated_theme_mod( 'custom_logo' );
		$logo = str_replace( 'http:', '', $logo );
		$logo = apply_filters( 'wpex_header_logo_img_url', $logo );
		return $logo;
	}

	/**
	 * Returns retina header logo
	 *
	 * @since 3.0.0
	 */
	private function retina_header_logo() {
		return wpex_get_translated_theme_mod( 'retina_logo' );
	}

	/**
	 * Returns header logo
	 *
	 * @since 3.0.0
	 */
	private function fixed_header_logo() {
		return apply_filters( 'wpex_fixed_header_logo', wpex_get_mod( 'fixed_header_logo' ) );
	}

	/**
	 * Check if has fixed header
	 *
	 * @since 3.0.0
	 */
	private function has_fixed_header() {
		if ( is_customize_preview() ) {
			$return = false;
		} elseif ( $this->vc_is_inline ) {
			$return = false;
		} elseif ( wpex_get_mod( 'fixed_header', true ) ) {
			$return = true;
		} else {
			$return = false;
		}
		if ( 'six' == $this->header_style ) {
			$return = false; // disabled for header six
		}
		return apply_filters( 'wpex_has_fixed_header', $return );
	}

	/**
	 * Check if shrink fixed header is enabled
	 * Only enabled for header styles one and five
	 *
	 * @since 3.0.0
	 */
	private function shrink_fixed_header() {
		if ( 'one' == $this->header_style || 'five' == $this->header_style ) {
			return wpex_get_mod( 'shink_fixed_header', true );
		} else {
			return false;
		}
	}

	/**
	 * Header Aside Content check so we can load custom CSS from the customizer
	 *
	 * @since 3.0.0
	 */
	private function header_aside_content() {

		// Not needed here
		if ( ! wpex_header_supports_aside( $this->header_style ) ) {
			return;
		}

		// Get header aside content
		$content = wpex_get_translated_theme_mod( 'header_aside' );

		// Check if content is a page ID and get page content
		if ( is_numeric( $content ) ) {
			$post_id = $content;
			$post = get_post( $post_id );
			if ( $post && ! is_wp_error( $post ) ) {
				$content = $post->post_content;
				$this->vc_css_ids[$post_id] = $post_id;
			}
		}

		// Apply filters and return content
		return apply_filters( 'wpex_header_aside_content', $content );

	}

	/**
	 * Returns lightbox skin
	 *
	 * @since 3.0.0
	 */
	private function lightbox_skin() {
		if ( function_exists( 'wpex_ilightbox_skin' ) ) {
			return wpex_ilightbox_skin();
		}
	}

	/**
	 * Returns mobile menu style
	 *
	 * @since 3.0.0
	 */
	private function mobile_menu_style() {

		// Get style defined in Customizer
		$style = wpex_get_mod( 'mobile_menu_style', 'sidr' );

		// Sanitize
		$style = $style ? $style : 'sidr';

		// Toggle style not supported when overlay header is enabled
		if ( 'toggle' == $style && $this->has_overlay_header ) {
			$style = 'sidr'; //@todo: Update to allow toggle style
		}

		// Disable if responsive is disabled
		$style = $this->responsive ? $style : 'disabled';

		// Apply filters and return
		return apply_filters( 'wpex_mobile_menu_style', $style );

	}

	/**
	 * Returns mobile menu toggle style
	 *
	 * @since 3.0.0
	 */
	private function mobile_menu_toggle_style() {

		// Not needed if mobile menu style is disabled
		if ( 'disabled' == $this->mobile_menu_style ) {
			return null;
		}

		// Get style
		$style = wpex_get_mod( 'mobile_menu_toggle_style' );

		// Overlay should NOT have navbar style - bad - set to Fixed Top Instead
		if ( ( 'navbar' == $style || 'fixed_top' == $style ) && $this->has_overlay_header ) {
			$style = 'icon_buttons'; //@todo: Update to allow other styles
		}

		// Sanitize
		$style = $style ? $style : 'icon_buttons';

		// Apply filters and return style
		return apply_filters( 'wpex_mobile_menu_toggle_style', $style );

	}

	/**
	 * Check if the mobile menu is enabled or not
	 *
	 * @since 2.1.04
	 */
	function has_mobile_menu() {
		if ( 'disabled' != $this->mobile_menu_style ) {
			return true;
		}
	}

	/**
	 * Returns sidebar menu source
	 *
	 * @since 3.0.0
	 */
	private function sidr_menu_source() {

		// Only needed for sidr menu style
		if ( 'sidr' != $this->mobile_menu_style ) {
			return;
		}

		// Define array of items
		$items = array();

		// Add close button
		$items['sidrclose'] = '#sidr-close';

		// Add mobile menu alternative if defined
		if ( has_nav_menu( 'mobile_menu_alt' ) ) {
			$items['nav'] = '#mobile-menu-alternative';
		}

		// If mobile menu alternative is not defined add main navigation
		else {
			$items['nav'] = '#site-navigation';
		}

		// Add search form
		if ( wpex_get_mod( 'mobile_menu_search', true ) ) {
			$items['search'] = '#mobile-menu-search';
		}

		// Apply filters for child theming
		$items = apply_filters( 'wpex_mobile_menu_source', $items );

		// Turn items into comma seperated list and return
		return implode( ', ', $items );

	}

	/**
	 * Check if search is enabled in the menu
	 *
	 * @since 3.0.0
	 */
	private function has_menu_search() {
		return apply_filters( 'wpex_has_menu_search', true ); // Return true always now since 3.0.0
	}

	/**
	 * Returns menu search style
	 *
	 * @since 3.0.0
	 */
	private function menu_search_style() {

		// Return if search disabled from the menu
		if ( ! $this->has_menu_search ) {
			return;
		}

		// Get search style from Customizer
		$style = wpex_get_mod( 'menu_search_style', 'drop_down' );

		// Overlay header should use pop-up
		if ( 'disabled' != $style && ( $this->has_overlay_header || 'six' == $this->header_style ) ) {
			$style = 'overlay';
		}

		// Apply filters for advanced edits
		$style = apply_filters( 'wpex_menu_search_style', $style );

		// Sanitize output so it's not empty and return
		$style = $style ? $style : 'drop_down';

		// Return style
		return $style;

	}

	/**
	 * Returns header search style
	 *
	 * @since 3.0.0
	 */
	private function menu_cart_style() {

		// Return if WooCommerce isn't enabled or icon is disabled
		if ( ! WPEX_WOOCOMMERCE_ACTIVE || 'disabled' == wpex_get_mod( 'woo_menu_icon_display', 'icon_count' ) ) {
			return;
		}

		// Get Menu Icon Style
		$style = wpex_get_mod( 'woo_menu_icon_style', 'drop_down' );

		// Overlay header should use pop-up
		if ( $this->has_overlay_header || 'six' == $this->header_style ) {
			$style = 'overlay';
		}

		// Return click style for these pages
		if ( is_cart() || is_checkout() ) {
			$style = 'custom-link';
		}

		// Apply filters for advanced edits
		$style = apply_filters( 'wpex_menu_cart_style', $style );

		// Sanitize output so it's not empty
		if ( 'drop-down' == $style || ! $style ) {
			$style = 'drop_down';
		}

		// Return style
		return $style;

	}

	/**
	 * Returns correct post slider shortcode
	 *
	 * @since 1.6.0
	 */
	function post_slider_shortcode() {

		// Check for slider defined in custom fields
		if ( $slider = get_post_meta( $this->post_id, 'wpex_post_slider_shortcode', true ) ) {
			$slider = $slider;
		} elseif( get_post_meta( $this->post_id, 'wpex_page_slider_shortcode', true ) ) {
			$slider = get_post_meta( $this->post_id, 'wpex_page_slider_shortcode', true );
		}

		// Apply filters and return
		return apply_filters( 'wpex_post_slider_shortcode', $slider );

	}

	/**
	 * Returns post slider position
	 *
	 * @since 3.0.0
	 */
	private function post_slider_position() {

		// Default position is below the title
		$position = 'below_title';

		// Check meta field for position
		if ( $meta = get_post_meta( $this->post_id, 'wpex_post_slider_shortcode_position', true ) ) {
			$position = $meta;
		}

		// Apply filters and return
		return apply_filters( 'wpex_post_slider_position', $position, $meta );

	}

	/**
	 * Checks if the page has a slider
	 *
	 * @since 3.0.0
	 */
	private function has_post_slider() {

		// Check for shortcode
		if ( $this->post_slider_shortcode ) {
			$return = true;
		} else {
			$return = false;
		}

		// Apply filters and return
		return apply_filters( 'wpex_has_post_slider', $return );

	}

	/**
	 * Checks if the topbar is enabled
	 *
	 * @since 3.0.0
	 */
	private function has_top_bar() {

		// Return true by default
		$return = true;

		// Return false if disabled via Customizer
		if ( ! wpex_get_mod( 'top_bar', true ) ) {
			$return = false;
		}

		// Return false if disabled via post meta
		if ( 'on' == get_post_meta( $this->post_id, 'wpex_disable_top_bar', true ) ) {
			$return = false;
		}

		// Return false if disabled via post meta
		if ( 'enable' == get_post_meta( $this->post_id, 'wpex_disable_top_bar', true ) ) {
			$return = true;
		}

		// Apply filers and return
		return apply_filters( 'wpex_is_top_bar_enabled', $return );

	}

	/**
	 * Returns topbar content
	 *
	 * @since 3.0.0
	 */
	private function top_bar_content() {

		if ( ! $this->has_top_bar() ) {
			return null;
		}

		// Get topbar content from Customizer
		$content = wpex_get_mod( 'top_bar_content', '[font_awesome icon="phone" margin_right="5px" color="#000"] 1-800-987-654 [font_awesome icon="envelope" margin_right="5px" margin_left="20px" color="#000"] admin@totalwptheme.com [font_awesome icon="user" margin_right="5px" margin_left="20px" color="#000"] [wp_login_url text="User Login" logout_text="Logout"]' );

		// Translate the content
		$content = wpex_translate_theme_mod( 'top_bar_content', $content );

		// Check if content is a page ID and get page content
		if ( is_numeric( $content ) ) {
			$post_id = $content;
			$post = get_post( $post_id );
			if ( $post && ! is_wp_error( $post ) ) {
				$content = $post->post_content;
				$this->vc_css_ids[$post_id] = $post_id;
			}
		}

		// Apply filters and return content
		return apply_filters( 'wpex_top_bar_content', $content );

	}

	/**
	 * Returns topbar content
	 *
	 * @since 3.0.0
	 */
	private function top_bar_social_alt() {

		// Get mod
		$content = wpex_get_translated_theme_mod( 'top_bar_social_alt' );

		// Check if social_alt is a page ID and get page content
		if ( is_numeric( $content ) ) {
			$post_id = $content;
			$post = get_post( $post_id );
			if ( $post && ! is_wp_error( $post ) ) {
				$content = $post->post_content;
				$this->vc_css_ids[$post_id] = $post_id;
			}
		}

		// Return content
		return $content;

	}	

	/**
	 * Returns correct toggle_bar_content_id
	 *
	 * @since 3.0.0
	 */
	private function toggle_bar_content_id() {
		if ( $post_id = wpex_get_mod( 'toggle_bar_page' ) ) {
			$post_id = apply_filters( 'wpex_toggle_bar_content_id', $post_id );
			$this->vc_css_ids[$post_id] = $post_id;
			return $post_id;
		}
	}

	/**
	 * Checks if the topbar is enabled
	 *
	 * @since 3.0.0
	 */
	private function has_togglebar() {

		// Return if toggle bar page is not defined
		if ( ! $this->toggle_bar_content_id() ) {
			return false;
		}

		// Return true by default
		$return = true;

		// Disabled for front-end composer
		if ( $this->vc_is_inline ) {
			$return = false;
		}

		// Return false if disabled via the Customizer
		if ( ! wpex_get_mod( 'toggle_bar', true ) ) {
			$return = false;
		}

		// Return true if enabled via the page settings
		if ( 'enable' == get_post_meta( $this->post_id, 'wpex_disable_toggle_bar', true ) ) {
			$return = true;
		}

		// Return false if disabled via the page settings
		if ( 'on' == get_post_meta( $this->post_id, 'wpex_disable_toggle_bar', true ) ) {
			$return = false;
		}

		// Apply filters and return
		return apply_filters( 'wpex_toggle_bar_active', $return );

	} // End has_togglebar

	/**
	 * Returns page header style
	 *
	 * @since 3.0.0
	 */
	private function page_header_style() {

		// Get default page header style defined in Customizer
		$style = wpex_get_mod( 'page_header_style' );

		// Get for header style defined in page settings
		if ( $meta = get_post_meta( $this->post_id, 'wpex_post_title_style', true ) ) {
			$style = $meta;
		}

		// Sanitize data
		$style = ( 'default' == $style ) ? '' : $style;
		
		// Apply filters and return
		return apply_filters( 'wpex_page_header_style', $style );

	}

	/**
	 * Checks if the page header is enabled
	 *
	 * @since 3.0.0
	 */
	private function has_page_header() {
		
		// Define vars
		$return = true;
		$style  = $this->page_header_style;

		// Return if page header is disabled via custom field
		if ( $this->post_id ) {

			// Return if page header is disabled and there isn't a page header background defined
			if ( 'on' == get_post_meta( $this->post_id, 'wpex_disable_title', true )
				&& 'background-image' != $style ) {
				$return	= false;
			}

		}

		// Check if page header style is set to hidden
		if ( 'hidden' == $style ) {
			$return = false;
		}

		// Apply filters and return
		return apply_filters( 'wpex_display_page_header', $return );

	}

	/**
	 * Checks if the page header has a title
	 *
	 * @since 3.0.0
	 */
	private function has_page_header_title() {

		// Disable title if the page header is disabled via meta (ignore filter)
		if ( 'on' == get_post_meta( $this->post_id, 'wpex_disable_title', true ) ) {
			return false;
		}

		// Apply filters and return
		return apply_filters( 'wpex_has_page_header_title', true );

	}

	/**
	 * Returns page subheading
	 *
	 * @since 3.0.0
	 */
	private function get_page_subheading() {

		// Subheading is NULL by default
		$subheading = NULL;

		// Posts & Pages
		if ( $meta = get_post_meta( $this->post_id, 'wpex_post_subheading', true ) ) {
			$subheading = $meta;
		}

		// Search
		elseif ( is_search() ) {
			$subheading = esc_html__( 'You searched for:', 'total' ) .' &quot;'. esc_html( get_search_query( false ) ) .'&quot;';
		}

		// Categories
		elseif ( is_category() ) {
			if ( 'under_title' == wpex_get_mod( 'category_description_position', 'under_title' ) ) {
				$subheading = term_description();
			}
		}

		// Author
		elseif ( is_author() ) {
			$subheading = esc_html__( 'This author has written', 'total' ) .' '. get_the_author_posts() .' '. esc_html__( 'articles', 'total' );
		}

		// All other Taxonomies
		elseif ( is_tax() && ! wpex_has_term_description_above_loop() ) {
			$subheading = term_description();
		}

		// Apply filters and return
		return apply_filters( 'wpex_post_subheading', $subheading );

	}

	/**
	 * Checks if the page header has subheading
	 *
	 * @since 3.0.0
	 */
	private function has_page_header_subheading() {
		if ( $this->get_page_subheading ) {
			return true;
		}
	}

	/**
	 * Checks if breadcrumbs are enabled
	 *
	 * @since 3.0.0
	 */
	private function has_breadcrumbs() {

		// Return true by default
		$return = true;

		// Check if disabled by theme options
		if ( ! wpex_get_mod( 'breadcrumbs', true ) ) {
			$return = false;
		}

		// Check page settings
		if ( $meta = get_post_meta( $this->post_id, 'wpex_disable_breadcrumbs', true ) ) {
			if ( 'on' == $meta ) {
				$return = false;
			} elseif ( 'enable' == $meta ) {
				$return = true;
			}
		}

		// Apply filters and return
		return apply_filters( 'wpex_has_breadcrumbs', $return );

	} // End has_breadcrumbs

	/**
	 * Checks if the footer is enabled
	 *
	 * @since 3.0.0
	 */
	private function has_footer() {

		// Return true by default
		$return = true;

		// Disabled on landing page
		if ( is_page_template( 'templates/landing-page.php' ) ) {
			$return = false;
		}

		// Check page settings
		if ( $meta = get_post_meta( $this->post_id, 'wpex_disable_footer', true ) ) {
			if ( 'on' == $meta ) {
				$return = false;
			} elseif ( 'enable' == $meta ) {
				$return = true;
			}
		}

		// Apply filters and return
		return apply_filters( 'wpex_display_footer', $return );

	}

	/**
	 * Checks if footer widgets are enabled
	 *
	 * @since 3.0.0
	 */
	private function has_footer_widgets() {

		// Check if enabled via the customizer
		$return = wpex_get_mod( 'footer_widgets', true );

		// Check page settings
		if ( $meta = get_post_meta( $this->post_id, 'wpex_disable_footer_widgets', true ) ) {
			if ( 'on' == $meta ) {
				$return = false;
			} elseif ( 'enable' == $meta ) {
				$return = true;
			}
		}

		// Apply filters and return
		return apply_filters( 'wpex_display_footer_widgets', $return );

	}

	/**
	 * Checks if footer widgets are enabled
	 *
	 * @since 3.0.0
	 */
	private function has_footer_reveal() {

		// Disable on boxed style - ALWAYS
		if ( 'boxed' == $this->main_layout || 'six' == $this->header_style ) {
			return false;
		}

		// Disabled by default
		$return = false;

		// Theme option check
		if ( wpex_get_mod( 'footer_reveal', false ) ) {
			$return = true;
		}

		// Check page settings
		if ( $meta = get_post_meta( $this->post_id, 'wpex_footer_reveal', true ) ) {
			if ( 'on' == $meta ) {
				$return = true;
			} elseif ( 'off' == $meta ) {
				$return = false;
			}
		}

		// Disable on 404
		if ( is_404() ) {
			$return = false;
		}

		// Apply filters and return
		return apply_filters( 'wpex_has_footer_reveal', $return );

	} // End has_footer_reveal

	/**
	 * Checks if footer callout is enabled
	 *
	 * @since 3.0.0
	 */
	private function has_footer_callout() {
		
		// Return true by default
		$return = true;

		// Return false if disabled via Customizer
		if ( ! wpex_get_mod( 'callout', true ) ) {
			$return = false;
		}

		// Return true if custom callout text exists
		if ( get_post_meta( $this->post_id, 'wpex_callout_text', true ) ) {
			$return = true;
		}

		// Check page settings
		if ( $meta = get_post_meta( $this->post_id, 'wpex_disable_footer_callout', true ) ) {
			if ( 'on' == $meta ) {
				$return = false;
			} elseif ( 'enable' == $meta ) {
				$return = true;
			}
		}

		// Apply filter and return
		return apply_filters( 'wpex_callout_enabled', $return );

	}

	/**
	 * Footer callout content
	 *
	 * @since 3.0.0
	 */
	private function footer_callout_content() {

		// Footer callout is disabled return nothing
		if ( ! $this->has_footer_callout() ) {
			return null;
		}
		
		// Get post ID
		$post_id = $this->post_id;

		// Get Content
		if ( $post_id && $meta = get_post_meta( $post_id, 'wpex_callout_text', true ) ) {

			// Return content defined in meta
			$content = $meta;

		} else {

			// Get content from theme mod
			$content = wpex_get_mod( 'callout_text', 'I am the footer call-to-action block, here you can add some relevant/important information about your company or product. I can be disabled in the theme options.' );

			// Check if content is a page ID and get page content
			if ( is_numeric( $content ) ) {
				$post_id = $content;
				$post = get_post( $post_id );
				if ( $post && ! is_wp_error( $post ) ) {
					$content = $post->post_content;
					$this->vc_css_ids[$post_id] = $post_id;
				}
			}

		}

		// Return content
		return apply_filters( 'wpex_get_footer_callout_content', $content );

	}

	/**
	 * Checks if social share is enabled
	 *
	 * @since 3.0.0
	 */
	private function has_social_share() {

		// Return false by default
		$return = false;

		// Check page settings to overrides theme mods and filters
		if ( $meta = get_post_meta( $this->post_id, 'wpex_disable_social', true ) ) {

			// Check if disabled by meta options
			if ( 'on' == $meta ) {
				return false;
			}

			// Return true if enabled via meta option
			if ( 'enable' == $meta ) {
				return true;
			}
			
		}

		// Page check
		if ( is_page() ) {
			if ( wpex_get_mod( 'social_share_pages' ) ) {
				$return = true;
			}
		}

		// Check if enabled on single blog posts
		elseif ( is_singular( 'post' ) ) {
			$return = true; // It uses the builder so we should return true
		}

		// Apply filters and return
		return apply_filters( 'wpex_has_social_share', $return );

	}

	/**
	 * No longer used but keeping to prevent errors
	 *
	 * @since 3.0.0
	 */
	private function is_mobile() {
		return false;
	}

}

/**
 * Helper function: Returns global object or property from global object
 * IMPORTANT: Must be loaded on init to prevent issues with the Visual Composer
 *
 * @since 2.1.0
 */
function wpex_global_obj( $key = null ) {
	global $wpex_theme;
	if ( $key ) {
		if ( isset( $wpex_theme->$key ) ) {
			return $wpex_theme->$key;
		}
		// Object doesn't exist, lets try and re-create it for the front-end VC builder only
		else {
			if ( function_exists( 'vc_is_inline' ) && vc_is_inline() ) {
				$obj = new WPEX_Global_Theme_Object;
				if ( isset( $obj->$key ) ) {
					return $obj->$key;
				}
			}
		}
	} else {
		return $wpex_theme;
	}
}