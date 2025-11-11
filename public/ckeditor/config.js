CKEDITOR.editorConfig = function (config) {
  // Toolbar
  config.toolbarGroups = [
    { name: 'clipboard', groups: ['clipboard', 'undo'] },
    { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
    { name: 'links' },
    { name: 'insert' },
    { name: 'forms' },
    { name: 'tools' },
    { name: 'document', groups: ['mode', 'document', 'doctools'] },
    { name: 'others' },
    '/',
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
    { name: 'styles' },
    { name: 'colors' }
  ];

  // Remove some buttons
  config.removeButtons = 'Underline,Subscript,Superscript';

  // Common block elements
  config.format_tags = 'p;h1;h2;h3;pre';

  // Simplify dialogs
  config.removeDialogTabs = 'image:advanced;link:advanced';

  // Disable upload-related plugins to prevent pasteUploadFileApi error
  config.removePlugins = 'uploadimage,uploadfile,pastebase64,pasteUploadFile';

  config.versionCheck = false;
  config.pasteUploadFileApi = null;

  // Optional: other settings
  config.height = 400;
  config.width = '100%';
};
