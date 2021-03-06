System.register(['angular2/src/facade/collection', 'angular2/src/facade/lang'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var collection_1, lang_1;
    var ShadowCss, _cssContentNextSelectorRe, _cssContentRuleRe, _cssContentUnscopedRuleRe, _polyfillHost, _polyfillHostContext, _parenSuffix, _cssColonHostRe, _cssColonHostContextRe, _polyfillHostNoCombinator, _shadowDOMSelectorsRe, _selectorReSuffix, _polyfillHostRe, _colonHostRe, _colonHostContextRe, _commentRe, _ruleRe, _curlyRe, OPEN_CURLY, CLOSE_CURLY, BLOCK_PLACEHOLDER, CssRule, StringWithEscapedBlocks;
    function stripComments(input) {
        return lang_1.StringWrapper.replaceAllMapped(input, _commentRe, function (_) { return ''; });
    }
    function processRules(input, ruleCallback) {
        var inputWithEscapedBlocks = escapeBlocks(input);
        var nextBlockIndex = 0;
        return lang_1.StringWrapper.replaceAllMapped(inputWithEscapedBlocks.escapedString, _ruleRe, function (m) {
            var selector = m[2];
            var content = '';
            var suffix = m[4];
            var contentPrefix = '';
            if (lang_1.isPresent(m[4]) && m[4].startsWith('{' + BLOCK_PLACEHOLDER)) {
                content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
                suffix = m[4].substring(BLOCK_PLACEHOLDER.length + 1);
                contentPrefix = '{';
            }
            var rule = ruleCallback(new CssRule(selector, content));
            return "" + m[1] + rule.selector + m[3] + contentPrefix + rule.content + suffix;
        });
    }
    exports_1("processRules", processRules);
    function escapeBlocks(input) {
        var inputParts = lang_1.StringWrapper.split(input, _curlyRe);
        var resultParts = [];
        var escapedBlocks = [];
        var bracketCount = 0;
        var currentBlockParts = [];
        for (var partIndex = 0; partIndex < inputParts.length; partIndex++) {
            var part = inputParts[partIndex];
            if (part == CLOSE_CURLY) {
                bracketCount--;
            }
            if (bracketCount > 0) {
                currentBlockParts.push(part);
            }
            else {
                if (currentBlockParts.length > 0) {
                    escapedBlocks.push(currentBlockParts.join(''));
                    resultParts.push(BLOCK_PLACEHOLDER);
                    currentBlockParts = [];
                }
                resultParts.push(part);
            }
            if (part == OPEN_CURLY) {
                bracketCount++;
            }
        }
        if (currentBlockParts.length > 0) {
            escapedBlocks.push(currentBlockParts.join(''));
            resultParts.push(BLOCK_PLACEHOLDER);
        }
        return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
    }
    return {
        setters:[
            function (collection_1_1) {
                collection_1 = collection_1_1;
            },
            function (lang_1_1) {
                lang_1 = lang_1_1;
            }],
        execute: function() {
            /**
             * This file is a port of shadowCSS from webcomponents.js to TypeScript.
             *
             * Please make sure to keep to edits in sync with the source file.
             *
             * Source:
             * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
             *
             * The original file level comment is reproduced below
             */
            /*
              This is a limited shim for ShadowDOM css styling.
              https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#styles
            
              The intention here is to support only the styling features which can be
              relatively simply implemented. The goal is to allow users to avoid the
              most obvious pitfalls and do so without compromising performance significantly.
              For ShadowDOM styling that's not covered here, a set of best practices
              can be provided that should allow users to accomplish more complex styling.
            
              The following is a list of specific ShadowDOM styling features and a brief
              discussion of the approach used to shim.
            
              Shimmed features:
            
              * :host, :host-context: ShadowDOM allows styling of the shadowRoot's host
              element using the :host rule. To shim this feature, the :host styles are
              reformatted and prefixed with a given scope name and promoted to a
              document level stylesheet.
              For example, given a scope name of .foo, a rule like this:
            
                :host {
                    background: red;
                  }
                }
            
              becomes:
            
                .foo {
                  background: red;
                }
            
              * encapsultion: Styles defined within ShadowDOM, apply only to
              dom inside the ShadowDOM. Polymer uses one of two techniques to implement
              this feature.
            
              By default, rules are prefixed with the host element tag name
              as a descendant selector. This ensures styling does not leak out of the 'top'
              of the element's ShadowDOM. For example,
            
              div {
                  font-weight: bold;
                }
            
              becomes:
            
              x-foo div {
                  font-weight: bold;
                }
            
              becomes:
            
            
              Alternatively, if WebComponents.ShadowCSS.strictStyling is set to true then
              selectors are scoped by adding an attribute selector suffix to each
              simple selector that contains the host element tag name. Each element
              in the element's ShadowDOM template is also given the scope attribute.
              Thus, these rules match only elements that have the scope attribute.
              For example, given a scope name of x-foo, a rule like this:
            
                div {
                  font-weight: bold;
                }
            
              becomes:
            
                div[x-foo] {
                  font-weight: bold;
                }
            
              Note that elements that are dynamically added to a scope must have the scope
              selector added to them manually.
            
              * upper/lower bound encapsulation: Styles which are defined outside a
              shadowRoot should not cross the ShadowDOM boundary and should not apply
              inside a shadowRoot.
            
              This styling behavior is not emulated. Some possible ways to do this that
              were rejected due to complexity and/or performance concerns include: (1) reset
              every possible property for every possible selector for a given scope name;
              (2) re-implement css in javascript.
            
              As an alternative, users should make sure to use selectors
              specific to the scope in which they are working.
            
              * ::distributed: This behavior is not emulated. It's often not necessary
              to style the contents of a specific insertion point and instead, descendants
              of the host element can be styled selectively. Users can also create an
              extra node around an insertion point and style that node's contents
              via descendent selectors. For example, with a shadowRoot like this:
            
                <style>
                  ::content(div) {
                    background: red;
                  }
                </style>
                <content></content>
            
              could become:
            
                <style>
                  / *@polyfill .content-container div * /
                  ::content(div) {
                    background: red;
                  }
                </style>
                <div class="content-container">
                  <content></content>
                </div>
            
              Note the use of @polyfill in the comment above a ShadowDOM specific style
              declaration. This is a directive to the styling shim to use the selector
              in comments in lieu of the next selector when running under polyfill.
            */
            ShadowCss = (function () {
                function ShadowCss() {
                    this.strictStyling = true;
                }
                /*
                * Shim some cssText with the given selector. Returns cssText that can
                * be included in the document via WebComponents.ShadowCSS.addCssToDocument(css).
                *
                * When strictStyling is true:
                * - selector is the attribute added to all elements inside the host,
                * - hostSelector is the attribute added to the host itself.
                */
                ShadowCss.prototype.shimCssText = function (cssText, selector, hostSelector) {
                    if (hostSelector === void 0) { hostSelector = ''; }
                    cssText = stripComments(cssText);
                    cssText = this._insertDirectives(cssText);
                    return this._scopeCssText(cssText, selector, hostSelector);
                };
                ShadowCss.prototype._insertDirectives = function (cssText) {
                    cssText = this._insertPolyfillDirectivesInCssText(cssText);
                    return this._insertPolyfillRulesInCssText(cssText);
                };
                /*
                 * Process styles to convert native ShadowDOM rules that will trip
                 * up the css parser; we rely on decorating the stylesheet with inert rules.
                 *
                 * For example, we convert this rule:
                 *
                 * polyfill-next-selector { content: ':host menu-item'; }
                 * ::content menu-item {
                 *
                 * to this:
                 *
                 * scopeName menu-item {
                 *
                **/
                ShadowCss.prototype._insertPolyfillDirectivesInCssText = function (cssText) {
                    // Difference with webcomponents.js: does not handle comments
                    return lang_1.StringWrapper.replaceAllMapped(cssText, _cssContentNextSelectorRe, function (m) { return m[1] + '{'; });
                };
                /*
                 * Process styles to add rules which will only apply under the polyfill
                 *
                 * For example, we convert this rule:
                 *
                 * polyfill-rule {
                 *   content: ':host menu-item';
                 * ...
                 * }
                 *
                 * to this:
                 *
                 * scopeName menu-item {...}
                 *
                **/
                ShadowCss.prototype._insertPolyfillRulesInCssText = function (cssText) {
                    // Difference with webcomponents.js: does not handle comments
                    return lang_1.StringWrapper.replaceAllMapped(cssText, _cssContentRuleRe, function (m) {
                        var rule = m[0];
                        rule = lang_1.StringWrapper.replace(rule, m[1], '');
                        rule = lang_1.StringWrapper.replace(rule, m[2], '');
                        return m[3] + rule;
                    });
                };
                /* Ensure styles are scoped. Pseudo-scoping takes a rule like:
                 *
                 *  .foo {... }
                 *
                 *  and converts this to
                 *
                 *  scopeName .foo { ... }
                */
                ShadowCss.prototype._scopeCssText = function (cssText, scopeSelector, hostSelector) {
                    var unscoped = this._extractUnscopedRulesFromCssText(cssText);
                    cssText = this._insertPolyfillHostInCssText(cssText);
                    cssText = this._convertColonHost(cssText);
                    cssText = this._convertColonHostContext(cssText);
                    cssText = this._convertShadowDOMSelectors(cssText);
                    if (lang_1.isPresent(scopeSelector)) {
                        cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
                    }
                    cssText = cssText + '\n' + unscoped;
                    return cssText.trim();
                };
                /*
                 * Process styles to add rules which will only apply under the polyfill
                 * and do not process via CSSOM. (CSSOM is destructive to rules on rare
                 * occasions, e.g. -webkit-calc on Safari.)
                 * For example, we convert this rule:
                 *
                 * @polyfill-unscoped-rule {
                 *   content: 'menu-item';
                 * ... }
                 *
                 * to this:
                 *
                 * menu-item {...}
                 *
                **/
                ShadowCss.prototype._extractUnscopedRulesFromCssText = function (cssText) {
                    // Difference with webcomponents.js: does not handle comments
                    var r = '', m;
                    var matcher = lang_1.RegExpWrapper.matcher(_cssContentUnscopedRuleRe, cssText);
                    while (lang_1.isPresent(m = lang_1.RegExpMatcherWrapper.next(matcher))) {
                        var rule = m[0];
                        rule = lang_1.StringWrapper.replace(rule, m[2], '');
                        rule = lang_1.StringWrapper.replace(rule, m[1], m[3]);
                        r += rule + '\n\n';
                    }
                    return r;
                };
                /*
                 * convert a rule like :host(.foo) > .bar { }
                 *
                 * to
                 *
                 * scopeName.foo > .bar
                */
                ShadowCss.prototype._convertColonHost = function (cssText) {
                    return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
                };
                /*
                 * convert a rule like :host-context(.foo) > .bar { }
                 *
                 * to
                 *
                 * scopeName.foo > .bar, .foo scopeName > .bar { }
                 *
                 * and
                 *
                 * :host-context(.foo:host) .bar { ... }
                 *
                 * to
                 *
                 * scopeName.foo .bar { ... }
                */
                ShadowCss.prototype._convertColonHostContext = function (cssText) {
                    return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
                };
                ShadowCss.prototype._convertColonRule = function (cssText, regExp, partReplacer) {
                    // p1 = :host, p2 = contents of (), p3 rest of rule
                    return lang_1.StringWrapper.replaceAllMapped(cssText, regExp, function (m) {
                        if (lang_1.isPresent(m[2])) {
                            var parts = m[2].split(','), r = [];
                            for (var i = 0; i < parts.length; i++) {
                                var p = parts[i];
                                if (lang_1.isBlank(p))
                                    break;
                                p = p.trim();
                                r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
                            }
                            return r.join(',');
                        }
                        else {
                            return _polyfillHostNoCombinator + m[3];
                        }
                    });
                };
                ShadowCss.prototype._colonHostContextPartReplacer = function (host, part, suffix) {
                    if (lang_1.StringWrapper.contains(part, _polyfillHost)) {
                        return this._colonHostPartReplacer(host, part, suffix);
                    }
                    else {
                        return host + part + suffix + ', ' + part + ' ' + host + suffix;
                    }
                };
                ShadowCss.prototype._colonHostPartReplacer = function (host, part, suffix) {
                    return host + lang_1.StringWrapper.replace(part, _polyfillHost, '') + suffix;
                };
                /*
                 * Convert combinators like ::shadow and pseudo-elements like ::content
                 * by replacing with space.
                */
                ShadowCss.prototype._convertShadowDOMSelectors = function (cssText) {
                    for (var i = 0; i < _shadowDOMSelectorsRe.length; i++) {
                        cssText = lang_1.StringWrapper.replaceAll(cssText, _shadowDOMSelectorsRe[i], ' ');
                    }
                    return cssText;
                };
                // change a selector like 'div' to 'name div'
                ShadowCss.prototype._scopeSelectors = function (cssText, scopeSelector, hostSelector) {
                    var _this = this;
                    return processRules(cssText, function (rule) {
                        var selector = rule.selector;
                        var content = rule.content;
                        if (rule.selector[0] != '@' || rule.selector.startsWith('@page')) {
                            selector =
                                _this._scopeSelector(rule.selector, scopeSelector, hostSelector, _this.strictStyling);
                        }
                        else if (rule.selector.startsWith('@media')) {
                            content = _this._scopeSelectors(rule.content, scopeSelector, hostSelector);
                        }
                        return new CssRule(selector, content);
                    });
                };
                ShadowCss.prototype._scopeSelector = function (selector, scopeSelector, hostSelector, strict) {
                    var r = [], parts = selector.split(',');
                    for (var i = 0; i < parts.length; i++) {
                        var p = parts[i];
                        p = p.trim();
                        if (this._selectorNeedsScoping(p, scopeSelector)) {
                            p = strict && !lang_1.StringWrapper.contains(p, _polyfillHostNoCombinator) ?
                                this._applyStrictSelectorScope(p, scopeSelector) :
                                this._applySelectorScope(p, scopeSelector, hostSelector);
                        }
                        r.push(p);
                    }
                    return r.join(', ');
                };
                ShadowCss.prototype._selectorNeedsScoping = function (selector, scopeSelector) {
                    var re = this._makeScopeMatcher(scopeSelector);
                    return !lang_1.isPresent(lang_1.RegExpWrapper.firstMatch(re, selector));
                };
                ShadowCss.prototype._makeScopeMatcher = function (scopeSelector) {
                    var lre = /\[/g;
                    var rre = /\]/g;
                    scopeSelector = lang_1.StringWrapper.replaceAll(scopeSelector, lre, '\\[');
                    scopeSelector = lang_1.StringWrapper.replaceAll(scopeSelector, rre, '\\]');
                    return lang_1.RegExpWrapper.create('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
                };
                ShadowCss.prototype._applySelectorScope = function (selector, scopeSelector, hostSelector) {
                    // Difference from webcomponentsjs: scopeSelector could not be an array
                    return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
                };
                // scope via name and [is=name]
                ShadowCss.prototype._applySimpleSelectorScope = function (selector, scopeSelector, hostSelector) {
                    if (lang_1.isPresent(lang_1.RegExpWrapper.firstMatch(_polyfillHostRe, selector))) {
                        var replaceBy = this.strictStyling ? "[" + hostSelector + "]" : scopeSelector;
                        selector = lang_1.StringWrapper.replace(selector, _polyfillHostNoCombinator, replaceBy);
                        return lang_1.StringWrapper.replaceAll(selector, _polyfillHostRe, replaceBy + ' ');
                    }
                    else {
                        return scopeSelector + ' ' + selector;
                    }
                };
                // return a selector with [name] suffix on each simple selector
                // e.g. .foo.bar > .zot becomes .foo[name].bar[name] > .zot[name]  /** @internal */
                ShadowCss.prototype._applyStrictSelectorScope = function (selector, scopeSelector) {
                    var isRe = /\[is=([^\]]*)\]/g;
                    scopeSelector = lang_1.StringWrapper.replaceAllMapped(scopeSelector, isRe, function (m) { return m[1]; });
                    var splits = [' ', '>', '+', '~'], scoped = selector, attrName = '[' + scopeSelector + ']';
                    for (var i = 0; i < splits.length; i++) {
                        var sep = splits[i];
                        var parts = scoped.split(sep);
                        scoped = parts.map(function (p) {
                            // remove :host since it should be unnecessary
                            var t = lang_1.StringWrapper.replaceAll(p.trim(), _polyfillHostRe, '');
                            if (t.length > 0 && !collection_1.ListWrapper.contains(splits, t) &&
                                !lang_1.StringWrapper.contains(t, attrName)) {
                                var re = /([^:]*)(:*)(.*)/g;
                                var m = lang_1.RegExpWrapper.firstMatch(re, t);
                                if (lang_1.isPresent(m)) {
                                    p = m[1] + attrName + m[2] + m[3];
                                }
                            }
                            return p;
                        })
                            .join(sep);
                    }
                    return scoped;
                };
                ShadowCss.prototype._insertPolyfillHostInCssText = function (selector) {
                    selector = lang_1.StringWrapper.replaceAll(selector, _colonHostContextRe, _polyfillHostContext);
                    selector = lang_1.StringWrapper.replaceAll(selector, _colonHostRe, _polyfillHost);
                    return selector;
                };
                return ShadowCss;
            }());
            exports_1("ShadowCss", ShadowCss);
            _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?['"](.*?)['"][;\s]*}([^{]*?){/gim;
            _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*['"](.*?)['"])[;\s]*[^}]*}/gim;
            _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*['"](.*?)['"])[;\s]*[^}]*}/gim;
            _polyfillHost = '-shadowcsshost';
            // note: :host-context pre-processed to -shadowcsshostcontext.
            _polyfillHostContext = '-shadowcsscontext';
            _parenSuffix = ')(?:\\((' +
                '(?:\\([^)(]*\\)|[^)(]*)+?' +
                ')\\))?([^,{]*)';
            _cssColonHostRe = lang_1.RegExpWrapper.create('(' + _polyfillHost + _parenSuffix, 'im');
            _cssColonHostContextRe = lang_1.RegExpWrapper.create('(' + _polyfillHostContext + _parenSuffix, 'im');
            _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
            _shadowDOMSelectorsRe = [
                />>>/g,
                /::shadow/g,
                /::content/g,
                // Deprecated selectors
                // TODO(vicb): see https://github.com/angular/clang-format/issues/16
                // clang-format off
                /\/deep\//g,
                /\/shadow-deep\//g,
                /\/shadow\//g,
            ];
            _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
            _polyfillHostRe = lang_1.RegExpWrapper.create(_polyfillHost, 'im');
            _colonHostRe = /:host/gim;
            _colonHostContextRe = /:host-context/gim;
            _commentRe = /\/\*[\s\S]*?\*\//g;
            _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
            _curlyRe = /([{}])/g;
            OPEN_CURLY = '{';
            CLOSE_CURLY = '}';
            BLOCK_PLACEHOLDER = '%BLOCK%';
            CssRule = (function () {
                function CssRule(selector, content) {
                    this.selector = selector;
                    this.content = content;
                }
                return CssRule;
            }());
            exports_1("CssRule", CssRule);
            StringWithEscapedBlocks = (function () {
                function StringWithEscapedBlocks(escapedString, blocks) {
                    this.escapedString = escapedString;
                    this.blocks = blocks;
                }
                return StringWithEscapedBlocks;
            }());
        }
    }
});
//# sourceMappingURL=shadow_css.js.map