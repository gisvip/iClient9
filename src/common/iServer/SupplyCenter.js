﻿import SuperMap from '../SuperMap';

/**
 * @class SuperMap.SupplyCenter
 * @classdesc 资源供给中心类。在资源分配和选址分区分析两个功能中使用。
 * @param options - {Object} 可选参数。如：<br>
 *        maxWeight - {number}资源供给中心的最大耗费值，必设参数。<br>
 *        nodeID - {Integer} 资源供给中心点的结点 ID 号，必设参数。资源供给中心必须是结点。<br>
 *        resourceValue - {number}资源供给中心能提供的最大服务量或商品数量，必设参数。<br>
 *        type - {SuperMap.SupplyCenterType} 资源供给中心点的类型常量。
 */
export default  class SupplyCenter {

    /**
     * @member SuperMap.SupplyCenter.prototype.maxWeight -{number}
     * @description 资源供给中心的最大耗费值，必设参数。中心点最大阻值设置越小，表示中心点所提供的资源可影响范围越大。
     *              最大阻力值是用来限制需求点到中心点的花费。
     *              如果需求点（弧段或结点）到此中心的花费大于最大阻力值，则该需求点不属于该资源供给中心提供资源的范围。
     */
    maxWeight = null;

    /**
     * @member SuperMap.SupplyCenter.prototype.nodeID -{Integer}
     * @description 资源供给中心点的结点 ID 号，必设参数。资源供给中心必须是结点。
     */
    nodeID = null;

    /**
     * @member SuperMap.SupplyCenter.prototype.resourceValue -{number}
     * @description 资源供给中心能提供的最大服务量或商品数量，必设参数。例如资源中心为学校，资源中心资源量表示该学校能够接纳多少学生。
     */
    resourceValue = null;

    /**
     * @member SuperMap.SupplyCenter.prototype.type -{SuperMap.SupplyCenterType}
     * @description 资源供给中心点的类型常量。资源供给中心点的类型包括非中心，固定中心和可选中心。
     *              固定中心用于资源分配分析；固定中心和可选中心用于选址分析；非中心在两种网络分析时都不予考虑。
     */
    type = null;

    constructor(options) {
        if (options) {
            SuperMap.Util.extend(this, options);
        }
    }

    /**
     * @function SuperMap.SupplyCenter.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
        var me = this;
        me.maxWeight = null;
        me.nodeID = null;
        me.resourceValue = null;
        me.type = null;
    }

    /**
     * @function SuperMap.SupplyCenter.fromJson
     * @description 将服务端JSON对象转换成当前客户端对象
     * @param jsonObject - {Object} 要转换的 JSON 对象。
     */
    static fromJson(jsonObject) {
        if (!jsonObject) {
            return;
        }
        return new SupplyCenter({
            maxWeight: jsonObject.maxWeight,
            nodeID: jsonObject.nodeID,
            resourceValue: jsonObject.resourceValue,
            type: jsonObject.type
        });
    }


    CLASS_NAME = "SuperMap.SupplyCenter"
}

SuperMap.SupplyCenter = SupplyCenter;

