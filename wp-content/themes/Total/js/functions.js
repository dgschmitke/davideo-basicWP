/**
 * Project: Total WordPress Theme
 * Description: Initialize all scripts and add custom js
 * Author: WPExplorer
 * Theme URI: http://www.wpexplorer.com
 * Author URI: http://www.wpexplorer.com
 * License: Custom
 * License URI: http://themeforest.net/licenses
 * Version: 3.0.0
 */

( function( $ ) {
	'use strict';

	var wpexTheme = {

		/**
		 * Main init function
		 *
		 * @since 2.0.0
		 */
		init : function() {
			this.config();
			this.bindEvents();
		},

		/**
		 * Cache Elements
		 *
		 * @since 2.0.0
		 */
		config : function() {

			this.config = {
				$window                 : $( window ),
				$document               : $( document ),
				$windowWidth            : $( window ).width(),
				$windowHeight           : $( window ).height(),
				$windowTop              : $( window ).scrollTop(),
				$body                   : $( 'body' ),
				$mobileMenuBreakpoint   : 960,
				$siteHeader             : null,
				$siteHeaderHeight       : 0,
				$siteHeaderTop          : 0,
				$siteHeaderBottom       : 0,
				$siteLogo               : null,
				$siteLogoHeight         : 0,
				$siteLogoSrc            : null,
				$siteNavWrap            : null,
				$localScrollOffset      : 0,
				$localScrollSpeed       : 600,
				$localScrollArray       : [],
				$mobileMenuStyle        : null,
				$hasFixedFooter         : false,
				$hasFooterReveal        : false,
				$hasTopBar              : false,
				$hasHeaderOverlay       : false,
				$hasStickyHeader        : false,
				$stickyHeaderBreakPoint : 960,
				$hasStickyMobileHeader  : false,
				$hasStickyTopBar        : false,
				$stickyTopBar           : null,
				$stickyTopBarHeight     : 0,
				$is_rtl                 : false,
				$retinaLogo             : null,
				$isMobile               : false,
				$verticalHeaderActive   : false,
				$isCustomizePreview     : false
			};

		},

		/**
		 * Bind Events
		 *
		 * @since 2.0.0
		 */
		bindEvents : function() {

			var self = this;

			// Run on document ready
			self.config.$document.on( 'ready', function() {
				self.initUpdateConfig();
				self.pageAnimations();
				self.superFish();
				self.megaMenusWidth();
				self.mobileMenu();
				self.navNoClick();
				self.hideEditLink();
				self.customMenuWidgetAccordion();
				self.inlineHeaderLogo();
				self.menuSearch();
				self.headerCart();
				self.backTopLink();
				self.smoothCommentScroll();
				self.tipsyTooltips();
				self.responsiveText();
				self.customHovers();
				self.toggleBar();
				self.localScrollLinks();
				self.customSelects();
				self.skillbar();
				self.milestone();
				self.vcexNavbar();
				self.owlCarousel();
				self.archiveMasonryGrids();
				self.iLightbox();
				self.wooSelects();
				self.overlayHovers();
				self.isotopeGrids();
			} );

			// Run on Window Load
			self.config.$window.on( 'load', function() {

				// Functions
				self.windowLoadUpdateConfig();
				self.megaMenusTop();
				self.flushDropdownsTop();
				self.equalHeights();
				self.fadeIn();
				self.parallax();
				self.cartSearchDropdownsRelocate();
				self.sliderPro();

				// Delay functions if page animations are enabled
				if ( $.fn.animsition && wpexLocalize.pageAnimation && wpexLocalize.pageAnimationInDuration ) {
					setTimeout( function() {
						self.stickyTopBar();
						self.stickyHeader();
						self.stickyHeaderShrink();
					}, wpexLocalize.pageAnimationInDuration );
				} else {
					self.stickyTopBar();
					self.stickyHeader();
					self.stickyHeaderShrink();
				}

				// Footer Reveal => Must run before fixed footer!!!
				self.footerRevealInit();

				// Fixed Footer
				self.fixedFooter();

				// Scroll to hash
				window.setTimeout( function() {
					self.scrollToHash( self )
				}, 500 );

			} );

			// Run on Window Resize
			self.config.$window.resize( function() {

				// Window width change
				if ( self.config.$window.width() != self.config.$windowWidth ) {
					self.resizeUpdateConfig();
					self.megaMenusWidth();
					self.inlineHeaderLogo();
					self.fixedFooter();
					self.footerRevealInit();
					self.cartSearchDropdownsRelocate();
				}

				// Window height change
				if ( self.config.$window.height() != self.config.$windowHeight ) {
					self.fixedFooter();
					self.footerRevealInit();
				}

			} );

			// Run on Scroll
			self.config.$window.scroll( function() {
				self.config.$windowTop = self.config.$window.scrollTop();
				self.localScrollHighlight();
				self.footerRevealScrollShow();
			} );

			// On orientation change
			self.config.$window.on( 'orientationchange',function() {
				resizeUpdateConfig();
				self.isotopeGrids();
				self.archiveMasonryGrids();
				self.inlineHeaderLogo();
			} );

		},

		/**
		 * Updates config on doc ready
		 *
		 * @since 3.0.0
		 */
		initUpdateConfig: function() {

			// Customizer check
			if ( this.config.$body.hasClass( 'is_customize_preview' ) ) {
				this.config.$isCustomizePreview = true;
			}

			// Mobile check & add mobile class to the header
			this.config.$isMobile = this.mobileCheck();
			if ( this.config.$isMobile ) {
				this.config.$body.addClass( 'wpex-is-mobile-device' );
			}

			// Local scroll speed
			if ( wpexLocalize.localScrollSpeed ) {
				this.config.$localScrollSpeed = parseInt( wpexLocalize.localScrollSpeed );
			}

			// Define header
			if ( $( '#site-header' ).length ) {
				this.config.$siteHeader = $( '#site-header' );
			}

			// Define logo
			if ( $( '#site-logo img' ).length ) {
				this.config.$siteLogo = $( '#site-logo img' );
				this.config.$siteLogoSrc = this.config.$siteLogo.attr( 'src' );
			}

			// Site nav wrap
			if ( $( '#site-navigation-wrap' ).length ) {
				this.config.$siteNavWrap = $( '#site-navigation-wrap' );
			}

			// Mobile menu style
			if ( $( '#site-navigation-wrap' ).length ) {
				this.config.$mobileMenuStyle = wpexLocalize.mobileMenuStyle;
			}

			// Define local scrolling links
			this.config.$localScrollArray = this.localScrollLinksArray();

			// Check if fixed footer is enabled
			if ( this.config.$body.hasClass( 'wpex-has-fixed-footer' ) ) {
				this.config.$hasFixedFooter = true;
			}
			
			// Footer reveal
			if ( $( '.footer-reveal' ).length && $( '#wrap' ).length && $( '#main' ).length ) {
				this.config.$hasFooterReveal = true;
			}

			// Header overlay
			if ( this.config.$siteHeader && this.config.$siteHeader.hasClass( 'fix-overlay-header' ) ) {
				this.config.$hasHeaderOverlay = true;
			}

			// RTL
			if ( wpexLocalize.isRTL ) {
				this.config.$isRTL = true;
			}

			// Top bar enabled
			if ( $( '#top-bar-wrap' ).length ) {
				this.config.$hasTopBar = true;
				if ( $( '#top-bar-wrap' ).hasClass( 'wpex-top-bar-sticky' ) ) {
					this.config.$stickyTopBar = $( '#top-bar-wrap' );
				}
			}

			// Local scroll speed
			if ( wpexLocalize.localScrollSpeed ) {
				this.config.localScrollSpeed = parseInt( wpexLocalize.localScrollSpeed );
			}

			// Sticky TopBar Init
			if ( this.config.$stickyTopBar ) {
				if ( wpexLocalize.hasStickyTopBarMobile || ( this.config.$windowWidth >= wpexLocalize.stickyTopBarBreakPoint ) ) {
					this.config.$hasStickyTopBar = true;
				} else {
					this.config.$hasStickyTopBar = false;
				}
			}

			// Sticky Header => Mobile Check (must check first)
			if ( 'toggle' == this.config.$mobileMenuStyle ) {
				this.config.$hasStickyMobileHeader = false;
			} else {
				this.config.$hasStickyMobileHeader = wpexLocalize.hasStickyMobileHeader;
			}

			// Sticky Header
			if ( wpexLocalize.hasStickyHeader ) {
				if ( wpexLocalize.stickyHeaderBreakPoint ) {
					this.config.$stickyHeaderBreakPoint = wpexLocalize.stickyHeaderBreakPoint;
				}
				if ( this.config.$hasStickyMobileHeader || ( this.config.$windowWidth >= this.config.$stickyHeaderBreakPoint ) ) {
					this.config.$hasStickyHeader = true;
				} else {
					this.config.$hasStickyHeader = false;
				}
			}

			// Retina logo
			if ( typeof $wpexRetinaLogo !== 'undefined' && window.devicePixelRatio >= 2 ) {
				this.config.retinaLogo = $wpexRetinaLogo;
			}

			// Vertical header
			if ( this.config.$body.hasClass( 'wpex-has-vertical-header' ) ) {
				this.config.$verticalHeaderActive = true;
			}

			// Remove active class from has-scroll links
			// And save array of localscroll- links
			var $links = $( '#site-navigation a' );
			$links.each( function() {
				var $this = $( this ),
					$ref = $this.attr( 'href' );
					if ( $ref ) {
						if ( $ref.indexOf( 'localscroll-' ) != -1 ) {
							$this.parent( 'li' ).addClass( 'local-scroll' );
						}
					}
			} );

			// Sticky VCEX Navbar => Disable all other sticky elements
			if ( $( '.vcex-navbar-sticky' ).length ) {
				this.config.$hasStickyTopBar = false;
				this.config.$hasStickyHeader = false;
			}

		},

		/**
		 * Updates config on window load
		 *
		 * @since 3.0.0
		 */
		windowLoadUpdateConfig: function() {

			// Header bottom position
			if ( this.config.$siteHeader ) {
				var $siteHeaderTop = this.config.$siteHeader.offset().top;
				this.config.$windowHeight = this.config.$window.height();
				this.config.$siteHeaderHeight = this.config.$siteHeader.outerHeight();
				this.config.$siteHeaderBottom = $siteHeaderTop + this.config.$siteHeaderHeight;
				this.config.$siteHeaderTop = $siteHeaderTop;
				if ( this.config.$siteLogo ) {
					this.config.$siteLogoHeight = this.config.$siteLogo.height();
				}
			}

			// Update Topbar sticky height
			if ( this.config.$stickyTopBar ) {
				this.config.$stickyTopBarHeight = this.config.$stickyTopBar.outerHeight();
				$( '.wpex-sticky-top-bar-holder' ).height( this.config.$stickyTopBarHeight );
			}

			// Set localScrollOffset after site is loaded to make sure it includes dynamic items
			this.config.$localScrollOffset = this.parseLocalScrollOffset();

		},

		/**
		 * Updates config whenever the window is resized
		 *
		 * @since 3.0.0
		 */
		resizeUpdateConfig: function() {

			// Update main configs
			this.config.$windowHeight = this.config.$window.height();
			this.config.$windowWidth  = this.config.$window.width();
			this.config.$windowTop    = this.config.$window.scrollTop();

			// Update header height
			if ( this.config.$siteHeader ) {

				// reset sticky height
				if ( $( '.wpex-sticky-header-holder' ).length ) {
					$( '.wpex-sticky-header-holder' ).height( '' );
				}

				// Get header height
				this.config.$siteHeaderHeight = this.config.$siteHeader.outerHeight();

				// Re add sticky height
				if ( $( '.wpex-sticky-header-holder' ).length ) {
					$( '.wpex-sticky-header-holder' ).height( this.config.$siteHeaderHeight );
				}

			}

			// Get logo height
			if ( this.config.$siteLogo ) {
				this.config.$siteLogoHeight = this.config.$siteLogo.height();
			}

			// Vertical Header
			if ( this.config.$windowWidth < 960 ) {
				this.config.$verticalHeaderActive = false;
			} else if ( this.config.$body.hasClass( 'wpex-has-vertical-header' ) ) {
				this.config.$verticalHeaderActive = true;
			}

			// Update Topbar sticky height
			if ( this.config.$stickyTopBar ) {
				this.config.$stickyTopBarHeight = this.config.$stickyTopBar.outerHeight();
				$( '.wpex-sticky-top-bar-holder' ).height( this.config.$stickyTopBarHeight );
			}

			// Re-stick topbar but check for mobile first
			if ( this.config.$hasStickyTopBar ) {

				// Unstick first
				this.stickyTopBar( 'unstick' );

				// Desktops or mobile enabled
				if ( wpexLocalize.hasStickyTopBarMobile || ( this.config.$windowWidth >= wpexLocalize.stickyTopBarBreakPoint ) ) {
					this.config.$hasStickyTopBar = true;
					this.stickyTopBar();
				}

				// Mobile
				else if ( ! wpexLocalize.hasStickyTopBarMobile ) {
					this.config.$hasStickyTopBar = false;
				}

			}

			// Sticky Header
			if ( this.config.$hasStickyHeader ) {

				// Unstick first
				this.stickyHeader( 'unstick' );
				this.stickyHeaderShrink( 'destroy' );

				// Desktops
				if ( this.config.$hasStickyMobileHeader || ( this.config.$windowWidth >= wpexLocalize.stickyHeaderBreakPoint ) ) {
					this.config.$hasStickyHeader = true;
					this.stickyHeader();
					this.stickyHeaderShrink();
				}

				// Mobile
				else if ( ! this.config.$hasStickyMobileHeader ) {
					this.config.$hasStickyHeader = false;
				}

			}

			// Local scroll offset => update last
			this.config.$localScrollOffset = this.parseLocalScrollOffset();

		},

		/**
		 * Mobile Check
		 *
		 * @since 2.1.0
		 */
		mobileCheck: function() {
			if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ) {
				return true;
			}
		},

		/**
		 * Page Animations
		 *
		 * @since 2.1.0
		 */
		pageAnimations: function() {

			if ( ! $.fn.animsition ) {
				return;
			}

			// Return if wrapper doesn't exist
			if ( ! wpexLocalize.pageAnimation ) {
				return;
			}

			// Run animsition
			$( '.animsition' ).animsition( {
				touchSupport: false,
				inClass: wpexLocalize.pageAnimationIn,
				outClass: wpexLocalize.pageAnimationOut,
				inDuration: wpexLocalize.pageAnimationInDuration,
				outDuration: wpexLocalize.pageAnimationOutDuration,
				linkElement: 'a[href]:not([target="_blank"]):not([href^="#"]):not([href*="javascript"]):not([href*=".jpg"]):not([href*=".jpeg"]):not([href*=".gif"]):not([href*=".png"]):not([href*=".mov"]):not([href*=".swf"]):not([href*=".mp4"]):not([href*=".flv"]):not([href*=".avi"]):not([href*=".mp3"]):not([href^="mailto:"]):not([href*="?"]):not([href*="#localscroll"]):not([class="wcmenucart"])',
				loading: true
			} );

		},

		/**
		 * Superfish menus
		 *
		 * @since 2.0.0
		 */
		superFish: function() {

			if ( ! $.fn.superfish ) {
				return;
			}

			$( '#site-navigation ul.sf-menu' ).superfish( {
				delay: wpexLocalize.superfishDelay,
				animation: {
					opacity: 'show'
				},
				animationOut: {
					opacity: 'hide'
				},
				speed: wpexLocalize.superfishSpeed,
				speedOut: wpexLocalize.superfishSpeedOut,
				cssArrows: false,
				disableHI: false
			} );


		},

		 /**
		 * MegaMenus Width
		 *
		 * @since 2.0.0
		 */
		megaMenusWidth: function() {

			if ( ! this.config.$siteHeader || wpexLocalize.siteHeaderStyle !== 'one' ) {
				return;
			}

			var $siteNavigationWrap         = $( '#site-navigation-wrap' ),
				$headerContainerWidth       = this.config.$siteHeader.find( '.container' ).outerWidth(),
				$navWrapWidth               = $siteNavigationWrap.outerWidth(),
				$siteNavigationWrapPosition = $siteNavigationWrap.css( 'right' ),
				$siteNavigationWrapPosition = parseInt( $siteNavigationWrapPosition );

			if ( 'auto' == $siteNavigationWrapPosition ) {
				$siteNavigationWrapPosition = 0;
			}

			var $megaMenuNegativeMargin = $headerContainerWidth-$navWrapWidth-$siteNavigationWrapPosition;

			$( '#site-navigation-wrap .megamenu > ul' ).css( {
				'width'       : $headerContainerWidth,
				'margin-left' : -$megaMenuNegativeMargin
			} );

		},

		/**
		 * MegaMenus Top Position
		 *
		 * @since 2.0.0
		 */
		megaMenusTop: function() {

			if ( ! this.config.$siteHeaderHeight
				|| ! this.config.$siteNavWrap
				|| ! this.config.$siteHeader.hasClass( 'header-one' )
				|| $( '#site-navigation-wrap' ).hasClass( 'wpex-flush-dropdowns' )
				|| ! this.config.$siteHeader.hasClass( 'header-one' )
			) {
				return;
			}

			var $navHeight = this.config.$siteNavWrap.outerHeight(),
				$megaMenuTop = this.config.$siteHeaderHeight - $navHeight;

			$( '#site-navigation-wrap .megamenu > ul' ).css( {
				'top': $megaMenuTop/2 + $navHeight
			} );

		},

		/**
		 * FlushDropdowns top positioning
		 *
		 * @since 2.0.0
		 */
		flushDropdownsTop: function() {

			if ( ! this.config.$siteHeaderHeight
				|| ! this.config.$siteNavWrap
				|| ! this.config.$siteNavWrap.hasClass( 'wpex-flush-dropdowns' )
			) {
				return;
			}

			var $navHeight = this.config.$siteNavWrap.outerHeight(),
				$dropTop = this.config.$siteHeaderHeight - $navHeight;

			$( '#site-navigation-wrap .dropdown-menu > .menu-item-has-children > ul' ).css( {
				'top': $dropTop/2 + $navHeight
			} );

		},

		/**
		 * Mobile Menu
		 *
		 * @since 2.0.0
		 */
		mobileMenu: function( event ) {

			var self = this;

			/***** Sidr Mobile Menu ****/
			if ( 'sidr' == this.config.$mobileMenuStyle && typeof wpexLocalize.sidrSource !== 'undefined' ) {

				var self = this;

				// Add sidr
				$( 'a.mobile-menu-toggle, li.mobile-menu-toggle > a' ).sidr( {
					name     : 'sidr-main',
					source   : wpexLocalize.sidrSource,
					side     : wpexLocalize.sidrSide,
					displace : wpexLocalize.sidrDisplace,
					speed    : parseInt( wpexLocalize.sidrSpeed ),
					renaming : true,
					onOpen   : function() {

						// Add extra classname
						$( '#sidr-main' ).addClass( 'wpex-mobile-menu' );

						// Prevent body scroll
						self.config.$body.addClass( 'wpex-noscroll' );

						// Declare useful vars
						var $hasChildren = $( '.sidr-class-menu-item-has-children' );

						// Add dropdown toggle (arrow)
						$hasChildren.children( 'a' ).append( '<span class="sidr-class-dropdown-toggle"></span>' );

						// Toggle dropdowns
						var $sidrDropdownTarget = $( '.sidr-class-dropdown-toggle' );

						// Check localization
						if ( wpexLocalize.sidrDropdownTarget == 'li' ) {
							$sidrDropdownTarget = $( '.sidr-class-sf-with-ul' );
						}

						// Add toggle click event
						$sidrDropdownTarget.on( self.config.$isMobile ? 'touchstart' : 'click', function( event ) {

							// Define toggle vars
							if ( wpexLocalize.sidrDropdownTarget == 'li' ) {
								var $toggleParentLi = $( this ).parent( 'li' );
							} else {
								var $toggleParentLink = $( this ).parent( 'a' ),
									$toggleParentLi   = $toggleParentLink.parent( 'li' );
							}

							// Get parent items and dropdown
							var $allParentLis = $toggleParentLi.parents( 'li' ),
								$dropdown     = $toggleParentLi.children( 'ul' );

							// Toogle items
							if ( ! $toggleParentLi.hasClass( 'active' ) ) {
								$hasChildren.not( $allParentLis ).removeClass( 'active' ).children( 'ul' ).slideUp( 'fast' );
								$toggleParentLi.addClass( 'active' ).children( 'ul' ).slideDown( 'fast' );
							} else {
								$toggleParentLi.removeClass( 'active' ).children( 'ul' ).slideUp( 'fast' );
							}

							// Return false
							return false;

						} );

						// Add dark overlay to content
						self.config.$body.append( '<div class="wpex-sidr-overlay wpex-hidden"></div>' );
						$( '.wpex-sidr-overlay' ).fadeIn( wpexLocalize.sidrSpeed );

						// Bind scroll
						$( '#sidr-main' ).bind( 'mousewheel DOMMouseScroll', function ( e ) {
							var e0 = e.originalEvent,
								delta = e0.wheelDelta || -e0.detail;
							this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
							e.preventDefault();
						} );

						// Close sidr when clicking toggle
						$( 'a.sidr-class-toggle-sidr-close' ).on( self.config.$isMobile ? 'touchstart' : 'click', function( event ) {
							$.sidr( 'close', 'sidr-main' );
							return false;
						} );

						// Close sidr when clicking on overlay
						$( '.wpex-sidr-overlay' ).on( self.config.$isMobile ? 'touchstart' : 'click', function( event ) {
							$.sidr( 'close', 'sidr-main' );
							return false;
						} );

						// Close on resize
						self.config.$window.resize( function() {
							if ( self.config.$windowWidth >= self.config.$mobileMenuBreakpoint ) {
								$.sidr( 'close', 'sidr-main' );
							}
						} );

					},
					onClose : function() {

						// Allow body scroll
						self.config.$body.removeClass( 'wpex-noscroll' );

						// Remove active dropdowns
						$( '.sidr-class-menu-item-has-children.active' ).removeClass( 'active' ).children( 'ul' ).hide();
						
						// FadeOut overlay
						$( '.wpex-sidr-overlay' ).fadeOut( wpexLocalize.sidrSpeed, function() {
							$( this ).remove();
						} );
					}

				} );

				// Close when clicking local scroll link
				$( 'li.sidr-class-local-scroll > a' ).click( function() {
					var $target = this.hash;
					$.sidr( 'close', 'sidr-main' );
					self.scrollTo( $target );
					return false;
				} );

			}

			/***** Toggle Mobile Menu ****/
			else if ( 'toggle' == self.config.$mobileMenuStyle && self.config.$siteHeader ) {

				var $classes = 'mobile-toggle-nav wpex-mobile-menu wpex-clr';

				// Insert nav
				if ( $( '#wpex-mobile-menu-fixed-top' ).length ) {
					$( '#wpex-mobile-menu-fixed-top' ).append( '<nav class="'+ $classes +'"></nav>' );
				}

				// Overlay header
				else if ( self.config.$hasHeaderOverlay && $( '#overlay-header-wrap' ).length ) {
					$( '<nav class="'+ $classes +'"></nav>' ).insertBefore( "#overlay-header-wrap" );
				}

				// Normal toggle insert
				else {
					$( '<nav class="'+ $classes +'"></nav>' ).insertAfter( self.config.$siteHeader );
				}

				// Grab all content from menu and add into mobile-toggle-nav element
				if ( $( '#mobile-menu-alternative' ).length ) {
					var mobileMenuContents = $( '#mobile-menu-alternative .dropdown-menu' ).html();
				} else {
					var mobileMenuContents = $( '#site-navigation .dropdown-menu' ).html();
				}
				$( '.mobile-toggle-nav' ).html( '<ul class="mobile-toggle-nav-ul">' + mobileMenuContents + '</ul>' );

				// Remove all styles
				$( '.mobile-toggle-nav-ul, .mobile-toggle-nav-ul *' ).children().each( function() {
					var attributes = this.attributes;
					$( this ).removeAttr( 'style' );
				} );

				// Add classes where needed
				$( '.mobile-toggle-nav-ul' ).addClass( 'container' );

				// Show/Hide
				$( '.mobile-menu-toggle' ).on( self.config.$isMobile ? 'touchstart' : 'click', function( event ) {
					if ( wpexLocalize.animateMobileToggle ) {
						$( '.mobile-toggle-nav' ).stop(true,true).slideToggle( 'fast' ).toggleClass( 'visible' );
					} else {
						$( '.mobile-toggle-nav' ).toggle().toggleClass( 'visible' );
					}
					return false;
				} );

				// Close on resize
				self.config.$window.resize( function() {
					if ( self.config.$windowWidth >= self.config.$mobileMenuBreakpoint && $( '.mobile-toggle-nav' ).length ) {
						$( '.mobile-toggle-nav' ).hide().removeClass( 'visible' );
					}
				} );

				// Add search to toggle menu
				var $mobileSearch = $( '#mobile-menu-search' );
				if ( $mobileSearch.length ) {
					$( '.mobile-toggle-nav' ).append( '<div class="mobile-toggle-nav-search container"></div>' );
					$( '.mobile-toggle-nav-search' ).append( $mobileSearch );
				}

			}

			/***** Full-Screen Overlay Mobile Menu ****/
			else if ( 'full_screen' == self.config.$mobileMenuStyle && self.config.$siteHeader ) {

				// Style
				var $style = wpexLocalize.fullScreenMobileMenuStyle ? wpexLocalize.fullScreenMobileMenuStyle : false;

				// Insert new nav
				self.config.$body.append( '<div class="full-screen-overlay-nav wpex-mobile-menu wpex-clr '+ $style +'"><span class="full-screen-overlay-nav-close"></span><nav class="full-screen-overlay-nav-ul-wrapper"><ul class="full-screen-overlay-nav-ul"></ul></nav></div>' );

				// Grab all content from menu and add into mobile-toggle-nav element
				if ( $( '#mobile-menu-alternative' ).length ) {
					var mobileMenuContents = $( '#mobile-menu-alternative .dropdown-menu' ).html();
				} else {
					var mobileMenuContents = $( '#site-navigation .dropdown-menu' ).html();
				}
				$( '.full-screen-overlay-nav-ul' ).html( mobileMenuContents );

				// Remove all styles
				$( '.full-screen-overlay-nav, .full-screen-overlay-nav *' ).children().each( function() {
					var attributes = this.attributes;
					$( this ).removeAttr( 'style' );
				} );

				// Show
				$( '.mobile-menu-toggle' ).on( self.config.$isMobile ? 'touchstart' : 'click', function( event ) {
					$( '.full-screen-overlay-nav' ).addClass( 'visible' );
					self.config.$body.addClass( 'wpex-noscroll' );
					return false;
				} );

				// Hide
				$( '.full-screen-overlay-nav-close' ).on( self.config.$isMobile ? 'touchstart' : 'click', function( event ) {
					$( '.full-screen-overlay-nav' ).removeClass( 'visible' );
					self.config.$body.removeClass( 'wpex-noscroll' );
					return false;
				} );

			}

		},

		/**
		 * Prevent clickin on links
		 *
		 * @since 2.0.0
		 */
		navNoClick: function() {
			$( 'li.nav-no-click > a, li.sidr-class-nav-no-click > a' ).live( 'click', function() {
				return false;
			} );
		},

		/**
		 * Sticky Topbar
		 *
		 * @since 3.0.0
		 */
		stickyTopBar: function( event ) {

			// Return if no topbar
			if ( ! this.config.$hasTopBar
				|| ! this.config.$hasStickyTopBar
				|| ! this.config.$stickyTopBar
			) {
				return;
			}

			// Declare vars
			var self = this;

			// Unstick the topbar
			if ( 'unstick' == event && $( '.wpex-sticky-top-bar-holder' ).length ) {

				// Unstick
				self.config.$stickyTopBar.unstick();

				// Reset topbar height
				self.config.$stickyTopBarHeight = $( '#top-bar-wrap' ).outerHeight();

				// Reset holder height
				$( '.wpex-sticky-top-bar-holder' ).height( '' );

				// Return
				return;

			}
			
			// Stick the TopBar
			if ( self.config.$hasStickyTopBar && ! $( '.wpex-sticky-top-bar-holder' ).length ) {

				// Offset the fixed mobile nav
				var $mobileMenu = $( '#wpex-mobile-menu-fixed-top' );
				if ( $mobileMenu.is( ':visible' ) ) {
					var $topSpacing = $mobileMenu.outerHeight();
				} else {
					var $topSpacing = 0;
				}

				self.config.$stickyTopBar.sticky( {
					topSpacing       : $topSpacing,
					getWidthFrom     : '#wrap',
					responsiveWidth  : true,
					wrapperClassName : 'wpex-sticky-top-bar-holder'
				} );

				// Add topbar height to sticky wrapper
				self.config.$stickyTopBar.on( 'sticky-start', function() {
					$( '.wpex-sticky-top-bar-holder' ).height( self.config.$stickyTopBar.outerHeight() );
				} );

			}

		},

		/**
		 * Sticky Header
		 *
		 * @since 2.0.0
		 */
		stickyHeader: function( event ) {

			var self        = this,
				$fixedNav   = $( '.fixed-nav' ),
				$topSpacing = 0,
				$mobileMenu = $( '#wpex-mobile-menu-fixed-top' );

			// Destroy sticky and sticky functions
			if ( 'unstick' == event ) {

				if ( $( '.wpex-sticky-header-holder' ).length ) {

					// Destroy shrink header
					self.stickyHeaderShrink( 'resize_destroy' );

					// Destroy sticky header
					$( '#site-header.fixed-scroll' ).unstick();

					// Set correct header height
					$( '.wpex-sticky-header-holder' ).css( 'height', '' );

					// Return correct logo
					var $logo = self.config.retinaLogo ? self.config.retinaLogo : self.config.$siteLogoSrc;
					if ( $logo ) {
						self.config.$siteLogo.attr( 'src', $logo );
					}

				}

				if ( $( '.wpex-sticky-menu-holder' ).length ) {
					$( '.fixed-nav' ).unstick();
				}

			}

			// Add Sticky
			else {

				// Sticky is disabled do nothing or header doesn't exist...return
				if ( ! this.config.$siteHeader
					|| ! this.config.$hasStickyHeader
				) {
				   return;
				}

				if ( self.config.$hasStickyTopBar ) {
					$topSpacing = $topSpacing + self.config.$stickyTopBar.outerHeight()
				}
				if ( $mobileMenu.is( ':visible' ) ) {
					$topSpacing = $topSpacing + $mobileMenu.outerHeight();
				}

				// Already sticky do nothing
				if ( $( '.wpex-sticky-header-holder' ).length ) {
					return;
				}

				// Sticky header
				if ( self.config.$siteHeader.hasClass( 'fixed-scroll' ) ) {

					// Start sticky
					self.config.$siteHeader.sticky( {
						topSpacing       : $topSpacing,
						getWidthFrom     : '#wrap',
						responsiveWidth  : true,
						wrapperClassName : 'wpex-sticky-header-holder'
					} );

					// Set header height
					$( '.wpex-sticky-header-holder' ).height( self.config.$siteHeaderHeight );

					// Sticky on start events
					self.config.$siteHeader.on( 'sticky-start', function() {

						// Sticky custom logo
						if ( self.config.$siteLogo
							&& wpexLocalize.stickyheaderCustomLogo
							&& ! self.config.$siteHeader.hasClass( 'wpex-shrink-sticky-header' )
						) {
							self.config.$siteLogo.attr( 'src', wpexLocalize.stickyheaderCustomLogo );
						}

					} );

					// Sticky on end events
					self.config.$siteHeader.on( 'sticky-end', function() {

						// Return correct logo
						if ( ! self.config.$siteHeader.hasClass( 'wpex-shrink-sticky-header' ) ) {
							var $logo = self.config.retinaLogo ? self.config.retinaLogo : self.config.$siteLogoSrc;
							if ( $logo ) {
								self.config.$siteLogo.attr( 'src', $logo );
							}
						}

					} );

				} 

				// Sticky nav
				else if ( $fixedNav.length ) {

					$fixedNav.sticky( {
						topSpacing       : $topSpacing,
						getWidthFrom     : '#wrap',
						responsiveWidth  : true,
						wrapperClassName : 'wpex-sticky-menu-holder'
					} );

					// Sticky on start events
					$fixedNav.on( 'sticky-start', function() {
						$( '.wpex-sticky-menu-holder' ).height( $fixedNav.outerHeight() );
					} );

					// Sticky on end events
					$fixedNav.on( 'sticky-end', function() {
						$( '.wpex-sticky-menu-holder' ).height('');
					} );

				}

			}

		},

		/**
		 * Shrink sticky header
		 *
		 * @since 2.0.0
		 */
		stickyHeaderShrink: function( event ) {

			// Initial checks
			if ( ! this.config.$siteHeader
				|| ! this.config.$siteHeader.hasClass( 'wpex-shrink-sticky-header' )
				|| ! $( '.wpex-sticky-header-holder' ).length
			) {
				return;
			}

			// Declare main vars
			var self = this,
				$siteHeaderInner  = $( '#site-header-inner' ),
				$ogTopPadding     = $( '#site-header-inner' ).css( 'padding-top' ),
				$ogBottomPadding  = $( '#site-header-inner' ).css( 'padding-bottom' ),
				$ogHeight         = $siteHeaderInner.outerHeight(),
				$shrunkHeight     = parseInt( wpexLocalize.shrinkHeaderHeight ),
				$shrunkSpeed      = 300;

			// Shurnk logo height
			if ( wpexLocalize.shrinkHeaderLogoHeight ) {
				var $shrunkHeightLogo = wpexLocalize.shrinkHeaderLogoHeight;
			} else {
				var $shrunkHeightLogo = 50;
				if ( $shrunkHeightLogo > self.config.$siteLogoHeight ) {
					$shrunkHeightLogo = self.config.$siteLogoHeight - 10;
				}
			}
			$shrunkHeightLogo = parseInt( $shrunkHeightLogo );

			// Destroy method
			function destroy() {

				if ( self.config.$siteHeader.hasClass( 'wpex-header-shrunk' ) ) {

					// Reset header height
					$siteHeaderInner.stop(true,true).animate( {
						'height'         : $ogHeight,
						'padding-top'    : $ogTopPadding,
						'padding-bottom' : $ogBottomPadding
					}, {
						duration: $shrunkSpeed,
						queue: false
					} );

					// Reset logo
					var $logo = self.config.retinaLogo ? self.config.retinaLogo : self.config.$siteLogoSrc;
					if ( $logo ) {
						self.config.$siteLogo.attr( 'src', $logo );
					}

					// Reset logo height
					if ( self.config.$siteLogo ) {
						self.config.$siteLogo.stop(true,true).animate( {
							'height' : self.config.$siteLogoHeight
						}, {
							duration : $shrunkSpeed,
							queue    : false,
							complete : function() {
								$( this ).css( 'height', '' );
							}
						} );
					}

					// Get correct header height after animations are complete and re-position megamenus
					setTimeout( function() {
						self.config.$siteHeaderHeight = self.config.$siteHeader.outerHeight();
						self.megaMenusTop();
						self.flushDropdownsTop();
					}, $shrunkSpeed );

					// Remove shrunk class
					self.config.$siteHeader.removeClass( 'wpex-header-shrunk' );

				}
			}

			// Destroy event
			if ( 'destroy' == event ) {
				destroy();
				return;
			}

			// Resize destroy method - required since header height can change on window resize
			function resizeDestroy() {

				if ( ! $shrunkHeight ) {
					return;
				}

				// Reset header height
				$siteHeaderInner.css( {
					'height'         : '',
					'padding-top'    : '',
					'padding-bottom' : ''
				} );

				// Reset logo
				var $logo = self.config.retinaLogo ? self.config.retinaLogo : self.config.$siteLogoSrc;
				if ( $logo ) {
					self.config.$siteLogo.attr( 'src', $logo );
				}

				// Reset logo height
				if ( self.config.$siteLogo ) {
					self.config.$siteLogo.css( 'height', '' );
				}

				// Get correct header height and megaMenus top location
				self.config.$siteHeaderHeight = self.config.$siteHeader.outerHeight();
				self.megaMenusTop();
				self.flushDropdownsTop();

				// Remove shrunk class
				self.config.$siteHeader.removeClass( 'wpex-header-shrunk' );

			}

			if ( 'resize_destroy' == event ) {
				resizeDestroy();
				return;
			}

			// Get offset
			var $offSet = 0;
			if ( self.config.$siteHeaderBottom ) {
				$offSet = self.config.$siteHeaderBottom;
			}

			self.config.$window.scroll( function() {

				// Sticky header disabled = must check on scroll
				if ( ! self.config.$hasStickyHeader ) {
					return;
				}

				// Add shrink classes
				if ( self.config.$windowTop > $offSet ) {

					if ( ! self.config.$siteHeader.hasClass( 'wpex-header-shrunk' ) ) {

						// Set header innner height
						$siteHeaderInner.stop(true,true).animate( {
							'height'         : $shrunkHeight,
							'padding-top'    : '0',
							'padding-bottom' : '0'
						}, {
							duration : $shrunkSpeed,
							queue    : false
						} );

						// Set logo height
						if ( self.config.$siteLogo ) {
							self.config.$siteLogo.stop(true,true).animate( {
								'height' : $shrunkHeightLogo
							}, {
								duration : $shrunkSpeed,
								queue    : false
							} );
						}

						// Sticky custom logo
						if ( self.config.$siteLogo && wpexLocalize.stickyheaderCustomLogo ) {
							self.config.$siteLogo.attr( 'src', wpexLocalize.stickyheaderCustomLogo );
						}

						// Get correct header height after animations are complete and re-position megamenus
						setTimeout( function() {
							self.config.$siteHeaderHeight = self.config.$siteHeader.outerHeight();
							self.megaMenusTop();
							self.flushDropdownsTop();
						}, $shrunkSpeed );

						// Add class to prevent events from running every time user scrolls
						self.config.$siteHeader.addClass( 'wpex-header-shrunk' );

					}

				} else {

					destroy(); // As a function so we can destroy when sticky is destroyed also

				}

			} );

		},

		/**
		 * Header Search
		 *
		 * @since 2.0.0
		 */
		menuSearch: function() {

			var self = this;

			/**** Menu Search > Dropdown ****/
			if ( 'drop_down' == wpexLocalize.menuSearchStyle ) {

				var $searchDropdownToggle = $( 'a.search-dropdown-toggle' );
				var $searchDropdownForm   = $( '#searchform-dropdown' );

				$searchDropdownToggle.click( function( event ) {
					// Display search form
					$searchDropdownForm.toggleClass( 'show' );
					// Active menu item
					$( this ).parent( 'li' ).toggleClass( 'active' );
					// Focus
					var $transitionDuration = $searchDropdownForm.css( 'transition-duration' );
					$transitionDuration = $transitionDuration.replace( 's', '' ) * 1000;
					if ( $transitionDuration ) {
						setTimeout( function() {
							$searchDropdownForm.find( 'input[type="search"]' ).focus();
						}, $transitionDuration );
					}
					// Hide other things
					$( 'div#current-shop-items-dropdown' ).removeClass( 'show' );
					$( 'li.wcmenucart-toggle-dropdown' ).removeClass( 'active' );
					// Return false
					return false;
				} );

				// Close on doc click
				self.config.$document.on( 'click', function( event ) {
					if ( ! $( event.target ).closest( '#searchform-dropdown.show' ).length ) {
						$searchDropdownToggle.parent( 'li' ).removeClass( 'active' );
						$searchDropdownForm.removeClass( 'show' );
					}
				} );

			}

			/**** Menu Search > Overlay Modal ****/
			else if ( 'overlay' == wpexLocalize.menuSearchStyle ) {

				if ( ! $.fn.leanerModal ) {
					return;
				}

				var $searchOverlayToggle = $( 'a.search-overlay-toggle' );

				$searchOverlayToggle.leanerModal( {
					id      : '#searchform-overlay',
					top     : 100,
					overlay : 0.8
				} );

				$searchOverlayToggle.click( function() {
					$( '#site-searchform input' ).focus();
				} );

			}
			
			/**** Menu Search > Header Replace ****/
			else if ( 'header_replace' == wpexLocalize.menuSearchStyle ) {

				// Show
				var $headerReplace = $( '#searchform-header-replace' );
				$( 'a.search-header-replace-toggle' ).click( function( event ) {
					// Display search form
					$headerReplace.toggleClass( 'show' );
					// Focus
					var $transitionDuration =  $headerReplace.css( 'transition-duration' );
					$transitionDuration = $transitionDuration.replace( 's', '' ) * 1000;
					if ( $transitionDuration ) {
						setTimeout( function() {
							$headerReplace.find( 'input[type="search"]' ).focus();
						}, $transitionDuration );
					}
					// Return false
					return false;
				} );

				// Close on click
				$( '#searchform-header-replace-close' ).click( function() {
					$headerReplace.removeClass( 'show' );
					return false;
				} );

				// Close on doc click
				self.config.$document.on( 'click', function( event ) {
					if ( ! $( event.target ).closest( $( '#searchform-header-replace.show' ) ).length ) {
						$headerReplace.removeClass( 'show' );
					}
				} );
			}

		},

		/**
		 * Header Cart
		 *
		 * @since 2.0.0
		 */
		headerCart: function() {

			if ( $( 'a.wcmenucart' ).hasClass( 'go-to-shop' ) ) {
				return;
			}

			// Drop-down
			if ( 'drop_down' == wpexLocalize.wooCartStyle ) {

				// Display cart dropdown
				$( '.toggle-cart-widget' ).click( function( event ) {
					$( '#searchform-dropdown' ).removeClass( 'show' );
					$( 'a.search-dropdown-toggle' ).parent( 'li' ).removeClass( 'active' );
					$( 'div#current-shop-items-dropdown' ).toggleClass( 'show' );
					$( this ).toggleClass( 'active' );
					return false;
				} );

				// Hide cart dropdown
				$( 'div#current-shop-items-dropdown' ).click( function( event ) {
					event.stopPropagation(); 
				} );
				this.config.$document.click( function() {
					$( 'div#current-shop-items-dropdown' ).removeClass( 'show' );
					$( 'li.wcmenucart-toggle-dropdown' ).removeClass( 'active' );
				} );

				/* Prevent body scroll on current shop dropdown - seems buggy...
				$( '#current-shop-items-dropdown' ).bind( 'mousewheel DOMMouseScroll', function ( e ) {
					var e0 = e.originalEvent,
						delta = e0.wheelDelta || -e0.detail;
					this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
					e.preventDefault();
				} );*/

			}

			// Modal
			else if ( 'overlay' == wpexLocalize.wooCartStyle ) {

				if ( ! $.fn.leanerModal ) {
					return;
				}

				$( '.toggle-cart-widget' ).leanerModal( {
					id: '#current-shop-items-overlay',
					top: 100,
					overlay: 0.8
				} );

			}

		},

		/**
		 * Relocate the cart and search dropdowns for specific header styles
		 *
		 * @since 2.0.0
		 */
		cartSearchDropdownsRelocate: function() {

			// Get last menu item
			var $lastMenuItem = $( '#site-navigation .dropdown-menu > li:nth-last-child(1)' );

			// Validate first
			if ( this.config.$hasHeaderOverlay
				|| ! this.config.$siteHeader
				|| ! $lastMenuItem.length
				|| ! this.config.$siteHeader.hasClass( 'wpex-reposition-cart-search-drops' )
			) {
				return;
			}

			// Define search and cart elements
			var $searchDrop = $( '#searchform-dropdown' ),
				$shopDrop   = $( '#current-shop-items-dropdown');

			// Get last menu item offset
			var $lastMenuItemOffset = $lastMenuItem.position();

			// Position search dropdown
			if ( $searchDrop.length ) {

				var $searchDropPosition = $lastMenuItemOffset.left - $searchDrop.outerWidth() + $lastMenuItem.width();

				$searchDrop.css( {
					'right' : 'auto',
					'left'  : $searchDropPosition
				} );

			}

			// Position Woo dropdown
			if ( $shopDrop.length ) {

				var $shopDropPosition = $lastMenuItemOffset.left - $shopDrop.outerWidth() + $lastMenuItem.width();

				$shopDrop.css( {
					'right': 'auto',
					'left': $shopDropPosition
				} );

			}

		},

		/**
		 * Hide post edit link
		 *
		 * @since 2.0.0
		 */
		hideEditLink: function() {

			$( 'a.hide-post-edit' ).click( function() {
				$( 'div.post-edit' ).hide();
				return false;
			} );

		},

		/**
		 * Custom menu widget toggles
		 *
		 * @since 2.0.0
		 */
		customMenuWidgetAccordion: function() {

			var self = this;

			$( '#main .widget_nav_menu .current-menu-ancestor' ).addClass( 'active' ).children( 'ul' ).show();

			$( '#main .widget_nav_menu' ).each( function() {
				var $widgetMenu  = $( this ),
					$hasChildren = $( this ).find( '.menu-item-has-children' ),
					$allSubs     = $hasChildren.children( '.sub-menu' );
				$hasChildren.each( function() {
					$( this ).addClass( 'parent' );
					var $links = $( this ).children( 'a' );
					$links.on( self.config.$isMobile ? 'touchstart' : 'click', function( event ) {
						var $linkParent = $( this ).parent( 'li' ),
							$allParents = $linkParent.parents( 'li' );
						if ( ! $linkParent.hasClass( 'active' ) ) {
							$hasChildren.not( $allParents ).removeClass( 'active' ).children( '.sub-menu' ).slideUp( 'fast' );
							$linkParent.addClass( 'active' ).children( '.sub-menu' ).stop( true, true ).slideDown( 'fast' );
						} else {
							$linkParent.removeClass( 'active' ).children( '.sub-menu' ).stop( true, true ).slideUp( 'fast' );
						}
						return false;
					} );
				} );
			} );

		},

		/**
		 * Header 5 - Inline Logo
		 *
		 * @since 2.0.0
		 */
		inlineHeaderLogo: function() {

			// Only needed for header style 5
			if ( 'five' != wpexLocalize.siteHeaderStyle ) {
				return;
			}

			var $headerLogo        = $( '#site-header-inner > .header-five-logo' ),
				$headerNav         = $( '#site-header-inner .navbar-style-five' ),
				$navLiCount        = $headerNav.children( '#site-navigation' ).children( 'ul' ).children( 'li' ).size(),
				$navBeforeMiddleLi = Math.round( $navLiCount / 2 ) - parseInt( wpexLocalize.headerFiveSplitOffset ),
				$centeredLogo      = $( '.menu-item-logo .header-five-logo' );

				// Add logo into menu
				if ( this.config.$windowWidth >= this.config.$mobileMenuBreakpoint && $headerLogo.length && $headerNav.length ) {
					$('<li class="menu-item-logo"></li>').insertAfter( $headerNav.find( '#site-navigation > ul > li:nth( '+ $navBeforeMiddleLi +' )' ) );
						$headerLogo.appendTo( $headerNav.find( '.menu-item-logo' ) );
				}

				// Remove logo from menu and add to header
				if ( this.config.$windowWidth < this.config.$mobileMenuBreakpoint && $centeredLogo.length ) {
					$centeredLogo.prependTo( $( '#site-header-inner' ) );
					$( '.menu-item-logo' ).remove();
				}

			// Add display class to logo (hidden by default)
			$headerLogo.addClass( 'display' );

		},

		/**
		 * Back to top link
		 *
		 * @since 2.0.0
		 */
		backTopLink: function() {

			var self = this,
				$scrollTopLink = $( 'a#site-scroll-top' );

			if ( $scrollTopLink.length ) {

				var $speed = wpexLocalize.windowScrollTopSpeed ? wpexLocalize.windowScrollTopSpeed : 2000,
					$speed = parseInt( $speed );

				this.config.$window.scroll( function() {
					if ( $( this ).scrollTop() > 100 ) {
						$scrollTopLink.addClass( 'show' );
					} else {
						$scrollTopLink.removeClass( 'show' );
					}
				} );

				$scrollTopLink.on( self.config.$isMobile ? 'touchstart' : 'click', function( event ) {
					$( 'html, body' ).stop(true,true).animate( {
						scrollTop : 0
					}, $speed );
					return false;
				} );

			}

		},

		/**
		 * Smooth Comment Scroll
		 *
		 * @since 2.0.0
		 */
		smoothCommentScroll: function() {

			$( '.single li.comment-scroll a' ).click( function( event ) {
				$( 'html, body' ).stop(true,true).animate( {
					scrollTop: $( this.hash ).offset().top -180
				}, 'normal' );
				return false;
			} );

		},

		/**
		 * Tooltips
		 *
		 * @since 2.0.0
		 */
		tipsyTooltips: function() {

			$( 'a.tooltip-left' ).tipsy( {
				fade    : true,
				gravity : 'e'
			} );

			$( 'a.tooltip-right' ).tipsy( {
				fade    : true,
				gravity : 'w'
			} );

			$( 'a.tooltip-up' ).tipsy( {
				fade    : true,
				gravity : 's'
			} );

			$( 'a.tooltip-down' ).tipsy( {
				fade    : true,
				gravity : 'n'
			} );

		},


		/**
		 * Tooltips
		 *
		 * @since 3.2.0
		 */
		responsiveText: function() {

			var self = this,
				$responsiveText = $( '.wpex-responsive-txt' );

			$responsiveText.each( function() {

				var $this  = $( this ),
					$data  = $this.data(),
					$min   = self.parseData( $data.minFontSize, 13 ),
					$max   = self.parseData( $data.maxFontSize, 40 ),
					$ratio = self.parseData( $data.responsiveTextRatio, 10 );

				$this.flowtype( {
					fontRatio : $ratio,
					minFont   : $min,
					maxFont   : $max
				} );

			} );

		},

		/**
		 * Custom hovers using data attributes
		 *
		 * @since 2.0.0
		 */
		customHovers: function() {

			$( '.wpex-data-hover' ).each( function() {

				var $this = $( this ),
					$originalBg = $( this ).css( 'backgroundColor' ),
					$originalColor = $( this ).css( 'color' ),
					$hoverBg = $( this ).attr( 'data-hover-background' ),
					$hoverColor = $( this ).attr( 'data-hover-color' );

				$this.hover( function () {
					if ( CSSStyleDeclaration.prototype.setProperty !== 'undefined' ) {
						if ( $hoverBg ) {
							this.style.setProperty( 'background-color', $hoverBg, 'important' );
						}
						if ( $hoverColor ) {
							this.style.setProperty( 'color', $hoverColor, 'important' );
						}
					} else {
						if ( $hoverBg ) {
							$this.css( 'background-color', $hoverBg );
						}
						if ( $hoverColor ) {
							$this.css( 'color', $hoverColor );
						}
					}
				}, function () {
					if ( CSSStyleDeclaration.prototype.setProperty !== 'undefined' ) {
						if ( $hoverBg ) {
							this.style.setProperty( 'background-color', $originalBg, 'important' );
						}
						if ( $hoverColor ) {
							this.style.setProperty( 'color', $originalColor, 'important' );
						}
					} else {
						if ( $hoverBg && $originalBg ) {
							$this.css( 'background-color', $originalBg );
						}
						if ( $hoverColor && $originalColor ) {
							$this.css( 'color', $originalColor );
						}
					}
				} );

			} );

		},


		/**
		 * Togglebar toggle
		 *
		 * @since 2.0.0
		 */
		toggleBar: function() {

			var self = this;
			var $toggleBtn = $( 'a.toggle-bar-btn' );
			var $toggleBarWrap = $( '#toggle-bar-wrap' );

			if ( $toggleBtn.length && $toggleBarWrap.length ) {

				$toggleBtn.on( self.config.$isMobile ? 'touchstart' : 'click', function( event ) {
					var $fa = $( '.toggle-bar-btn' ).find( '.fa' );
					$fa.toggleClass( $toggleBtn.data( 'icon' ) );
					$fa.toggleClass( $toggleBtn.data( 'icon-hover' ) );
					$toggleBarWrap.toggleClass( 'active-bar' );
					return false;
				} );

				// Close on doc click
				self.config.$document.on( 'click', function( event ) {
					if ( ! $( event.target ).closest( '#toggle-bar-wrap.active-bar' ).length ) {
						$toggleBarWrap.removeClass( 'active-bar' );
						$toggleBtn.children( '.fa' ).removeClass( $toggleBtn.data( 'icon-hover' ) ).addClass( $toggleBtn.data( 'icon' ) );
					}
				} );

			}

		},

		/**
		 * Skillbar
		 *
		 * @since 2.0.0
		 */
		skillbar: function() {

			$( '.vcex-skillbar' ).each( function() {
				var $this = $( this );
				$this.appear( function() {
					$this.find( '.vcex-skillbar-bar' ).animate( {
						width: $( this ).attr( 'data-percent' )
					}, 800 );
				} );
			}, {
				accX : 0,
				accY : 0
			} );

		},

		/**
		 * Milestones
		 *
		 * @since 2.0.0
		 */
		milestone: function() {

			$( '.vcex-animated-milestone' ).each( function() {
				$( this ).appear( function() {
					$( this ).find( '.vcex-milestone-time' ).countTo( {
						formatter: function ( value, options ) {
							return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, wpexLocalize.milestoneDecimalFormat );
						},
					} );
				}, {
					accX : 0,
					accY : 0
				} );
			} );

		},

		/**
		 * VCEX Navbar
		 *
		 * @since 3.3.2
		 */
		vcexNavbar: function() {

			var self = this;

			// Sticky
			self.config.$window.on( 'load', function() {

				// Define sticky nav element
				var $stickyNav = $( '.vcex-navbar-sticky' );

				// Add sticky nav function
				if ( $stickyNav.length == 1 ) {
					$stickyNav.sticky( {
						responsiveWidth  : true,
						wrapperClassName : 'vcex-navbar-sticky-wrapper'
					} );

					// Set wrapper height equal to sticky to make sure offset is correct
					$( '.vcex-navbar-sticky-wrapper' ).css( {
						height : $stickyNav.outerHeight()
					} );

					// Update wrapper height on resize
					self.config.$window.resize( function() {
						$( '.vcex-navbar-sticky-wrapper' ).css( {
							height : $stickyNav.outerHeight()
						} );
					} );

				}
			} );

		},

		/**
		 * Advanced Parallax
		 *
		 * @since 2.0.0
		 */
		parallax: function() {

			$( '.wpex-parallax-bg' ).each( function() {
				var $this = $( this );
				$this.scrolly2().trigger( 'scroll' );
				$this.css( {
					'opacity' : 1
				} );
			} );

		},

		/**
		 * Local Scroll Offset
		 *
		 * @since 2.0.0
		 */
		parseLocalScrollOffset: function() {

			// Return custom offset
			if ( wpexLocalize.localScrollOffset ) {
				return wpexLocalize.localScrollOffset;
			}

			// Define return var
			var $offSet = 0;

			// VCEX Navbar module
			if ( $( '.vcex-navbar-sticky' ).length ) {
				$offSet = parseInt( $offSet ) + parseInt( $( '.vcex-navbar-sticky' ).outerHeight() );
			}

			// Fixed header
			if ( ! this.config.$verticalHeaderActive
				&& this.config.$siteHeader
				&& this.config.$hasStickyHeader
				&& this.config.$siteHeaderHeight
				&& this.config.$siteHeader.hasClass( 'fixed-scroll' )
			) {


				// Return 0 for small screens if mobile fixed header is disabled
				if ( ! this.config.$hasStickyMobileHeader && this.config.$windowWidth <= wpexLocalize.stickyHeaderBreakPoint ) {
					$offSet = 0;
				}

				// Return header height
				else {

					// Shrink header
					if ( this.config.$siteHeader.hasClass( 'wpex-shrink-sticky-header' ) ) {
						$offSet = wpexLocalize.shrinkHeaderHeight;
					}

					// Standard header
					else {
						$offSet = this.config.$siteHeaderHeight;
					}

				}

			}

			// Fixed Nav
			if ( $( '#site-navigation-wrap' ).length && $( '#site-navigation-wrap' ).hasClass( 'fixed-nav' ) ) {
				if ( this.config.$windowWidth >= wpexLocalize.stickyHeaderBreakPoint ) {
					$offSet = parseInt( $offSet ) + parseInt( $( '#site-navigation-wrap' ).outerHeight() );
				}
			}

			// Add sticky topbar height offset
			if ( this.config.$hasStickyTopBar && this.config.$stickyTopBarHeight ) {
				$offSet = parseInt( $offSet ) + parseInt( this.config.$stickyTopBarHeight );
			}

			// Add wp toolbar
			if ( $( '#wpadminbar' ).length ) {
				$offSet = parseInt( $offSet ) + 32;
			}

			// Return offset
			return $offSet;

		},

		/**
		 * Local scroll links array
		 *
		 * @since 2.0.0
		 */
		localScrollLinksArray: function() {

			// Define array
			var $array = []

			// Return if no local-scroll links in doc
			if ( ! $( 'li.local-scroll' ).length ) {
				return $array;
			}

			// Get all localscroll links
			var $menuLinks     = $( '#site-navigation li.local-scroll' ).children( 'a' ),
				$vcNavbarLinks = $( '.vcex-navbar-link.local-scroll' ),
				$links         = $menuLinks.add( $vcNavbarLinks );

			// Loop through links
			for ( var i=0; i < $links.length; i++ ) {

				// Add to array and save hash
				var $link = $links[i],
					$hash = '#' + $( $link ).attr('href').replace(/^.*?(#|$)/,'');

				// Hash required
				if ( $hash ) {

					// Add custom data attribute to each
					$( $link ).attr( 'data-ls_linkto', $hash );
					//$( $link ).parent( 'li.current-menu-item' ).removeClass( 'current-menu-item' );

					// Data attribute targets
					if ( $( '[data-ls_id="'+ $hash +'"]' ).length ) {
						if ( $.inArray( $hash, $array ) == -1 ) {
							$array.push( $hash );
						}
					}

					// Standard ID targets
					else if ( $( $hash ).length ) {
						if ( $.inArray( $hash, $array ) == -1 ) {
							$array.push( $hash );
						}
					}

				}

			}

			// Return array of local scroll links
			return $array;

		},

		/**
		 * Scroll to function
		 *
		 * @since 2.0.0
		 */
		scrollTo: function( hash, offset, callback ) {

			// Hash is required
			if ( ! hash ) {
				return;
			}

			// Define important vars
			var self          = this,
				$target       = null,
				$page         = $( 'html, body' ),
				$isLsDataLink = false, // we can do special things here
				$lsSpeed      = self.config.$localScrollSpeed ? parseInt( self.config.$localScrollSpeed ) : 1000;

			// Check for target in data attributes
			var $lsTarget = $( '[data-ls_id="'+ hash +'"]' );

			if ( $lsTarget.length ) {
				$target       = $lsTarget;
				$isLsDataLink = true;
			}

			// Check for targets with localscroll- in hash
			else if ( hash.indexOf( 'localscroll-' ) != -1 ) {
				var $parseHash = hash.replace( 'localscroll-', '' );
				$lsTarget = $( '[data-ls_id="'+ $parseHash +'"]' );
				if ( $lsTarget.length ) {
					$target = $lsTarget;
				} else {
					$target = $( $parseHash );
				}
			}

			// Check for straight up element with ID
			else {
				$target = $( hash );
			}

			// Target check
			if ( $target.length ) {

				// Update hash
				if ( hash && $isLsDataLink && wpexLocalize.localScrollUpdateHash ) {
					window.location.hash = hash;
				}

				// Mobile toggle Menu needs it's own code
				var $mobileToggleNav = $( '.mobile-toggle-nav' );
				if ( $mobileToggleNav.length && $mobileToggleNav.is( ':visible' ) ) {
					if ( wpexLocalize.animateMobileToggle ) {
						$( '.mobile-toggle-nav' ).slideUp( 'fast', function() {
							$( '.mobile-toggle-nav' ).removeClass( 'visible' );
							$page.stop( true, true ).animate( {
								scrollTop: $target.offset().top
							}, $lsSpeed );
						} );
					} else {
						$( '.mobile-toggle-nav' ).hide().removeClass( 'visible' );
						$page.stop( true, true ).animate( {
							scrollTop: $target.offset().top
						}, $lsSpeed );
					}

				}

				// Scroll to target
				else {

					// Get offset
					var $scrollTo = offset ? offset : $target.offset().top - self.config.$localScrollOffset;

					/* Stop animation if user tries to scroll while animating (BUGGY)
					$page.on( 'scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove', function() {
				       $page.stop();
				 	} );*/

					// Animate scroll
					$page.stop( true, true ).animate( {
						scrollTop: $scrollTo
					}, $lsSpeed );

				}

			}

		},

		/**
		 * Local Scroll link
		 *
		 * @since 2.0.0
		 */
		localScrollLinks: function() {

			// Set global object to "self" var
			var self = this;

			// Local Scroll - Menus
			$( 'li.local-scroll > a, .vcex-navbar-link.local-scroll' ).on( 'click', function() {
				var $hash = this.hash;
				if ( $.inArray( $hash, self.config.$localScrollArray ) > -1 ) {
					self.scrollTo( $hash );
					return false;
				}
			} );

			// Local Scroll Anylink
			$( '.local-scroll-link' ).click( function() {
				var $hash = this.hash;
				self.scrollTo( $hash );
				return false;
			} );

			// LocalScroll Woocommerce Reviews
			$( 'body.single div.entry-summary a.woocommerce-review-link' ).click( function() {
				var $hash   = this.hash,
					$target = $( $hash );
				if ( $target.length ) {
					var $offset = $target.offset().top - self.config.$localScrollOffset - 20;
					self.scrollTo( $hash, $offset );
				}
				return false;
			} );

		},

		/**
		 * Local Scroll Highlight on scroll
		 *
		 * @since 2.0.0
		 */
		localScrollHighlight: function() {

			// Get local scroll array
			var self              = this,
				$localScrollArray = this.config.$localScrollArray;

			// Return if there aren't any local scroll items
			if ( ! $localScrollArray.length ) {
				return;
			}

			// Define vars
			var $windowPos    = this.config.$window.scrollTop(),
				$windowHeight = this.config.$windowHeight,
				$docHeight    = this.config.$document.height();

			// Highlight active items
			for ( var i=0; i < $localScrollArray.length; i++ ) {

				// Get section
				var $section = $localScrollArray[i];

				// Data attribute targets
				if ( $( '[data-ls_id="'+ $section +'"]' ).length ) {
					var $targetDiv     = $( '[data-ls_id="'+ $section +'"]' ),
						$divPos        = $targetDiv.offset().top - self.config.$localScrollOffset - 1,
						$divHeight     = $targetDiv.outerHeight(),
						$higlight_link = $( '[data-ls_linkto="'+ $section +'"]' );
				}

				// Standard element targets
				else if ( $( $section ).length ) {
					var $divPos        = $( $section ).offset().top - self.config.$localScrollOffset - 1,
						$divHeight     = $( $section ).outerHeight(),
						$higlight_link = $( '[data-ls_linkto="'+ $section +'"]' );
				}

				// Higlight items
				if ( $windowPos >= $divPos && $windowPos < ( $divPos + $divHeight ) ) {
					if ( $higlight_link.hasClass( 'vcex-navbar-link' ) ) {
						$higlight_link.addClass( 'active' );
					}
					$higlight_link.parent( 'li' ).addClass( 'current-menu-item' );
				} else {
					if ( $higlight_link.hasClass( 'vcex-navbar-link' ) ) {
						$higlight_link.removeClass( 'active' );
					}
					$higlight_link.parent( 'li' ).removeClass( 'current-menu-item' );
				}

			}

			/* Highlight last item if at bottom of page - needs major testing now.
			var $lastLink = $localScrollArray[$localScrollArray.length-1];
			if ( $windowPos + $windowHeight == $docHeight ) {
				$( '.local-scroll.current-menu-item' ).removeClass( 'current-menu-item' );
				$( "li.local-scroll a[href='" + $lastLink + "']" ).parent( 'li' ).addClass( 'current-menu-item' );
			}*/

		},

		/**
		 * Scroll to Hash
		 *
		 * @since 2.0.0
		 */
		scrollToHash: function( $this ) {

			// Declare function vars
			var self  = $this,
				$hash = location.hash;

			// Hash needed
			if ( ! $hash ) {
				return;
			}

			// Scroll to hash for localscroll links
			if ( $hash.indexOf( 'localscroll-' ) != -1 ) {
				self.scrollTo( $hash.replace( 'localscroll-', '' ) );
				return;
			}

			// Check elements with data attributes
			else if ( $( '[data-ls_id="'+ $hash +'"]' ).length ) {
				self.scrollTo( $hash );
			}

		},

		/**
		 * Equal heights function
		 *
		 * @since 2.0.0
		 */
		equalHeights: function() {

			// Make sure equal heights function is defined
			if ( ! $.fn.matchHeight ) {
				return;
			}
			
			// Add equal heights
			$( '.equal-height-column, .match-height-row .match-height-content, .vcex-feature-box-match-height .vcex-match-height, .equal-height-content, .match-height-grid .match-height-content, .blog-entry-equal-heights .blog-entry-inner, .wpex-vc-row-columns-match-height .wpex-vc-column-wrapper' ).matchHeight();

		},

		/**
		 * Footer Reveal Display on Load
		 *
		 * @since 2.0.0
		 */
		footerRevealInit: function() {

			// Return if disabled
			if ( ! this.config.$hasFooterReveal ) {
				return;
			}

			// Declare main vars
			var $showFooter         = false,
				$windowHeight       = $( window ).height(),
				$footerRevealHeight = $( '.footer-reveal' ).outerHeight();

			// If window height is greater then the wrap height display footer
			if ( $windowHeight > $( '#wrap' ).height() ) {
				$showFooter = true;
			}

			// If window height is smaller then footer reveal display footer
			if ( $windowHeight < $footerRevealHeight ) {
				$showFooter = true;
			}

			// Display footer reveal since we can't properly perform the reveal
			if ( $showFooter ) {
				$( '.footer-reveal' ).show().toggleClass( 'footer-reveal footer-reveal-visible' );
			}

			// Add margin to the wrap div for the footer reveal
			else {
				
				$( '#wrap' ).css( {
					'margin-bottom': $footerRevealHeight
				} );

			}

		},

		/**
		 * Footer Reveal Display on Scroll
		 *
		 * @since 2.0.0
		 */
		footerRevealScrollShow: function() {
			if ( this.config.$hasFooterReveal ) {
				if ( this.config.$windowTop > $( '#main' ).offset().top ) {
					if ( ! $( '.footer-reveal' ).hasClass( 'wpex-visible' ) ) {
						$( '.footer-reveal' ).show().addClass( 'wpex-visible' );
					}
				} else {
					if ( $( '.footer-reveal' ).hasClass( 'wpex-visible' ) ) {
						$( '.footer-reveal' ).removeClass( 'wpex-visible' ).hide();
					}
				}
			}
		},

		/**
		 * Set min height on main container to prevent issue with extra space below footer
		 *
		 * @since 3.1.1
		 */
		fixedFooter: function() {

			// Return if disabled
			if ( ! this.config.$hasFixedFooter ) {
				return;
			}

			// Get main wrapper
			var $main = $( '#main' );

			// Make sure main exists
			if ( $main.length ) {

				// Set main vars
				var $mainHeight = $( '#main' ).outerHeight(),
					$htmlHeight = $( 'html' ).height();

				// Check for footerReveal and add min height
				var $minHeight = $mainHeight + ( this.config.$window.height() - $htmlHeight );

				// Add min height
				$main.css( 'min-height', $minHeight );

			}
		},

		/**
		 * Custom Selects
		 *
		 * @since 2.0.0
		 */
		customSelects: function() {
			$( wpexLocalize.customSelects ).customSelect( {
				customClass: 'theme-select'
			} );
		},

		/**
		 * FadeIn Elements
		 *
		 * @since 2.0.0
		 */
		fadeIn: function() {
			$( '.fade-in-image, .wpex-show-on-load' ).addClass( 'no-opacity' );
		},

		/**
		 * OwlCarousel
		 *
		 * @since 2.0.0
		 */
		owlCarousel: function() {

			var self = this;
			
			$( '.wpex-carousel' ).each( function() {

				var $this = $( this ),
					$data = $this.data();

				$this.owlCarousel( {
					animateIn          : false,
					animateOut         : false,
					lazyLoad           : false,
					smartSpeed         : self.parseData( $data.smartSpeed, wpexLocalize.carouselSpeed ),
					rtl                : self.config.$isRTL,
					dots               : $data.dots,
					nav                : $data.nav,
					items              : $data.items,
					slideBy            : $data.slideby,
					center             : $data.center,
					loop               : $data.loop,
					margin             : $data.margin,
					autoplay           : $data.autoplay,
					autoplayTimeout    : $data.autoplayTimeout,
					autoplayHoverPause : true,
					navText            : [ '<span class="fa fa-chevron-left"><span>', '<span class="fa fa-chevron-right"></span>' ],
					responsive         : {
						0: {
							items : $data.itemsMobilePortrait
						},
						480: {
							items : $data.itemsMobileLandscape
						},
						768: {
							items : $data.itemsTablet
						},
						960: {
							items : $data.items
						}
					}
				} );
			} );

		},

		/**
		 * SliderPro
		 *
		 * @since 2.0.0
		 */
		sliderPro: function() {

			// Set main object to self
			var self = this;

			// Loop through each slider
			$( '.wpex-slider' ).each( function() {

				// Declare vars
				var $slider = $( this ),
					$data   = $slider.data();

				// Lets show things that were hidden to prevent flash
				$( '.wpex-slider-slide, .wpex-slider-thumbnails' ).css( {
						'opacity': 1,
						'display': 'block'
				} );

				// Get height based on first items to prevent animation on initial load
				var $preloader = $( '.wpex-slider' ).prev( '.wpex-slider-preloaderimg' ),
					$height = $preloader.length ? $preloader.outerHeight() : null,
					$heightAnimationDuration = self.parseData( $data.heightAnimationDuration, 500 );

				// Run slider
				$slider.sliderPro( {
					responsive              : true,
					width                   : '100%',
					height                  : $height,
					fade                    : self.parseData( $data.fade, 600 ),
					touchSwipe              : self.parseData( $data.touchSwipe, true ),
					fadeDuration            : self.parseData( $data.animationSpeed, 600 ),
					slideAnimationDuration  : self.parseData( $data.animationSpeed, 600 ),
					autoHeight              : self.parseData( $data.autoHeight, true ),
					heightAnimationDuration : $heightAnimationDuration,
					arrows                  : self.parseData( $data.arrows, true ),
					fadeArrows              : self.parseData( $data.fadeArrows, true ),
					autoplay                : self.parseData( $data.autoPlay, true ),
					autoplayDelay           : self.parseData( $data.autoPlayDelay, 5000 ),
					buttons                 : self.parseData( $data.buttons, true ),
					shuffle                 : self.parseData( $data.shuffle, false ),
					orientation             : self.parseData( $data.direction, 'horizontal' ),
					loop                    : self.parseData( $data.loop, false ),
					keyboard                : false,
					fullScreen              : self.parseData( $data.fullscreen, false ),
					slideDistance           : self.parseData( $data.slideDistance, 0 ),
					thumbnailHeight         : self.parseData( $data.thumbnailHeight, 70 ),
					thumbnailWidth          : self.parseData( $data.thumbnailWidth, 70 ),
					thumbnailPointer        : self.parseData( $data.thumbnailPointer, false ),
					updateHash              : self.parseData( $data.updateHash, false ),
					thumbnailArrows         : false,
					fadeThumbnailArrows     : false,
					thumbnailTouchSwipe     : true,
					fadeCaption             : self.parseData( $data.fadeCaption, true ),
					captionFadeDuration     : 500,
					waitForLayers           : true,
					autoScaleLayers         : true,
					forceSize               : 'none',
					thumbnailPosition       : 'bottom',
					reachVideoAction        : 'playVideo',
					leaveVideoAction        : 'pauseVideo',
					endVideoAction          : 'nextSlide',
					init                    : function( event ) {
						$slider.prev( '.wpex-slider-preloaderimg' ).hide();
						if ( $slider.parent( '.gallery-format-post-slider' ) && $( '.blog-masonry-grid' ).length ) {
							setTimeout( function() {
								$( '.blog-masonry-grid' ).isotope( 'layout' );
							}, $heightAnimationDuration + 1 );
						}
					},
					gotoSlideComplete       : function( event ) {
						if ( $slider.parent( '.gallery-format-post-slider' ) && $( '.blog-masonry-grid' ).length ) {
							$( '.blog-masonry-grid' ).isotope( 'layout' );
						}
					}

				} );

			} );

			// WooCommerce: Prevent clicking on Woo entry slider
			$( '.woo-product-entry-slider' ).click( function() {
				return false;
			} );

		   
		},

		/**
		 * Isotope Grids
		 *
		 * @since 2.0.0
		 */
		isotopeGrids: function() {

			var self = this;

			$( '.vcex-isotope-grid' ).each( function() {

				// Isotope layout
				var $container = $( this );

				// Run only once images have been loaded
				$container.imagesLoaded( function() {

					// Crete the isotope layout
					var $grid = $container.isotope( {
						itemSelector       : '.vcex-isotope-entry',
						transformsEnabled  : true,
						isOriginLeft       : self.config.$isRTL ? false : true,
						transitionDuration : $container.data( 'transition-duration' ) ? $container.data( 'transition-duration' ) + 's' : '0.4s',
						layoutMode         : $container.data( 'layout-mode' ) ? $container.data( 'layout-mode' ) : 'masonry',
						filter             : $container.data( 'filter' ) ? $container.data( 'filter' ) : ''
					} );

					// Filter links
					var $filter = $container.prev( 'ul.vcex-filter-links' );
					if ( $filter.length ) {
						var $filterLinks = $filter.find( 'a' );
						$filterLinks.click( function() {
							$grid.isotope( {
								filter: $( this ).attr( 'data-filter' )
							} );
							$( this ).parents( 'ul' ).find( 'li' ).removeClass( 'active' );
							$( this ).parent( 'li' ).addClass( 'active' );
							return false;
						} );
					}

					/* Run functions on trigger
					$grid.on( 'arrangeComplete', function() {
						// You can do cool things here
					} );*/

				} );

			} );

		},

		/**
		 * Isotope Grids
		 *
		 * @since 2.0.0
		 */
		archiveMasonryGrids: function() {

			// Define main vars
			var self      = this,
				$archives = $( '.blog-masonry-grid,div.wpex-row.portfolio-masonry,div.wpex-row.portfolio-no-margins,div.wpex-row.staff-masonry,div.wpex-row.staff-no-margins' );

			// Loop through archives
			$archives.each( function() {

				var $this               = $( this ),
					$data               = $this.data(),
					$transitionDuration = self.parseData( $data.transitionDuration, '0.0' ),
					$layoutMode         = self.parseData( $data.layoutMode, 'masonry' );

				// Load isotope after images loaded
				$this.imagesLoaded( function() {
					$this.isotope( {
						itemSelector       : '.isotope-entry',
						transformsEnabled  : true,
						isOriginLeft       : self.config.$isRTL ? false : true,
						transitionDuration : $transitionDuration + 's'
					} );
				} );

			} );

		},

		/**
		 * iLightbox
		 *
		 * @since 2.0.0
		 */
		iLightbox: function() {

			// Set main object to self
			var self = this;

			// Auto lightbox
			if ( wpexLocalize.iLightbox.auto ) {
				var $iLightboxAutoExtensions = ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'tiff', 'tif', 'jfif', 'jpe'];
				$( '.wpb_text_column a:has(img), body.no-composer .entry a:has(img)' ).each( function() {
					var $this = $( this ),
						$url  = $this.attr( 'href' ),
						$ext  = self.getUrlExtension( $url );
					if ( $iLightboxAutoExtensions.indexOf( $ext ) !== -1 ) {
						$this.addClass( 'wpex-lightbox' );
					}
				} );
			}

			// Lightbox Standard
			$( '.wpex-lightbox' ).each( function() {

				var $this = $( this );

				if ( ! $this.hasClass( 'wpex-lightbox-group-item' ) ) {

					var $data = $this.data();

					$this.iLightBox( {
						skin     : self.parseData( $data.skin, wpexLocalize.iLightbox.skin ),
						controls : {
							fullscreen : wpexLocalize.iLightbox.controls.fullscreen
						},
						show     : {
							title : wpexLocalize.iLightbox.show.title,
							speed : parseInt( wpexLocalize.iLightbox.show.speed )
						},
						hide     : {
							speed : parseInt( wpexLocalize.iLightbox.hide.speed )
						},
						effects  : {
							reposition      : true,
							repositionSpeed : 200,
							switchSpeed     : 300,
							loadedFadeSpeed : wpexLocalize.iLightbox.effects.loadedFadeSpeed,
							fadeSpeed       : wpexLocalize.iLightbox.effects.fadeSpeed
						},
						overlay  : wpexLocalize.iLightbox.overlay,
						social   : wpexLocalize.iLightbox.social
					} );

				}

			} );

			// Lightbox Videos => OLD SCHOOL STUFF, keep for old customers
			$( '.wpex-lightbox-video, .wpb_single_image.video-lightbox a, .wpex-lightbox-autodetect, .wpex-lightbox-autodetect a' ).each( function() {

				var $this = $( this ),
					$data = $this.data();

				$this.iLightBox( {
					smartRecognition : true,
					skin             : self.parseData( $data.skin, wpexLocalize.iLightbox.skin ),
					path             : 'horizontal',
					controls         : {
						fullscreen : wpexLocalize.iLightbox.controls.fullscreen
					},
					show             : {
						title : wpexLocalize.iLightbox.show.title,
						speed : parseInt( wpexLocalize.iLightbox.show.speed )
					},
					hide             : {
						speed : parseInt( wpexLocalize.iLightbox.hide.speed )
					},
					effects          : {
						reposition      : true,
						repositionSpeed : 200,
						switchSpeed     : 300,
						loadedFadeSpeed : wpexLocalize.iLightbox.effects.loadedFadeSpeed,
						fadeSpeed       : wpexLocalize.iLightbox.effects.fadeSpeed
					},
					overlay : wpexLocalize.iLightbox.overlay,
					social  : wpexLocalize.iLightbox.social
				} );
			} );

			// Lightbox Galleries - NEW since 1.6.0
			$( '.lightbox-group' ).each( function() {

				// Get lightbox data
				var $this = $( this ),
					$item = $this.find( 'a.wpex-lightbox-group-item' ),
					$data = $this.data();

				// Start up lightbox
				$item.iLightBox( {
					skin     : self.parseData( $data.skin, wpexLocalize.iLightbox.skin ),
					path     : self.parseData( $data.path, wpexLocalize.iLightbox.path ),
					infinite : true,
					show     : {
						title : wpexLocalize.iLightbox.show.title,
						speed : parseInt( wpexLocalize.iLightbox.show.speed )
					},
					hide     : {
						speed: parseInt( wpexLocalize.iLightbox.hide.speed )
					},
					controls : {
						arrows     : self.parseData( $data.arrows, wpexLocalize.iLightbox.controls.arrows ),
						thumbnail  : self.parseData( $data.thumbnails, wpexLocalize.iLightbox.controls.thumbnail ),
						fullscreen : wpexLocalize.iLightbox.controls.fullscreen,
						mousewheel : wpexLocalize.iLightbox.controls.mousewheel
					},
					effects : {
						reposition      : true,
						repositionSpeed : 200,
						switchSpeed     : 300,
						loadedFadeSpeed : wpexLocalize.iLightbox.effects.loadedFadeSpeed,
						fadeSpeed       : wpexLocalize.iLightbox.effects.fadeSpeed
					},
					overlay : wpexLocalize.iLightbox.overlay,
					social  : wpexLocalize.iLightbox.social
				} );

			} );

			// Lightbox Gallery with custom imgs
			$( '.wpex-lightbox-gallery' ).on( 'click', function( event ) {
				// event.preventDefault(); // to fix customizer bug
				var imagesArray = $( this ).data( 'gallery' ).split( ',' );
				if ( imagesArray ) {
					$.iLightBox( imagesArray, {
						skin: wpexLocalize.iLightbox.skin,
						path: 'horizontal',
						infinite: true,
						show: {
							title: wpexLocalize.iLightbox.show.title,
							speed: parseInt( wpexLocalize.iLightbox.show.speed )
						},
						hide: {
							speed: parseInt( wpexLocalize.iLightbox.hide.speed )
						},
						controls: {
							arrows: wpexLocalize.iLightbox.controls.arrows,
							thumbnail: wpexLocalize.iLightbox.controls.thumbnail,
							fullscreen: wpexLocalize.iLightbox.controls.fullscreen,
							mousewheel: wpexLocalize.iLightbox.controls.mousewheel
						},
						effects: {
							reposition: true,
							repositionSpeed: 200,
							switchSpeed: 300,
							loadedFadeSpeed: wpexLocalize.iLightbox.effects.loadedFadeSpeed,
							fadeSpeed: wpexLocalize.iLightbox.effects.fadeSpeed
						},
						overlay: wpexLocalize.iLightbox.overlay,
						social : wpexLocalize.iLightbox.social
					} );
				}
				return false;
			} );

		},

		/**
		 * Overlay Hovers
		 *
		 * @since 2.0.0
		 */
		overlayHovers: function() {

			$( '.overlay-parent-title-push-up' ).each( function() {

				// Define vars
				var $this        = $( this ),
					$title       = $this.find( '.overlay-title-push-up' ),
					$child       = $this.find( 'a' ),
					$img         = $child.find( 'img' ),
					$titleHeight = $title.outerHeight();

				// Create overlay after image is loaded to prevent issues
				$this.imagesLoaded( function() {

					// Position title
					$title.css( {
						'bottom' : - $titleHeight
					} );

					// Add height to child
					$child.css( {
						'height' : $img.outerHeight()
					} );

					// Position image
					$img.css( {
						'position' : 'absolute',
						'top'      : '0',
						'left'     : '0',
						'width'    : '100%',
						'height'   : '100%'
					} );

					// Animate image on hover
					$this.hover( function() {
						$img.css( {
							'top' : -20
						} );
						$title.css( {
							'bottom' : 0
						} );
					}, function() {
						$img.css( {
							'top' : '0'
						} );
						$title.css( {
							'bottom' : - $titleHeight
						} );
					} );

				} );

			} );

		},

		/**
		 * WooCommerce Selects
		 *
		 * @since 2.0.0
		 */
		wooSelects: function() {
			if ( $.fn.select2 !== undefined ) {
				$( '#calc_shipping_country' ).select2();
			}
		},

		/**
		 * Parses data to check if a value is defined in the data attribute and if not returns the fallback
		 *
		 * @since 2.0.0
		 */
		parseData: function( val, fallback ) {
			return ( typeof val !== 'undefined' ) ? val : fallback;
		},

		/**
		 * Returns extension from URL
		 */
		getUrlExtension: function( url ) {
			var ext = url.split( '.' ).pop().toLowerCase(),
				extra = ext.indexOf( '?' ) !== -1 ? ext.split( '?' ).pop() : '';
			return ext.replace( extra, '' );
		}


	}; // END wpexTheme

	// Start things up
	wpexTheme.init();

} ) ( jQuery );