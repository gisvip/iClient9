import ol from 'openlayers/dist/ol-debug';
import SuperMap from '../../common/SuperMap';
import GeoFeature from './theme/geoFeature';
import Vector from '../../common/iServer/ThemeVector';
/**
 * @class ol.source.Range
 * @classdesc 获取范围信息
 * @param name - {string} 名称
 * @param opt_options -{Object} 交互时所需可选参数。
 */
export default class Range extends GeoFeature {

    constructor(name, opt_options) {
        super(name, opt_options);
        this.map = opt_options.map;
        this.features = opt_options.features;
        this.style = opt_options.style;
        this.isHoverAble = opt_options.isHoverAble;
        this.highlightStyle = opt_options.highlightStyle;
        this.themeField = opt_options.themeField;
        this.styleGroups = opt_options.styleGroups;

        //添加features
        var features = this.features;
        if (!(SuperMap.Util.isArray(features))) {
            features = [features];
        }
        var event = {features: features};
        var ret = this.dispatchEvent({type: 'beforefeaturesadded', value: event});
        if (ret === false) {
            return;
        }
        features = event.features;
        var featuresFailAdded = [];
        var toFeatures = [];
        for (var i = 0, len = features.length; i < len; i++) {
            toFeatures.push(new SuperMap.REST.ServerFeature.fromJson(features[i]).toFeature());
        }
        this.features = toFeatures;
        var succeed = featuresFailAdded.length == 0 ? true : false;
        this.dispatchEvent({type: 'featuresadded', value: {features: featuresFailAdded, succeed: succeed}});
        if (!this.isCustomSetMaxCacheCount) {
            this.maxCacheCount = this.features.length * 5;
        }
    }

    /**
     * @function ol.source.Range.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
        this.style = null;
        this.themeField = null;
        this.styleGroups = null;
        GeoFeature.prototype.destroy.apply(this, arguments);
    }

    /**
     * @function ol.source.Range.prototype.createThematicFeature
     * @param feature -{object} 要创建的专题图形要素
     * @description 创建专题图特征
     */
    createThematicFeature(feature) {
        //赋 style
        var style = this.getStyleByData(feature);
        //创建专题要素时的可选参数
        var options = {};
        options.nodesClipPixel = this.nodesClipPixel;
        options.isHoverAble = this.isHoverAble;
        options.isMultiHover = this.isMultiHover;
        options.isClickAble = this.isClickAble;
        options.highlightStyle = SuperMap.Feature.ShapeFactory.transformStyle(this.highlightStyle);

        //将数据转为专题要素（Vector）
        var thematicFeature = new Vector(feature, this, SuperMap.Feature.ShapeFactory.transformStyle(style), options);

        //直接添加图形到渲染器
        for (var m = 0; m < thematicFeature.shapes.length; m++) {
            this.renderer.addShape(thematicFeature.shapes[m]);
        }

        return thematicFeature;
    }

    /**
     * @function ol.source.Range.prototype.getStyleByData
     * @param fea -{object} 要创建的专题图形要素
     * @description 获取style
     */
    getStyleByData(fea) {
        var style = {};
        var feature = fea;
        style = SuperMap.Util.copyAttributesWithClip(style, this.style);
        if (this.themeField && this.styleGroups && this.styleGroups.length > 0 && feature.attributes) {
            var Sf = this.themeField;
            var Attrs = feature.attributes;
            var Gro = this.styleGroups;
            var isSfInAttrs = false; //指定的 themeField 是否是 feature 的属性字段之一
            var attr = null; //属性值

            for (var property in Attrs) {
                if (Sf === property) {
                    isSfInAttrs = true;
                    attr = Attrs[property];
                    break;
                }
            }
            //判断属性值是否属于styleGroups的某一个范围，以便对获取分组 style
            if (isSfInAttrs) {
                for (var i = 0, len = Gro.length; i < len; i++) {
                    if ((attr >= Gro[i].start) && (attr < Gro[i].end)) {
                        //feature.style = SuperMap.Util.copyAttributes(feature.style, this.defaultStyle);
                        var sty1 = Gro[i].style;
                        style = SuperMap.Util.copyAttributesWithClip(style, sty1);
                    }
                }
            }
        }
        if (feature.style && this.isAllowFeatureStyle === true) {
            style = SuperMap.Util.copyAttributesWithClip(feature.style);
        }
        return style;
    }

    canvasFunctionInternal_(extent, resolution, pixelRatio, size, projection) {
        return GeoFeature.prototype.canvasFunctionInternal_.apply(this, arguments);
    }
}

ol.source.Range = Range;