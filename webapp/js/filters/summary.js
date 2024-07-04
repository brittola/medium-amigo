angular.module('mediumAmigo').filter('SummaryFilter', function(ConfigValue) {
    return function(input) {
        if (input.length < ConfigValue.summaryMaxLength) return input;
        return input.substring(0, ConfigValue.summaryMaxLength) + '...';
    }
});