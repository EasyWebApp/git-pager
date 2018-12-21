//
//  Generated by https://www.npmjs.com/package/amd-bundle
//
(function (factory) {

    if ((typeof define === 'function')  &&  define.amd)
        define('git-pager', ["git-element","web-cell","marked"], factory);
    else if (typeof module === 'object')
        return  module.exports = factory.call(global,require('git-element'),require('web-cell'),require('marked'));
    else
        return  this['git-pager'] = factory.call(self,this['git-element'],this['web-cell'],this['marked']);

})(function (git_element,web_cell,marked) {

function merge(base, path) {
  return (base + '/' + path).replace(/\/\//g, '/').replace(/[^/.]+\/\.\.\//g, '').replace(/\.\//g, function (match, index, input) {
    return input[index - 1] === '.' ? match : '';
  });
}

function outPackage(name) {
  return /^[^./]/.test(name);
}

    var require = (typeof module === 'object') ?
        function () {

            return  module.require.apply(module, arguments);
        } : (
            this.require  ||  function (name) {

                if (self[name] != null)  return self[name];

                throw ReferenceError('Can\'t find "' + name + '" module');
            }
        );

    var _include_ = include.bind(null, './');

    function include(base, path) {

        path = outPackage( path )  ?  path  :  ('./' + merge(base, path));

        var module = _module_[path], exports;

        if (! module)  return require(path);

        if (! module.exports) {

            module.exports = { };

            var dependency = module.dependency;

            for (var i = 0;  dependency[i];  i++)
                module.dependency[i] = _include_( dependency[i] );

            exports = module.factory.apply(
                null,  module.dependency.concat(
                    include.bind(null, module.base),  module.exports,  module
                )
            );

            if (exports != null)  module.exports = exports;

            delete module.dependency;  delete module.factory;
        }

        return module.exports;
    }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function() {
        var self = this,
            args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(
                    gen,
                    resolve,
                    reject,
                    _next,
                    _throw,
                    'next',
                    value
                );
            }
            function _throw(err) {
                asyncGeneratorStep(
                    gen,
                    resolve,
                    reject,
                    _next,
                    _throw,
                    'throw',
                    err
                );
            }
            _next(undefined);
        });
    };
}

var _module_ = {
    './index.json': {
        base: '.',
        dependency: [],
        factory: function factory(require, exports, module) {
            Object.defineProperty(exports, '__esModule', {
                value: true
            });
            exports.default = void 0;
            var _default = {
                template: [
                    {
                        name: 'bootstrap@3'
                    }
                ]
            };
            exports.default = _default;
        }
    },
    './utility': {
        base: '.',
        dependency: [],
        factory: function factory(require, exports, module) {
            Object.defineProperty(exports, '__esModule', {
                value: true
            });
            exports.fileOf = fileOf;
            exports.isGitMarkdown = isGitMarkdown;
            exports.wrapTemplate = wrapTemplate;
            exports.contentOf = contentOf;

            var _gitElement = _interopRequireDefault(require('git-element'));

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj
                      };
            }

            function fileOf(_x) {
                return _fileOf.apply(this, arguments);
            }

            function _fileOf() {
                _fileOf = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee(URI) {
                        return regeneratorRuntime.wrap(
                            function _callee$(_context) {
                                while (1) {
                                    switch ((_context.prev = _context.next)) {
                                        case 0:
                                            _context.t0 = self;
                                            _context.next = 3;
                                            return _gitElement.default.fetch(
                                                URI
                                            );

                                        case 3:
                                            _context.t1 = _context.sent.content;
                                            return _context.abrupt(
                                                'return',
                                                _context.t0.atob.call(
                                                    _context.t0,
                                                    _context.t1
                                                )
                                            );

                                        case 5:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            },
                            _callee,
                            this
                        );
                    })
                );
                return _fileOf.apply(this, arguments);
            }

            function isGitMarkdown(URI) {
                return (
                    /\.(md|markdown)/i.test(URI) ||
                    /^(ReadMe|Contributing|License)\.?/.test(URI)
                );
            }

            function wrapTemplate(_x2, _x3) {
                return _wrapTemplate.apply(this, arguments);
            }

            function _wrapTemplate() {
                _wrapTemplate = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee2(name, content) {
                        var template;
                        return regeneratorRuntime.wrap(
                            function _callee2$(_context2) {
                                while (1) {
                                    switch ((_context2.prev = _context2.next)) {
                                        case 0:
                                            if (!/^(https?:)?\/\//.test(name))
                                                name = 'template/'.concat(
                                                    name,
                                                    '.html'
                                                );
                                            _context2.t0 = new DOMParser();
                                            _context2.next = 4;
                                            return self.fetch(name);

                                        case 4:
                                            _context2.next = 6;
                                            return _context2.sent.text();

                                        case 6:
                                            _context2.t1 = _context2.sent;
                                            template = _context2.t0.parseFromString.call(
                                                _context2.t0,
                                                _context2.t1,
                                                'text/html'
                                            );
                                            template.querySelector(
                                                'article'
                                            ).innerHTML = content;
                                            return _context2.abrupt(
                                                'return',
                                                template
                                            );

                                        case 10:
                                        case 'end':
                                            return _context2.stop();
                                    }
                                }
                            },
                            _callee2,
                            this
                        );
                    })
                );
                return _wrapTemplate.apply(this, arguments);
            }

            function contentOf(HTML) {
                if (!/<(html|head|body)>/.test(HTML)) return HTML;
                HTML = new DOMParser().parseFromString(HTML, 'text/html');
                if ((HTML = HTML.querySelector('article, main, body')))
                    return HTML.innerHTML;
            }
        }
    },
    './index': {
        base: '.',
        dependency: [],
        factory: function factory(require, exports, module) {
            var _webCell = require('web-cell');

            var _gitElement = _interopRequireDefault(require('git-element'));

            var _utility = require('./utility');

            var _marked = _interopRequireDefault(require('marked'));

            var _index = _interopRequireDefault(require('./index.json'));

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj
                      };
            }

            _webCell.documentReady.then(function() {
                var main_view = new _webCell.ObjectView(document.body),
                    git_user = (0, _webCell.$)('git-user')[0],
                    git_path = (0, _webCell.$)('git-path')[0],
                    editor = (0, _webCell.$)(
                        'text-editor [contenteditable]'
                    )[0];
                main_view.render(_index.default);
                if (self.localStorage.token)
                    git_user.token = self.localStorage.token;
                document.addEventListener('signin', function(_ref) {
                    var detail = _ref.detail;
                    git_path.user = detail.login;
                    self.localStorage.token = detail.token;
                    document.forms[0].hidden = false;
                });
                document.addEventListener('signout', function() {
                    git_path.user = '';
                    delete self.localStorage.token;
                    document.forms[0].hidden = true;
                });
                document.addEventListener(
                    'change',
                    (0, _webCell.delegate)(
                        'git-path',
                        /*#__PURE__*/
                        (function() {
                            var _ref3 = _asyncToGenerator(
                                /*#__PURE__*/
                                regeneratorRuntime.mark(function _callee3(
                                    _ref2
                                ) {
                                    var _ref2$target, content, URI;

                                    return regeneratorRuntime.wrap(
                                        function _callee3$(_context3) {
                                            while (1) {
                                                switch (
                                                    (_context3.prev =
                                                        _context3.next)
                                                ) {
                                                    case 0:
                                                        (_ref2$target =
                                                            _ref2.target),
                                                            (content =
                                                                _ref2$target.content),
                                                            (URI =
                                                                _ref2$target.URI);

                                                        if (
                                                            !(
                                                                content.type !==
                                                                'file'
                                                            )
                                                        ) {
                                                            _context3.next = 3;
                                                            break;
                                                        }

                                                        return _context3.abrupt(
                                                            'return'
                                                        );

                                                    case 3:
                                                        _context3.next = 5;
                                                        return (0,
                                                        _utility.fileOf)(URI);

                                                    case 5:
                                                        content =
                                                            _context3.sent;

                                                        if (
                                                            (0,
                                                            _utility.isGitMarkdown)(
                                                                URI
                                                            )
                                                        ) {
                                                            content = (0,
                                                            _marked.default)(
                                                                content
                                                            );
                                                            editor.contentEditable = false;
                                                        } else {
                                                            if (
                                                                /\.html?$/.test(
                                                                    URI
                                                                )
                                                            )
                                                                content = (0,
                                                                _utility.contentOf)(
                                                                    content
                                                                );
                                                            editor.contentEditable = true;
                                                        }

                                                        editor.innerHTML = content;

                                                    case 8:
                                                    case 'end':
                                                        return _context3.stop();
                                                }
                                            }
                                        },
                                        _callee3,
                                        this
                                    );
                                })
                            );

                            return function(_x4) {
                                return _ref3.apply(this, arguments);
                            };
                        })()
                    )
                );
                document.addEventListener(
                    'submit',
                    /*#__PURE__*/
                    (function() {
                        var _ref4 = _asyncToGenerator(
                            /*#__PURE__*/
                            regeneratorRuntime.mark(function _callee4(event) {
                                var URI,
                                    content,
                                    _event$target$element,
                                    template,
                                    message,
                                    data;

                                return regeneratorRuntime.wrap(
                                    function _callee4$(_context4) {
                                        while (1) {
                                            switch (
                                                (_context4.prev =
                                                    _context4.next)
                                            ) {
                                                case 0:
                                                    event.preventDefault();
                                                    (URI = git_path.URI),
                                                        (content =
                                                            git_path.content),
                                                        (_event$target$element =
                                                            event.target
                                                                .elements),
                                                        (template =
                                                            _event$target$element.template),
                                                        (message =
                                                            _event$target$element.message);
                                                    _context4.prev = 2;
                                                    _context4.t0 =
                                                        _gitElement.default;
                                                    _context4.t1 = URI;
                                                    _context4.t2 =
                                                        message.value;
                                                    _context4.t3 = self;
                                                    _context4.t4 = (0,
                                                    _webCell.stringifyDOM);
                                                    _context4.next = 10;
                                                    return (0,
                                                    _utility.wrapTemplate)(
                                                        template.value ||
                                                            template.parentNode
                                                                .value,
                                                        editor.innerHTML
                                                    );

                                                case 10:
                                                    _context4.t5 =
                                                        _context4.sent;
                                                    _context4.t6 = (0,
                                                    _context4.t4)(_context4.t5);
                                                    _context4.t7 = _context4.t3.btoa.call(
                                                        _context4.t3,
                                                        _context4.t6
                                                    );
                                                    _context4.t8 = content.sha;
                                                    _context4.t9 = {
                                                        message: _context4.t2,
                                                        content: _context4.t7,
                                                        sha: _context4.t8
                                                    };
                                                    _context4.next = 17;
                                                    return _context4.t0.fetch.call(
                                                        _context4.t0,
                                                        _context4.t1,
                                                        'PUT',
                                                        _context4.t9
                                                    );

                                                case 17:
                                                    data = _context4.sent;
                                                    content.render(
                                                        data.content
                                                    );
                                                    self.alert(
                                                        'Commit success!'
                                                    );
                                                    _context4.next = 25;
                                                    break;

                                                case 22:
                                                    _context4.prev = 22;
                                                    _context4.t10 = _context4[
                                                        'catch'
                                                    ](2);
                                                    self.alert(
                                                        _context4.t10.message
                                                    );

                                                case 25:
                                                case 'end':
                                                    return _context4.stop();
                                            }
                                        }
                                    },
                                    _callee4,
                                    this,
                                    [[2, 22]]
                                );
                            })
                        );

                        return function(_x5) {
                            return _ref4.apply(this, arguments);
                        };
                    })()
                );
            });
        }
    },
    'git-element': {
        exports: git_element
    },
    'web-cell': {
        exports: web_cell
    },
    marked: {
        exports: marked
    }
};

    return _include_('./index');
});