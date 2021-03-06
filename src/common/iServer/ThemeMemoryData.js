﻿import SuperMap from '../SuperMap';

/**
 * @class SuperMap.ThemeMemoryData
 * @classdesc 专题图内存数据类。
 * @param srcData - {Array} 原始值数组。
 * @param targetData - {Array} 外部值数组。
 */
export default  class ThemeMemoryData {

    /**
     * @member SuperMap.ThemeMemoryData.prototype.srcData -{Array}
     * @description 原始值数组，该属性值将被 targetData 属性所指定的值替换掉，然后制作专题图，但数据库中的值并不会改变。
     */
    srcData = null;

    /**
     * @member SuperMap.ThemeMemoryData.prototype.targetData -{Array}
     * @description 外部值数组，即用于制作专题图的内存数据，设定该属性值后，会将 srcData 属性所指定的原始值替换掉制作专题图，但数据库中的值并不会改变。
     */
    targetData = null;

    constructor(srcData, targetData) {
        if (srcData) {
            this.srcData = srcData;
        }
        if (targetData) {
            this.targetData = targetData;
        }
    }

    /**
     * @function SuperMap.ThemeMemoryData.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
        var me = this;
        me.srcData = null;
        me.targetData = null;
    }


    /**
     * @function SuperMap.ThemeMemoryData.prototype.toJSON
     * @description 将 SuperMap.ThemeMemoryData 对象转化为json字符串。
     * @return {String} 返回转换后的 JSON 字符串。
     */
    toJSON() {
        if (this.srcData && this.targetData) {
            var memoryDataStr = "";
            var count = Math.min(this.srcData.length, this.targetData.length);
            for (var i = 0; i < count; i++) {
                memoryDataStr += "\'" + this.srcData[i] + "\':\'" + this.targetData[i] + "\',";
            }
            //去除多余的逗号
            if (i > 0) {
                memoryDataStr = memoryDataStr.substring(0, memoryDataStr.length - 1);
            }
            return "{" + memoryDataStr + "}";
        } else {
            return null;
        }
    }


    CLASS_NAME = "SuperMap.ThemeMemoryData"
}

SuperMap.ThemeMemoryData = ThemeMemoryData;