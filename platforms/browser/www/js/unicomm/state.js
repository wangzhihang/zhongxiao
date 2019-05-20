function unicommState(_this) {
	
	_this
	.state('number-list', {
		"url":'/number-list',
		"templateUrl":'templates/unicomm/number/list.html',
		"controller":"number-list"
	})
	.state('number-filter', {
		"url":'/number-filter',
		"templateUrl":'templates/unicomm/number/filter.html',
		"controller":"number-filter"
	})
	// CBSS 无线固话
	.state('unicomm-cbss-fixed-information', {
		"url":'/unicomm-cbss-fixed-information',
		"templateUrl":'templates/unicomm/cbss/fixed/information.html',
		"controller":"unicomm-cbss-fixed-information"
	})
	.state('unicomm-cbss-fixed-getFixNumber', {
		"url":'/unicomm-cbss-fixed-getFixNumber',
		"templateUrl":'templates/unicomm/cbss/fixed/number.html',
		"controller":"unicomm-cbss-fixed-getFixNumber"
	})
	.state('unicomm-cbss-fixed-submit', {
		"url":'/unicomm-cbss-fixed-submit',
		"templateUrl":'templates/unicomm/cbss/fixed/submit.html',
		"controller":"unicomm-cbss-fixed-submit"
	})

};