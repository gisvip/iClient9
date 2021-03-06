import L from "leaflet";
import {Symbolizer} from './Symbolizer';
import {PolyBase} from './SymbolizerPolyBase';

/**
 * @class L.supermap.LineSymbolizer
 * @classdesc 线符号类
 * @private
 * @extends L.Polyline{@linkdoc-leaflet/#polyline}
 * @param feature - {L.feature} 线要素
 * @param pxPerExtent - {number}线长
 */
export var LineSymbolizer = L.Polyline.extend({

    /**
     * @member L.supermap.LineSymbolizer.prototype.includes
     * @description 包含符号
     */
    includes: [Symbolizer.prototype, PolyBase],

    initialize: function (feature, pxPerExtent) {
        Symbolizer.prototype.initialize.call(this, feature);
        this._makeFeatureParts(feature, pxPerExtent);
    },

    /**
     * @function L.supermap.LineSymbolizer.prototype.render
     * @description 绘制线符号
     * @param renderer - {object} 渲染器
     * @param style - {string} 符号样式
     */
    render: function (renderer, style) {
        style.fill = false;
        Symbolizer.prototype.render.call(this, renderer, style);
        this._updatePath();
    },

    /**
     * @function L.supermap.LineSymbolizer.prototype.updateStyle
     * @description 更新替换符号样式
     * @param renderer - {object} 渲染器
     * @param style - {string} 符号样式
     */
    updateStyle: function (renderer, style) {
        style.fill = false;
        Symbolizer.prototype.updateStyle.call(this, renderer, style);
    }
});