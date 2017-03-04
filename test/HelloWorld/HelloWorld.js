module.exports = function($module) {
  return new $module.ReportModule(
    'HelloWorld',
    $module.Level.Application,
    function(document, callback) {
      document.write('Hello, world!');
      callback(null);
    }
  );
};
