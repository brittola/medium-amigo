angular.module('mediumAmigo').filter('CapitalizeFilter', function() {
    return function(name) {
        let nameParts = name.split(' ');
        nameParts = nameParts.map(n => {
            if (/(da|do|de|dos)/.test(n)) return n; 
            return n.charAt(0).toUpperCase() + n.substring(1).toLowerCase();
        });
        return nameParts.join(' ');
    }
});