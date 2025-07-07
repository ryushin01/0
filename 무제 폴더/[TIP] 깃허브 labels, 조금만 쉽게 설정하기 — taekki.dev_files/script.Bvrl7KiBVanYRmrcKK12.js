function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
document.addEventListener('alpine:init', function() {
  return Alpine.data('indicator', function() {
    return {
      /**
       * Scroll indicate
       */
      indicate: function indicate() {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = winScroll / height * 100;
        this.$refs.indicator.style.width = scrolled + '%';
      }
    };
  });
});
document.addEventListener('alpine:init', function() {
  return Alpine.data('scrollspy', function() {
    return {
      /**
       * Show
       *
       * @property {boolean} show
       */
      show: false,
      /**
       * On active Class
       *
       * @property {string} activeClass
       */
      activeClass: 'active',
      /**
       * Open
       *
       * @property {boolean} open
       */
      open: false,
      /**
       * Scollspy
       */
      scrollspy: function scrollspy() {
        this.track();
        this.on();
      },
      /**
       * Toggle
       */
      toggle: function toggle() {
        this.open = !this.open;
      },
      /**
       * Track
       */
      track: function track() {
        var _this = this;
        var $headings = this.$headings;
        $headings.forEach(function($heading, index) {
          if (_this["in"]($heading)) {
            _this.reset();
            _this.hit(index);
          }
        });
        var $heading = $headings.item(0);
        if (this.out($heading)) {
          this.reset();
        }
      },
      /**
       * On
       */
      on: function on() {
        this.show = this.$article.getBoundingClientRect().top < 0;
      },
      /**
       * Active
       *
       * @param {number} index
       */
      hit: function hit(index) {
        this.$data.headings[index].active = true;
      },
      /**
       * inactive All
       */
      reset: function reset() {
        this.$data.headings.forEach(function(spy) {
          return spy.active = false;
        });
      },
      /**
       * Scroll in heading
       *
       * @param {HTMLElement} $heading
       *
       * @returns {boolean}
       */
      "in": function _in($heading) {
        return $heading.getBoundingClientRect().top < 0;
      },
      /**
       * Scroll out heading
       *
       * @param {HTMLElement} $heading
       *
       * @returns {boolean}
       */
      out: function out($heading) {
        return $heading.getBoundingClientRect().top > 0;
      },
      /**
       * Article
       *
       * @returns {HTMLElement}
       */
      get $article() {
        return this.$refs.article;
      },
      /**
       * Get headings in content
       *
       * @return {NodeListOf<HTMLElement>}
       */
      get $headings() {
        return this.$article.querySelectorAll(this.$data.supportHeadings);
      }
    };
  });
});
document.addEventListener('alpine:init', function() {
  return Alpine.data('content', function() {
    return {
      /**
       * Support Headings
       *
       * @property {array} headings
       */
      supportHeadings: '.contents_style > h2, .contents_style > h3',
      /**
       * Headings
       *
       * @property {array} headings
       */
      headings: [],
      /**
       * Init 'content' Component
       */
      init: function init() {
        this.setAnchorToHeadings();
        this.collectHeading();
        this.setLazyLoadToImages();
        this.setRatioToImages();
        this.setPositionToImages();
        this.highlightCodeBlocks();
      },
      /**
       * Syntax highlighting code blocks in template
       */
      highlightCodeBlocks: function highlightCodeBlocks() {
        this.$article.querySelectorAll('pre code').forEach(hljs.highlightElement);
      },
      /**
       * Collect heading in template
       */
      collectHeading: function collectHeading() {
        var _this2 = this;
        this.$headings.forEach(function($heading) {
          var heading = _this2.heading($heading);
          _this2.headings.push(heading);
        });
      },
      /**
       * Get new Scrollspy item
       *
       * @param {HTMLElement} $heading
       *
       * @return {object}
       */
      heading: function heading($heading) {
        return {
          tagName: $heading.tagName,
          id: $heading.id,
          href: "#".concat($heading.id),
          text: $heading.textContent,
          active: false
        };
      },
      /**
       * Set lazy load to images in template
       */
      setLazyLoadToImages: function setLazyLoadToImages() {
        this.$article.querySelectorAll('figure[class^=image] img').forEach(this.setLazyLoadToImage);
      },
      /**
       * Set lazy load to image
       *
       * @param {object} $image
       */
      setLazyLoadToImage: function setLazyLoadToImage($image) {
        $image.classList.add('lazyload');
        $image.dataset.src = $image.getAttribute('src');
        $image.dataset.srcset = $image.getAttribute('srcset');
        $image.dataset.sizes = 'auto';
        $image.removeAttribute('src');
        $image.removeAttribute('srcset');
      },
      /**
       * set Ratio to images in template
       */
      setRatioToImages: function setRatioToImages() {
        this.$article.querySelectorAll('figure.imageslideblock').forEach(this.setRatioToImageSlideBlock.bind(this));
        this.$article.querySelectorAll('figure.imageblock').forEach(this.setRatioToImageBlock.bind(this));
        this.$article.querySelectorAll('figure.imagegridblock').forEach(this.setRatioToImageGridBlock.bind(this));
      },
      /**
       * Set Ratio to image block
       *
       * @param {HTMLElement} $imageBlock
       */
      setRatioToImageBlock: function setRatioToImageBlock($imageBlock) {
        var $imageWrap = $imageBlock.querySelector('span, a');
        var $image = $imageWrap.querySelector('img');
        var paddingBottom = this.ratio($imageBlock, $image);
        $imageWrap.style.paddingBottom = "".concat(paddingBottom, "%");
      },
      /**
       * Set Ratio to image grid block
       *
       * @param {HTMLElement} $imageBlock
       */
      setRatioToImageGridBlock: function setRatioToImageGridBlock($imageBlock) {
        var _this3 = this;
        var $imageWraps = $imageBlock.querySelectorAll('span, a');
        $imageWraps.forEach(function($imageWrap) {
          var $image = $imageWrap.querySelector('img');
          var paddingBottom = _this3.ratio($imageWrap, $image);
          $imageWrap.style.paddingBottom = "".concat(paddingBottom, "%");
        });
      },
      /**
       * Set Ratio to image slide block
       *
       * @param {HTMLElement} $imageBlock
       */
      setRatioToImageSlideBlock: function setRatioToImageSlideBlock($imageBlock) {
        var $imageWrap = $imageBlock.querySelector('.image-container');
        var $image = $imageWrap.querySelector('img');
        var paddingBottom = this.ratio($image, $image);
        $imageWrap.style.paddingBottom = "".concat(paddingBottom, "%");
      },
      /**
       * Get ratio
       *
       * @param {HTMLElement} $originBlock
       * @param {HTMLElement} $image
       *
       * @return {number}
       */
      ratio: function ratio($originBlock, $image) {
        var width = $originBlock.dataset.originWidth;
        var height = $originBlock.dataset.originHeight;
        if ($image.hasAttribute('width') && $image.hasAttribute('height')) {
          width = $image.getAttribute('width');
          height = $image.getAttribute('height');
        }
        width = $originBlock.dataset.widthpercent ? width * (100 / $originBlock.dataset.widthpercent) : width;
        return height / width * 100;
      },
      /**
       * Set position to images
       */
      setPositionToImages: function setPositionToImages() {
        this.$article.querySelectorAll('figure.imageblock').forEach(this.setImageBlockPosition.bind(this));
        this.$article.querySelectorAll('figure.imagegridblock').forEach(this.setImageGridBlockPosition.bind(this));
      },
      /**
       * Set image block position
       *
       * @param {HTMLElement} $imageBlock
       */
      setImageBlockPosition: function setImageBlockPosition($imageBlock) {
        var width = this.imageBlockWidth($imageBlock);
        if ($imageBlock.classList.contains('alignCenter')) {
          this.setImageBlockToCenter($imageBlock);
        }
        if ($imageBlock.classList.contains('widthContent')) {
          return;
        }
        this.setImageBlockWidth($imageBlock, width);
      },
      /**
       * Set image grid block position
       *
       * @param {HTMLElement} $imageBlock
       */
      setImageGridBlockPosition: function setImageGridBlockPosition($imageBlock) {
        var width = this.imageGridBlockWidth();
        this.setImageBlockToCenter($imageBlock);
        this.setImageBlockWidth($imageBlock, width);
      },
      /**
       * Center image block
       *
       * @param {HTMLElement} $imageBlock
       */
      imageBlockWidth: function imageBlockWidth($imageBlock) {
        var $imageWrap = $imageBlock.querySelector('span, a');
        var $image = $imageWrap.querySelector('img');
        var width = $image.getAttribute('width') || $imageBlock.dataset.originWidth;
        return width > 1100 ? 1100 : width;
      },
      /**
       * Center image grid block
       */
      imageGridBlockWidth: function imageGridBlockWidth() {
        return 1100;
      },
      /**
       * set Image Width
       *
       * @param {HTMLElement} $imageBlock
       * @param {String|Number} width
       */
      setImageBlockWidth: function setImageBlockWidth($imageBlock, width) {
        $imageBlock.style.width = "".concat(width, "px");
        $imageBlock.style.maxWidth = "".concat(width, "px");
      },
      /**
       * set Image block to center
       *
       * @param {HTMLElement} $imageBlock
       */
      setImageBlockToCenter: function setImageBlockToCenter($imageBlock) {
        $imageBlock.style.marginLeft = '50%';
        $imageBlock.style.transform = 'translateX(-50%)';
      },
      /**
       * Set anchor to headings in template
       */
      setAnchorToHeadings: function setAnchorToHeadings() {
        this.$headings.forEach(this.setAnchorToHeading.bind(this));
      },
      /**
       * Set anchor to heading
       *
       * @param {HTMLElement} $heading
       */
      setAnchorToHeading: function setAnchorToHeading($heading) {
        var link = this.link($heading);
        var $anchor = this.$anchor($heading, "#".concat(link));
        $heading.setAttribute('id', link);
        $heading.innerHTML = $anchor.outerHTML;
      },
      /**
       * Get link for heading
       *
       * @param {HTMLElement} $heading
       *
       * @return {string}
       */
      link: function link($heading) {
        return this.$id(encodeURIComponent($heading.textContent));
      },
      /**
       * Get new anchor
       *
       * @param {HTMLElement} $heading
       * @param {string} link
       *
       * @return {HTMLElement}
       */
      $anchor: function $anchor($heading, link) {
        var $anchor = document.createElement('a');
        $anchor.setAttribute('href', link);
        $anchor.textContent = $heading.textContent;
        return $anchor;
      },
      /**
       * Get article template content
       *
       * @return {HTMLElement}
       */
      get $article() {
        return this.$refs.articleTemplate.content;
      },
      /**
       * Get headings in content
       *
       * @return {NodeListOf<HTMLElement>}
       */
      get $headings() {
        return this.$article.querySelectorAll(this.supportHeadings);
      }
    };
  });
});
document.addEventListener('alpine:init', function() {
  return Alpine.data('tag', function() {
    return {
      /**
       * Init
       */
      init: function init() {
        this.removeAllCommas();
      },
      /**
       * Remove all commas
       */
      removeAllCommas: function removeAllCommas() {
        var _iterator = _createForOfIteratorHelper(this.$el.childNodes),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var node = _step.value;
            if (node.nodeType === 3) {
              node.remove();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    };
  });
});
document.addEventListener('alpine:init', function() {
  return Alpine.data('category', function() {
    return {
      /**
       * @var {Boolean} foldableCategory
       */
      foldableCategory: skinOptions.foldableCategory,
      /**
       * Init
       */
      init: function init() {
        if (this.foldableCategory) {
          this.$subCategories.forEach(this.foldable.bind(this));
        }
      },
      /**
       * Foldable
       *
       * @param {HTMLElement} $subCategory
       */
      foldable: function foldable($subCategory) {
        $subCategory.parentNode.setAttribute('x-data', '{ open: false }');
        $subCategory.setAttribute('x-show', 'open');
        $subCategory.setAttribute('x-collapse', '');
        var $icon = this.$icon;
        $icon.setAttribute('x-on:click', 'open = ! open');
        $icon.setAttribute(':class', '{ "rotate-90 duration-200": open }');
        $subCategory.parentNode.prepend($icon);
      },
      /**
       * Get subcategories
       *
       * @var {NodeListOf<HTMLElement>} $subCategories
       */
      get $subCategories() {
        return this.$el.querySelectorAll('.sub_category_list');
      },
      /**
       * Get a new icon
       *
       * @var {HTMLElement} $icon
       */
      get $icon() {
        var icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-chevron-right');
        return icon;
      }
    };
  });
});
document.addEventListener('alpine:init', function() {
  return Alpine.data('top', function() {
    return {
      /**
       * @property {boolean} open
       */
      open: true,
      /**
       * Init
       */
      init: function init() {
        this.setTistoryMenuToolbar();
        this.hasScrollbar() && this.toggle();
      },
      /**
       * Set TISTORY menu toolbar
       */
      setTistoryMenuToolbar: function setTistoryMenuToolbar() {
        var tistoryMenuToolbar = document.getElementById('menubar_wrapper');
        tistoryMenuToolbar && this.$refs.toolbar.append(tistoryMenuToolbar);
      },
      /**
       * Toggle
       */
      toggle: function toggle() {
        var _this4 = this;
        this.$targets.forEach(function(el) {
          if (document.body.contains(el)) {
            _this4.open = el.getBoundingClientRect().top < 0;
          }
        });
      },
      /**
       * Has scroll bar on html
       *
       * @returns {boolean}
       */
      hasScrollbar: function hasScrollbar() {
        return document.documentElement.scrollHeight > document.documentElement.clientHeight;
      },
      /**
       * targets
       *
       * @returns {Array<HTMLElement>}
       */
      get $targets() {
        return [this.$refs.list, this.$refs.content];
      }
    };
  });
});
document.addEventListener('alpine:init', function() {
  return Alpine.data('bottom', function() {
    return {
      /**
       * Toggle Theme
       */
      toggleTheme: function toggleTheme() {
        darkMode.toggle();
        this.$data.dark = !this.$data.dark;
      }
    };
  });
});
window.addEventListener('DOMContentLoaded', function() {
  return Alpine.start();
});