	// create the module and name it scotchApp
	var scotchApp = angular.module('scotchApp', ['ngRoute','firebase']);

	// configure our routes
	scotchApp.config(function($routeProvider) {
		
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/test', {
				templateUrl : 'pages/test.html',
				controller  : 'testController'
			})
			.otherwise({redirectTo: '/'});
	});

	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', function($scope) {
		// create a message to display in our view
		initApp();
		
		$scope.message = 'Yeah, you like it.. oooh wunderbarrrr!';
		$scope.addAWord = function(){
			addAWord();
		};
	});

	scotchApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	scotchApp.controller('testController', function($scope) {
			initApp();
		$scope.message = 'Contact us! JK. This is just a demo.';
		$scope.startTest = function(){
			startTest();
		};
		$scope.chcekAnswer = function(){
			chcekAnswer();
		};
	});


