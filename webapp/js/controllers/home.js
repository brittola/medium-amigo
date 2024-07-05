angular.module('mediumAmigo').controller('HomeController', function ($scope, $window, PostService) {
    $scope.posts = [];
    $scope.page = 1;

    PostService.get($scope.page)
        .success(data => {
            console.log(data.data);
            $scope.posts = data.data
        })
        .error(data => console.log(data));

    $scope.setShowOptions = function (post_id, $event) {
        $event.stopPropagation();
        $scope.showOptions = $scope.showOptions === post_id ? null : post_id;
    }

    $scope.onScroll = function () {
        var scrollTop = $window.scrollY;
        var windowHeight = $window.innerHeight;
        var scrollHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= scrollHeight) {

            PostService.get(++$scope.page)
                .success(data => {
                    if (data.data.length === 0) {
                        $scope.page--;
                        return;
                    }
                    $scope.posts = $scope.posts.concat(data.data);
                })
                .error(data => console.log(data));
        }
    };

    angular.element($window).on('scroll', $scope.onScroll);

    $scope.$on('$destroy', function () {
        angular.element($window).off('scroll', $scope.onScroll);
    });
});