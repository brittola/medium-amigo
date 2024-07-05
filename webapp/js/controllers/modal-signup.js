angular.module('mediumAmigo').controller('modalSignupController', function($scope, $rootScope, $modalInstance, UserService) {
    $scope.newUser = {
        name: '',
        email: '',
        password: ''
    }

    $scope.errorMessage = '';

    $scope.close = function() {
        $modalInstance.close();
    };

    $scope.dismiss = function() {
        $modalInstance.dismiss();
    }

    $scope.sendSignup = function(e) {
        e.preventDefault();

        Object.keys($scope.newUser).forEach(function(key) {
            $scope.newUser[key] = $scope.newUser[key].trim();

            console.log($scope.newUser[key]);

            if ($scope.newUser[key] === '') {
                $scope.errorMessage = 'Preencha todos os campos.';
            }
        });

        UserService.signup($scope.newUser)
            .success(function(data) {
                console.log(data);
                $scope.close();
            })
            .error(function(data) {
                console.log(data);
                if (data.error) {
                    $scope.errorMessage = 'Credenciais inválidas.';
                }
            });
    };
});