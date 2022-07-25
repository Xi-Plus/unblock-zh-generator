/* eslint indent: ["error", "tab"] */
if (
	mw.config.get('wgCanonicalSpecialPageName') === 'Blankpage' &&
	/\/unblock-zh-generator$/.test(mw.config.get('wgPageName'))
) {
	$('#mw-content-text').html('<div id="app"></div>');

	mw.loader.using(['ext.gadget.morebits', 'mediawiki.api', 'mediawiki.jqueryMsg', '@wikimedia/codex'], function () {
		var api = new mw.Api();
		api.loadMessagesIfMissing(['antispoof-name-illegal']).then(function () {
			mw.loader.load('http://localhost:5173/dist/style.css', 'text/css');
			mw.loader.load('http://localhost:5173/dist/unblock-zh-generator.iife.js');
		});
	});
}

/*

Usage:

mw.loader.load('http://localhost:5173/dist/load-local.js');

*/
