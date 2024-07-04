angular.module('mediumAmigo').directive('appHeader', function() {
    return {
        templateUrl: 'view/app-header.html',
        replace: true,
        restrict: 'E'
    }
});