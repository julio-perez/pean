'use strict';

angular.module('core').directive('customConfirmation', ['$uibModal',
  function($uibModal) {

    let ModalInstanceCtrl = function($scope, $uibModalInstance) {
      $scope.ok = function() {
        $uibModalInstance.close();
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    };

    return {
      restrict: 'A',
      scope: {
        customConfirmation: '&'
      },
      link: function(scope, element, attrs) {
        element.bind('click', function() {
          let message = attrs.customMessage || 'Are you sure?';

          //let modalHtml;
          let modalHtml = '<div class="modal-header"><h4 class="modal-title">Confirmation</h4></div>';
          modalHtml += '<div class="modal-body">' + message + '</div>';
          modalHtml += '<div class="modal-footer"><button class="btn btn-success" ng-click="ok()">Yes</button><button class="btn btn-danger" ng-click="cancel()">No</button></div>';

          let modalInstance = $uibModal.open({
            template: modalHtml,
            controller: ModalInstanceCtrl
          });

          modalInstance.result.then(function() {
            scope.customConfirmation();
          }, function() {
            //Modal dismissed
          });

        });
      }
    };
  }
]);
