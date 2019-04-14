(function($) {

  // node_walk: walk the element tree, stop when func(node) returns false

  /**
   * Walk a tree of nodes and return when the predicate is equal to false.
   *
   * Used to evaluate a whole tree and stop/process a node when one match is found.
   *
   * @param {HTMLElement} node The parent node to start from.
   * @param {Function}    func The predicate to be evaluated for each node.
   * @returns {*}
   */
  function anyNode(node, func) {
    if (!node.hasChildNodes()) {
      return func(node);
    } else {
      for(var child = node.firstChild;
              child !== null;
              child = child.nextSibling) {
        if(anyNode(child, func) === false) {
            return false;
        }
      }
      return true;
    }
  }

  /**
   * ZFE Code Editor.
   *
   * Intended to perform IDE-like functions when editing Zabbix evaluated expressions such as Trigger expressions.
   *
   * @param el
   * @param settings
   * @constructor
   */
  function ZFECodeEditor(el, settings) {
    this.$el = $(el);
    this._settings = settings;
    this.$suggestEl = null;

    this.handleChange = this.handleChange.bind(this);

    this._bindEvents(el);
  }

  /**
   * Bind event handlers on the element that the plugin was called on via $el.zfecode()
   *
   * @private
   */
  ZFECodeEditor.prototype._bindEvents = function() {
    var that = this;

    // change events do not fire on contentEditable elements, so this is simulated.
    this.$el.on('focus', function() {
      var $this = $(this);
      $this.data('before', $this.html());
    }).on('blur keyup paste input', function() {
      var $this = $(this);
      if ($this.data('before') !== $this.html()) {
        $this.data('before', $this.html());
        that.$el.trigger('change');
      }
    });

    this.$el.change(this.handleChange);

    addListener(window, 'resize', this.positionSuggests.bindAsEventListener(this));
  };

  /**
   * Handle the custom event 'change' which is synthesised on the editable area.
   */
  ZFECodeEditor.prototype.handleChange = function() {
    console.log('got a change');
    var text = this.$el.text();

    var pos = this.caretPosition(this.$el.get(0));
    console.log(pos);

    this.parse(text);
  };

  /**
   * Parse the text given, using the parser given in the settings (default parser = trigger expression parser)
   *
   * @param {String} text Text content of the editable div.
   */
  ZFECodeEditor.prototype.parse = function(text) {
    var tracer = this._settings.tracer;
    var parser = this._settings.parser;

    try {
      var result = parser(text, { tracer: tracer });

      $('.zfe-code-editor-msg').text('Valid expression');
    } catch (e) { // An exception is quite normal in an unfinished expression.
      console.dir(e);

      var matches = tracer.matches;
      var lastMatch = tracer.lastMatch;

      var rightMostMatch = tracer.rightMostMatch;  // This one probably provides the most context about what to suggest.
      var rightMostMatchColumn = rightMostMatch[0];
      var rightMostMatchRule = rightMostMatch[1];

      this.suggest(matches, rightMostMatchRule);

      tracer.clearMatches();

      $('.zfe-code-editor-msg').text(e.message);
    }
  };

  /**
   * Suggest a possible number of completions that fit several criteria including a search prefix.
   *
   * @param {Array} matches List of matched rules.
   * @param {Object} rightMatch Rightmost matched rule which may give a clue about what to suggest.
   */
  ZFECodeEditor.prototype.suggest = function(matches, rightMatch) {
    this.showSuggests();

    switch (rightMatch.rule) {
      case "open_brace":
        // console.log("suggest a key");
        // this.suggestType('items', '');
        break;
      case "key_element":
        console.log("search a key");
        this.suggestType('items', rightMatch.result);
        break;
      case "open_paren":
        console.log("suggest function parameters");
        break;
      case "open_bracket":
        console.log("suggest key parameters");
        console.log(matches);
        break;
      case "period":
        console.log("suggest key name OR function");
        break;
      default:
        console.log("no suggestion found");
    }


  };

  /**
   * Search and populate the suggestion results area given the intended object type and a partial text prefix.
   *
   * @param objType
   * @param searchValue
   */
  ZFECodeEditor.prototype.suggestType = function(objType, searchValue) {
    switch(objType) {
      case 'items':
        if (!this._settings.suggestions.hasOwnProperty('items')) { return; }

        var items = this._settings.suggestions.items;
        var keys = Object.keys(items);

        if (searchValue.length !== 0) {
          var matches = keys.filter(function (value) {
            return value.indexOf(searchValue) !== -1;
          });

          var suggestions = matches.map(function(v) {
            return {
              title: v,
              subtitle: items[v].hasOwnProperty('title') ? items[v].title : 'No description available.',
              comment: items[v].hasOwnProperty('description') ? items[v].description : '',
              args: items[v].args ? items[v].args : null
            }
          });
        } else {
          var suggestions = Object.keys(items).map(function(v) {
            return Object.assign({}, items[v], { key: v });
          });
        }

        //
        // if (suggestions.length > this._settings.maxSuggest) {
        //   suggestions = suggestions.slice(this._settings.maxSuggest, suggestions.length);
        // }

        this.createSuggestionResults(suggestions, searchValue);
        break;
    }
  };

  /**
   * Retrieve the caret position from a content editable area.
   *
   * getCaretPosition: return [start, end] as offsets to elem.textContent that
   * correspond to the selected portion of text
   * (if start == end, caret is at given position and no text is selected)
   */
  ZFECodeEditor.prototype.caretPosition = function(elem) {
    var sel = window.getSelection();
    var cum_length = [0, 0];

    if(sel.anchorNode === elem)
      cum_length = [sel.anchorOffset, sel.extentOffset];
    else {
      var nodes_to_find = [sel.anchorNode, sel.extentNode];
      if(!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode))
        return undefined;
      else {
        var found = [0,0];
        var i;
        anyNode(elem, function(node) {
          for(i = 0; i < 2; i++) {
            if(node === nodes_to_find[i]) {
              found[i] = true;
              if(found[i === 0 ? 1 : 0])
                return false; // all done
            }
          }

          if(node.textContent && !node.firstChild) {
            for(i = 0; i < 2; i++) {
              if(!found[i])
                cum_length[i] += node.textContent.length;
            }
          }
        });
        cum_length[0] += sel.anchorOffset;
        cum_length[1] += sel.extentOffset;
      }
    }
    if(cum_length[0] <= cum_length[1])
      return cum_length;
    return [cum_length[1], cum_length[0]];
  };

  // DOM creation
  ZFECodeEditor.prototype.showSuggests = function() {
    if (this.$suggestEl === null) {
      this.$suggestEl = $(document.createElement('ul'));

      var doc_body = $('body');
      doc_body.append(this.$suggestEl);
      this.$suggestEl.addClass('search-suggest');
      this.$suggestEl.addClass('zfe-search-suggest');
      this.positionSuggests();
    }

    this.$suggestEl.css('display', 'block');
  };

  ZFECodeEditor.prototype.hideSuggests = function() {
    if (this.$suggestEl !== null) {
      this.$suggestEl.style.display = 'none';
    }
  };

  ZFECodeEditor.prototype.positionSuggests = function() {
    if (this.$suggestEl === null) {
      return true;
    }

    var pos = jQuery(this.$el).offset();
    //   dims = getDimensions(this.$el);

    var caretPos = this.caretPosition(this.$el.get(0));
    console.log('caret position');
    console.log(caretPos);

    this.$suggestEl.css('top', (pos.top + caretPos[1]) + 'px');
    this.$suggestEl.css('left', (pos.left + caretPos[0]) + 'px');
  };

  /**
   * Populate the <ul> search result element with list items that represent the search results.
   *
   * @param {Array}  suggestions An array of objects which each have (at minimum) a `title` attribute which will be displayed.
   * @param {String} searchTerm  The partially typed search term (for highlighting).
   */
  ZFECodeEditor.prototype.createSuggestionResults = function(suggestions, searchTerm) {
    this.$suggestEl.html('');

    console.log(suggestions);

    for (var i in suggestions) {
      if (!suggestions.hasOwnProperty(i)) continue;
      var suggestion = suggestions[i];

      var li = $('<li></li>');
      var title = $('<span class="title"></span>');
      var name = $('<span class="name"></span>');

      name.text(suggestion.title);
      title.append(name);

      if (suggestion.args) {
        var ulArgs = $('<ul class="args"></ul>');
        var bracketOpen = $('<li>[</li>');
        ulArgs.append(bracketOpen);

        for (var k = 0; k < suggestion.args.length; k++) {
          var arg = $('<li></li>');
          arg.text(suggestion.args[k].name + ', ');
          ulArgs.append(arg);
        }

        var bracketClose = $('<li>]</li>');
        ulArgs.append(bracketClose);

        title.append(ulArgs);
      }

      li.append(title);

      var subtitle = $('<span class="subtitle"></span>');
      if (suggestion.subtitle) {
        subtitle.text(suggestion.subtitle);
      } else {
        subtitle.text('No description provided.');
      }
      li.append(subtitle);

      var comment = $('<span class="comment"></span>');
      if (suggestion.comment) {
        comment.text(suggestion.comment);
      }
      li.append(comment);

      this.$suggestEl.append(li);
    }
  };

  // ZFECodeEditor.prototype.newSugTab = function(suggestions, searchTerm) {
  //   var sugTab = document.createElement('div'),
  //       count = 0;
  //
  //   searchTerm = searchTerm.toLowerCase();
  //
  //   for (var key in suggestions) {
  //     if (empty(suggestions[key])) {
  //       continue;
  //     }
  //
  //     count++;
  //
  //     var li = document.createElement('li'),
  //       text = suggestions[key].toLowerCase(),
  //       start = 0,
  //       end = 0;
  //
  //     li.setAttribute('id', 'line_' + count);
  //     li.setAttribute('searchTerm', suggestions[key]);
  //
  //     while (text.indexOf(needle, end) > -1) {
  //       end = text.indexOf(needle, end);
  //
  //       if (end > start) {
  //         li.appendChild(document.createTextNode(suggestions[key].substring(start, end)));
  //       }
  //
  //       var bold = document.createElement('span');
  //       bold.appendChild(document.createTextNode(suggestions[key].substring(end, end + needle.length)));
  //       bold.setAttribute('class', 'suggest-found');
  //       li.appendChild(bold);
  //
  //       end += needle.length;
  //       start = end;
  //     }
  //
  //     if (end < suggestions[key].length) {
  //       li.appendChild(document.createTextNode(suggestions[key].substring(end, suggestions[key].length)));
  //     }
  //
  //     addListener(li, 'mouseover', this.mouseOver.bindAsEventListener(this), true);
  //     addListener(li, 'mouseup', this.selectSuggest.bindAsEventListener(this), true);
  //     addListener(li, 'mouseout', this.mouseOut.bindAsEventListener(this), true);
  //     sugTab.appendChild(li);
  //
  //     if (count >= this.suggestLimit) {
  //       break;
  //     }
  //   }
  //
  //   this.dom.suggest.appendChild(sugTab);
  //
  //   if (!is_null(this.dom.sugtab)) {
  //     this.dom.sugtab.remove();
  //   }
  //
  //   this.dom.sugtab = $(sugTab);
  //   this.dom.suggest.appendChild(this.dom.sugtab);
  //
  //   if (count === 0) {
  //     this.hideSuggests();
  //   }
  //
  //   this.suggestCount = count;
  // };

  $.fn.zfecode = function(options) {
    var settings = $.extend({}, $.fn.zfecode.defaults, options);
    return new ZFECodeEditor($(this), settings);
  };

  $.fn.zfecode.defaults = {
    parser: peg$parse,
    tracer: new ZFETracer(),
    suggestions: {},
    maxSuggest: 10
  };

})(jQuery);