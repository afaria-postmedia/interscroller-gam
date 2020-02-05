(function() {
  /**
   *  Constants
   */

  // Component name
  const NAME = 'interscroller';

  // Version
  const VERSION = '1.37';

  // Flag for dev mode
  const IS_DEV = true;

  // Flag for stretching bg height
  const STRETCH_BG_HEIGHT = true;

  /**
   *  Global vars
   *
   *  imageUrl        {URL}   the desktop creative image url -> [%image_url%]
   *  mobileIMageUrl  {URL}   the mobile/tablet creative image url -> [%mobile_image_url%]
   *  bgColor         {Text}  the background color hex -> [%bg_color%]
   *  clickUrl        {URL}   the url to go to when the ad is clicked -> [%click_url%]
   *
   *  iframe          {HTMLElement}   the <iframe> element where the ad is served
   *  viewpoint       {HTMLElement}   the <div> that contains the above iframe
   */
  var imageUrl, mobileImageUrl, bgColor, clickUrl, iframe, viewport;

  /**
   *  If dev mode, load pre-defined values
   */
  if (IS_DEV) {
    imageUrl =
      'http://via.placeholder.com/1000x700/000000/ffffff?text=1000%20x%20700';
    mobileImageUrl =
      'http://via.placeholder.com/300x600/000000/ffffff?text=300%20x%20600';
    bgColor = '#ff0000';
    clickUrl = 'https://nationalpost.com';

    /**
     *  If production, load values from GAM variables
     */
  } else {
    imageUrl = '[%image_url%]';
    mobileImageUrl = '[%mobile_image_url%]';
    bgColor = '[%bg_color%]';
    clickUrl = '[%click_url%]';
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
      height: (!isDesktop() ? 600 : 700) + 'px',
      backgroundImage: 'url(' + (!isDesktop() ? mobileImageUrl : imageUrl) + ')'
    });
  }

  /**
   *  isValid
   *  @description determine if desktop based on window size
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
        (STRETCH_BG_HEIGHT ? ' / contain' : '')
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