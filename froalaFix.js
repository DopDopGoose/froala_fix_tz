
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

/**
 * @param {number} offset_x
 * @param {number} offset_y
 * @example 
 * var coords = new Coords(100, 200);
 */
class Coords {
    constructor(offset_x, offset_y) {
        this.offset_x = offset_x;
        this.offset_y = offset_y;
    }
}

class Tests {
    /**
     * @param {Size} size
     * @param {Coords} coords
     * @returns {void}
     */
    static createSquare(size, coords) {
        console.log(coords);
        console.log(coords.offset_x, coords.offset_y);
        const square = document.createElement("div");
        square.style.backgroundColor = "blue";
        square.id = "square22";
        square.style.zIndex = 99999999999;

        square.style.width = size.width + "px";
        square.style.height = size.height + "px";

        square.style.position = "absolute";
        square.style.left = coords.offset_x + "px";
        square.style.top = coords.offset_y + "px";

        document.body.appendChild(square);
    }
}

class PositionAndSize {
    static getElementSize(element) {
        const width = element.clientWidth;
        const height = element.clientHeight;
        return new Size(width, height);
    }
    
    static getElementAbsolutePosition(element) {
        const rect = element.getBoundingClientRect();
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const { top, left } = rect;
        return new Coords((left + scrollLeft), (top + scrollTop));
    }

    static getElementAbsoluteCoords($element) {
        const offset = $element.offset();
        const scrollLeft = $(document).scrollLeft();
        const scrollTop = $(document).scrollTop();
        const absoluteLeft = offset.left + scrollLeft;
        const absoluteTop = offset.top + scrollTop;
        return { left: absoluteLeft, top: absoluteTop };
    }

    static getElementCurrentCoords(element) {
        const top = element.offsetTop;
        const left = element.offsetLeft;
        return new Coords(left, top);
    }

    /**
     * @param {Element} element - Element
     * @param {Coords} coords - x offset
     * @returns {void}
     * @example
     * var element = document.querySelector('#elem_id');
     * PositionAndSize.changeElementCoords(element, new Coords(100, 100));
     * console.log(PositionAndSize.getElementAbsoluteCoords(element));
     */
    static changeElementCoords(element, coords) {
        element.style.top = coords.offset_y + "px";
        element.style.left = coords.offset_x + "px";
    }

    constructor(element) {
        this.element = element;
    }

    get size() {
        return PositionAndSize.getElementSize(this.element);
    }

    get coords() {
        return PositionAndSize.getElementCurrentCoords(this.element);
    }
}

class PopupFixListeners {
    static fix_popup_pos_listener() {
        //В фулл скрине с попапом ничего не делаем и он появляется под кнопкой линка
        if (PopupFix.is_full_screen === true) return;
        
        var insert_link_btn = PopupFix.insert_link_btn;
        //попап с инсертом линка и текста, до нажатия на кнопку линка, он не появляется. После нажатия
        //его можно получить по editor.popups.get("link.insert");
        var insert_link_popup = PopupFix.editor.popups.get("link.insert");

        var link_btn_size = PositionAndSize.getElementSize(insert_link_btn[0]);
        var popup_size = PositionAndSize.getElementSize(insert_link_popup[0]);

        var popup_curr_coords = PositionAndSize.getElementCurrentCoords(insert_link_popup[0]);
        var new_offset_y = (popup_curr_coords.offset_y - (link_btn_size.height + popup_size.height + 10));

        PositionAndSize.changeElementCoords(insert_link_popup[0], new Coords(0, new_offset_y));
    }
}

class PopupFix {
    //Статика для более удобного доступа
    static editor = null;
    static insert_link_btn = null;
    static is_full_screen = false;
    //Статика для более удобного доступа


    static _addListeners(editor) {
        //Обьект эдитора
        PopupFix.editor = editor;
        //Кнопка добавления линка в тулбаре
        PopupFix.insert_link_btn = $(editor.$tb.find('.fr-command[data-cmd="insertLink"]'));

        // Читаем чо там юзер жмет и если жмет на инсерт линк, то делаем дела
        editor.events.on("commands.after", function(cmd) 
        { 
            if (cmd === "insertLink") {
                 PopupFixListeners.fix_popup_pos_listener(); 
            }
            if (cmd === "fullscreen") {
                //В фулл скрине с попапом ничего не делаем и он появляется под кнопкой линка
                PopupFix.is_full_screen = !PopupFix.is_full_screen;
            }
        });
    };


    static activate() {
        FroalaEditor.PLUGINS.insertPopupFix = function(editor) { 
            return {
                _init: PopupFix._addListeners(editor)
            }
        };
    }
}

PopupFix.activate()
