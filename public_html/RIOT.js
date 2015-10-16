/**
 * @class RIOT
 * @param {string} elementId
 * @returns {undefined}
 */
window.RIOT = function (elementId) {
    this.svgElement = document.getElementById(elementId);
    this.getDefs();
};

RIOT._xmlns = "http://www.w3.org/2000/svg";

/**
 * 
 * @param {type} value
 * @returns {undefined}
 */
RIOT.radian = function (value) {

};

/**
 * 
 * @param {type} value
 * @returns {undefined}
 */
RIOT.degree = function (value) {

};

/**
 * 
 * @param {type} sHex
 * @returns {undefined}
 */
RIOT.toRGB = function (sHex) {

};

/**
 * 
 * @param {type} r
 * @param {type} g
 * @param {type} b
 * @returns {String}
 */
RIOT.toHex = function (r, g, b) {
    return "#" + (r).toString(16).toUpperCase()
            + (g).toString(16).toUpperCase()
            + (b).toString(16).toUpperCase();
};

/**
 * 
 * @returns {String}
 */
RIOT.randomHex = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

RIOT.prototype.getDefs = function () {
    var oDefs = this.svgElement.getElementsByTagName("defs");
    if (oDefs.length === 0) {
        oDefs = document.createElementNS(RIOT._xmlns, "defs");
        this.svgElement.appendChild(oDefs);
    } else {
        oDefs = oDefs[0];
    }
    return oDefs;
};
/**
 * @class RIOT.SVGElement
 * @param {type} sName
 * @param {type} attrs
 * @param {type} oRootElement
 * @returns {RIOT.SVGElement}
 */
RIOT.SVGElement = function (sName, attrs, oParentElement, oRootElement) {
    this.type = sName;
    this.id = sName + "_" + Math.floor(Math.random() * 99999999);
    this.element = document.createElementNS(RIOT._xmlns, sName);
    this.parent = oParentElement;
    this.root = oRootElement;
    for (var attrName in attrs) {
        this.element.setAttributeNS(null, attrName, attrs[attrName]);
    }
    this.element.setAttributeNS(null, "id", this.id);
    oRootElement.svgElement.appendChild(this.element);
};

RIOT.SVGElement.prototype._addInnerText = function (text) {
    this.element.innerHTML = text;
    return this;
};
/**
 * 
 * @param {type} attrs
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.SVGElement.prototype.attr = function (attrs) {
    var srg = [];
    var regCap = /[A-Z]/;
    var modAttrName;
    for (var attrName in attrs) {
        modAttrName = attrName;

        //Camel case
        if (regCap.test(attrName)) {
            modAttrName = attrName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }

        //Special fill
        if (attrName == "fill"
                && (attrs[attrName] instanceof RIOT.SVGGradiantLinear
                        || attrs[attrName] instanceof RIOT.SVGGradiantRadial
                        || attrs[attrName] instanceof  RIOT.SVGPattern)) {

            attrs[attrName] = "url(#" + attrs[attrName].id + ")";

        }

        if (attrName.indexOf("marker") > -1 && attrs[attrName] instanceof  RIOT.SVGElement) {
            attrs[attrName] = "url(#" + attrs[attrName].id + ")";
        }

        //Text path for text
        if (attrName === "textpath"
                && this.type === "text") {

            var thePath;
            if (attrs[attrName] instanceof  RIOT.SVGElement
                    && attrs[attrName].type === "path") {
                thePath = attrs[attrName];
            } else {
                thePath = this.root.path(attrs[attrName]);
            }

            this.root.getDefs().appendChild(thePath.element);
            var sText = this.element.innerHTML;
            this.element.innerHTML = "";

            var textPath = document.createElementNS(RIOT._xmlns, "textPath");
            textPath.setAttributeNS(RIOT._xmlns, "xlink:href", "#" + thePath.id);
            textPath.innerHTML = sText;
            this.element.appendChild(textPath);
            continue;
        }


        srg.push(modAttrName + ":" + attrs[attrName]);
    }
    this.element.setAttributeNS(null, "style", srg.join(";"));
    return this;
};
/**
 * 
 * @param {type} attrs
 * @param {type} duration
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.SVGElement.prototype.animate = function (attrs, duration) {
    for (var attrName in attrs) {
        var anim = document.createElementNS(RIOT._xmlns, "animate");
        anim.setAttributeNS(null, "attributeName", attrName);
        anim.setAttributeNS(null, "to", attrs[attrName]);
        anim.setAttributeNS(null, "dur", duration + "s");
        this.element.appendChild(anim);
    }
    return this;
};
/**
 * 
 * @param {type} handler
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.SVGElement.prototype.click = function (handler) {
    this.element.addEventListener("click", handler);
    return this;
};
/**
 * 
 * @param {type} handler
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.SVGElement.prototype.mousemove = function (handler) {
    this.element.addEventListener("mousemove", handler);
    return this;
};
/**
 * 
 * @param {type} handler
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.SVGElement.prototype.mouseout = function (handler) {
    this.element.addEventListener("mouseout", handler);
    return this;
};
/**
 * 
 * @param {type} handler
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.SVGElement.prototype.mouseover = function (handler) {
    this.element.addEventListener("mouseover", handler);
    return this;
};
/**
 * 
 * @param {type} handler
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.SVGElement.prototype.dblclick = function (handler) {
    this.element.addEventListener("dblclick", handler);
    return this;
};
/**
 * 
 * @param {type} x
 * @param {type} y
 * @param {type} width
 * @param {type} height
 * @returns {RIOT.SVGPattern}
 */
RIOT.SVGElement.prototype.pattern = function (x, y, width, height) {
    return new RIOT.SVGPattern(this.element, x, y, width, height, this.root);
};

/**
 * 
 * @param {type} parentEle
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.SVGElement.prototype.appendTo = function (parentEle) {
    if (parentEle instanceof  RIOT.SVGElement) {
        parentEle.element.appendChild(this.element);
        this.parent = parentEle;
    }
    return this;
};

RIOT.SVGElement.prototype.clone = function (parentEle) {
    return this;
};


/**
 * 
 * @returns {undefined}
 */
RIOT.SVGTransform = function () {

};

RIOT.SVGFilter = function () {

};

/**
 * 
 * @param {type} element
 * @param {type} x
 * @param {type} y
 * @param {type} width
 * @param {type} height
 * @param {type} oRootEle
 * @returns {RIOT.SVGPattern}
 */
RIOT.SVGPattern = function (element, x, y, width, height, oRootEle) {
    this.is = "patter" + Math.floor(Math.random() * 10000);
    this.pattern = document.createElementNS(RIOT._xmlns, "pattern");
    this.pattern.setAttributeNS(null, "id", this.id);
    this.pattern.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
    this.pattern.setAttributeNS(null, "x", x);
    this.pattern.setAttributeNS(null, "y", y);
    this.pattern.setAttributeNS(null, "width", width);
    this.pattern.setAttributeNS(null, "height", height);

    oRootEle.getDefs().appendChild(this.pattern);
    this.pattern.appendChild(element);
};
/**
 * 
 * @param {type} x1
 * @param {type} y1
 * @param {type} x2
 * @param {type} y2
 * @param {type} arrColor
 * @param {type} oDefs
 * @returns {RIOT.SVGGradiantLinear}
 */
RIOT.SVGGradiantLinear = function (x1, y1, x2, y2, arrColor, oDefs) {
    this.id = "linearGradient" + Math.floor(Math.random() * 10000);
    this.ele = document.createElementNS(RIOT._xmlns, "linearGradient");
    this.ele.setAttributeNS(null, "id", this.id);

    this.ele.setAttributeNS(null, "x1", x1 + "%");
    this.ele.setAttributeNS(null, "y1", y1 + "%");
    this.ele.setAttributeNS(null, "x2", x2 + "%");
    this.ele.setAttributeNS(null, "y2", y2 + "%");

    var gap = 100 / (arrColor.length - 1);
    for (var i = 0; i < arrColor.length; i++) {
        var stop = document.createElementNS(RIOT._xmlns, "stop");
        var percent = (i * gap);
        if (arrColor[i].indexOf(":") > -1) {
            percent = parseInt(arrColor[i].split(":")[1]);
        }
        stop.setAttributeNS(null, "offset", percent + "%");
        stop.setAttributeNS(null, "style", "stop-opacity:1;stop-color:" + arrColor[i].split(":")[0]);
        this.ele.appendChild(stop);
    }
    oDefs.appendChild(this.ele);
};
/**
 * 
 * @param {type} cx
 * @param {type} cy
 * @param {type} r
 * @param {type} arrColor
 * @param {type} oDefs
 * @returns {RIOT.SVGGradiantRadial}
 */
RIOT.SVGGradiantRadial = function (cx, cy, r, arrColor, oDefs) {
    this.id = "linearGradient" + Math.floor(Math.random() * 10000);
    this.ele = document.createElementNS(RIOT._xmlns, "radialGradient");
    this.ele.setAttributeNS(null, "id", this.id);

    this.ele.setAttributeNS(null, "cx", cx + "%");
    this.ele.setAttributeNS(null, "cy", cy + "%");
    this.ele.setAttributeNS(null, "r", r + "%");
    this.ele.setAttributeNS(null, "fx", "50%");
    this.ele.setAttributeNS(null, "fy", "50%");

    var gap = 100 / (arrColor.length - 1);
    for (var i = 0; i < arrColor.length; i++) {
        var stop = document.createElementNS(RIOT._xmlns, "stop");
        var percent = (i * gap);
        if (arrColor[i].indexOf(":") > -1) {
            percent = parseInt(arrColor[i].split(":")[1]);
        }
        stop.setAttributeNS(null, "offset", percent + "%");
        stop.setAttributeNS(null, "style", "stop-opacity:1;stop-color:" + arrColor[i].split(":")[0]);
        this.ele.appendChild(stop);
    }
    oDefs.appendChild(this.ele);
};



/**
 * 
 * @param {type} x1
 * @param {type} x2
 * @param {type} y1
 * @param {type} y2
 * @returns {parentEle}
 */
RIOT.prototype.line = function (x1, y1, x2, y2) {
    return new RIOT.SVGElement("line", {
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2
    }, this.svgElement, this);
};

/**
 * 
 * @param {type} r
 * @param {type} cx
 * @param {type} cy
 * @returns {RIOT.SVGElement}
 */
RIOT.prototype.circle = function (r, cx, cy) {
    return new RIOT.SVGElement('circle', {
        r: r,
        cx: cx,
        cy: cy
    }, this.svgElement, this);

};
/**
 * 
 * @param {type} x
 * @param {type} y
 * @param {type} width
 * @param {type} height
 * @returns {RIOT.SVGElement}
 */
RIOT.prototype.rect = function (x, y, width, height) {
    return new RIOT.SVGElement('rect', {
        x: x,
        y: y,
        width: width,
        height: height
    }, this.svgElement, this);
};

/**
 * 
 * @param {type} x
 * @param {type} y
 * @param {type} width
 * @param {type} height
 * @returns {RIOT.SVGElement}
 */
RIOT.prototype.image = function (imageSrc, x, y, width, height) {
    return new RIOT.SVGElement('image', {
        "xlink:href": imageSrc,
        x: x,
        y: y,
        width: width,
        height: height
    }, this.svgElement, this);
};
/**
 * 
 * @param {type} text
 * @param {type} x
 * @param {type} y
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.prototype.text = function (text, x, y) {
    return new RIOT.SVGElement('text', {
        x: x,
        y: y
    }, this.svgElement, this)._addInnerText(text);
};
/**
 * 
 * @param {type} text
 * @param {type} x
 * @param {type} y
 * @returns {RIOT.SVGElement.prototype}
 */
RIOT.prototype.path = function (text) {
    return new RIOT.SVGElement('path', {
        d: text
    }, this.svgElement, this);
};

RIOT.prototype.polyline = function (arrPoint) {
    return new RIOT.SVGElement('polyline', {
        points: arrPoint.join(" ")
    }, this.svgElement, this);
};

RIOT.prototype.polygon = function (arrPoint) {
    return new RIOT.SVGElement('polygon', {
        points: arrPoint.join(" ")
    }, this.svgElement, this);
};

/**
 * 
 * @returns {RIOT.SVGElement}
 */
RIOT.prototype.group = function () {
    var aElements = arguments;
    var gp = new RIOT.SVGElement('g', {}, this.svgElement, this);
    for (var i = 0; i < aElements.length; i++) {
        gp.element.appendChild(aElements[i].element);
    }
    return gp;
};

/**
 * 
 * @param {type} refX
 * @param {type} refY
 * @param {type} width
 * @param {type} height
 * @returns {RIOT.SVGElement}
 */
RIOT.prototype.marker = function (refX, refY, width, height) {
    var aElements = arguments;
    var gp = new RIOT.SVGElement('marker', {
        markerWidth: width,
        markerHeight: height,
        refX: refX,
        refY: refY,
        orient: 'auto'
    }, this.svgElement, this);

    for (var i = 4; i < aElements.length; i++) {
        gp.element.appendChild(aElements[i].element);
    }
    this.getDefs().appendChild(gp.element);
    return gp;
};



/**
 * 
 * @param {type} rx
 * @param {type} ry
 * @param {type} cx
 * @param {type} cy
 * @returns {RIOT.SVGElement}
 */
RIOT.prototype.ellipse = function (rx, ry, cx, cy) {
    return new RIOT.SVGElement('circle', {
        rx: rx,
        ry: ry,
        cx: cx,
        cy: cy
    }, this.svgElement, this);
};

/**
 * 
 * @param {type} x1
 * @param {type} y1
 * @param {type} x2
 * @param {type} y2
 * @param {type} arrColor
 * @returns {RIOT.SVGGradiantLinear}
 */
RIOT.prototype.linearGradient = function (x1, y1, x2, y2, arrColor) {
    return new RIOT.SVGGradiantLinear(x1, y1, x2, y2, arrColor, this.getDefs());
};

/**
 * 
 * @param {type} cx
 * @param {type} cy
 * @param {type} r
 * @param {type} arrColor
 * @returns {RIOT.SVGGradiantRadial}
 */
RIOT.prototype.radialGradient = function (cx, cy, r, arrColor) {
    return new RIOT.SVGGradiantRadial(cx * 100, cy * 100, r * 100, arrColor, this.getDefs());
};