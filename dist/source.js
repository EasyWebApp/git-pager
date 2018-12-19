//
//  Generated by https://www.npmjs.com/package/amd-bundle
//
(function (factory) {

    if ((typeof define === 'function')  &&  define.amd)
        define('git-pager', ["web-cell"], factory);
    else if (typeof module === 'object')
        return  module.exports = factory.call(global,require('web-cell'));
    else
        return  this['git-pager'] = factory.call(self,this['web-cell']);

})(function (web_cell) {

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

var _module_ = {
    './index': {
        base: '.',
        dependency: [],
        factory: function factory(require, exports, module) {
            var _webCell = require('web-cell');

            _webCell.documentReady.then(function() {
                var file_path = (0, _webCell.$)('git-path')[0];
                document.addEventListener('signin', function(_ref) {
                    var detail = _ref.detail;
                    file_path.user = detail.login;
                });
            });

            document.addEventListener(
                'change',
                (0, _webCell.delegate)('git-path', function(_ref2) {
                    var value = _ref2.target.value;
                    return console.info(value);
                })
            );
        }
    },
    'web-cell': {
        exports: web_cell
    }
};

    return _include_('./index');
});