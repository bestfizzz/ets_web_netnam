/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.removePlugins = 'uploadimage,uploadfile,pastebase64,pasteUploadFile';
	config.removeButtons = 'About'; // remove toolbar button if it appears

	config.versionCheck = false;
	config.pasteUploadFileApi = null;

	// Optional: other settings
	config.height = 400;
	config.width = '100%';
};
