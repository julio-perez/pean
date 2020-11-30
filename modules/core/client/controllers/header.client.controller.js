'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', '$transitions', 'Authentication', 'Menus',
  function ($scope, $state, $transitions, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = true;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $transitions.onSuccess({}, function(transition) {
      $scope.isCollapsed = true;
    });

  }
]);
