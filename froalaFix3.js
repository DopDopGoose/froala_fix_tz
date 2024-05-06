
FroalaEditor.PLUGINS.insertPopupFix = function(editor) { 
    let isFullScreen;

    function fixPopupPosListener(editor) {
        if (isFullScreen === true) return;

        let insertLinkButton = $(editor.$tb.find('.fr-command[data-cmd="insertLink"]'))[0];
        let insertLinkPopup = editor.popups.get("link.insert")[0];
        
        let popupOffsetY = insertLinkPopup.offsetTop;
        let newPopupOfssetY = ( popupOffsetY - (insertLinkButton.clientHeight + insertLinkPopup.clientHeight + 10));
        
        insertLinkPopup.style.top = newPopupOfssetY + "px";
    }

    function _init() { 
        editor.events.on("commands.after", function(cmd) 
        { 
            switch (cmd) {
                case "insertLink":
                    fixPopupPosListener(editor);
                    break;
                case "fullscreen":
                    isFullScreen = !isFullScreen;
                    break
            }
        });
    }
    return {_init}
};