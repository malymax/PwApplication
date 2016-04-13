angular.module('pwapp')
        .controller('registerController', ['$location', 'UserService', '$scope', function ($location, UserService, $scope) {
        	var controller = this;

        	$scope.register = register;
        	$scope.emailIsUnique = emailIsUnique;
            
        	function register() {
        		$scope.dataLoading = true;
        	    UserService.Create($scope.user)
					.then(function (response) {
						if (response.success) {
							$location.path('/login');
						} else {
							$scope.dataLoading = false;
						}
					});
        	}

        	function emailIsUnique() {
        	    if (!$scope.form.email.$error.email)
        	        UserService.GetByLogin($scope.user.email).then(
                        function (response) {
                            $scope.emailIsNotUnique = response != undefined && response != null;
                        }
                    );
        	}
        }]);