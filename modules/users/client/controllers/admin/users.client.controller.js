'use strict';

angular.module('users').controller('UsersController', [
  'Authentication',
  'Users',

  'moment',
  '_',

  '$http',
  '$rootScope',
  '$scope',
  '$stateParams',
  '$location',
  '$uibModal',

  function(Authentication,
    Users,
    moment,
    _,
    $http,
    $rootScope,
    $scope,
    $stateParams,
    $location,
    $uibModal) {
    $scope.authentication = Authentication;

    // Authentication check
    if (!$scope.authentication.user) {
      $location.path('/authentication/signin');
    } else {
      let roles = $scope.authentication.user.roles;

      if (_.includes(roles, 'admin')) {
        $scope.authenticated = true;
      } else {
        $location.path('/');
      }
    }

    /**
     * Find users
     */
    $scope.find = function() {
      let limit = $scope.pageSize;
      let offset = ($scope.currentPage - 1) * $scope.pageSize;
      let search = $scope.search;

      let params = {
        'limit': limit,
        'offset': offset,
        'search': search
      };

      $http({
        url: 'api/users/admin',
        method: 'GET',
        params: params
      }).then(function(data) {
        $scope.totalItems = data.data.count;
        $scope.users = data.data.rows;
        $scope.numberOfPages = Math.ceil($scope.totalItems / $scope.pageSize);

        if ($scope.numberOfPages !== 0 && $scope.currentPage > $scope.numberOfPages) {
          $scope.currentPage = $scope.numberOfPages;
        }

        let beginning = $scope.pageSize * $scope.currentPage - $scope.pageSize;
        let end = (($scope.pageSize * $scope.currentPage) > $scope.totalItems) ? $scope.totalItems : ($scope.pageSize * $scope.currentPage);

        $scope.pageRange = beginning + ' ~ ' + end;
      });
    };

    /**
     * Remove user
     * @param article
     */
    $scope.remove = function(user) {
      if (user) {
        $http({
          url: 'api/users/admin/' + user.user_id,
          method: 'DELETE'
        }).then(function(data) {
          for (let i in $scope.users) {
            if ($scope.users[i] === user) {
              $scope.users.splice(i, 1);
            }
          }
        }, function(error) {
          alert(error.data.message);
        });

      } else {
        $scope.user.$remove(function() {
          $location.path('users');
        });
      }
    };

    /**
     * Search controls
     */

    $scope.changeSearch = function() {
      $scope.userForm.$setPristine();

      $scope.find();
    };

    /**
     * Pagination Controls
     */

    $scope.pageSizes = [1, 5, 10];
    $scope.currentPage = 1;

    $scope.pageSize = $scope.pageSizes[1];

    $scope.changePage = function() {
      if (!angular.isNumber($scope.currentPage)) {
        $scope.currentPage = 1;
      }

      if ($scope.currentPage === '') {
        $scope.currentPage = 1;
      } else if ($scope.currentPage > $scope.numberOfPages) {
        $scope.currentPage = $scope.numberOfPages;
      }

      $scope.paginationForm.$setPristine();
      $scope.find();
    };

    $scope.changeSize = function() {
      $scope.paginationForm.$setPristine();

      $scope.currentPage = 1;

      $scope.find();
    };

    $scope.clickFastBackward = function() {
      if ($scope.currentPage !== 1) {
        $scope.currentPage = 1;
        $scope.find();
      }
    };

    $scope.clickBackward = function() {
      if ($scope.currentPage !== 1) {
        $scope.currentPage--;
        $scope.find();
      }
    };

    $scope.clickForward = function() {
      if ($scope.currentPage !== $scope.numberOfPages && $scope.numberOfPages !== 0) {
        $scope.currentPage++;
        $scope.find();
      }
    };

    $scope.clickFastForward = function() {
      if ($scope.currentPage !== $scope.numberOfPages && $scope.numberOfPages !== 0) {
        $scope.currentPage = $scope.numberOfPages;
        $scope.find();
      }
    };

    /**
     * Init
     */
    $scope.init = function() {
      if ($scope.authenticated) {
        $scope.find();
      }
    };

    /*
     * Modal
     */

    /**
     * Open roles modal
     * @param index
     * @param size
     */
    $scope.openRolesModal = function(index, size) {
      let user = $scope.users[index];

      let modalInstance = $uibModal.open({
        templateUrl: 'roles-modal.html',
        controller: 'RolesController',
        size: size,
        resolve: {
          user: function() {
            return user;
          }
        }
      });
    };

    $rootScope.$on('rolesUpdate', function(event) {
      $scope.init();
    });
  }
]);
