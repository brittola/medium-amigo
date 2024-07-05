angular.module('mediumAmigo', ["ngRoute", 'ui.bootstrap']).run(function($rootScope, $modal) {

    $rootScope.goTo = function(path) {
        location.href = path;
    };

    $rootScope.loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || null;

    $rootScope.openLoginModal = function() {
        const modalInstance = $modal.open({
            templateUrl: 'view/modal-login.html',
            controller: 'modalLoginController'
        });

        modalInstance.result.then(function() {
            location.reload();
        }).catch(function() {
            console.log('Modal dismissed');
        });
    }

    $rootScope.openSignupModal = function() {
        const modalInstance = $modal.open({
            templateUrl: 'view/modal-signup.html',
            controller: 'modalSignupController'
        });

        modalInstance.result.then(function() {
            $rootScope.openLoginModal();
        }).catch(function() {
            console.log('Modal dismissed');
        });
    }

});