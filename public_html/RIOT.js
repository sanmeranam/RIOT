window.RIOT = function (elementId) {
    this.svgElement = document.getElementById(elementId);

};

/**
 * 
 * @param {type} sName
 * @param {type} attrs
 * @param {type} sRoot
 * @returns {SVGElement}
 */
SVGElement = function (sName, attrs, sRoot) {
    var xmlns = "http://www.w3.org/2000/svg";
    this.element = document.createElementNS(xmlns, sName);
    for (var attrName in attrs) {
        this.element.setAttributeNS(null, attrName, attrs[attrName]);
    }
    sRoot.appendChild(this.element);
};
SVGElement.prototype.attr = function (attrs) {
    var srg = [];
    for (var attrName in attrs) {

        //Special fill
        if (attrName == "fill" && (attrs[attrName] instanceof SVGGradiantLinear || attrs[attrName] instanceof SVGGradiantRadial)) {
            attrs[attrName] = "url(#" + attrs[attrName].id + ")";
        }

        srg.push(attrName + ":" + attrs[attrName]);
    }
    this.element.setAttributeNS(null, "style", srg.join(";"));
    return this;
};

SVGElement.prototype.animate = function (attrs, duration) {
    var xmlns = "http://www.w3.org/2000/svg";
    for (var attrName in attrs) {
        var anim = document.createElementNS(xmlns, "animate");
        anim.setAttributeNS(null, "attributeName", attrName);
        anim.setAttributeNS(null, "to", attrs[attrName]);
        anim.setAttributeNS(null, "dur", duration + "s");
        this.element.appendChild(anim);
    }
    return this;
};

/**
 * 
 * @param {type} x1
 * @param {type} y1
 * @param {type} x2
 * @param {type} y2
 * @param {type} arrColor
 * @param {type} oDefs
 * @returns {SVGGradiantLinear}
 */
SVGGradiantLinear = function (x1, y1, x2, y2, arrColor, oDefs) {
    this.id = "linearGradient" + Math.floor(Math.random() * 10000);

    var xmlns = "http://www.w3.org/2000/svg";
    this.ele = document.createElementNS(xmlns, "linearGradient");
    this.ele.setAttributeNS(null, "id", this.id);

    this.ele.setAttributeNS(null, "x1", x1 + "%");
    this.ele.setAttributeNS(null, "y1", y1 + "%");
    this.ele.setAttributeNS(null, "x2", x2 + "%");
    this.ele.setAttributeNS(null, "y2", y2 + "%");

    var gap = 100 / (arrColor.length - 1);
    for (var i = 0; i < arrColor.length; i++) {
        var stop = document.createElementNS(xmlns, "stop");
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
 * @returns {SVGGradiantRadial}
 */
SVGGradiantRadial = function (cx, cy, r, arrColor, oDefs) {
    this.id = "linearGradient" + Math.floor(Math.random() * 10000);

    var xmlns = "http://www.w3.org/2000/svg";
    this.ele = document.createElementNS(xmlns, "radialGradient");
    this.ele.setAttributeNS(null, "id", this.id);

    this.ele.setAttributeNS(null, "cx", cx + "%");
    this.ele.setAttributeNS(null, "cy", cy + "%");
    this.ele.setAttributeNS(null, "r", r + "%");
    this.ele.setAttributeNS(null, "fx", "50%");
    this.ele.setAttributeNS(null, "fy", "50%");

    var gap = 100 / (arrColor.length - 1);
    for (var i = 0; i < arrColor.length; i++) {
        var stop = document.createElementNS(xmlns, "stop");
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
 * @returns {element}
 */
RIOT.prototype.line = function (x1, y1, x2, y2) {
    return new SVGElement("line", {
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2
    }, this.svgElement);
};

/**
 * 
 * @param {type} r
 * @param {type} cx
 * @param {type} cy
 * @returns {SVGElement}
 */
RIOT.prototype.circle = function (r, cx, cy) {
    return new SVGElement('circle', {
        r: r,
        cx: cx,
        cy: cy
    }, this.svgElement);

};

/**
 * 
 * @param {type} rx
 * @param {type} ry
 * @param {type} cx
 * @param {type} cy
 * @returns {SVGElement}
 */
RIOT.prototype.ellipse = function (rx, ry, cx, cy) {
    return new SVGElement('circle', {
        rx: rx,
        ry: ry,
        cx: cx,
        cy: cy
    }, this.svgElement);
};

/**
 * 
 * @param {type} x1
 * @param {type} y1
 * @param {type} x2
 * @param {type} y2
 * @param {type} arrColor
 * @returns {SVGGradiantLinear}
 */
RIOT.prototype.linearGradient = function (x1, y1, x2, y2, arrColor) {
    var oDefs = this.svgElement.getElementsByTagName("defs");
    if (oDefs.length === 0) {
        var xmlns = "http://www.w3.org/2000/svg";
        oDefs = document.createElementNS(xmlns, "defs");
        this.svgElement.appendChild(oDefs);
    }
    return new SVGGradiantLinear(x1, y1, x2, y2, arrColor, oDefs);
};

/**
 * 
 * @param {type} cx
 * @param {type} cy
 * @param {type} r
 * @param {type} arrColor
 * @returns {SVGGradiantRadial}
 */
RIOT.prototype.radialGradient = function (cx, cy, r, arrColor) {
    var oDefs = this.svgElement.getElementsByTagName("defs");
    if (oDefs.length === 0) {
        var xmlns = "http://www.w3.org/2000/svg";
        oDefs = document.createElementNS(xmlns, "defs");
        this.svgElement.appendChild(oDefs);
    }
    return new SVGGradiantRadial(cx * 100, cy * 100, r * 100, arrColor, oDefs);
};