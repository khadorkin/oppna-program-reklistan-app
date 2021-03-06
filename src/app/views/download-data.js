'use strict';

import * as frameModule from 'ui/frame';
import * as initApp from './../shared/utils/appInit';
import customUi from './../shared/modules/ui';
import {Observable} from 'data/observable';
import language from './../shared/utils/language';
import * as debug from './../shared/utils/debug';
import Images from './../shared/utils/images';
var contextObj = new Observable({
	error: '',
	errorGoBack: '',
	rekLogo: Images.rekLogo
});

var pageLoaded = function(args) {
	customUi.setViewDefaults();

	debug.debug('User initialized reload of data');

	contextObj.set('error', '');
	contextObj.set('errorGoBack', '');

	var page = args.object;
	page.bindingContext = contextObj;

	contextObj.set('loadingCount', 0);

	let loadingInterval = setInterval(function () {
		let curLoadingCount = contextObj.get('loadingCount') > 5 ? 0 : contextObj.get('loadingCount') + 1;
		contextObj.set('loadingCount', curLoadingCount);
	}, 200);

	return initApp.init('force')
		.then(function () {
			debug.debug('All done. Manual refresh of data successful!');
			clearInterval(loadingInterval);
			contextObj.set('loadingCount', 0);
			frameModule.topmost().goBack();
		})
		.catch(function (e) {
			debug.debug('Could not manually refresh data');
			debug.debug(JSON.stringify(e));

			clearInterval(loadingInterval);
			contextObj.set('loadingCount', 0);

			if (e === 'NO_NETWORK') {
				contextObj.set('error', language.downloadDataNoConnection);
			} else {
				contextObj.set('error', language.downloadDataUnknownError);
			}

			contextObj.set('errorGoBack', language.downloadDataErrorGoBack);
		});

};

exports.pageLoaded = pageLoaded;
exports.errorGoBack = function() {
	frameModule.topmost().goBack();
};
