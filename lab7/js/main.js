/*********************************************************************************
 *                                                                               *
 *                                  AngularJS                                    *
 *                                                                               *
 *********************************************************************************/

/**
 * Main AngularJS Web Application
 */
var app = angular.module('webApp', ['ui.bootstrap', 'ngRoute', 'mapsApp']);


/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/",            {templateUrl: "partials/home.html", controller: "PageController"})
    .when("/home",        {templateUrl: "partials/home.html", controller: "PageController"})
    // Pages
    .when("/about",       {templateUrl: "partials/about.html", controller: "PageController"})
    .when("/menu",        {templateUrl: "partials/menu.html", controller: "PageController"})
    // else 404
    .otherwise("/404",    {templateUrl: "partials/404.html", controller: "PageController"});
}]);


/**
 * Controls all other Pages
 */
app.controller('PageController', function ($scope, $modal /* also: $location, $http */) {
	$scope.carInterval = 5000;    /* msec */
	$scope.slides = [1, 2, 3, 4, 5, 6, 7, 8];

	/* function which opens the "Order Now" modal */
	$scope.openOrderModal = function() {
	    console.log("openOrderModal: on enter");
	    var modal = $modal.open({
		    templateUrl: 'order.html.script',
		    controller: 'costController'
		});
	}

	/* Prepare messages */
	$scope.enjoy = [
			"Enjoy the most deluxe sushi on the west coast!",
			"Our cooks source their inspiration from the wild west coast nature!",
			"Immerse yourself into the world of sushi!",
			"Open the flavour of Asia in just one bite!",
			"Your local source of finest asian traditions right at your hand!",
			"Touch with the culture of thousands years of sushi crafting perfection - just over lunch!",
			"Bring colours to your life through our vibrant selection!",
			"Feel our affection for what we make!"
			];


	/* set a cookie */
	var cookieName = "countCookie";
	$scope.cookieValue = $.cookie(cookieName);
	if ($scope.cookieValue == null || isNaN($scope.cookieValue)) {
	    $scope.cookieValue = 0;
	}
	$scope.cookieValue = parseInt($scope.cookieValue);
	$.cookie(cookieName, ++$scope.cookieValue, { expires: 7 }, { path: "/" });
});


/*
 * Google Maps
 */
var mapsApp = angular.module('mapsApp', ['uiGmapgoogle-maps']);


/**
 * Google Maps Controller
 */
mapsApp.controller("mapsController", function($scope, uiGmapGoogleMapApi) {
	// Do stuff with your $scope.
	// Note: Some of the directives require at least something to be defined originally!
	// e.g. $scope.markers = []
	$scope.map = {
	    center: {latitude: 48.49172759999998, longitude: -123.4164109}, 
	    zoom: 12,
	    marker: {
		id: 0,
		coords: {
		    latitude: 48.49172759999998, 
		    longitude: -123.4164109
		}, 
		icon: 'images/blue_marker.png',
		options: {
		    animation: null
		}
	    }
	};
	$scope.windowOptions = {
	    visible: false,
	    boxClass: "custom-info-window"
	}
	$scope.markerClick = function() {
	    $scope.map.marker.options.animation =     // Toggle bouncing
	    $scope.map.marker.options.animation ? null : google.maps.Animation.BOUNCE;
	    $scope.windowOptions.visible = !$scope.windowOptions.visible;
	}
	$scope.windowCloseClick = function() {
	    $scope.windowOptions.visible = false;
	}

	console.log("mapsApp controller reporting for duty");

	// uiGmapGoogleMapApi is a promise.
	// The "then" callback function provides the google.maps object.
	uiGmapGoogleMapApi.then(function(maps) {

	    });
    });


/**
 * Configure Google Maps
 */
mapsApp.config(function(uiGmapGoogleMapApiProvider) {
	       uiGmapGoogleMapApiProvider.configure({
		       //    key: 'your api key',
		       v: '3.17',
		       libraries: 'weather,geometry,visualization'
	       });
    });


/*
 * Order Form Modal Controller
 */
app.controller("costController", function($scope, $modalInstance, $http) {

	console.log("costController: on enter");

	/*
	 * Function switching to a specific page
	 */
	$scope.switchPage = function(page) {
	    console.log("switchPage: asked page ", page);
	    $scope.currentPage = page;
	};

	/*
	 * Function that determines if enough data has been entered
	 * to switch to a specific page
	 */
	$scope.pageDisabled = function(page) {
	    switch (page) {
	    case 2:
	    return !$scope.order.flavour;

	    case 3:
	    return !($scope.order.flavour && $scope.order.type);
	    
	    default:
	    return false;
	    }
	};

	/* clears all data */
	$scope.reset = function(removeAlerts) {

	    /* reset order details */
	    $scope.order = {};
	    $scope.order.serving = "six";
	    $scope.order.quantity = 1;
	    $scope.order.spice = { soy: false, ginger: false, wasabi: false, hot: false, mayo: false };
	    $scope.minTime = new Date;
	    min = $scope.minTime.getMinutes();
	    min = (Math.floor(min / 15) + 1) * 15;
	    $scope.minTime.setMinutes(min);
	    $scope.order.pickupTime = $scope.minTime;

	    /* 'orderform' is not available on the initiall call of reset() below */
	    if ($scope.orderform) {
		$scope.orderform.$setPristine();
	    }

	    /* remove alerts if needed */
	    if (removeAlerts) {
		$scope.showAlerts = false;
	    }

	    /* return to the first page */
	    $scope.currentPage = 1;
	};

	/* calculates the cost */
	$scope.calculateTotal = function() {
	    total = 0.0;

	    /* basic pricing */
	    if (typeof($scope.order.flavour) !== "undefined") {
		total = $scope.priceTable[$scope.order.flavour][$scope.order.serving];
	    }

	    /* spices */
	    if ($scope.order.spice.soy) total += 0.50;
	    if ($scope.order.spice.ginger) total += 0.50;
	    if ($scope.order.spice.wasabi) total += 0.50;
	    if ($scope.order.spice.hot) total += 0.50;
	    if ($scope.order.spice.mayo) total += 0.50;

	    /* quantity */
	    total *= $scope.order.quantity;

	    /* a 15% discount for pick-up */
	    if ($scope.order.type === "pickup") total *= (1.00 - 0.15);

	    return total.toFixed(2);
	};

	/* submit the form */
	$scope.submitForm = function() {
	    console.log("submitForm(): on enter");

	    $http.post("php/submit.php", $scope.order)
	    .success(function(data) {
		    if (data["success"] == 0) {
			$scope.order.error = "Validation error: " + data["error-reason"];
		    } else {
			$scope.receipt = data["receipt"];
			$scope.reset(false);
		    }
		})
	    .error(function(data, status) {
		    console.log(data);
		    $scope.order.error = "Error accessing the server: " + status + ".";
		});

            /* need to show the status of request in either case */
            $scope.showAlerts = true;
	}

	/* cancel */
	$scope.cancel = function() {
	    $modalInstance.dismiss('cancel');
	};


	/*
	 * Perform initializations
	 */

	/* initialize the price table */
	$scope.priceTable = {
	    "california": { "six": 5.0, "eight": 7.0,  "ten": 10.0 },
	    "salmon":     { "six": 7.0, "eight": 10.0, "ten": 12.0 },
	    "calamari":   { "six": 9.0, "eight": 12.0, "ten": 14.0 }
	};

	/* Minute step for Time Picker */
	$scope.mstep = 15;

	/* initialize */
	$scope.reset(true);

	/* pagination */
	$scope.numPages = 3;
    });
