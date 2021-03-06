import SuperMap from '../SuperMap';
import SpatialAnalystBase from './SpatialAnalystBase';
import DensityKernelAnalystParameters from './DensityKernelAnalystParameters';
/**
 * @class SuperMap.DensityAnalystService
 * @classdesc
 *  密度分析服务类，密度分析可计算每个输出栅格像元周围圆形邻域内输入的点或线对象的密度。
 *  密度分析，在某种意义上来说，相当于在表面上将输入的点线对象的测量值散开来，将每个点或线对象的测量量分布在整个研究区域，并计算输出栅格中每个像元的密度值。目前提供1种密度分析：核密度分析（Kernel）。
 * @param  url - {string} 服务的访问地址。如 http://localhost:8090/iserver/services/spatialanalyst-changchun/restjsr/spatialanalyst 。
 * @param options - {Object} 可选参数。如:</br>
 *        eventListeners - {Object} 需要被注册的监听器对象。
 * @extends SuperMap.SpatialAnalystBase
 * @example  例如：
 * (start code)
 * var myDensityAnalystService = new SuperMap.DensityAnalystService(url);
 * myDensityAnalystService.on({
 *     "processCompleted": processCompleted,
 *     "processFailed": processFailed
 *     }
 * );
 * (end)
 *
 */
export default  class DensityAnalystService extends SpatialAnalystBase {

    /**
     * @member SuperMap.DensityAnalystService.prototype.mode -{string}
     * @description 密度分析类型。
     */
    mode = null;

    constructor(url, options) {
        super(url, options);
        var me = this;
        if (options) {
            SuperMap.Util.extend(me, options);
        }
    }

    /**
     * @function SuperMap.DensityAnalystService.prototype.destroy
     * @description 释放资源,将引用资源的属性置空。
     */
    destroy() {
        super.destroy();
        this.mode = null;
    }

    /**
     * @function SuperMap.DensityAnalystService.prototype.processAsync
     * @description 负责将客户端的查询参数传递到服务端。
     * @param parameter - {DensityKernelAnalystParameters}
     */
    processAsync(parameter) {
        var me = this;

        var end = me.url.substr(me.url.length - 1, 1);
        if (end === '/') {

        } else {
            me.url += "/";
        }

        var parameterObject = new Object();

        if (parameter instanceof SuperMap.DensityKernelAnalystParameters) {
            me.url += 'datasets/' + parameter.dataset + '/densityanalyst/kernel';
            me.mode = "kernel";
        }

        DensityKernelAnalystParameters.toObject(parameter, parameterObject);
        var jsonParameters = SuperMap.Util.toJSON(parameterObject);

        if (me.isInTheSameDomain) {
            me.url += '.json?returnContent=true';
        } else {
            me.url += '.jsonp?returnContent=true';
        }

        me.request({
            method: "POST",
            data: jsonParameters,
            scope: me,
            success: me.serviceProcessCompleted,
            failure: me.serviceProcessFailed
        });
    }

    CLASS_NAME = "SuperMap.DensityAnalystService"
}
SuperMap.DensityAnalystService = DensityAnalystService;