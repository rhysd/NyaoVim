Polymer({
    is: 'nyaovim-plugins',

    properties: {
        editor: Object,
    },

    attached: function() {
        console.log('plugin-manager: editor: ', this.editor);
        // TODO:
        // Load plugins with this.editor (and GUI config)
    },
});
