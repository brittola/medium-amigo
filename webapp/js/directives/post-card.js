angular.module('mediumAmigo').directive('postCard', function() {
    return {
        templateUrl: 'view/post-card.html',
        replace: true,
        restrict: 'E'
    }
});