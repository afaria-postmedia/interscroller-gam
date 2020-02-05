(function() {
  /**
   *  Constants
   */
  // Component name
  const NAME = 'interscroller';

  // Version
  const VERSION = '1.41';

  // Flag for dev mode
  const IS_DEV = true;

  // Defined widths
  const WIDTH_DESKTOP = 1000;
  const WIDTH_MOBILE_TABLET = 300;

  // Defined heights
  const HEIGHT_DESKTOP = 700;
  const HEIGHT_MOBILE_TABLET = 600;

  // Placeholder
  const PLACEHOLDER_IMAGE_COLOR = '000000';
  const PLACEHOLDER_BG_COLOR = 'ff0000';

  /**
   *  Global vars
   *
   *  imageUrl        {URL}   the desktop creative image url -> [%image_url%]
   *  mobileImageUrl  {URL}   the mobile/tablet creative image url -> [%mobile_image_url%]
   *  bgColor         {Text}  the background color hex -> [%bg_color%]
   *  clickUrl        {URL}   the url to go to when the ad is clicked -> [%click_url%]
   *  forceHeight     {List}  whether to stretch the height of the image (yes/no) -> [%force_height%]
   *
   *  iframe          {HTMLElement}   the <iframe> element where the ad is served
   *  viewpoint       {HTMLElement}   the <div> that contains the above iframe
   */
  var imageUrl, mobileImageUrl, bgColor, clickUrl, forceHeight, iframe, viewport;

  /**
   *  If dev mode, load pre-defined values
   */
  if (IS_DEV) {
    imageUrl =
      'http://via.placeholder.com/' + WIDTH_DESKTOP + 'x' + HEIGHT_DESKTOP + '/' + PLACEHOLDER_IMAGE_COLOR + '/ffffff?text=' + WIDTH_DESKTOP + '%20x%20' + HEIGHT_DESKTOP;
    mobileImageUrl =
      'http://via.placeholder.com/' + WIDTH_MOBILE_TABLET + 'x' + HEIGHT_MOBILE_TABLET + '/' + PLACEHOLDER_IMAGE_COLOR + '/ffffff?text=' + WIDTH_MOBILE_TABLET + '%20x%20' + HEIGHT_MOBILE_TABLET;
    bgColor = '#' + PLACEHOLDER_BG_COLOR;
    clickUrl = 'https://nationalpost.com';
    forceHeight = 'no';

    /**
     *  If production, load values from GAM variables
     */
  } else {
    imageUrl = '[%image_url%]';
    mobileImageUrl = '[%mobile_image_url%]';
    bgColor = '[%bg_color%]';
    clickUrl = '[%click_url%]';
    forceHeight = '[%force_height%]';
  }

  /**
   *  addStyles
   *  @description adds multiple style properties to element
   *  @param el - the dom element
   *  @param styles - object containing style props
   */
  function addStyles(el, styles) {
    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        const style = styles[key];
        el.style[key] = style;
      }
    }
  }

  /**
   *  updateStyles
   *  @description updates styles for ifram/viewport
   */
  function updateStyles() {
    /**
     *  Iframe styles
     */
    addStyles(iframe, {
      width: window.parent.innerWidth + 'px'
    });

    /**
     *  Viewport styles
     */
    addStyles(viewport, {
      width: window.parent.innerWidth + 'px',
      height: (!isDesktop() ? HEIGHT_MOBILE_TABLET : HEIGHT_DESKTOP) + 'px',
      backgroundImage: 'url(' + (!isDesktop() ? mobileImageUrl : imageUrl) + ')'
    });
  }

  /**
   *  isValid
   *  @description determine whether the component can be init or not
   *  @return boolean
   */
  function isValid() {
    return imageUrl !== '';
  }

  /**
   *  isDesktop
   *  @description determine if desktop based on window size
   *  @return boolean
   */
  function isDesktop() {
    return window.parent.innerWidth >= 1024;
  }

  /**
   *  setElements
   *  @description assign main elements to global vars
   */
  function setElements() {
    iframe = window.parent.document.querySelector('.ad iframe');
    viewport = iframe.parentElement;
  }

  /**
   *  init
   *  @description initalizes interscroller
   */
  function init() {
    /**
     *  Logging, if dev ..
     */
    if (IS_DEV) console.log('Init ' + NAME + ' v' + VERSION);

    /**
     *  Set main elements
     */
    setElements();

    /**
     *  Force iframe height 100%
     */
    iframe.style.height = '100%';

    /**
     *  Add styles
     */
    addStyles(viewport, {
      width: window.parent.innerWidth + 'px',
      background:
        (bgColor !== '' ? bgColor + ' ' : '') +
        'no-repeat fixed center center' +
        (forceHeight && forceHeight === 'yes' ? ' / contain' : '')
    });

    /**
     *  Add click link
     */
    if (clickUrl !== '') {
      var link = document.createElement('a');
      link.setAttribute('href', clickUrl);
      link.setAttribute('target', '_top');
      link.setAttribute('style', 'display:block;height:100%;');
      document.body.appendChild(link);
    }

    /**
     *  Update styles and add resize event
     */
    updateStyles();
    window.parent.addEventListener('resize', updateStyles);
  }

  /**
   *  Init if desktop
   */
  if (isDesktop() && isValid())
    document.addEventListener('DOMContentLoaded', init);
})();