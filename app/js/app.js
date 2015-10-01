;(function () {

	angular
		.module('mainApp', ['rx'])
		.controller('AppCtrl', AppCtrl);

	AppCtrl.$inject = ['$scope', '$http', 'rx'];

	function AppCtrl($scope, $http, rx) {
		$scope.search = '';
		$scope.results = [];
		$scope.repoSearch = [];

		var search = term => {
			var deferred = $http.get('https://api.github.com/search/repositories?', { params: { q: term } });
			return rx.Observable
					 .fromPromise(deferred)
					 .retry(10)
					 .map( response => response.data.items.slice(0 ,10) );
		};

		var searchWikipedia = query => {
			var promise = $http.get('https://api.github.com/search/issues?q=+repo:'+ query.full_name +'+type:issue+state:closed');
			return Rx.Observable.fromPromise(promise);
		};

		$scope
			.$toObservable('search')
			.throttle(750)
			.filter(text =>	text.newValue.length > 2 )
			.map(data => data.newValue )
			.distinctUntilChanged()
			.select(search)
			.switchLatest()
			.subscribe(
				val => {
					$scope.repoSearch = [];
					$scope.results = val;
					Rx.Observable
						.fromArray($scope.results)
						.flatMap(searchWikipedia)
						.map( val => val.data.total_count )
						.zip($scope.results, (s1, s2) => {return {'repoName': s2.full_name, 'url': s2.html_url, 'closedIsuuesCount': s1}} )
						.subscribe( 
							val => {$scope.repoSearch.push(val)}, 
							err => {console.log(err)}
						);
				},
				e => {console.log('onError: %s', e)}
			);
	};

})();