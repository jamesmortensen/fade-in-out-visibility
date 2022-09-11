

class ElementFader {

    constructor(selector, doc) {
        doc = doc || window.document;
        this.selector = selector;
        this.elem = doc.querySelector(selector);
        this.opacity = parseFloat(this.elem.style.opacity);
    }

    fadeIn() {
        const interval = setInterval( ((_this) => {
            return function() {
                _this.opacity += .1;
                _this.elem.style.opacity = _this.opacity;
                if(_this.opacity > 1)
                    clearInterval(interval);
            }
        })(this), 100);
    }

    fadeOut() {
        const interval = setInterval( ((_this) => {
            return function() {
                _this.opacity -= .1;
                _this.elem.style.opacity = _this.opacity;
                if(_this.opacity < 0)
                    clearInterval(interval);
            }
        })(this), 100);
    }

    getOpacity() {
        return this.opacity;
    }
}

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = ElementFader;
