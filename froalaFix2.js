

class PopupFix {
    static isFullScreen = false;

    static getElementSize(element) {
        const width = element.clientWidth;
        const height = element.clientHeight;
        return {width: width, height: height};
    }

    static fix_popup_pos_listener(editor) {
        if (PopupFix.isFullScreen === true) return;

        let insertLinkButton = $(editor.$tb.find('.fr-command[data-cmd="insertLink"]'))[0];
        let insertLinkPopup = editor.popups.get("link.insert")[0];

        let linkButtonSize = PopupFix.getElementSize(insertLinkButton);
        let popupSize = PopupFix.getElementSize(insertLinkPopup);

        let popupOffsetY = insertLinkPopup.offsetTop;
        let newPopupOfssetY = ( popupOffsetY - (linkButtonSize.height + popupSize.height + 10));
        
        insertLinkPopup.style.top = newPopupOfssetY + "px";
    }

    static _addPopupFixListener(editor) {
        editor.events.on("commands.after", function(cmd) 
        { 
            console.log(cmd);
            switch (cmd) {
                case "insertLink":
                    PopupFix.fix_popup_pos_listener(editor);
                    break;
                case "fullscreen":
                    PopupFix.isFullScreen = !PopupFix.isFullScreen;
                    break
                default:
                    break;
            }
        });
    }

    static init() {
        FroalaEditor.PLUGINS.insertPopupFix = function(editor) { 
            return {
                _init: PopupFix._addPopupFixListener(editor)
            }
        };
    }
}

/**
 * Активируем плагин одной коммандой
 * Все выше выносим в отдельный файл
 */
PopupFix.init()
