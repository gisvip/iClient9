﻿import SuperMap from '../SuperMap';
import GetFeaturesServiceBase from './GetFeaturesServiceBase';
import GetFeaturesByBufferParameters from './GetFeaturesByBufferParameters';

/**
 * @class SuperMap.GetFeaturesByBufferService
 * @classdesc 数据服务中数据集缓冲区查询服务类。
 * @param url - {string} 数据查询结果资源地址。请求数据服务中数据集查询服务，
 * URL 应为：http://{服务器地址}:{服务端口号}/iserver/services/{数据服务名}/rest/data/；</br>
 * 例如："http://localhost:8090/iserver/services/data-jingjin/rest/data/"
 * @param options - {Object} 可选参数。如：<br>
 *        eventListeners - {Object} 需要被注册的监听器对象。
 * @extends SuperMap.GetFeaturesServiceBase
 * @example 例如：
 * (start code)
 * var myGetFeaturesByBufferService = new   SuperMap.GetFeaturesByBufferService(url, {
     *     eventListeners: {
     *           "processCompleted": GetFeaturesCompleted,
     *           "processFailed": GetFeaturesError
     *           }
     * });
 * function GetFeaturesCompleted(object){//todo};
 * function GetFeaturesError(object){//todo};
 * (end)
 *
 */

export default  class GetFeaturesByBufferService extends GetFeaturesServiceBase {

    constructor(url, options) {
        super(url, options);
    }

    /**
     * @inheritDoc
     */
    destroy() {
        super.destroy();
    }

    /**
     * @function SuperMap.GetFeaturesByBufferService.prototype.getJsonParameters
     * @description 将查询参数转化为 JSON 字符串。
     * 在本类中重写此方法，可以实现不同种类的查询（IDs, SQL, Buffer, Geometry等）。
     * @param params {SuperMap.GetFeaturesByBufferParameters}
     * @return {Object} 转化后的 JSON 字符串。
     */
    getJsonParameters(params) {
        return SuperMap.GetFeaturesByBufferParameters.toJsonParameters(params);
    }

    CLASS_NAME = "SuperMap.GetFeaturesByBufferService"
}

SuperMap.GetFeaturesByBufferService = GetFeaturesByBufferService;