angular.module('mediumAmigo').controller('ModalPostController', function($scope, $rootScope, $modalInstance, PostService, mode, post, is_home) {
    $rootScope.mode = mode;
    $scope.post = {
        title: post.title,
        content: post.content,
        summary: post.summary
    }

    $scope.dismiss = function() {
        $modalInstance.dismiss();
    }

    $scope.ok = function() {
        if (mode === 'Criar') {
            PostService.create($scope.post)
                .success(function(data) {
                    $rootScope.goTo('#/post/' + data.data.id);
                })
                .error(function(data) {
                    console.log(data);
                });
        } else {
            $scope.post.id = post.id;
            PostService.update($scope.post)
                .success(function(data) {
                    if (is_home) {
                        $rootScope.goTo('#/post/' + post.id);
                    }
                    location.reload();
                })
                .error(function(data) {
                    console.log(data);
                });
        }

        $modalInstance.dismiss();
    }
});