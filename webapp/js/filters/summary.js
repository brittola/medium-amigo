angular.module('mediumAmigo').filter('SummaryFilter', function() {
    return function(input, maxLength=5) {
        if (input.length < maxLength) return input;
        return input.substring(0, maxLength) + '...';
    }
});