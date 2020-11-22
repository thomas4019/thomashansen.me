(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = global || self, factory(global['json-schema-editor'] = {}, global.Vue));
}(this, function (exports, Vue) { 'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

  //

  var script = {
    name: 'schema-string',
    props: {
      value: Object
    },
    methods: {
      toggleEnum: function toggleEnum() {
        Vue.delete(this.value, 'enum');
      }
    },
    data: function data() {
      return {
        hasEnum: false,
        formats: ['', 'color', 'date', 'datetime', 'datetime-local', 'email', 'month', 'number', 'range', 'tel', 'text', 'textarea', 'time', 'url', 'week'],
      }
    },
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  var __vue_script__ = script;
  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _vm._v("\n  Format:\n  "),
      _c(
        "select",
        {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.value.format,
              expression: "value.format"
            }
          ],
          attrs: { name: "format" },
          on: {
            change: function($event) {
              var $$selectedVal = Array.prototype.filter
                .call($event.target.options, function(o) {
                  return o.selected
                })
                .map(function(o) {
                  var val = "_value" in o ? o._value : o.value;
                  return val
                });
              _vm.$set(
                _vm.value,
                "format",
                $event.target.multiple ? $$selectedVal : $$selectedVal[0]
              );
            }
          }
        },
        _vm._l(_vm.formats, function(option) {
          return _c("option", { key: option, domProps: { value: option } }, [
            _vm._v(_vm._s(option))
          ])
        }),
        0
      ),
      _vm._v("\n  UseEnum: "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.hasEnum,
            expression: "hasEnum"
          }
        ],
        attrs: { name: "hasEnum", type: "checkbox" },
        domProps: {
          checked: Array.isArray(_vm.hasEnum)
            ? _vm._i(_vm.hasEnum, null) > -1
            : _vm.hasEnum
        },
        on: {
          change: [
            function($event) {
              var $$a = _vm.hasEnum,
                $$el = $event.target,
                $$c = $$el.checked ? true : false;
              if (Array.isArray($$a)) {
                var $$v = null,
                  $$i = _vm._i($$a, $$v);
                if ($$el.checked) {
                  $$i < 0 && (_vm.hasEnum = $$a.concat([$$v]));
                } else {
                  $$i > -1 &&
                    (_vm.hasEnum = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                }
              } else {
                _vm.hasEnum = $$c;
              }
            },
            function($event) {
              return _vm.toggleEnum()
            }
          ]
        }
      }),
      _vm._v(" "),
      _vm.hasEnum
        ? _c(
            "span",
            [
              _c("label", { attrs: { htmlFor: "enum" } }, [
                _vm._v("Enum (one value per line):")
              ]),
              _vm._v(" "),
              _c("textarea-array", {
                model: {
                  value: _vm.value.enum,
                  callback: function($$v) {
                    _vm.$set(_vm.value, "enum", $$v);
                  },
                  expression: "value.enum"
                }
              })
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      !_vm.hasEnum
        ? _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.value.pattern,
                expression: "value.pattern"
              }
            ],
            attrs: { placeholder: "pattern", name: "pattern", type: "text" },
            domProps: { value: _vm.value.pattern },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.value, "pattern", $event.target.value);
              }
            }
          })
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = undefined;
    /* scoped */
    var __vue_scope_id__ = "data-v-4e1280de";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //

  var script$1 = {
    name: 'schema-number',
    props: {
      value: Object
    },
  };

  /* script */
  var __vue_script__$1 = script$1;
  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _vm._v("\n  Min: "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model.number",
            value: _vm.value.minimum,
            expression: "value.minimum",
            modifiers: { number: true }
          }
        ],
        staticClass: "short-num",
        attrs: { name: "minimum", type: "number" },
        domProps: { value: _vm.value.minimum },
        on: {
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.$set(_vm.value, "minimum", _vm._n($event.target.value));
          },
          blur: function($event) {
            return _vm.$forceUpdate()
          }
        }
      }),
      _vm._v("\n  Max: "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model.number",
            value: _vm.value.maximum,
            expression: "value.maximum",
            modifiers: { number: true }
          }
        ],
        staticClass: "short-num",
        attrs: { name: "maximum", type: "number" },
        domProps: { value: _vm.value.maximum },
        on: {
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.$set(_vm.value, "maximum", _vm._n($event.target.value));
          },
          blur: function($event) {
            return _vm.$forceUpdate()
          }
        }
      })
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    var __vue_inject_styles__$1 = undefined;
    /* scoped */
    var __vue_scope_id__$1 = "data-v-6953bc62";
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      undefined,
      undefined,
      undefined
    );

  function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  function arrayifySchema(obj) {
      if (typeof obj === 'object' && !Array.isArray(obj)) {
          Object.keys(obj).forEach(function (key) {
              arrayifySchema(obj[key]);
          });
      }
      if (obj.type && obj.type === 'object' && obj.properties) {
          obj.properties = Object.entries(obj.properties).map(function (ref) {
             var key = ref[0];
             var value = ref[1];

             return (Object.assign({}, value, { name: key }));
          });
          if (typeof obj.additionalProperties === 'undefined') {
              obj.additionalProperties = false;
          }
      }
      return obj;
  }

  function cleanKeys(obj, keys) {
      keys.forEach(function (key) {
         if (obj[key] === "") {
             delete obj[key];
         }
     });
  }

  function setupType(Vue, svalue, type) {
      if (type === 'array') {
          Vue.set(svalue, 'items', svalue.items || {});
      } else {
          Vue.delete(svalue, 'items');
      }

      if (type === 'object') {
          Vue.set(svalue, 'properties', svalue.properties || []);
          Vue.set(svalue, 'required', svalue.required || []);
      } else {
          Vue.delete(svalue, 'properties');
          Vue.delete(svalue, 'required');
      }

      Vue.set(svalue, 'type', type);
  }

  function objectifySchema(obj2) {
      var obj = JSON.parse(JSON.stringify(obj2));
      if (obj.type === 'object' && obj.properties) {
          obj.properties = Object.fromEntries(obj.properties
                                                  .filter(function (value) { return value.name; })
                                                  .map(function (value) {
                                                      var name = value.name;
                                                      var rest = objectWithoutProperties( value, ["name"] );
                                                      var withoutName = rest;
                                                      console.log(withoutName);
                                                      return [value.name, withoutName]
                                                  }));
      }
      if (obj.type === 'string') {
          cleanKeys(obj, ['format']);
      }
      if (obj.type === 'number') {
          cleanKeys(obj, ['minimum', 'maximum']);
      }
      if (obj.type === 'array') {
          cleanKeys(obj, ['minItems', 'maxItems']);
      }
      if (typeof obj === 'object' && !Array.isArray(obj)) {
          Object.keys(obj).forEach(function (key) {
              obj[key] = objectifySchema(obj[key]);
          });
      }
      return obj;
  }

  //

  var script$2 = {
    name: 'schema-array',
    props: {
      value: Object
    },
    mounted: function mounted() {
      this.value.items = this.value.items || {};
    },
    methods: {
      selectType: function selectType(type) {
        setupType(Vue, this.value.items, type);
      }
    },
    data: function data() {
      return {
        types: ['string', 'number', 'array', 'object', 'boolean'],
        formats: ['', 'table', 'checkbox', 'select', 'tabs'],
      }
    },
  };

  /* script */
  var __vue_script__$2 = script$2;
  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _vm._v("\n  Items Type:\n  "),
      _c(
        "select",
        {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.value.items.type,
              expression: "value.items.type"
            }
          ],
          attrs: { name: "itemtype" },
          on: {
            input: function($event) {
              return _vm.selectType($event.target.value)
            },
            change: function($event) {
              var $$selectedVal = Array.prototype.filter
                .call($event.target.options, function(o) {
                  return o.selected
                })
                .map(function(o) {
                  var val = "_value" in o ? o._value : o.value;
                  return val
                });
              _vm.$set(
                _vm.value.items,
                "type",
                $event.target.multiple ? $$selectedVal : $$selectedVal[0]
              );
            }
          }
        },
        _vm._l(_vm.types, function(type) {
          return _c("option", { key: type, domProps: { value: type } }, [
            _vm._v(_vm._s(type))
          ])
        }),
        0
      ),
      _vm._v("\n  minItems: "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model.number",
            value: _vm.value.minItems,
            expression: "value.minItems",
            modifiers: { number: true }
          }
        ],
        staticClass: "short-num",
        attrs: { name: "minItems", type: "number" },
        domProps: { value: _vm.value.minItems },
        on: {
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.$set(_vm.value, "minItems", _vm._n($event.target.value));
          },
          blur: function($event) {
            return _vm.$forceUpdate()
          }
        }
      }),
      _vm._v("\n  maxItems: "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model.number",
            value: _vm.value.maxItems,
            expression: "value.maxItems",
            modifiers: { number: true }
          }
        ],
        staticClass: "short-num",
        attrs: { name: "maxItems", type: "number" },
        domProps: { value: _vm.value.maxItems },
        on: {
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.$set(_vm.value, "maxItems", _vm._n($event.target.value));
          },
          blur: function($event) {
            return _vm.$forceUpdate()
          }
        }
      }),
      _vm._v("\n  uniqueItems: "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.value.uniqueItems,
            expression: "value.uniqueItems"
          }
        ],
        attrs: { name: "uniqueItems", type: "checkbox" },
        domProps: {
          checked: Array.isArray(_vm.value.uniqueItems)
            ? _vm._i(_vm.value.uniqueItems, null) > -1
            : _vm.value.uniqueItems
        },
        on: {
          change: function($event) {
            var $$a = _vm.value.uniqueItems,
              $$el = $event.target,
              $$c = $$el.checked ? true : false;
            if (Array.isArray($$a)) {
              var $$v = null,
                $$i = _vm._i($$a, $$v);
              if ($$el.checked) {
                $$i < 0 && _vm.$set(_vm.value, "uniqueItems", $$a.concat([$$v]));
              } else {
                $$i > -1 &&
                  _vm.$set(
                    _vm.value,
                    "uniqueItems",
                    $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                  );
              }
            } else {
              _vm.$set(_vm.value, "uniqueItems", $$c);
            }
          }
        }
      }),
      _vm._v("\n  Format:\n  "),
      _c(
        "select",
        {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.value.format,
              expression: "value.format"
            }
          ],
          attrs: { name: "format" },
          on: {
            change: function($event) {
              var $$selectedVal = Array.prototype.filter
                .call($event.target.options, function(o) {
                  return o.selected
                })
                .map(function(o) {
                  var val = "_value" in o ? o._value : o.value;
                  return val
                });
              _vm.$set(
                _vm.value,
                "format",
                $event.target.multiple ? $$selectedVal : $$selectedVal[0]
              );
            }
          }
        },
        _vm._l(_vm.formats, function(f) {
          return _c("option", { key: f, domProps: { value: f } }, [
            _vm._v(_vm._s(f))
          ])
        }),
        0
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "option-form" },
        [_c("json-schema-editor", { attrs: { value: _vm.value.items } })],
        1
      )
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    var __vue_inject_styles__$2 = undefined;
    /* scoped */
    var __vue_scope_id__$2 = "data-v-06aac422";
    /* module identifier */
    var __vue_module_identifier__$2 = undefined;
    /* functional template */
    var __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$3 = {
    name: 'schema-object',
    props: {
      value: Object
    },
    data: function data() {
      return {
        //properties: Object.entries(this.value.properties).map(([key, value]) => ({ ...value, name: key }))
        types: ['string', 'number', 'array', 'object', 'boolean'],
        formats: ['', 'grid', 'schema'],
      }
    },
    methods: {
      selectType: function selectType(svalue, type) {
        setupType(Vue, svalue, type);
      },
      updateKey: function updateKey(svalue, newKey) {
        var oldKey = svalue.name;
        this.toggleRequired(oldKey, false);
        this.toggleRequired(newKey, true);
        svalue.name = newKey;
      },
      toggleRequired: function toggleRequired(name, checked) {
        if (!this.value.required) {
          Vue.set(this.value, 'required', []);
        }
        if (checked) {
          if (name)
            { this.value.required.push(name); }
        } else {
          var index = this.value.required.indexOf(name);
          if (index !== -1)
            { this.value.required.splice(index, 1); }
        }
      },
      add: function add() {
        // Vue.set(this.properties, '', {})
        this.value.properties.push({});
      },
      deleteItem: function deleteItem(index) {
        this.toggleRequired(this.value.required[index]);
        this.value.properties.splice(index, 1);
        // Vue.delete(this.properties, index)
      }
    }
  };

  /* script */
  var __vue_script__$3 = script$3;
  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "schema-object" },
      [
        _vm._l(_vm.value.properties, function(svalue, index) {
          return _c("div", { key: index, staticClass: "field" }, [
            _c("span", { staticClass: "more-options-btn" }),
            _vm._v(" "),
            _c("input", {
              attrs: { name: "field", type: "string" },
              domProps: { value: svalue.name },
              on: {
                input: function($event) {
                  return _vm.updateKey(svalue, $event.target.value)
                }
              }
            }),
            _vm._v(" "),
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: svalue.type,
                    expression: "svalue.type"
                  }
                ],
                staticClass: "type-select",
                attrs: { name: "type" },
                on: {
                  input: function($event) {
                    return _vm.selectType(svalue, $event.target.value)
                  },
                  change: function($event) {
                    var $$selectedVal = Array.prototype.filter
                      .call($event.target.options, function(o) {
                        return o.selected
                      })
                      .map(function(o) {
                        var val = "_value" in o ? o._value : o.value;
                        return val
                      });
                    _vm.$set(
                      svalue,
                      "type",
                      $event.target.multiple ? $$selectedVal : $$selectedVal[0]
                    );
                  }
                }
              },
              _vm._l(_vm.types, function(type) {
                return _c("option", { key: type, domProps: { value: type } }, [
                  _vm._v(_vm._s(type))
                ])
              }),
              0
            ),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: svalue.description,
                  expression: "svalue.description"
                }
              ],
              staticClass: "description",
              attrs: {
                placeholder: "description",
                name: "description",
                type: "text"
              },
              domProps: { value: svalue.description },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(svalue, "description", $event.target.value);
                }
              }
            }),
            _vm._v(" "),
            _c("span", { staticClass: "required-icon" }, [_vm._v("*")]),
            _vm._v(" "),
            _c("input", {
              attrs: { name: "name", type: "checkbox" },
              domProps: { checked: _vm.value.required.includes(svalue.name) },
              on: {
                input: function($event) {
                  return _vm.toggleRequired(svalue.name, $event.target.checked)
                }
              }
            }),
            _vm._v(" "),
            _c(
              "span",
              {
                staticClass: "delete-prop",
                on: {
                  click: function($event) {
                    return _vm.deleteItem(index)
                  }
                }
              },
              [_vm._v("x")]
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "option-form" },
              [_c("json-schema-editor", { attrs: { value: svalue } })],
              1
            )
          ])
        }),
        _vm._v(" "),
        _c("div", [
          _vm._v("\n    Allow additional properties: "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.value.additionalProperties,
                expression: "value.additionalProperties"
              }
            ],
            attrs: { name: "additionalProperties", type: "checkbox" },
            domProps: {
              checked: Array.isArray(_vm.value.additionalProperties)
                ? _vm._i(_vm.value.additionalProperties, null) > -1
                : _vm.value.additionalProperties
            },
            on: {
              change: function($event) {
                var $$a = _vm.value.additionalProperties,
                  $$el = $event.target,
                  $$c = $$el.checked ? true : false;
                if (Array.isArray($$a)) {
                  var $$v = null,
                    $$i = _vm._i($$a, $$v);
                  if ($$el.checked) {
                    $$i < 0 &&
                      _vm.$set(
                        _vm.value,
                        "additionalProperties",
                        $$a.concat([$$v])
                      );
                  } else {
                    $$i > -1 &&
                      _vm.$set(
                        _vm.value,
                        "additionalProperties",
                        $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                      );
                  }
                } else {
                  _vm.$set(_vm.value, "additionalProperties", $$c);
                }
              }
            }
          }),
          _vm._v("\n    Format:\n    "),
          _c(
            "select",
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.value.format,
                  expression: "value.format"
                }
              ],
              attrs: { name: "format" },
              on: {
                change: function($event) {
                  var $$selectedVal = Array.prototype.filter
                    .call($event.target.options, function(o) {
                      return o.selected
                    })
                    .map(function(o) {
                      var val = "_value" in o ? o._value : o.value;
                      return val
                    });
                  _vm.$set(
                    _vm.value,
                    "format",
                    $event.target.multiple ? $$selectedVal : $$selectedVal[0]
                  );
                }
              }
            },
            _vm._l(_vm.formats, function(f) {
              return _c("option", { key: f, domProps: { value: f } }, [
                _vm._v(_vm._s(f))
              ])
            }),
            0
          )
        ]),
        _vm._v(" "),
        _c(
          "button",
          {
            on: {
              click: function($event) {
                return _vm.add()
              }
            }
          },
          [_vm._v("Add another field")]
        )
      ],
      2
    )
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    var __vue_inject_styles__$3 = undefined;
    /* scoped */
    var __vue_scope_id__$3 = "data-v-1e98e177";
    /* module identifier */
    var __vue_module_identifier__$3 = undefined;
    /* functional template */
    var __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$3 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$4 = {
    name: 'json-schema-editor',
    props: {
      value: Object
    },
    components: {
      SchemaString: __vue_component__,
      SchemaNumber: __vue_component__$1,
      SchemaArray: __vue_component__$2,
      SchemaObject: __vue_component__$3,
    },
  };

  /* script */
  var __vue_script__$4 = script$4;
  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "option-form" },
      [
        _vm.value.type == "object"
          ? _c("SchemaObject", { attrs: { value: _vm.value } })
          : _vm._e(),
        _vm._v(" "),
        _vm.value.type == "string"
          ? _c("SchemaString", { attrs: { value: _vm.value } })
          : _vm._e(),
        _vm._v(" "),
        _vm.value.type == "number"
          ? _c("SchemaNumber", { attrs: { value: _vm.value } })
          : _vm._e(),
        _vm._v(" "),
        _vm.value.type == "array"
          ? _c("SchemaArray", { attrs: { value: _vm.value } })
          : _vm._e()
      ],
      1
    )
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    var __vue_inject_styles__$4 = undefined;
    /* scoped */
    var __vue_scope_id__$4 = "data-v-16bd0ea9";
    /* module identifier */
    var __vue_module_identifier__$4 = undefined;
    /* functional template */
    var __vue_is_functional_template__$4 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$4 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      undefined,
      undefined,
      undefined
    );

  // Import vue component

  // Declare install function executed by Vue.use()
  function install(Vue) {
      if (install.installed) { return; }
      install.installed = true;
      Vue.component('json-schema-editor', __vue_component__$4);

      Vue.component('textarea-array', {
          inheritAttrs: false,
          props: ['label', 'value'],
          computed: {
              inputListeners: function () {
                  var vm = this;
                  // `Object.assign` merges objects together to form a new object
                  return Object.assign({},
                      // We add all the listeners from the parent
                      this.$listeners,
                      // Then we can add custom listeners or override the
                      // behavior of some listeners.
                      {
                          // This ensures that the component works with v-model
                          input: function (event) {
                              vm.$emit('input', event.target.value.split('\n'));
                          }
                      }
                  )
              }
          },
          methods:{
              joined: function joined(arr) {
                  if (arr && Array.isArray(arr))
                      { return arr.join('\n') }
                  else
                      { return arr }
              }
          },
          template: "\n    <label>\n      {{ label }}\n       <textarea\n        v-bind=\"$attrs\"\n        v-bind:value=\"joined(value)\"\n        v-on=\"inputListeners\"\n      />\n    </label>\n  "
      });
  }

  // Create module definition for Vue.use()
  var plugin = {
      install: install,
  };

  // Auto-install when vue is found (eg. in browser via <script> tag)
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
      GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
      GlobalVue = global.Vue;
  }
  if (GlobalVue) {
      GlobalVue.use(plugin);
  }

  window.arrayifyJSONSchema = arrayifySchema;
  window.objectifyJSONSchema = objectifySchema;

  exports.default = __vue_component__$4;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
