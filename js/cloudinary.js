(function() {
  /*
 * Cloudinary's Javascript library - v1.0.24
 * Copyright Cloudinary
 * see https://github.com/cloudinary/cloudinary_js
 */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'lodash'
        ], factory);
    } else {
        // Browser globals:
        factory(_);
    }
}(function (_) {
;

  /**
    * Includes utility methods and lodash / jQuery shims
   */

  /**
    * Verifies that jQuery is present.
    *
    * @returns {boolean} true if jQuery is defined
   */
  var ArrayParam, Cloudinary, Configuration, HtmlTag, ImageTag, Param, RangeParam, RawParam, Transformation, TransformationBase, TransformationParam, VideoTag, addClass, augmentWidthOrHeight, contains, crc32, cssExpand, cssValue, curCSS, exports, getAttribute, getData, getStyles, getWidthOrHeight, global, hasClass, isJQuery, pnum, process_video_params, ref, rnumnonpx, setAttribute, setAttributes, setData, utf8_encode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isJQuery = function() {
    return typeof jQuery !== "undefined" && jQuery !== null;
  };


  /**
    * Get data from the DOM element.
    *
    * This method will use jQuery's `data()` method if it is available, otherwise it will get the `data-` attribute
    * @param {Element} element - the element to get the data from
    * @param {String} name - the name of the data item
    * @returns the value associated with the `name`
    *
   */

  getData = function(element, name) {
    if (isJQuery()) {
      return jQuery(element).data(name);
    } else if (_.isElement(element)) {
      return element.getAttribute("data-" + name);
    }
  };


  /**
    * Set data in the DOM element.
    *
    * This method will use jQuery's `data()` method if it is available, otherwise it will set the `data-` attribute
    * @param {Element} element - the element to set the data in
    * @param {String} name - the name of the data item
    * @param {*} value - the value to be set
    *
   */

  setData = function(element, name, value) {
    if (isJQuery()) {
      return jQuery(element).data(name, value);
    } else if (_.isElement(element)) {
      return element.setAttribute("data-" + name, value);
    }
  };


  /**
    * Get attribute from the DOM element.
    *
    * This method will use jQuery's `attr()` method if it is available, otherwise it will get the attribute directly
    * @param {Element} element - the element to set the attribute for
    * @param {String} name - the name of the attribute
    * @returns {*} the value of the attribute
    *
   */

  getAttribute = function(element, name) {
    if (isJQuery()) {
      return jQuery(element).attr(name);
    } else if (_.isElement(element)) {
      return element.getAttribute(name);
    }
  };


  /**
    * Set attribute in the DOM element.
    *
    * This method will use jQuery's `attr()` method if it is available, otherwise it will set the attribute directly
    * @param {Element} element - the element to set the attribute for
    * @param {String} name - the name of the attribute
    * @param {*} value - the value to be set
    *
   */

  setAttribute = function(element, name, value) {
    if (isJQuery()) {
      return jQuery(element).attr(name, value);
    } else if (_.isElement(element)) {
      return element.setAttribute(name, value);
    }
  };

  setAttributes = function(element, attributes) {
    var name, results, value;
    if (isJQuery()) {
      return jQuery(element).attr(attributes);
    } else {
      results = [];
      for (name in attributes) {
        value = attributes[name];
        if (value != null) {
          results.push(setAttribute(element, name, value));
        } else {
          results.push(element.removeAttribute(name));
        }
      }
      return results;
    }
  };

  hasClass = function(element, name) {
    if (isJQuery()) {
      return jQuery(element).hasClass(name);
    } else if (_.isElement(element)) {
      return element.className.match(new RegExp("\\b" + name + "\\b"));
    }
  };

  addClass = function(element, name) {
    if (!element.className.match(new RegExp("\\b" + name + "\\b"))) {
      return element.className = _.trim(element.className + " " + name);
    }
  };

  getStyles = function(elem) {
    if (elem.ownerDocument.defaultView.opener) {
      return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
    }
    return window.getComputedStyle(elem, null);
  };

  cssExpand = ["Top", "Right", "Bottom", "Left"];

  contains = function(a, b) {
    var adown, bup;
    adown = (a.nodeType === 9 ? a.documentElement : a);
    bup = b && b.parentNode;
    return a === bup || !!(bup && bup.nodeType === 1 && adown.contains(bup));
  };

  curCSS = function(elem, name, computed) {
    var maxWidth, minWidth, ret, style, width;
    width = void 0;
    minWidth = void 0;
    maxWidth = void 0;
    ret = void 0;
    style = elem.style;
    computed = computed || getStyles(elem);
    if (computed) {
      ret = computed.getPropertyValue(name) || computed[name];
    }
    if (computed) {
      if (ret === "" && !contains(elem.ownerDocument, elem)) {
        ret = jQuery.style(elem, name);
      }
      if (rnumnonpx.test(ret) && rmargin.test(name)) {
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;
        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;
        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }
    if (ret !== undefined) {
      return ret + "";
    } else {
      return ret;
    }
  };

  cssValue = function(elem, name, convert, styles) {
    var val;
    val = curCSS(elem, name, styles);
    if (convert) {
      return parseFloat(val);
    } else {
      return val;
    }
  };

  augmentWidthOrHeight = function(elem, name, extra, isBorderBox, styles) {
    var j, len, side, sides, val;
    if (extra === (isBorderBox ? "border" : "content")) {
      return 0;
    } else {
      sides = name === "width" ? ["Right", "Left"] : ["Top", "Bottom"];
      val = 0;
      for (j = 0, len = sides.length; j < len; j++) {
        side = sides[j];
        if (extra === "margin") {
          val += cssValue(elem, extra + side, true, styles);
        }
        if (isBorderBox) {
          if (extra === "content") {
            val -= cssValue(elem, "padding" + side, true, styles);
          }
          if (extra !== "margin") {
            val -= cssValue(elem, "border" + side + "Width", true, styles);
          }
        } else {
          val += cssValue(elem, "padding" + side, true, styles);
          if (extra !== "padding") {
            val += cssValue(elem, "border" + side + "Width", true, styles);
          }
        }
      }
      return val;
    }
  };

  pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

  rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

  getWidthOrHeight = function(elem, name, extra) {
    var isBorderBox, styles, val, valueIsBorderBox;
    valueIsBorderBox = true;
    val = (name === "width" ? elem.offsetWidth : elem.offsetHeight);
    styles = getStyles(elem);
    isBorderBox = cssValue(elem, "boxSizing", false, styles) === "border-box";
    if (val <= 0 || (val == null)) {
      val = curCSS(elem, name, styles);
      if (val < 0 || (val == null)) {
        val = elem.style[name];
      }
      if (rnumnonpx.test(val)) {
        return val;
      }
      valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
      val = parseFloat(val) || 0;
    }
    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles);

    /*
    The following lodash methods are used in this library.
    TODO create a shim that will switch between jQuery and lodash
    
    _.all
    _.any
    _.assign
    _.camelCase
    _.cloneDeep
    _.compact
    _.contains
    _.defaults
    _.difference
    _.extend
    _.filter
    _.identity
    _.includes
    _.isArray
    _.isElement
    _.isEmpty
    _.isFunction
    _.isObject
    _.isPlainObject
    _.isString
    _.isUndefined
    _.map
    _.mapValues
    _.merge
    _.omit
    _.parseInt
    _.snakeCase
    _.trim
    _.trimRight
     */
  };

  if (!(((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) || (typeof exports !== "undefined" && exports !== null))) {
    exports = window;
  }

  if (exports.Cloudinary == null) {
    exports.Cloudinary = {};
  }

  exports.Cloudinary.getWidthOrHeight = getWidthOrHeight;


  /**
    Main Cloudinary class
  
    Backward compatibility:
    Must provide public keys
     * CF_SHARED_CDN
     * OLD_AKAMAI_SHARED_CDN
     * AKAMAI_SHARED_CDN
     * SHARED_CDN
     * config
     * url
     * video_url
     * video_thumbnail_url
     * transformation_string
     * image
     * video_thumbnail
     * facebook_profile_image
     * twitter_profile_image
     * twitter_name_profile_image
     * gravatar_image
     * fetch_image
     * video
     * sprite_css
     * responsive
     * calc_stoppoint
     * device_pixel_ratio
     * supported_dpr_values
   */

  Cloudinary = (function() {
    var AKAMAI_SHARED_CDN, CF_SHARED_CDN, DEFAULT_POSTER_OPTIONS, DEFAULT_VIDEO_SOURCE_TYPES, OLD_AKAMAI_SHARED_CDN, SHARED_CDN, absolutize, cdnSubdomainNumber, closestAbove, cloudinaryUrlPrefix, defaultStoppoints, devicePixelRatioCache, finalizeResourceType, responsiveConfig, responsiveResizeInitialized;

    CF_SHARED_CDN = "d3jpl91pxevbkh.cloudfront.net";

    OLD_AKAMAI_SHARED_CDN = "cloudinary-a.akamaihd.net";

    AKAMAI_SHARED_CDN = "res.cloudinary.com";

    SHARED_CDN = AKAMAI_SHARED_CDN;

    DEFAULT_POSTER_OPTIONS = {
      format: 'jpg',
      resource_type: 'video'
    };

    DEFAULT_VIDEO_SOURCE_TYPES = ['webm', 'mp4', 'ogv'];

    devicePixelRatioCache = {};

    responsiveConfig = {};

    responsiveResizeInitialized = false;


    /**
    * Defaults values for image parameters.
    *
    * (Previously defined using option_consume() )
     */

    Cloudinary.DEFAULT_IMAGE_PARAMS = {
      resource_type: "image",
      transformation: [],
      type: 'upload'
    };


    /**
    * Defaults values for video parameters.
    *
    * (Previously defined using option_consume() )
     */

    Cloudinary.DEFAULT_VIDEO_PARAMS = {
      fallback_content: '',
      resource_type: "video",
      source_transformation: {},
      source_types: DEFAULT_VIDEO_SOURCE_TYPES,
      transformation: [],
      type: 'upload'
    };

    function Cloudinary(options) {
      var configuration;
      configuration = new Cloudinary.Configuration(options);
      this.config = function(newConfig, newValue) {
        return configuration.config(newConfig, newValue);
      };
    }

    Cloudinary["new"] = function(options) {
      return new this(options);
    };


    /**
     * Return the resource type and action type based on the given configuration
     * @param resource_type
     * @param type
     * @param url_suffix
     * @param use_root_path
     * @param shorten
     * @returns {string} resource_type/type
     *
     */

    finalizeResourceType = function(resourceType, type, urlSuffix, useRootPath, shorten) {
      var options;
      if (_.isPlainObject(resourceType)) {
        options = resourceType;
        resourceType = options.resource_type;
        type = options.type;
        urlSuffix = options.url_suffix;
        useRootPath = options.use_root_path;
        shorten = options.shorten;
      }
      if (type == null) {
        type = 'upload';
      }
      if (urlSuffix != null) {
        if (resourceType === 'image' && type === 'upload') {
          resourceType = "images";
          type = null;
        } else if (resourceType === 'raw' && type === 'upload') {
          resourceType = 'files';
          type = null;
        } else {
          throw new Error("URL Suffix only supported for image/upload and raw/upload");
        }
      }
      if (useRootPath) {
        if (resourceType === 'image' && type === 'upload' || resourceType === "images") {
          resourceType = null;
          type = null;
        } else {
          throw new Error("Root path only supported for image/upload");
        }
      }
      if (shorten && resourceType === 'image' && type === 'upload') {
        resourceType = 'iu';
        type = null;
      }
      return [resourceType, type].join("/");
    };

    absolutize = function(url) {
      var prefix;
      if (!url.match(/^https?:\//)) {
        prefix = document.location.protocol + '//' + document.location.host;
        if (url[0] === '?') {
          prefix += document.location.pathname;
        } else if (url[0] !== '/') {
          prefix += document.location.pathname.replace(/\/[^\/]*$/, '/');
        }
        url = prefix + url;
      }
      return url;
    };

    Cloudinary.prototype.url = function(publicId, options) {
      var prefix, ref, resourceTypeAndType, transformation, transformationString, url, version;
      if (options == null) {
        options = {};
      }
      options = _.defaults({}, options, this.config(), Cloudinary.DEFAULT_IMAGE_PARAMS);
      if (options.type === 'fetch') {
        options.fetch_format = options.fetch_format || options.format;
        publicId = absolutize(publicId);
      }
      transformation = new Transformation(options);
      transformationString = transformation.serialize();
      if (!options.cloud_name) {
        throw 'Unknown cloud_name';
      }
      if (options.url_suffix && !options.private_cdn) {
        throw 'URL Suffix only supported in private CDN';
      }
      if (publicId.search('/') >= 0 && !publicId.match(/^v[0-9]+/) && !publicId.match(/^https?:\//) && !((ref = options.version) != null ? ref.toString() : void 0)) {
        options.version = 1;
      }
      if (publicId.match(/^https?:/)) {
        if (options.type === 'upload' || options.type === 'asset') {
          url = publicId;
        } else {
          publicId = encodeURIComponent(publicId).replace(/%3A/g, ':').replace(/%2F/g, '/');
        }
      } else {
        publicId = encodeURIComponent(decodeURIComponent(publicId)).replace(/%3A/g, ':').replace(/%2F/g, '/');
        if (options.url_suffix) {
          if (options.url_suffix.match(/[\.\/]/)) {
            throw 'url_suffix should not include . or /';
          }
          publicId = publicId + '/' + options.url_suffix;
        }
        if (options.format) {
          if (!options.trust_public_id) {
            publicId = publicId.replace(/\.(jpg|png|gif|webp)$/, '');
          }
          publicId = publicId + '.' + options.format;
        }
      }
      prefix = cloudinaryUrlPrefix(publicId, options);
      resourceTypeAndType = finalizeResourceType(options.resource_type, options.type, options.url_suffix, options.use_root_path, options.shorten);
      version = options.version ? 'v' + options.version : '';
      return url || _.filter([prefix, resourceTypeAndType, transformationString, version, publicId], null).join('/').replace(/([^:])\/+/g, '$1/');
    };

    Cloudinary.prototype.video_url = function(publicId, options) {
      options = _.merge({
        resource_type: 'video'
      }, options);
      return this.url(publicId, options);
    };

    Cloudinary.prototype.video_thumbnail_url = function(publicId, options) {
      options = _.merge({}, DEFAULT_POSTER_OPTIONS, options);
      return this.url(publicId, options);
    };

    Cloudinary.prototype.transformation_string = function(options) {
      return new Transformation(options).serialize();
    };


    /**
     * Generate an image tag.
     * @param {string} publicId - the public ID of the image
     * @param {Object} [options] - options for the tag and transformations
     * @return {HTMLImageElement} an image tag element
     */

    Cloudinary.prototype.image = function(publicId, options) {
      var img, tag_options;
      if (options == null) {
        options = {};
      }
      tag_options = _.merge({
        src: ''
      }, options);
      img = this.imageTag(publicId, tag_options).toDOM();
      setData(img, 'src-cache', this.url(publicId, options));
      this.cloudinary_update(img, options);
      return img;
    };

    Cloudinary.prototype.video_thumbnail = function(publicId, options) {
      return this.image(publicId, _.extend({}, DEFAULT_POSTER_OPTIONS, options));
    };

    Cloudinary.prototype.facebook_profile_image = function(publicId, options) {
      return this.image(publicId, _.merge({
        type: 'facebook'
      }, options));
    };

    Cloudinary.prototype.twitter_profile_image = function(publicId, options) {
      return this.image(publicId, _.merge({
        type: 'twitter'
      }, options));
    };

    Cloudinary.prototype.twitter_name_profile_image = function(publicId, options) {
      return this.image(publicId, _.merge({
        type: 'twitter_name'
      }, options));
    };

    Cloudinary.prototype.gravatar_image = function(publicId, options) {
      return this.image(publicId, _.merge({
        type: 'gravatar'
      }, options));
    };

    Cloudinary.prototype.fetch_image = function(publicId, options) {
      return this.image(publicId, _.merge({
        type: 'fetch'
      }, options));
    };

    Cloudinary.prototype.video = function(publicId, options) {
      if (options == null) {
        options = {};
      }
      return this.videoTag(publicId, options).toHtml();
    };

    Cloudinary.prototype.sprite_css = function(publicId, options) {
      options = _.merge({
        type: 'sprite'
      }, options);
      if (!publicId.match(/.css$/)) {
        options.format = 'css';
      }
      return this.url(publicId, options);
    };

    Cloudinary.prototype.responsive = function(options) {
      var ref, ref1, responsiveResize, timeout;
      responsiveConfig = _.merge(responsiveConfig || {}, options);
      this.cloudinary_update('img.cld-responsive, img.cld-hidpi', responsiveConfig);
      responsiveResize = (ref = (ref1 = responsiveConfig['responsive_resize']) != null ? ref1 : this.config('responsive_resize')) != null ? ref : true;
      if (responsiveResize && !responsiveResizeInitialized) {
        responsiveConfig.resizing = responsiveResizeInitialized = true;
        timeout = null;
        return window.addEventListener('resize', (function(_this) {
          return function() {
            var debounce, ref2, ref3, reset, run, wait;
            debounce = (ref2 = (ref3 = responsiveConfig['responsive_debounce']) != null ? ref3 : _this.config('responsive_debounce')) != null ? ref2 : 100;
            reset = function() {
              if (timeout) {
                clearTimeout(timeout);
                return timeout = null;
              }
            };
            run = function() {
              return this.cloudinary_update('img.cld-responsive', responsiveConfig);
            };
            wait = function() {
              reset();
              return setTimeout((function() {
                reset();
                return run();
              }), debounce);
            };
            if (debounce) {
              return wait();
            } else {
              return run();
            }
          };
        })(this));
      }
    };

    Cloudinary.prototype.calc_stoppoint = function(element, width) {
      var stoppoints;
      stoppoints = getData(element, 'stoppoints') || this.config('stoppoints') || defaultStoppoints;
      if (_.isFunction(stoppoints)) {
        return stoppoints(width);
      } else {
        if (_.isString(stoppoints)) {
          stoppoints = _.map(stoppoints.split(','), _.parseInt).sort(function(a, b) {
            return a - b;
          });
        }
        return closestAbove(stoppoints, width);
      }
    };

    Cloudinary.prototype.device_pixel_ratio = function() {
      var dpr, dprString, dprUsed;
      dpr = (typeof window !== "undefined" && window !== null ? window.devicePixelRatio : void 0) || 1;
      dprString = devicePixelRatioCache[dpr];
      if (!dprString) {
        dprUsed = closestAbove(this.supported_dpr_values, dpr);
        dprString = dprUsed.toString();
        if (dprString.match(/^\d+$/)) {
          dprString += '.0';
        }
        devicePixelRatioCache[dpr] = dprString;
      }
      return dprString;
    };

    Cloudinary.prototype.supported_dpr_values = [0.75, 1.0, 1.3, 1.5, 2.0, 3.0];

    defaultStoppoints = function(width) {
      return 10 * Math.ceil(width / 10);
    };

    closestAbove = function(list, value) {
      var i;
      i = list.length - 2;
      while (i >= 0 && list[i] >= value) {
        i--;
      }
      return list[i + 1];
    };

    cdnSubdomainNumber = function(publicId) {
      return crc32(publicId) % 5 + 1;
    };

    cloudinaryUrlPrefix = function(publicId, options) {
      var cdnPart, host, path, protocol, ref, ref1, subdomain;
      if (((ref = options.cloud_name) != null ? ref.indexOf("/") : void 0) === 0) {
        return '/res' + options.cloud_name;
      }
      protocol = "http://";
      cdnPart = "";
      subdomain = "res";
      host = ".cloudinary.com";
      path = "/" + options.cloud_name;
      if (options.protocol) {
        protocol = options.protocol + '//';
      } else if ((typeof window !== "undefined" && window !== null ? (ref1 = window.location) != null ? ref1.protocol : void 0 : void 0) === 'file:') {
        protocol = 'file://';
      }
      if (options.private_cdn) {
        cdnPart = options.cloud_name + "-";
        path = "";
      }
      if (options.cdn_subdomain) {
        subdomain = "res-" + cdnSubdomainNumber(publicId);
      }
      if (options.secure) {
        protocol = "https://";
        if (options.secure_cdn_subdomain === false) {
          subdomain = "res";
        }
        if ((options.secure_distribution != null) && options.secure_distribution !== OLD_AKAMAI_SHARED_CDN && options.secure_distribution !== SHARED_CDN) {
          cdnPart = "";
          subdomain = "";
          host = options.secure_distribution;
        }
      } else if (options.cname) {
        protocol = "http://";
        cdnPart = "";
        subdomain = options.cdn_subdomain ? 'a' + ((crc32(publicId) % 5) + 1) + '.' : '';
        host = options.cname;
      }
      return [protocol, cdnPart, subdomain, host, path].join("");
    };


    /**
    * similar to `$.fn.cloudinary`
    * Finds all `img` tags under each node and sets it up to provide the image through Cloudinary
     */

    Cloudinary.prototype.processImageTags = function(nodes, options) {
      var images;
      if (options == null) {
        options = {};
      }
      options = _.defaults({}, options, this.config());
      images = _(nodes).filter({
        'tagName': 'IMG'
      }).forEach(function(i) {
        var imgOptions, publicId, url;
        imgOptions = _.extend({
          width: i.getAttribute('width'),
          height: i.getAttribute('height'),
          src: i.getAttribute('src')
        }, options);
        publicId = imgOptions['source'] || imgOptions['src'];
        delete imgOptions['source'];
        delete imgOptions['src'];
        url = this.url(publicId, imgOptions);
        imgOptions = new Transformation(imgOptions).toHtmlAttributes();
        setData(i, 'src-cache', url);
        i.setAttribute('width', imgOptions.width);
        return i.setAttribute('height', imgOptions.height);
      }).value();
      this.cloudinary_update(images, options);
      return this;
    };


    /**
    * Update hidpi (dpr_auto) and responsive (w_auto) fields according to the current container size and the device pixel ratio.
    * Only images marked with the cld-responsive class have w_auto updated.
    * options:
    * - responsive_use_stoppoints:
    *   - true - always use stoppoints for width
    *   - "resize" - use exact width on first render and stoppoints on resize (default)
    *   - false - always use exact width
    * - responsive:
    *   - true - enable responsive on this element. Can be done by adding cld-responsive.
    *            Note that $.cloudinary.responsive() should be called once on the page.
    * - responsive_preserve_height: if set to true, original css height is perserved. Should only be used if the transformation supports different aspect ratios.
     */

    Cloudinary.prototype.cloudinary_update = function(elements, options) {
      var attrs, container, containerWidth, currentWidth, exact, j, len, ref, ref1, ref2, requestedWidth, responsive, responsive_use_stoppoints, src, tag;
      if (options == null) {
        options = {};
      }
      elements = (function() {
        switch (elements) {
          case _.isArray(elements):
            return elements;
          case elements.constructor.name === "NodeList":
            return elements;
          case _.isString(elements):
            return document.querySelectorAll(elements);
          default:
            return [elements];
        }
      })();
      responsive_use_stoppoints = (ref = (ref1 = options['responsive_use_stoppoints']) != null ? ref1 : this.config('responsive_use_stoppoints')) != null ? ref : 'resize';
      exact = !responsive_use_stoppoints || responsive_use_stoppoints === 'resize' && !options.resizing;
      for (j = 0, len = elements.length; j < len; j++) {
        tag = elements[j];
        if (!((ref2 = tag.tagName) != null ? ref2.match(/img/i) : void 0)) {
          continue;
        }
        if (options.responsive) {
          addClass(tag, "cld-responsive");
        }
        attrs = {};
        src = getData(tag, 'src-cache') || getData(tag, 'src');
        if (!src) {
          return;
        }
        responsive = hasClass(tag, 'cld-responsive') && src.match(/\bw_auto\b/);
        if (responsive) {
          container = tag.parentNode;
          containerWidth = 0;
          while (container && containerWidth === 0) {
            containerWidth = container.clientWidth || 0;
            container = container.parentNode;
          }
          if (containerWidth === 0) {
            return;
          }
          requestedWidth = exact ? containerWidth : this.calc_stoppoint(tag, containerWidth);
          currentWidth = getData(tag, 'width') || 0;
          if (requestedWidth > currentWidth) {
            setData(tag, 'width', requestedWidth);
          } else {
            requestedWidth = currentWidth;
          }
          src = src.replace(/\bw_auto\b/g, 'w_' + requestedWidth);
          attrs.width = null;
          if (!options.responsive_preserve_height) {
            attrs.height = null;
          }
        }
        attrs.src = src.replace(/\bdpr_(1\.0|auto)\b/g, 'dpr_' + this.device_pixel_ratio());
        setAttributes(tag, attrs);
      }
      return this;
    };


    /**
    * Provide a transformation object, initialized with own's options, for chaining purposes.
    * @return {Transformation}
     */

    Cloudinary.prototype.transformation = function(options) {
      return Transformation["new"](this.config()).fromOptions(options).setParent(this);
    };

    return Cloudinary;

  })();

  global = (ref = typeof module !== "undefined" && module !== null ? module.exports : void 0) != null ? ref : window;

  if (global.Cloudinary) {
    _.extend(Cloudinary, global.Cloudinary);
  }

  global.Cloudinary = Cloudinary;

  crc32 = function(str) {
    var crc, i, iTop, table, x, y;
    str = utf8_encode(str);
    table = '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';
    crc = 0;
    x = 0;
    y = 0;
    crc = crc ^ -1;
    i = 0;
    iTop = str.length;
    while (i < iTop) {
      y = (crc ^ str.charCodeAt(i)) & 0xFF;
      x = '0x' + table.substr(y * 9, 8);
      crc = crc >>> 8 ^ x;
      i++;
    }
    crc = crc ^ -1;
    if (crc < 0) {
      crc += 4294967296;
    }
    return crc;
  };

  if (typeof module !== "undefined" && module.exports) {
    exports.crc32 = crc32;
  } else {
    window.crc32 = crc32;
  }

  utf8_encode = function(argString) {
    var c1, enc, end, n, start, string, stringl, utftext;
    if (argString === null || typeof argString === 'undefined') {
      return '';
    }
    string = argString + '';
    utftext = '';
    start = void 0;
    end = void 0;
    stringl = 0;
    start = end = 0;
    stringl = string.length;
    n = 0;
    while (n < stringl) {
      c1 = string.charCodeAt(n);
      enc = null;
      if (c1 < 128) {
        end++;
      } else if (c1 > 127 && c1 < 2048) {
        enc = String.fromCharCode(c1 >> 6 | 192, c1 & 63 | 128);
      } else {
        enc = String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, c1 & 63 | 128);
      }
      if (enc !== null) {
        if (end > start) {
          utftext += string.slice(start, end);
        }
        utftext += enc;
        start = end = n + 1;
      }
      n++;
    }
    if (end > start) {
      utftext += string.slice(start, stringl);
    }
    return utftext;
  };

  if (typeof module !== "undefined" && module.exports) {
    exports.utf8_encode = utf8_encode;
  } else {
    window.utf8_encode = utf8_encode;
  }

  Configuration = (function() {

    /**
    * Defaults configuration.
    *
    * (Previously defined using option_consume() )
     */
    var DEFAULT_CONFIGURATION_PARAMS, ref1;

    DEFAULT_CONFIGURATION_PARAMS = {
      secure: (typeof window !== "undefined" && window !== null ? (ref1 = window.location) != null ? ref1.protocol : void 0 : void 0) === 'https:'
    };

    Configuration.CONFIG_PARAMS = ["api_key", "api_secret", "cdn_subdomain", "cloud_name", "cname", "private_cdn", "protocol", "resource_type", "responsive_width", "secure", "secure_cdn_subdomain", "secure_distribution", "shorten", "type", "url_suffix", "use_root_path", "version"];

    function Configuration(options) {
      if (options == null) {
        options = {};
      }
      this.configuration = _.cloneDeep(options);
      _.defaults(this.configuration, DEFAULT_CONFIGURATION_PARAMS);
    }


    /**
     * Set a new configuration item
     * @param {String} name - the name of the item to set
     * @param value - the value to be set
     *
     */

    Configuration.prototype.set = function(name, value) {
      this.configuration[name] = value;
      return this;
    };

    Configuration.prototype.get = function(name) {
      return this.configuration[name];
    };

    Configuration.prototype.merge = function(config) {
      if (config == null) {
        config = {};
      }
      _.assign(this.configuration, _.cloneDeep(config));
      return this;
    };

    Configuration.prototype.fromDocument = function() {
      var el, j, len, meta_elements;
      meta_elements = typeof document !== "undefined" && document !== null ? document.querySelectorAll('meta[name^="cloudinary_"]') : void 0;
      if (meta_elements) {
        for (j = 0, len = meta_elements.length; j < len; j++) {
          el = meta_elements[j];
          this.configuration[el.getAttribute('name').replace('cloudinary_', '')] = el.getAttribute('content');
        }
      }
      return this;
    };

    Configuration.prototype.fromEnvironment = function() {
      var cloudinary, cloudinary_url, k, ref2, ref3, uri, v;
      cloudinary_url = typeof process !== "undefined" && process !== null ? (ref2 = process.env) != null ? ref2.CLOUDINARY_URL : void 0 : void 0;
      if (cloudinary_url != null) {
        uri = require('url').parse(cloudinary_url, true);
        cloudinary = {
          cloud_name: uri.host,
          api_key: uri.auth && uri.auth.split(":")[0],
          api_secret: uri.auth && uri.auth.split(":")[1],
          private_cdn: uri.pathname != null,
          secure_distribution: uri.pathname && uri.pathname.substring(1)
        };
        if (uri.query != null) {
          ref3 = uri.query;
          for (k in ref3) {
            v = ref3[k];
            cloudinary[k] = v;
          }
        }
      }
      return this;
    };


    /**
    * Create or modify the Cloudinary client configuration
    *
    * Warning: `config()` returns the actual internal configuration object. modifying it will change the configuration.
    *
    * This is a backward compatibility method. For new code, use get(), merge() etc.
    *
    * @param {Hash|String|true} new_config
    * @param {String} new_value
    * @returns {*} configuration, or value
    *
     */

    Configuration.prototype.config = function(new_config, new_value) {
      if ((this.configuration == null) || new_config === true) {
        this.fromEnvironment();
        if (!this.configuration) {
          this.fromDocument();
        }
      }
      switch (false) {
        case new_value === void 0:
          this.set(new_config, new_value);
          return this.configuration;
        case !_.isString(new_config):
          return this.get(new_config);
        case !_.isObject(new_config):
          this.merge(new_config);
          return this.configuration;
        default:
          return this.configuration;
      }
    };


    /**
     * Returns a copy of the configuration parameters
     * @returns {Object} a key:value collection of the configuration parameters
     */

    Configuration.prototype.toOptions = function() {
      return _.cloneDeep(this.configuration);
    };

    return Configuration;

  })();

  if (!(typeof module !== "undefined" && module !== null ? module.exports : void 0)) {
    exports = window;
  }

  if (exports.Cloudinary == null) {
    exports.Cloudinary = {};
  }

  exports.Cloudinary.Configuration = Configuration;


  /**
   * @class Represents a single parameter
   */

  Param = (function() {

    /**
     * Create a new Parameter
     * @param {string} name - The name of the parameter in snake_case
     * @param {string short - The name of the serialized form of the parameter
     * @param {function} [process=_.identity ] - Manipulate origValue when value is called
     */
    function Param(name, short, process) {
      if (process == null) {
        process = _.identity;
      }

      /**
       * The name of the parameter in snake_case
       * @type {string}
       */
      this.name = name;

      /**
       * The name of the serialized form of the parameter
       * @type {string}
       */
      this.short = short;

      /**
       * Manipulate origValue when value is called
       * @type {function}
       */
      this.process = process;
    }


    /**
     * Set a (unprocessed) value for this parameter
     * @param {*} origValue - the value of the parameter
     * @return {Param} self for chaining
     */

    Param.prototype.set = function(origValue) {
      this.origValue = origValue;
      return this;
    };


    /**
     * Generate the serialized form of the parameter
     * @return {string} the serialized form of the parameter
     */

    Param.prototype.serialize = function() {
      var val;
      val = this.process(this.origValue);
      if ((this.short != null) && (val != null)) {
        return this.short + "_" + val;
      } else {
        return null;
      }
    };


    /**
     * Return the processed value of the parameter
     */

    Param.prototype.value = function() {
      return this.process(this.origValue);
    };

    Param.norm_color = function(value) {
      return value != null ? value.replace(/^#/, 'rgb:') : void 0;
    };

    Param.prototype.build_array = function(arg) {
      if (arg == null) {
        arg = [];
      }
      if (_.isArray(arg)) {
        return arg;
      } else {
        return [arg];
      }
    };

    return Param;

  })();

  ArrayParam = (function(superClass) {
    extend(ArrayParam, superClass);

    function ArrayParam(name, short, sep, process) {
      if (sep == null) {
        sep = '.';
      }
      this.sep = sep;
      ArrayParam.__super__.constructor.call(this, name, short, process);
    }

    ArrayParam.prototype.serialize = function() {
      var flat, t;
      if (this.short != null) {
        flat = (function() {
          var j, len, ref1, results;
          ref1 = this.value();
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            t = ref1[j];
            if (_.isFunction(t.serialize)) {
              results.push(t.serialize());
            } else {
              results.push(t);
            }
          }
          return results;
        }).call(this);
        return this.short + "_" + (flat.join(this.sep));
      } else {
        return null;
      }
    };

    ArrayParam.prototype.set = function(origValue) {
      this.origValue = origValue;
      if (_.isArray(this.origValue)) {
        return ArrayParam.__super__.set.call(this, this.origValue);
      } else {
        return ArrayParam.__super__.set.call(this, [this.origValue]);
      }
    };

    return ArrayParam;

  })(Param);

  TransformationParam = (function(superClass) {
    extend(TransformationParam, superClass);

    function TransformationParam(name, short, sep, process) {
      if (short == null) {
        short = "t";
      }
      if (sep == null) {
        sep = '.';
      }
      this.sep = sep;
      TransformationParam.__super__.constructor.call(this, name, short, process);
    }

    TransformationParam.prototype.serialize = function() {
      var result, t;
      if (_.isEmpty(this.value())) {
        return null;
      } else if (_.all(this.value(), _.isString)) {
        return this.short + "_" + (this.value().join(this.sep));
      } else {
        result = (function() {
          var j, len, ref1, results;
          ref1 = this.value();
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            t = ref1[j];
            if (t != null) {
              if (_.isString(t)) {
                results.push(this.short + "_" + t);
              } else if (_.isFunction(t.serialize)) {
                results.push(t.serialize());
              } else if (_.isPlainObject(t)) {
                results.push(new Transformation(t).serialize());
              } else {
                results.push(void 0);
              }
            }
          }
          return results;
        }).call(this);
        return _.compact(result);
      }
    };

    TransformationParam.prototype.set = function(origValue) {
      this.origValue = origValue;
      if (_.isArray(this.origValue)) {
        return TransformationParam.__super__.set.call(this, this.origValue);
      } else {
        return TransformationParam.__super__.set.call(this, [this.origValue]);
      }
    };

    return TransformationParam;

  })(Param);

  RangeParam = (function(superClass) {
    extend(RangeParam, superClass);

    function RangeParam(name, short, process) {
      if (process == null) {
        process = this.norm_range_value;
      }
      RangeParam.__super__.constructor.call(this, name, short, process);
    }

    RangeParam.norm_range_value = function(value) {
      var modifier, offset;
      offset = String(value).match(new RegExp('^' + offset_any_pattern + '$'));
      if (offset) {
        modifier = offset[5] != null ? 'p' : '';
        value = (offset[1] || offset[4]) + modifier;
      }
      return value;
    };

    return RangeParam;

  })(Param);

  RawParam = (function(superClass) {
    extend(RawParam, superClass);

    function RawParam(name, short, process) {
      if (process == null) {
        process = _.identity;
      }
      RawParam.__super__.constructor.call(this, name, short, process);
    }

    RawParam.prototype.serialize = function() {
      return this.value();
    };

    return RawParam;

  })(Param);


  /**
  * Covert value to video codec string.
  *
  * If the parameter is an object,
  * @param {(string|Object)} param - the video codec as either a String or a Hash
  * @return {string} the video codec string in the format codec:profile:level
  * @example
  * vc_[ :profile : [level]]
  * or
    { codec: 'h264', profile: 'basic', level: '3.1' }
   */

  process_video_params = function(param) {
    var video;
    switch (param.constructor) {
      case Object:
        video = "";
        if ('codec' in param) {
          video = param['codec'];
          if ('profile' in param) {
            video += ":" + param['profile'];
            if ('level' in param) {
              video += ":" + param['level'];
            }
          }
        }
        return video;
      case String:
        return param;
      default:
        return null;
    }
  };


  /**
   *  A single transformation.
   *
   *  @example
   *  t = new Transformation();
   *  t.angle(20).crop("scale").width("auto");
   *
   *  // or
   *
   *  t = new Transformation( {angle: 20, crop: "scale", width: "auto"});
   *  @class
   */

  TransformationBase = (function() {
    function TransformationBase(options) {
      var chainedTo, trans;
      if (options == null) {
        options = {};
      }
      chainedTo = void 0;
      trans = {};

      /**
       * Return an options object that can be used to create an identical Transformation
       * @return {Object} a plain object representing this transformation
       */
      this.toOptions = function() {
        return _.merge(_.mapValues(trans, function(t) {
          return t.origValue;
        }), this.otherOptions);
      };

      /**
       * Set a parent for this object for chaining purposes.
       * @param {Object} object - the parent to be assigned to
       * @returns {Transformation} - returns this instance for chaining purposes.
       */
      this.setParent = function(object) {
        chainedTo = object;
        this.fromOptions(typeof object.toOptions === "function" ? object.toOptions() : void 0);
        return this;
      };

      /**
       * Returns the parent of this object in the chain
       * @return {Object} the parent of this object if any
       */
      this.getParent = function() {
        return chainedTo;
      };

      /*
       * Helper methods to create parameter methods
       * These methods are required because `trans` is a private member of `TransformationBase`
       */
      this.param = function(value, name, abbr, defaultValue, process) {
        if (process == null) {
          if (_.isFunction(defaultValue)) {
            process = defaultValue;
          } else {
            process = _.identity;
          }
        }
        trans[name] = new Param(name, abbr, process).set(value);
        return this;
      };
      this.rawParam = function(value, name, abbr, defaultValue, process) {
        if (process == null) {
          process = _.identity;
        }
        if (_.isFunction(defaultValue) && (process == null)) {
          process = defaultValue;
        }
        trans[name] = new RawParam(name, abbr, process).set(value);
        return this;
      };
      this.rangeParam = function(value, name, abbr, defaultValue, process) {
        if (process == null) {
          process = _.identity;
        }
        if (_.isFunction(defaultValue) && (process == null)) {
          process = defaultValue;
        }
        trans[name] = new RangeParam(name, abbr, process).set(value);
        return this;
      };
      this.arrayParam = function(value, name, abbr, sep, defaultValue, process) {
        if (sep == null) {
          sep = ":";
        }
        if (defaultValue == null) {
          defaultValue = [];
        }
        if (process == null) {
          process = _.identity;
        }
        if (_.isFunction(defaultValue) && (process == null)) {
          process = defaultValue;
        }
        trans[name] = new ArrayParam(name, abbr, sep, process).set(value);
        return this;
      };
      this.transformationParam = function(value, name, abbr, sep, defaultValue, process) {
        if (sep == null) {
          sep = ".";
        }
        if (process == null) {
          process = _.identity;
        }
        if (_.isFunction(defaultValue) && (process == null)) {
          process = defaultValue;
        }
        trans[name] = new TransformationParam(name, abbr, sep, process).set(value);
        return this;
      };

      /**
       * Get the value associated with the given name.
       * @param {string} name - the name of the parameter
       * @return {*} the processed value associated with the given name
       * @description Use {@link get}.origValue for the value originally provided for the parameter
       */
      this.getValue = function(name) {
        var ref1, ref2;
        return (ref1 = (ref2 = trans[name]) != null ? ref2.value() : void 0) != null ? ref1 : this.otherOptions[name];
      };

      /**
       * Get the parameter object for the given parameter name
       * @param {String} name the name of the transformation parameter
       * @returns {Param} the param object for the given name, or undefined
       */
      this.get = function(name) {
        return trans[name];
      };
      this.remove = function(name) {
        var temp;
        switch (false) {
          case trans[name] == null:
            temp = trans[name];
            delete trans[name];
            return temp;
          case this.otherOptions[name] == null:
            temp = this.otherOptions[name];
            delete this.otherOptions[name];
            return temp;
          default:
            return null;
        }
      };
      this.keys = function() {
        return _(trans).keys().map(_.snakeCase).value().sort();
      };
      this.toPlainObject = function() {
        var hash, key;
        hash = {};
        for (key in trans) {
          hash[key] = trans[key].value();
        }
        return hash;
      };
      this.chain = function() {
        var tr;
        tr = new this.constructor(this.toOptions());
        trans = [];
        this.otherOptions = {};
        return this.set("transformation", tr);
      };
      this.otherOptions = {};

      /**
       * Transformation Class methods.
       * This is a list of the parameters defined in Transformation.
       * Values are camelCased.
       * @type {Array<String>}
       */
      this.methods = _.difference(_.functions(Transformation.prototype), _.functions(TransformationBase.prototype));

      /**
       * Parameters that are filtered out before passing the options to an HTML tag.
       * The list of parameters is `Transformation::methods` and `Configuration::CONFIG_PARAMS`
       * @type {Array<string>}
       * @see toHtmlAttributes
       */
      this.PARAM_NAMES = _.map(this.methods, _.snakeCase).concat(Cloudinary.Configuration.CONFIG_PARAMS);

      /*
        Finished constructing the instance, now process the options
       */
      if (!_.isEmpty(options)) {
        this.fromOptions(options);
      }
    }


    /**
     * Merge the provided options with own's options
     * @param {Object} [options={}] key-value list of options
     * @returns {Transformation} this instance for chaining
     */

    TransformationBase.prototype.fromOptions = function(options) {
      var key, opt;
      options || (options = {});
      if (_.isString(options) || _.isArray(options) || options instanceof Transformation) {
        options = {
          transformation: options
        };
      }
      options = _.cloneDeep(options, function(value) {
        if (value instanceof Transformation) {
          return new value.constructor(value.toOptions());
        }
      });
      for (key in options) {
        opt = options[key];
        this.set(key, opt);
      }
      return this;
    };


    /**
     * Set a parameter.
     * The parameter name `key` is converted to
     * @param {String} key - the name of the parameter
     * @param {*} value - the value of the parameter
     * @returns {Transformation} this instance for chaining
     */

    TransformationBase.prototype.set = function(key, value) {
      var camelKey;
      camelKey = _.camelCase(key);
      if (_.includes(this.methods, camelKey)) {
        this[camelKey](value);
      } else {
        this.otherOptions[key] = value;
      }
      return this;
    };

    TransformationBase.prototype.hasLayer = function() {
      return this.getValue("overlay") || this.getValue("underlay");
    };

    TransformationBase.prototype.serialize = function() {
      var paramList, ref1, resultArray, t, transformationList, transformationString, transformations;
      resultArray = [];
      paramList = this.keys();
      transformations = (ref1 = this.get("transformation")) != null ? ref1.serialize() : void 0;
      paramList = _.without(paramList, "transformation");
      transformationList = (function() {
        var j, len, ref2, results;
        results = [];
        for (j = 0, len = paramList.length; j < len; j++) {
          t = paramList[j];
          results.push((ref2 = this.get(t)) != null ? ref2.serialize() : void 0);
        }
        return results;
      }).call(this);
      switch (false) {
        case !_.isString(transformations):
          transformationList.push(transformations);
          break;
        case !_.isArray(transformations):
          resultArray = transformations;
      }
      transformationString = _.filter(transformationList, function(value) {
        return _.isArray(value) && !_.isEmpty(value) || !_.isArray(value) && value;
      }).sort().join(',');
      if (!_.isEmpty(transformationString)) {
        resultArray.push(transformationString);
      }
      return _.compact(resultArray).join('/');
    };

    TransformationBase.prototype.listNames = function() {
      return this.methods;
    };


    /**
     * Returns attributes for an HTML tag.
     * @return PlainObject
     */

    TransformationBase.prototype.toHtmlAttributes = function() {
      var height, j, k, key, l, len, len1, options, ref1, ref2, ref3, ref4, width;
      options = _.omit(this.otherOptions, this.PARAM_NAMES);
      ref1 = _.difference(this.keys(), this.PARAM_NAMES);
      for (j = 0, len = ref1.length; j < len; j++) {
        key = ref1[j];
        options[key] = this.get(key).value;
      }
      ref2 = this.keys();
      for (l = 0, len1 = ref2.length; l < len1; l++) {
        k = ref2[l];
        if (/^html_/.exec(k)) {
          options[k.substr(5)] = this.getValue(k);
        }
      }
      if (!(this.hasLayer() || this.getValue("angle") || _.contains(["fit", "limit", "lfill"], this.getValue("crop")))) {
        width = (ref3 = this.get("width")) != null ? ref3.origValue : void 0;
        height = (ref4 = this.get("height")) != null ? ref4.origValue : void 0;
        if (parseFloat(width) >= 1.0) {
          if (options['width'] == null) {
            options['width'] = width;
          }
        }
        if (parseFloat(height) >= 1.0) {
          if (options['height'] == null) {
            options['height'] = height;
          }
        }
      }
      return options;
    };

    TransformationBase.prototype.isValidParamName = function(name) {
      return this.methods.indexOf(_.camelCase(name)) >= 0;
    };

    TransformationBase.prototype.toHtml = function() {
      var ref1;
      return (ref1 = this.getParent()) != null ? typeof ref1.toHtml === "function" ? ref1.toHtml() : void 0 : void 0;
    };

    TransformationBase.prototype.toString = function() {
      return this.serialize();
    };

    return TransformationBase;

  })();

  Transformation = (function(superClass) {
    extend(Transformation, superClass);

    Transformation["new"] = function(args) {
      return new Transformation(args);
    };

    function Transformation(options) {
      if (options == null) {
        options = {};
      }
      Transformation.__super__.constructor.call(this, options);
    }


    /*
      Transformation Parameters
     */

    Transformation.prototype.angle = function(value) {
      return this.arrayParam(value, "angle", "a", ".");
    };

    Transformation.prototype.audioCodec = function(value) {
      return this.param(value, "audio_codec", "ac");
    };

    Transformation.prototype.audioFrequency = function(value) {
      return this.param(value, "audio_frequency", "af");
    };

    Transformation.prototype.background = function(value) {
      return this.param(value, "background", "b", Param.norm_color);
    };

    Transformation.prototype.bitRate = function(value) {
      return this.param(value, "bit_rate", "br");
    };

    Transformation.prototype.border = function(value) {
      return this.param(value, "border", "bo", function(border) {
        if (_.isPlainObject(border)) {
          border = _.assign({}, {
            color: "black",
            width: 2
          }, border);
          return border.width + "px_solid_" + (Param.norm_color(border.color));
        } else {
          return border;
        }
      });
    };

    Transformation.prototype.color = function(value) {
      return this.param(value, "color", "co", Param.norm_color);
    };

    Transformation.prototype.colorSpace = function(value) {
      return this.param(value, "color_space", "cs");
    };

    Transformation.prototype.crop = function(value) {
      return this.param(value, "crop", "c");
    };

    Transformation.prototype.defaultImage = function(value) {
      return this.param(value, "default_image", "d");
    };

    Transformation.prototype.delay = function(value) {
      return this.param(value, "delay", "l");
    };

    Transformation.prototype.density = function(value) {
      return this.param(value, "density", "dn");
    };

    Transformation.prototype.duration = function(value) {
      return this.rangeParam(value, "duration", "du");
    };

    Transformation.prototype.dpr = function(value) {
      return this.param(value, "dpr", "dpr", function(dpr) {
        dpr = dpr.toString();
        if (dpr === "auto") {
          return "1.0";
        } else if (dpr != null ? dpr.match(/^\d+$/) : void 0) {
          return dpr + ".0";
        } else {
          return dpr;
        }
      });
    };

    Transformation.prototype.effect = function(value) {
      return this.arrayParam(value, "effect", "e", ":");
    };

    Transformation.prototype.endOffset = function(value) {
      return this.rangeParam(value, "end_offset", "eo");
    };

    Transformation.prototype.fallbackContent = function(value) {
      return this.param(value, "fallback_content");
    };

    Transformation.prototype.fetchFormat = function(value) {
      return this.param(value, "fetch_format", "f");
    };

    Transformation.prototype.format = function(value) {
      return this.param(value, "format");
    };

    Transformation.prototype.flags = function(value) {
      return this.arrayParam(value, "flags", "fl", ".");
    };

    Transformation.prototype.gravity = function(value) {
      return this.param(value, "gravity", "g");
    };

    Transformation.prototype.height = function(value) {
      return this.param(value, "height", "h", (function(_this) {
        return function() {
          if (_.any([_this.getValue("crop"), _this.getValue("overlay"), _this.getValue("underlay")])) {
            return value;
          } else {
            return null;
          }
        };
      })(this));
    };

    Transformation.prototype.htmlHeight = function(value) {
      return this.param(value, "html_height");
    };

    Transformation.prototype.htmlWidth = function(value) {
      return this.param(value, "html_width");
    };

    Transformation.prototype.offset = function(value) {
      var end_o, ref1, start_o;
      ref1 = _.isFunction(value != null ? value.split : void 0) ? value.split('..') : _.isArray(value) ? value : [null, null], start_o = ref1[0], end_o = ref1[1];
      if (start_o != null) {
        this.startOffset(start_o);
      }
      if (end_o != null) {
        return this.endOffset(end_o);
      }
    };

    Transformation.prototype.opacity = function(value) {
      return this.param(value, "opacity", "o");
    };

    Transformation.prototype.overlay = function(value) {
      return this.param(value, "overlay", "l");
    };

    Transformation.prototype.page = function(value) {
      return this.param(value, "page", "pg");
    };

    Transformation.prototype.poster = function(value) {
      return this.param(value, "poster");
    };

    Transformation.prototype.prefix = function(value) {
      return this.param(value, "prefix", "p");
    };

    Transformation.prototype.quality = function(value) {
      return this.param(value, "quality", "q");
    };

    Transformation.prototype.radius = function(value) {
      return this.param(value, "radius", "r");
    };

    Transformation.prototype.rawTransformation = function(value) {
      return this.rawParam(value, "raw_transformation");
    };

    Transformation.prototype.size = function(value) {
      var height, ref1, width;
      if (_.isFunction(value != null ? value.split : void 0)) {
        ref1 = value.split('x'), width = ref1[0], height = ref1[1];
        this.width(width);
        return this.height(height);
      }
    };

    Transformation.prototype.sourceTypes = function(value) {
      return this.param(value, "source_types");
    };

    Transformation.prototype.sourceTransformation = function(value) {
      return this.param(value, "source_transformation");
    };

    Transformation.prototype.startOffset = function(value) {
      return this.rangeParam(value, "start_offset", "so");
    };

    Transformation.prototype.transformation = function(value) {
      return this.transformationParam(value, "transformation", "t");
    };

    Transformation.prototype.underlay = function(value) {
      return this.param(value, "underlay", "u");
    };

    Transformation.prototype.videoCodec = function(value) {
      return this.param(value, "video_codec", "vc", process_video_params);
    };

    Transformation.prototype.videoSampling = function(value) {
      return this.param(value, "video_sampling", "vs");
    };

    Transformation.prototype.width = function(value) {
      return this.param(value, "width", "w", (function(_this) {
        return function() {
          if (_.any([_this.getValue("crop"), _this.getValue("overlay"), _this.getValue("underlay")])) {
            return value;
          } else {
            return null;
          }
        };
      })(this));
    };

    Transformation.prototype.x = function(value) {
      return this.param(value, "x", "x");
    };

    Transformation.prototype.y = function(value) {
      return this.param(value, "y", "y");
    };

    Transformation.prototype.zoom = function(value) {
      return this.param(value, "zoom", "z");
    };

    return Transformation;

  })(TransformationBase);

  if (!(((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) || (exports != null))) {
    exports = window;
  }

  if (exports.Cloudinary == null) {
    exports.Cloudinary = {};
  }

  exports.Cloudinary.Transformation = Transformation;

  exports.Cloudinary.TransformationBase = TransformationBase;


  /**
    * Represents an HTML (DOM) tag
   */

  HtmlTag = (function() {

    /**
     * Represents an HTML (DOM) tag
     * Usage: tag = new HtmlTag( 'div', { 'width': 10})
     * @param {String} name - the name of the tag
     * @param {String} [publicId]
     * @param {Object} options
     */
    var toAttribute;

    function HtmlTag(name, publicId, options) {
      var transformation;
      this.name = name;
      this.publicId = publicId;
      if (options == null) {
        if (_.isPlainObject(publicId)) {
          options = publicId;
          this.publicId = void 0;
        } else {
          options = {};
        }
      }
      transformation = new Transformation(options);
      transformation.setParent(this);
      this.transformation = function() {
        return transformation;
      };
    }


    /**
     * Convenience constructor
     * Creates a new instance of an HTML (DOM) tag
     * Usage: tag = HtmlTag.new( 'div', { 'width': 10})
     * @param {String} name - the name of the tag
     * @param {String} [publicId]
     * @param {Object} options
     */

    HtmlTag["new"] = function(name, publicId, options) {
      return new this(name, publicId, options);
    };


    /**
     * Represent the given key and value as an HTML attribute.
     * @param {String} key - attribute name
     * @param {*|boolean} value - the value of the attribute. If the value is boolean `true`, return the key only.
     * @returns {String} the attribute
     *
     */

    toAttribute = function(key, value) {
      if (!value) {
        return void 0;
      } else if (value === true) {
        return key;
      } else {
        return key + "=\"" + value + "\"";
      }
    };


    /**
     * combine key and value from the `attr` to generate an HTML tag attributes string.
     * `Transformation::toHtmlTagOptions` is used to filter out transformation and configuration keys.
     * @param {Object} attr
     * @return {String} the attributes in the format `'key1="value1" key2="value2"'`
     */

    HtmlTag.prototype.htmlAttrs = function(attrs) {
      var pairs;
      pairs = _.map(attrs, function(value, key) {
        return toAttribute(key, value);
      });
      pairs.sort();
      return pairs.filter(function(pair) {
        return pair;
      }).join(' ');
    };


    /**
     * Get all options related to this tag.
     * @returns {Object} the options
     *
     */

    HtmlTag.prototype.getOptions = function() {
      return this.transformation().toOptions();
    };


    /**
     * Get the value of option `name`
     * @param {String} name - the name of the option
     * @returns the value of the option
     *
     */

    HtmlTag.prototype.getOption = function(name) {
      return this.transformation().getValue(name);
    };


    /**
     * Get the attributes of the tag.
     * The attributes are be computed from the options every time this method is invoked.
     * @returns {Object} attributes
     */

    HtmlTag.prototype.attributes = function() {
      return this.transformation().toHtmlAttributes();
    };

    HtmlTag.prototype.setAttr = function(name, value) {
      this.transformation().set(name, value);
      return this;
    };

    HtmlTag.prototype.getAttr = function(name) {
      return this.attributes()[name];
    };

    HtmlTag.prototype.removeAttr = function(name) {
      return this.transformation().remove(name);
    };

    HtmlTag.prototype.content = function() {
      return "";
    };

    HtmlTag.prototype.openTag = function() {
      return "<" + this.name + " " + (this.htmlAttrs(this.attributes())) + ">";
    };

    HtmlTag.prototype.closeTag = function() {
      return "</" + this.name + ">";
    };

    HtmlTag.prototype.content = function() {
      return "";
    };

    HtmlTag.prototype.toHtml = function() {
      return this.openTag() + this.content() + this.closeTag();
    };

    HtmlTag.prototype.toDOM = function() {
      var element, name, ref1, value;
      if (!_.isFunction(typeof document !== "undefined" && document !== null ? document.createElement : void 0)) {
        throw "Can't create DOM if document is not present!";
      }
      element = document.createElement(this.name);
      ref1 = this.attributes();
      for (name in ref1) {
        value = ref1[name];
        element[name] = value;
      }
      return element;
    };

    return HtmlTag;

  })();

  if (!(((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) || (exports != null))) {
    exports = window;
  }

  if (exports.Cloudinary == null) {
    exports.Cloudinary = {};
  }

  exports.Cloudinary.HtmlTag = HtmlTag;


  /**
  * Creates an HTML (DOM) Image tag using Cloudinary as the source.
   */

  ImageTag = (function(superClass) {
    extend(ImageTag, superClass);


    /**
     * Creates an HTML (DOM) Image tag using Cloudinary as the source.
     * @param {String} [publicId]
     * @param {Object} [options]
     */

    function ImageTag(publicId, options) {
      if (options == null) {
        options = {};
      }
      ImageTag.__super__.constructor.call(this, "img", publicId, options);
    }

    ImageTag.prototype.closeTag = function() {
      return "";
    };

    ImageTag.prototype.attributes = function() {
      var attr;
      attr = ImageTag.__super__.attributes.call(this) || [];
      if (attr['src'] == null) {
        attr['src'] = new Cloudinary(this.getOptions()).url(this.publicId);
      }
      return attr;
    };

    return ImageTag;

  })(HtmlTag);

  if (!(((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) || (exports != null))) {
    exports = window;
  }

  if (exports.Cloudinary == null) {
    exports.Cloudinary = {};
  }

  exports.Cloudinary.prototype.imageTag = function(publicId, options) {
    options = _.defaults({}, options, this.config());
    return new ImageTag(publicId, options);
  };

  exports.Cloudinary.ImageTag = ImageTag;


  /**
  * Creates an HTML (DOM) Video tag using Cloudinary as the source.
   */

  VideoTag = (function(superClass) {
    var DEFAULT_POSTER_OPTIONS, DEFAULT_VIDEO_SOURCE_TYPES, VIDEO_TAG_PARAMS;

    extend(VideoTag, superClass);

    VIDEO_TAG_PARAMS = ['source_types', 'source_transformation', 'fallback_content', 'poster'];

    DEFAULT_VIDEO_SOURCE_TYPES = ['webm', 'mp4', 'ogv'];

    DEFAULT_POSTER_OPTIONS = {
      format: 'jpg',
      resource_type: 'video'
    };


    /**
     * Creates an HTML (DOM) Video tag using Cloudinary as the source.
     * @param {String} [publicId]
     * @param {Object} [options]
     */

    function VideoTag(publicId, options) {
      if (options == null) {
        options = {};
      }
      options = _.defaults({}, options, Cloudinary.DEFAULT_VIDEO_PARAMS);
      VideoTag.__super__.constructor.call(this, "video", publicId.replace(/\.(mp4|ogv|webm)$/, ''), options);
    }

    VideoTag.prototype.setSourceTransformation = function(value) {
      this.transformation().sourceTransformation(value);
      return this;
    };

    VideoTag.prototype.setSourceTypes = function(value) {
      this.transformation().sourceTypes(value);
      return this;
    };

    VideoTag.prototype.setPoster = function(value) {
      this.transformation().poster(value);
      return this;
    };

    VideoTag.prototype.setFallbackContent = function(value) {
      this.transformation().fallbackContent(value);
      return this;
    };

    VideoTag.prototype.content = function() {
      var cld, fallback, innerTags, mimeType, sourceTransformation, sourceTypes, src, srcType, transformation, videoType;
      sourceTypes = this.transformation().getValue('source_types');
      sourceTransformation = this.transformation().getValue('source_transformation');
      fallback = this.transformation().getValue('fallback_content');
      if (_.isArray(sourceTypes)) {
        cld = new Cloudinary(this.getOptions());
        innerTags = (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = sourceTypes.length; j < len; j++) {
            srcType = sourceTypes[j];
            transformation = sourceTransformation[srcType] || {};
            src = cld.url("" + this.publicId, _.defaults({}, transformation, {
              resource_type: 'video',
              format: srcType
            }));
            videoType = srcType === 'ogv' ? 'ogg' : srcType;
            mimeType = 'video/' + videoType;
            results.push("<source " + (this.htmlAttrs({
              src: src,
              type: mimeType
            })) + ">");
          }
          return results;
        }).call(this);
      } else {
        innerTags = [];
      }
      return innerTags.join('') + fallback;
    };

    VideoTag.prototype.attributes = function() {
      var attr, defaults, poster, ref1, ref2, sourceTypes;
      sourceTypes = this.getOption('source_types');
      poster = (ref1 = this.getOption('poster')) != null ? ref1 : {};
      if (_.isPlainObject(poster)) {
        defaults = poster.public_id != null ? Cloudinary.DEFAULT_IMAGE_PARAMS : DEFAULT_POSTER_OPTIONS;
        poster = new Cloudinary(this.getOptions()).url((ref2 = poster.public_id) != null ? ref2 : this.publicId, _.defaults({}, poster, defaults));
      }
      attr = VideoTag.__super__.attributes.call(this) || [];
      attr = _.omit(attr, VIDEO_TAG_PARAMS);
      if (!_.isArray(sourceTypes)) {
        attr["src"] = new Cloudinary(this.getOptions()).url(this.publicId, {
          resource_type: 'video',
          format: sourceTypes
        });
      }
      if (poster != null) {
        attr["poster"] = poster;
      }
      return attr;
    };

    return VideoTag;

  })(HtmlTag);

  if (!(((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) || (exports != null))) {
    exports = window;
  }

  if (exports.Cloudinary == null) {
    exports.Cloudinary = {};
  }

  exports.Cloudinary.prototype.videoTag = function(publicId, options) {
    options = _.defaults({}, options, this.config());
    return new VideoTag(publicId, options);
  };

  exports.Cloudinary.VideoTag = VideoTag;

  
}));
;

}).call(this);