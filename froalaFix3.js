
FroalaEditor.PLUGINS.insertPopupFix = function(editor) { 
    let isFullScreen = false;

    function getElementSize(element) {
        const width = element.clientWidth;
        const height = element.clientHeight;
        return {width: width, height: height};
    }

    function fixPopupPosListener(editor) {
        if (isFullScreen === true) return;

        let insertLinkButton = $(editor.$tb.find('.fr-command[data-cmd="insertLink"]'))[0];
        let insertLinkPopup = editor.popups.get("link.insert")[0];

        let linkButtonSize = getElementSize(insertLinkButton);
        let popupSize = getElementSize(insertLinkPopup);

        let popupOffsetY = insertLinkPopup.offsetTop;
        let newPopupOfssetY = ( popupOffsetY - (linkButtonSize.height + popupSize.height + 10));
        
        insertLinkPopup.style.top = newPopupOfssetY + "px";
    }

    function _init() { 
        editor.events.on("commands.after", function(cmd) 
        { 
            console.log("3", cmd);
            switch (cmd) {
                case "insertLink":
                    fixPopupPosListener(editor);
                    break;
                case "fullscreen":
                    isFullScreen = !isFullScreen;
                    break
                default:
                    break;
            }
        });
    }
    return {_init}
};