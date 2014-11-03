/**
 * AngularJS
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', ['ngRoute', 'formApp']);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    .when("/home", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/menu", {templateUrl: "partials/menu.html", controller: "PageCtrl"})
    .when("/specials", {templateUrl: "partials/specials.html", controller: "PageCtrl"})
    .when("/order", {templateUrl: "partials/order.html", controller: "PageCtrl"})
    .when("/opportunity", {templateUrl: "partials/opportunity.html", controller: "PageCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  console.log("Page Controller reporting for duty.");

});


/*
 * Order Form application
 */
var formApp = angular.module("formApp", []);

formApp.controller("costController", function($scope) {
	/* initialize the variables which the user will set in the form */
	$scope.serving="six";
	$scope.priceTable = {
	    "california": { "six": 5.0, "eight": 7.0, "ten": 10.0 },
	    "salmon": { "six": 7.0, "eight": 10.0, "ten": 12.0 },
	    "calamari": { "six": 9.0, "eight": 12.0, "ten": 14.0 }
	};
	$scope.quantity = 1;
	$scope.calculateTotal = function() {
	    total = 0.0;

	    /* basic pricing */
	    if (typeof($scope.flavour) !== "undefined") {
		total = $scope.priceTable[$scope.flavour][$scope.serving];
	    }

	    /* spices */
	    if (typeof($scope.soy) !== "undefined" && $scope.soy) total += 0.50;
	    if (typeof($scope.ginger) !== "undefined" && $scope.ginger) total += 0.50;
	    if (typeof($scope.wasabi) !== "undefined" && $scope.wasabi) total += 0.50;
	    if (typeof($scope.hot) !== "undefined" && $scope.hot) total += 0.50;
	    if (typeof($scope.mayo) !== "undefined" && $scope.mayo) total += 0.50;

	    /* quantity */
	    total *= $scope.quantity;

	    /* flat fee for delivery */
	    if (typeof($scope.delivery) !== "undefined" && $scope.delivery) total += 4.0;

	    return total;
	}
    });