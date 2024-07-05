angular.module('mediumAmigo').controller('ModalDeleteController', function($scope, $modalInstance, PostService, post_id) {

    $scope.ok = function() {
        PostService.delete(post_id)
        .success(function(data) {
            console.log(data);
        })
        .error(function(error) {
            console.log(error);
        });

        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
});