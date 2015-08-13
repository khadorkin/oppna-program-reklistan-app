'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sharedUtilsDebug = require('./../shared/utils/debug');

var _sharedUtilsHtmlRenderer = require('./../shared/utils/htmlRenderer');

var _sharedModulesUi = require('./../shared/modules/ui');

var _sharedModulesUi2 = _interopRequireDefault(_sharedModulesUi);

var _sharedViewmodelActionBar = require('./../shared/viewmodel/ActionBar');

var _sharedViewmodelActionBar2 = _interopRequireDefault(_sharedViewmodelActionBar);

var _sharedUtilsNavigation = require('./../shared/utils/navigation');

var _sharedUtilsNavigation2 = _interopRequireDefault(_sharedUtilsNavigation);

var _application = require('application');

var _dataObservable = require('data/observable');

var webViewModule = require('ui/web-view');
//const frameModule = require('ui/frame');

var page = undefined;
var actionBar = undefined;
var curPageName = undefined;
var wv = undefined;
var navContext = undefined;
var wvContext = new _dataObservable.Observable({});

function navigatingTo(args) {
	_sharedModulesUi2['default'].setViewDefaults();
	page = args.object;
	navContext = page.navigationContext;
	//curPageName = navContext.data.title;
	//
	//
	//let enabledTabs = '';
	//if (navContext.data.hasType(0) && navContext.data.hasType(1)) {
	//	enabledTabs = 'both';
	//} else if (navContext.data.hasType(0)) {
	//	enabledTabs = 'drugs';
	//} else if (navContext.data.hasType(1)) {
	//	enabledTabs = 'advice';
	//}
	//actionBar = new ActionBar(curPageName, navContext.prevPageTitle, navContext.selectedIndex, enabledTabs);
	//let elActionBar = page.getViewById('actionbar');
	//elActionBar.bindingContext = actionBar;

	wv = page.getViewById('detailsWV');
	wv.bindingContext = wvContext;
	//wv.off(webViewModule.WebView.loadStartedEvent);
	//wv.on(webViewModule.WebView.loadStartedEvent, function(event) {
	//	interjectLink(event);
	//});
	//
	showVW(navContext.data.getContent(navContext.selectedIndex));

	(0, _sharedUtilsDebug.inspect)('Navigating to: ' + navContext.data.id);
}

function interjectLink(event) {

	var linkObj = {
		url: '',
		internal: false,
		external: false
	};

	[{
		protocol: 'rek://',
		type: 'internal',
		prefix: ''
	}, {
		protocol: 'rekhttps://',
		type: 'external',
		prefix: 'https://'
	}, {
		protocol: 'rekhttp://',
		type: 'external',
		prefix: 'http://'
	}].forEach(function (linkType) {
		if (event.url.indexOf(linkType.protocol) === 0) {
			linkObj.url = linkType.prefix + event.url.substr(linkType.protocol.length);
			linkObj[linkType.type] = true;
		}
	});

	if (linkObj.internal || linkObj.external) {
		if (_application.ios) {
			event.object.ios.stopLoading();
		} else if (_application.android) {
			event.object.android.stopLoading();
		}
	}

	if (linkObj.internal) {
		_sharedUtilsNavigation2['default'].navigateToUrl(linkObj.url, curPageName);
	} else if (linkObj.external) {
		_sharedUtilsNavigation2['default'].navigateToExternalUrl(linkObj.url, curPageName);
	}
}

function showVW(htmlContent) {

	var html = 'hi<br>by';

	//const html = `<!DOCTYPE html>
	//	<html lang="en">
	//	<head>
	//		<meta charset="utf-8">
	//		<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, user-scalable=0;" />
	//		<title>REKListan</title>
	//		<style>
	//		${templatesModel.getCss('custom')}
	//		</style>
	//	</head>
	//	<body style="background-color: #ffffff;">
	//		${htmlContent}
	//	</body>
	//	</html>`;

	wvContext.set('html', html);
}

function setTab(index) {
	if (navContext.selectedIndex !== index) {
		actionBar.selectedIndex = index;
		navContext.selectedIndex = index;
		showVW(navContext.data.getContent(index));
	}
}

module.exports.navigatingTo = navigatingTo;
module.exports.drugsTap = function drugsTap() {
	setTab(0);
};
module.exports.adviceTap = function adviceTap() {
	setTab(1);
};
module.exports.backTap = _sharedUtilsNavigation2['default'].back;
module.exports.swipe = function (args) {
	_sharedUtilsNavigation2['default'].swipe(args, curPageName);
};
module.exports.searchTap = function () {
	_sharedUtilsNavigation2['default'].toSearch(curPageName);
};
module.exports.menuTap = function () {
	_sharedUtilsNavigation2['default'].toMenu(curPageName);
};