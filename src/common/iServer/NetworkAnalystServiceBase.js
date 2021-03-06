﻿import SuperMap from '../SuperMap';
import {DataFormat} from '../REST';
import CommonServiceBase  from './CommonServiceBase';

/**
 * @class SuperMap.NetworkAnalystServiceBase
 * @description 网络分析服务基类。
 * @extends SuperMap.CommonServiceBase
 * @param url - {string} 网络分析服务地址
 * @param options - {object} 网络分析可选参数。如：<br>
 *        format - {string} 查询结果返回格式
 *
 */
export default  class NetworkAnalystServiceBase extends CommonServiceBase {

    /**
     * @member SuperMap.NetworkAnalystServiceBase.prototype.format -{string}
     * @description 查询结果返回格式，目前支持iServerJSON 和GeoJSON两种格式
     *              参数格式为"ISERVER","GEOJSON",GEOJSON
     */
    format = DataFormat.GEOJSON;

    constructor(url, options) {
        super(url, options);
        if (options && options.format) {
            this.format = options.format.toUpperCase();
        }
    }

    /**
     * @function SuperMap.NetworkAnalystServiceBase.prototype.destroy
     * @description 释放资源，将引用的资源属性置空。
     */
    destroy() {
        super.destroy();
        this.format = null;
    }

    /**
     * @function SuperMap.NetworkAnalystServiceBase.prototype.serviceProcessCompleted
     * @description 分析完成，执行此方法。
     * @param result - {Object} 服务器返回的结果对象。
     */
    serviceProcessCompleted(result) {
        var me = this, analystResult;
        result = SuperMap.Util.transformResult(result);
        if (result && me.format === DataFormat.GEOJSON && typeof me.toGeoJSONResult === 'function') {
            analystResult = me.toGeoJSONResult(result);
        }
        if (!analystResult) {
            analystResult = result;
        }
        me.events.triggerEvent("processCompleted", {result: analystResult});
    }

    /**
     * @function SuperMap.NetworkAnalystServiceBase.prototype.toGeoJSONResult
     * @description 将含有geometry的数据转换为geojson格式。只处理结果中的路由，由子类实现
     * @param result - {Object} 服务器返回的结果对象。
     */
    toGeoJSONResult(result) {
        return null;
    }

    CLASS_NAME = "SuperMap.NetworkAnalystServiceBase"
}
SuperMap.NetworkAnalystServiceBase = NetworkAnalystServiceBase;