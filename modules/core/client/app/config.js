'use strict';

// Init the application configuration module for AngularJS application
let ApplicationConfiguration = (function() {
  // Init module configuration options
  let applicationModuleName = 'pean';
  let applicationModuleVendorDependencies = [
    'ngResource',
    'ngAnimate',
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'angularFileUpload'
  ];

  // Add a new vertical module
  let registerModule = function(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || [
      'angularMoment',
      'angular-capitalize-filter',
      'ngSanitize'
    ]).constant('_', window._);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
