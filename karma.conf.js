// Karma configuration
// Generated on Wed Oct 04 2016 14:27:36 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'src/main/webapp/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [{
      pattern: 'bower_components/angular/angular.min.js'
    }, {
      pattern: 'bower_components/angular-translate/angular-translate.min.js'
    }, {
      pattern: 'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js'
    }, {
      pattern: 'bower_components/angular-sanitize/angular-sanitize.min.js'
    }, {
      pattern: 'bower_components/angular-cookies/angular-cookies.min.js'
    }, {
      pattern: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'
    }, {
      pattern: 'bower_components/angular-ui-router/release/angular-ui-router.min.js'
    }, {
      pattern: 'bower_components/angular-ui-switch/angular-ui-switch.min.js'
    }, {
      pattern: 'bower_components/ui-select/dist/select.min.js'
    }, {
      pattern: 'bower_components/angular-smart-table/dist/smart-table.min.js'
    }, {
      pattern: 'bower_components/checklist-model/checklist-model.js'
    }, {
      pattern: 'bower_components/angular-mocks/angular-mocks.js'
    }, {
      pattern: 'bower_components/angular-bootstrap-grid-tree/src/tree-grid-directive.js'
    }, {
      pattern: 'bower_components/jquery/dist/jquery.min.js'
    }, {
      pattern: 'bower_components/underscore/underscore-min.js'
    }, {
      pattern: 'bower_components/ladda/js/ladda.js'
    }, {
      pattern: 'bower_components/angular-ladda/dist/angular-ladda.min.js'
    }, {
      pattern: 'bower_components/angular-filter/dist/angular-filter.min.js'
    }, {
      pattern: 'app/app.bootstrapper.js'
    }, {
      pattern: 'app/**/*.js'
    }, {
      pattern: 'test/spec/*.js'
    }, {
      pattern: 'app/**/*.html'
    }, {
      pattern: 'i18n/*.json',
      watched: true,
      served: true,
      included: false
    }],


    // injects static files
    // prevents Karma CLI from throwing not found errors/warnings
    proxies: {
      '/app/': '/base/app/',
      '/i18n/': '/base/i18n/'
    },


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/**/*.js': 'coverage'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // generate coverage report
    coverageReporter: {
      dir: 'test/converage-results/',
      subdir: function(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
      },
      type: 'lcov',
      includeAllSources: true
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome', 'IE', 'Safari', 'Firefox', 'PhantomJS'],
    // {PhantomJS} a headless browser, doesn't open a window on single run
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,


    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
