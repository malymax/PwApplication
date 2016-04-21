angular.module('pwapp')
        .controller('transactionCreateController', ['$location', '$scope', '$rootScope', '$cookies', 'TransactionService', 'UserService', 'DataProvider', function ($location, $scope, $rootScope, $cookies, TransactionService, UserService, DataProvider) {

            $scope.create = create;
            $scope.loadUsers = loadUsers;
            $scope.dataLoading = false;
            $scope.users = [];
            $scope.selected = null;
            
            function create() {
                DataProvider.data = null;
                TransactionService.Create({ OwnerUser: { ID: $scope.user.ID }, CorrespondentUser: { ID: $scope.selected.ID }, Amount: $scope.amount }).then(function (response) {
                    if (response.success) {
                        $location.path('/home');
                    }
                    else {
                        $scope.errorMessage = response.message;
                    }
                })
            }

            function loadUsers() {
                $scope.dataLoading = true;
                UserService.GetAll().then(function (response) {
                    $scope.users = response;
                    $scope.dataLoading = false;
                    return response;
                })
            }

            function loadCurrentUser() {
                UserService.GetByLogin($rootScope.currentUser.login).then(
                    function (response) {
                        $scope.user = response;
                    }
                  )
            }

            loadCurrentUser();
            loadUsers();

            if (DataProvider.data != null) {
                $scope.user = DataProvider.data.OwnerUser;
                $scope.selected = DataProvider.data.CorrespondentUser;
                $scope.amount = DataProvider.data.Amount;
            }
            
        }]);