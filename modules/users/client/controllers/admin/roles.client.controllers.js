'use strict';

angular.module('users').controller('RolesController', [
  'Authentication',

  '$http',
  '$location',
  '$uibModalInstance',
  '$rootScope',
  '$scope',

  '_',
  'user',

  function(
    Authentication,

    $http,
    $location,
    $uibModalInstance,
    $rootScope,
    $scope,

    _,
    user
  ) {
    $scope.user = user;

    /**
     * Dismiss
     */
    $scope.dismiss = function() {
      $uibModalInstance.dismiss(true);
    };

    /**
     * Get roles
     * @return {[type]} [description]
     */
    $scope.getRoles = function() {
      $http({
        url: 'api/users/roles',
        method: 'GET'
      })
        .then(function(response) {
          $scope.roles = response.data;
        });
    };

    /**
     * Is checked
     * @param roleId
     * @returns {boolean}
     */
    $scope.isChecked = function(roleId) {
      let rolesArray = [];
      _.each(user.roles, function(Role) {
        rolesArray.push(Role.role_id);
      });

      if (rolesArray.indexOf(roleId) !== -1) {
        return true;
      }
    };

    /**
     * Update
     * @param roleId
     */
    $scope.update = function(roleId) {
      let rolesArray = [];
      _.each(user.roles, function(Role) {
        rolesArray.push(Role.role_id);
      });

      if (rolesArray.indexOf(roleId) === -1) {
        rolesArray.push(roleId);

      } else {
        let index = rolesArray.indexOf(roleId);
        rolesArray.splice(index, 1);
      }

      let params = {
        roles: rolesArray
      };

      $http({
        url: 'api/users/admin/' + user.user_id,
        method: 'PUT',
        params: params
      })
        .then(function(response) {
          $rootScope.$emit('rolesUpdate');
          user = response.data;
        });
    };
    
    /**
     * Init
     * @return {[type]} [description]
     */
    $scope.init = function() {
      $scope.getRoles();
    };
  }
]);
