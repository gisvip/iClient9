import ol from 'openlayers/dist/ol-debug';
import SuperMap from '../../common/SuperMap';
import  '../../common/security/SecurityManager';
import  Util from '../core/Util';

/**
 * @class ol.source.ImageSuperMapRest
 * @classdesc UGC 影像图层类。
 * @param options - {object} 参数
 * @extends  ol.source.TileImage
 */
export default class ImageSuperMapRest extends ol.source.TileImage {

    constructor(options) {
        if (options.url === undefined) {
            return;
        }
        options.attributions = options.attributions ||
            new ol.Attribution({
                html: "Map Data <span>© <a href='http://support.supermap.com.cn/product/iServer.aspx' target='_blank'>SuperMap iServer</a></span> with <a href='http://icltest.supermapol.com/'>© SuperMap iClient</a>"
            });
        var layerUrl = options.url + "/image.png?";
        options.serverType = options.serverType || SuperMap.ServerType.ISERVER;
        //为url添加安全认证信息片段
        layerUrl = appendCredential(layerUrl, options.serverType);
        /**
         * @function ol.source.ImageSuperMapRest.prototype.appendCredential
         * @param url - {string} 地址
         * @param serverType - {object} 服务类型
         * @description 添加凭据
         */
        function appendCredential(url, serverType) {
            var newUrl = url, credential, value;
            switch (serverType) {
                case SuperMap.ServerType.ISERVER:
                    value = SuperMap.SecurityManager.getToken(url);
                    credential = value ? new SuperMap.Credential(value, "token") : null;
                    break;
                case SuperMap.ServerType.IPORTAL:
                    value = SuperMap.SecurityManager.getToken(url);
                    credential = value ? new SuperMap.Credential(value, "token") : null;
                    if (!credential) {
                        value = SuperMap.SecurityManager.getKey(url);
                        credential = value ? new SuperMap.Credential(value, "key") : null;
                    }
                    break;
                case SuperMap.ServerType.ONLINE:
                    value = SuperMap.SecurityManager.getKey(url);
                    credential = value ? new SuperMap.Credential(value, "key") : null;
                    break;
                default:
                    value = SuperMap.SecurityManager.getToken(url);
                    credential = value ? new SuperMap.Credential(value, "token") : null;
                    break;
            }
            if (credential) {
                newUrl += "&" + credential.getUrlParameters();
            }
            return newUrl;
        }

        //切片是否透明
        var transparent = true;
        if (options.opaque !== undefined) {
            transparent = options.opaque;
        }
        layerUrl += "&transparent=" + transparent;

        //是否使用缓存
        var cacheEnabled = false;
        if (options.cacheEnabled !== undefined) {
            cacheEnabled = options.cacheEnabled;
        }
        layerUrl += "&cacheEnabled=" + cacheEnabled;

        //如果有layersID，则是在使用专题图
        if (options.layersID !== undefined) {
            layerUrl += "&layersID=" + options.layersID;
        }
        //是否重定向
        if (options.redirect !== undefined) {
            layerUrl += "&redirect=" + options.redirect;
        }
        if (options.cacheEnabled !== undefined) {
            layerUrl += "&cacheEnabled=" + options.cacheEnabled;
        }
        if (options.prjCoordSys) {
            layerUrl += "prjCoordSys=" + JSON.stringify(options.prjCoordSys);
        }
        if (options.clipRegion instanceof ol.geom.Geometry) {
            options.clipRegionEnabled = true;
            options.clipRegion = Util.toSuperMapGeometry(new ol.format.GeoJSON().writeGeometryObject(options.clipRegion));
            options.clipRegion = SuperMap.Util.toJSON(SuperMap.REST.ServerGeometry.fromGeometry(options.clipRegion));
            layerUrl += "&clipRegionEnabled=" + options.clipRegionEnabled + "&clipRegion=" + JSON.stringify(options.clipRegion);
        }
        if (!!options.overlapDisplayed && options.overlapDisplayedOptions) {
            options.overlapDisplayedOptions = options.overlapDisplayedOptions;
            layerUrl += "&overlapDisplayed=" + options.overlapDisplayed + "&overlapDisplayedOptions=" + options.overlapDisplayedOptions.toString();
        }
        if (options.cacheEnabled === true && options.tileversion) {
            layerUrl += "tileversion=" + options.tileversion;
        }
        /**
         * @function ol.source.ImageSuperMapRest.prototype.tileUrlFunction
         * @param tileCoord - {object} 算瓦片坐标
         * @param pixelRatio - {object} 像素密度
         * @param projection - {object} 投影
         * @description 添加凭据
         */
        function tileUrlFunction(tileCoord, pixelRatio, projection) {
            if (!this.tileGrid) {
                this.tileGrid = this.getTileGridForProjection(projection);
            }
            var tileExtent = this.tileGrid.getTileCoordExtent(
                tileCoord, this.tmpExtent_);
            var tileSize = ol.size.toSize(
                this.tileGrid.getTileSize(tileCoord[0]), this.tmpSize);
            return layerUrl + "&width=" + tileSize[0] + "&height=" + tileSize[1] + "&viewBounds=" + "{\"leftBottom\" : {\"x\":" + tileExtent[0] + ",\"y\":" + tileExtent[1] + "},\"rightTop\" : {\"x\":" + tileExtent[2] + ",\"y\":" + tileExtent[3] + "}}";
        }

        super({
            attributions: options.attributions,
            cacheSize: options.cacheSize,
            crossOrigin: options.crossOrigin,
            logo: options.logo,
            opaque: options.opaque,
            projection: options.projection,
            reprojectionErrorThreshold: options.reprojectionErrorThreshold,
            state: options.state,
            tileClass: options.tileClass,
            tileGrid: options.tileGrid,
            tileLoadFunction: options.tileLoadFunction,
            tilePixelRatio: options.tilePixelRatio,
            tileUrlFunction: tileUrlFunction,
            url: options.url,
            urls: options.urls,
            wrapX: options.wrapX !== undefined ? options.wrapX : false,
            cacheEnabled: options.cacheEnabled,
            layersID: options.layersID
        });
    }
    /**
     * @function ol.source.ImageSuperMapRest.optionsFromMapJSON
     * @param url - {string} 地址
     * @param mapJSONObj - {object} 地图JSON
     * @description 获取地图JSON信息
     */
    static optionsFromMapJSON(url, mapJSONObj) {
        var options = {};
        options.url = url;
        options.crossOrigin = 'anonymous';
        var extent = [mapJSONObj.bounds.left, mapJSONObj.bounds.bottom, mapJSONObj.bounds.right, mapJSONObj.bounds.top];
        var resolutions = getResolutions();

        function getResolutions() {
            var level = 17;
            var dpi = 96;
            var width = (extent[2] - extent[0]);
            var height = (extent[3] - extent[1]);
            var tileSize = width >= height ? width : height;
            var maxReolution;
            if (tileSize === width) {
                maxReolution = tileSize / mapJSONObj.viewer.width;
            } else {
                maxReolution = tileSize / mapJSONObj.viewer.height;
            }
            var resolutions = [];
            var unit = SuperMap.Unit.METER;
            if (mapJSONObj.coordUnit === SuperMap.Unit.DEGREE) {
                unit = SuperMap.Unit.DEGREE;
            }
            if (mapJSONObj.visibleScales.length > 0) {
                for (var i = 0; i < mapJSONObj.visibleScales.length; i++) {
                    resolutions.push(Util.scaleToResolution(mapJSONObj.visibleScales[i], dpi, unit));
                }
            } else {
                for (var i = 0; i < level; i++) {
                    resolutions.push(maxReolution / Math.pow(2, i));
                }
            }
            return resolutions;
        }

        options.tileGrid = new ol.tilegrid.TileGrid({
            extent: extent,
            resolutions: resolutions
        });
        return options;
    }

    static createTileGrid(extent, maxZoom, minZoom, tileSize, origin) {
        var tilegrid = ol.tilegrid.createXYZ({
            extent: extent,
            maxZoom: maxZoom,
            minZoom: minZoom,
            tileSize: tileSize
        });
        return new ol.tilegrid.TileGrid({
                extent: extent,
                minZoom: minZoom,
                origin: origin,
                resolutions: tilegrid.getResolutions(),
                tileSize: tilegrid.getTileSize()
            }
        );
    }
}
ol.source.ImageSuperMapRest = ImageSuperMapRest;