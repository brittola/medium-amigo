angular.module('mediumAmigo', ["ngRoute", 'ui.bootstrap']).run(function($rootScope, $modal) {

    $rootScope.goTo = function(path) {
        location.href = path;
    };

    $rootScope.loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || null;

    $rootScope.logout = function() {
        localStorage.removeItem('loggedUser');
        location.reload();
    };

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

    $rootScope.openDeleteModal = function(post_id, e) {
        try {
            e.stopPropagation();
        } catch (error) {
            e.cancelBubble = true;
        }
        
        const modalInstance = $modal.open({
            templateUrl: 'view/modal-delete.html',
            controller: 'ModalDeleteController',
            resolve: {
                post_id: function() {
                    return post_id;
                }
            }
        });

        modalInstance.result.then(function() {
            $rootScope.goTo('');
        }).catch(function() {
            console.log('Modal dismissed');
        });
    };

});