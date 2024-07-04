angular.module('mediumAmigo').filter('FirstNameFilter', function() {
    return function(name) {
            return name.split(' ')[0];
        }
});