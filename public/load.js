/* eslint indent: ["error", "tab"] */
if (
	mw.config.get('wgCanonicalSpecialPageName') === 'Blankpage' &&
	/\/unblock-zh-generator$/.test(mw.config.get('wgPageName'))
) {
	$('#firstHeading').text('unblock-zh-generator');
	$('title').text('unblock-zh-generator');
	$('#mw-content-text').html('<div id="app"></div>');

	mw.loader.using(['ext.gadget.morebits', 'mediawiki.api', 'mediawiki.jqueryMsg', '@wikimedia/codex'], function () {
		var api = new mw.Api();
		api.loadMessagesIfMissing(['antispoof-name-illegal']).then(function () {
			mw.loader.load('https://zh.wikipedia.org/w/index.php?title=User:Xiplus/js/unblock-zh-generator/style.css&action=raw&ctype=text/css', 'text/css');
			mw.loader.load('https://zh.wikipedia.org/w/index.php?title=User:Xiplus/js/unblock-zh-generator/unblock-zh-generator.iife.js&action=raw&ctype=text/javascript');
		});
	});
}
