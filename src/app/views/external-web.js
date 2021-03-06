'use strict';

//import {debug} from './../shared/utils/debug';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';

function loaded(args) {
	customUi.setViewDefaults();
	let page = args.object;
	let navContext = page.navigationContext;

	let wv = page.getViewById('externalWV');
	wv.src = navContext.url;

	let actionBar = new ActionBar();
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;
}

module.exports.loaded = loaded;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) { navigation.swipe(args, '', ['back']); };
