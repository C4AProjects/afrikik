'use strict';

// Karma configuration
// Generated on Sat Oct 05 2013 22:00:14 GMT+0700 (ICT)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../../',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'public/lib/jquery/jquery.min.js',
            'public/lib/underscore/underscore-min.js',
            'public/lib/underscore.string/dist/underscore.string.min.js',
            'public/lib/angular/angular.js',
            'public/lib/angular-mocks/angular-mocks.js',
            'public/lib/angular-cookies/angular-cookies.js',
            'public/lib/angular-resource/angular-resource.js',
            'public/lib/angular-ui-router/release/angular-ui-router.js',
            'public/lib/angular-bootstrap/dist/ui-bootstrap-tpls-0.9.0.js',
            'public/lib/angular-bootstrap/ui-bootstrap-0.9.0.js',
            'public/lib/angular-ui-utils/modules/route/route.js',
            'public/lib/angularLocalStorage/src/angularLocalStorage.js',
            'public/lib/angular-underscore-module/angular-underscore-module.js',
            'public/lib/moment/moment.js',
            'public/lib/twix/bin/twix.js',
            'public/lib/uri.js/src/URI.min.js',
            'public/js/app.js',
            'public/js/config.js',
            'public/js/directives.js',
            'public/js/filters.js',
            'public/js/models/shop.js',
            'public/js/models/schedule.js',
            'public/js/models/appointment.js',
            'public/js/services/global.js',
            'public/js/services/appointments.js',
            'public/js/services/appointments.js',
            'public/js/services/token-handler.js',
            'public/js/services/auth-service.js',
            'public/js/services/profile-wizard-service.js',
            'public/js/services/clients.js',
            'public/js/services/user-service.js',
            'public/js/services/shop-service.js',
            'public/js/services/error-handler.js',
            'public/js/services/appointment-helper.js',
            'public/js/directives/us-states.js',
            'public/js/directives/customer-select.js',
            'public/js/directives/shop-form.js',
            'public/js/directives/barber-appointment-list-item.js',
            'public/js/directives/customer-list-item.js',
            'public/js/directives/check-list.js',
            'public/js/controllers/appointments.js',
            'public/js/controllers/account.js',
            'public/js/controllers/index.js',
            'public/js/controllers/header.js',
            'public/js/controllers/authentication.js',
            'public/js/controllers/clients.js',
            'public/js/controllers/profile-wizard.js',
            'public/js/controllers/profile.js',
            'public/js/controllers/main.js',
            'public/js/init.js',
            'test/karma/unit/**/*.js'
        ],


        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        //reporters: ['progress'],
        reporters: ['progress', 'coverage'],

        // coverage
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'public/js/controllers/*.js': ['coverage'],
            'public/js/services/*.js': ['coverage'],
            'public/js/directives/*.js': ['coverage'],
            'public/js/models/*.js': ['coverage']
        },

        coverageReporter: {
            type: 'html',
            dir: 'test/coverage/'
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


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};