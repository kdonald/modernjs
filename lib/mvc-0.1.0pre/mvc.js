define(["jquery", "handlebars"], function($, handlebars) {

  var mapPrototype = (function() {

    function get(key) {
      if (!this.data.hasOwnProperty(key)) {
        this.data[key] = this.newValue();
      }
      return this.data[key];
    }
    
    return {
      get: get
    };
    
  })();
  
  var MVC = (function() {

    var mvcPrototype = (function() {

      var model = (function() {   
        
        var modelPrototype = (function() {
          
          function change(property, listener) {
            if (this.changeListeners[property] === undefined) {
              this.changeListeners[property] = [];
            }
            this.changeListeners[property].push(listener);
          }
          
          return Object.create(Object.prototype, {
            change: { value: change }
          });
          
        })();      
        
        function addProperties(model, obj) {
          for (name in obj) {
            var value = obj[name];
            if (typeof value === "function") {
              addPropertyForGetterFunction(model, obj, name, value);
            } else {
              addProperty(model, obj, name);
            }
          }
        }

        function addPropertyForGetterFunction(model, obj, name, getter) {
          Object.defineProperty(model, name, {
            enumerable: true,
            get: function() {
              return getter.call(obj);
            }
          });
          if (obj.change) {
            obj.change(name, function(value) {
              if (this.changeListeners[name]) {
                this.changeListeners[name].forEach(function(listener) {
                  listener(value);
                });
              }
            }.bind(model));
          }
        }
        
        function addProperty(model, obj, name) {
          Object.defineProperty(model, name, {
            enumerable: true,
            get: function() {
              return obj[name];
            },
            set: function(value) {
              obj[name] = value;
              if (this.changeListeners[name]) {
                this.changeListeners[name].forEach(function(listener) {
                  listener(value);
                });
              }
            }
          });                
        }
        
        function create(obj) {
          var model = Object.create(modelPrototype, {
            changeListeners: { value: {} }
          });
          addProperties(model, obj);
          return model;
        }
        
        return create;
        
      })();
      
      var view = (function() {
        function template(require, file, options) {
          options = options || {};
          var compiled = undefined;
          var renderOptions = {};
          function render(context, callback) {
            function initRenderOptions() {
              var helpers = Object.create(handlebars.helpers);
              for (helper in options.helpers) {
                helpers[helper] = options.helpers[helper];
              }
              renderOptions.helpers = helpers;
              renderOptions.partials = options.partials;
            }
            if (compiled === undefined) {
              require(["text!./" + file + ".hb"].concat(options.dependencies), function(content) {
                compiled = handlebars.compile(content);
                initRenderOptions();
                callback(compiled(context, renderOptions));
              });
            } else {
              callback(compiled(context, renderOptions));
            }
          };
          render.toString = function() {
            return "{ file: " + file + ", options: " + options + "}"; 
          };
          return render;
        }
        
        var viewPrototype = (function() {
          
          function bind(event, listener) {
            this.listeners.get(event).push(listener);
          }
          
          function trigger(event, args) {
            var listeners = this.listeners.get(event);
            listeners.forEach(function(listener) {
              listener(args);
            });
          }
          
          function render(callback) {
            if (this.root === undefined) {
              this.template(this.model, function(content) {
                this.root = $(content);
                if (this.events) {
                  attachEventHandlers(this);
                }
                attachDataBindings(this);
                if (this.init) {
                  this.init();
                }
                callback(this.root);         
              }.bind(this));
            } else {
              callback(this.root);
            }
          }
          
          function renderDeferred(anchor) {
            var self = this;
            var thisRendered = $.Deferred();
            this.render(function(root) {
              thisRendered.resolveWith(self, [root]);
            });
            function createPromise(deferred) {
              function append(child) {
                var childRendered = $.Deferred();
                $.when(deferred).then(function(root) {
                  child.render(function(element) {
                    if (anchor) {
                      root.find(anchor).append(element);
                    } else {
                      root.append(element);
                    }
                    childRendered.resolveWith(self, [root]);
                  });
                });
                return createPromise(childRendered);            
              }
              function insertAfter(element) {
                return $.when(thisRendered).then(function(root) {
                  root.insertAfter(element);
                });
              }
              return Object.create(deferred.promise(), { 
                append: { value: append },
                insertAfter: { value: insertAfter }
              });
            };
            return createPromise(thisRendered);
          }    
          
          function find(element) {
            return this.root.find(element);
          }
          
          function reset() {
            // TODO
          }
          
          function detach(result) {
            this.root.detach();
            this.postDetachListeners.forEach(function(listener) {
              listener(result);
            });
          }
          
          function destroy(result) {
            this.root.remove();
            this.postDestroyListeners.forEach(function(listener) {
              listener(result);
            });
          }
          
          function postDetach(listener) {
            this.postDetachListeners.push(listener);
            return this;
          }
          
          function postDestroy(listener) {
            this.postDestroyListeners.push(listener);
            return this;
          }
          
          function toString() {
            return "{ template: " + this.template + "], model: " + this.model + "}";
          }
          
          // internal
          
          function attachEventHandlers(view) {
            for (eventDesc in view.events) {
              var array = eventDesc.split(" ");
              var event = array[0];
              var source = array[1];
              var handler = view.events[eventDesc].bind(view);
              if (source) {
                view.root.find(source).bind(event, handler);
              } else {
                view.root.bind(event, handler);
              }
            }        
          }
          
          function attachDataBindings(view) {
            function postProcess(value) {
              return typeof value === "function" ? value.bind(view.model) : value;
            }
            function bindInput(element, view, propertyName, propertyValue) {
              element.val(propertyValue);
              view.model.change(propertyName, function(newValue) {
                element.val(newValue);    
              });
              element.change(function() {
                view.model[propertyName] = element.val();
              });              
            }
            function bindSelect(element, view, propertyName, propertyValue) {
              var optionsSource = element.attr("data-options");
              if (optionsSource) {
                var optionsLoader = view.referenceData[optionsSource], deferred = $.Deferred();
                deferred.done(function(options) {
                  options.forEach(function(option) {
                    var optionElement = $("<option></option>").attr("value", option.value).append(option.label);
                    if (option.value === propertyValue) {
                      optionElement.attr("selected", "selected");
                    }
                    optionElement.appendTo(element);
                  });
                });
                optionsLoader(deferred);
              }              
            }
            var bindElements = view.root.find("[data-bind]");
            bindElements.each(function(element) {
              var element = $(this);
              var propertyName = element.attr("data-bind");
              var propertyValue = postProcess(view.model[propertyName]);
              if (element.is("input")) {
                bindInput(element, view, propertyName, propertyValue);
              } else if (element.is("select")) {
                bindSelect(element, view, propertyName, propertyValue);
              } else {
                element.html(propertyValue);
                view.model.change(propertyName, function(newValue) {
                  element.html(newValue);
                });
              }
            });
          }
          
          return {
            bind: bind,
            trigger: trigger,
            render: render,
            renderDeferred: renderDeferred,            
            $: find,
            reset: reset,
            detach: detach,
            postDetach: postDetach,
            destroy: destroy,
            postDestroy: postDestroy,
            toString: toString
          };
          
        })();

        function create(args) {
          var listeners = Object.create(mapPrototype, { 
            data: { value: {} },
            newValue: { value: function() { return []; } }
          });
          return Object.create(viewPrototype, {
            model: { value: model(args.model) },
            referenceData: { value: args.referenceData },            
            template: { value: template(this.require, args.template) },
            events: { value: args.events },
            init: { value: args.init },
            listeners: { value: listeners },
            postDetachListeners: { value: [] },      
            postDestroyListeners: { value: [] }
          });
        }

        return create;
        
      })();
            
      function extend(view, obj) {
        return Object.create(view, { model: { value: model(obj) } });
      }
      
      function submodule(name, callback) {
        this.require(["./" + name + "/" + name], callback);
      }
      
      return {
        view: view,
        extend: extend,
        submodule: submodule
      };
      
    })();
    
    function create(require) {
      return Object.create(mvcPrototype, {
        require: { value: require },
      });
    }
    
    return {
      create: create
    };
    
  })();

  return MVC;
  
});