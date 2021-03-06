import ol from 'openlayers/dist/ol-debug';
/**
 * @class ol.Graphic
 * @classdesc 地理几何信息
 * @param geometry - {object} 几何对象
 * @extends ol.Object
 */
export default class Graphic extends ol.Object {

    constructor(geometry) {
        super();
        if (geometry instanceof ol.geom.Geometry) {
            this.geometry_ = geometry;
        }
        this.setStyle();
    }
    /**
     * @function  ol.Graphic.prototype.clone
     * @description 复制当前信息
     */
    clone() {
        var clone = new ol.supermap.Graphic();
        clone.setId(this.id_);
        clone.setGeometry(this.geometry_);
        clone.setStyle(this.style_);
        return clone;
    }
    /**
     * @function   ol.Graphic.prototype.getId
     * @description 获取当前ID
     */
    getId() {
        return this.id_;
    }
    /**
     * @function   ol.Graphic.prototype.setId
     * @description 设置当前ID
     */
    setId(id) {
        this.id_ = id;
    }
    /**
     * @function   ol.Graphic.prototype.setId
     * @description 获取当前几何信息
     */
    getGeometry() {
        return this.geometry_;
    }
    /**
     * @function   ol.Graphic.prototype.setId
     * @param geometry -{object} 几何参数
     * @description  设置当前几何信息
     */
    setGeometry(geometry) {
        this.geometry_ = geometry;
    }
    /**
     * @function   ol.Graphic.prototype.getStyle
     * @description  获取样式
     */
    getStyle() {
        return this.style_;
    }
    /**
     * @function   ol.Graphic.prototype.getStyle
     * @param style -{object} 样式参数
     * @description  设置样式
     */
    setStyle(style) {
        this.style_ = style;
        this.styleFunction_ = !style ?
            undefined : ol.Graphic.createStyleFunction(style);
        this.changed();
    }
    /**
     * @function   ol.Graphic.prototype.getStyleFunction
     * @description  获取样式函数
     */
    getStyleFunction() {
        return this.styleFunction_;
    }
    /**
     * @function   ol.Graphic.prototype.createStyleFunction
     * @param obj -{object} 对象参数
     * @description  新建样式函数
     */
    static createStyleFunction(obj) {
        var styleFunction;
        if (typeof obj === 'function') {
            if (obj.length == 2) {
                styleFunction = function (resolution) {
                    return (obj)(this, resolution);
                };
            } else {
                styleFunction = obj;
            }
        } else {
            var styles;
            if (Array.isArray(obj)) {
                styles = obj;
            } else {
                styles = [obj];
            }
            styleFunction = function () {
                return styles;
            };
        }
        return styleFunction;
    }
    /**
     * @function   ol.Graphic.prototype.destroy
     * @description  清除参数值
     */
    destroy() {
        this.id_ = null;
        this.geometry_ = null;
        this.style_ = null;
    }
}
ol.Graphic = Graphic;