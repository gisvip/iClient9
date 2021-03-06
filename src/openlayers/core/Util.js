import ol from 'openlayers/dist/ol-debug';
import SuperMap from '../../common/SuperMap';
import GeoJSONFormat from '../../common/format/GeoJSON';
ol.supermap = ol.supermap || {};
/**
 * @class ol.supermap.Util
 * @classdesc 工具类
 */
export default class Util {

    constructor() {

    }

    static toGeoJSON(smObj) {
        if (smObj) {
            var format = new GeoJSONFormat();
            return JSON.parse(format.write(smObj));
        }
    }

    static toSuperMapGeometry(geoJSON) {
        if (geoJSON && geoJSON.type) {
            var format = new GeoJSONFormat();
            var result = format.read(geoJSON, "FeatureCollection");
            return result[0].geometry;
        }
    }

    static resolutionToScale(resolution, dpi, mapUnit) {
        var inchPerMeter = 1 / 0.0254;
        // 地球半径。
        var meterPerMapUnit = this.getMeterPerMapUnit(mapUnit);
        var scale = resolution * dpi * inchPerMeter * meterPerMapUnit;
        scale = 1 / scale;
        return scale;
    }

    static scaleToResolution(scale, dpi, mapUnit) {
        var inchPerMeter = 1 / 0.0254;
        var meterPerMapUnitValue = this.getMeterPerMapUnit(mapUnit);
        var resolution = scale * dpi * inchPerMeter * meterPerMapUnitValue;
        resolution = 1 / resolution;
        return resolution;
    }

    static getMeterPerMapUnit(mapUnit) {
        var earchRadiusInMeters = 6378137;
        var meterPerMapUnit;
        if (mapUnit === SuperMap.Unit.METER) {
            meterPerMapUnit = 1;
        } else if (mapUnit === SuperMap.Unit.DEGREE) {
            // 每度表示多少米。
            meterPerMapUnit = Math.PI * 2 * earchRadiusInMeters / 360;
        } else if (mapUnit === SuperMap.Unit.KILOMETER) {
            meterPerMapUnit = 1.0E-3;
        } else if (mapUnit === SuperMap.Unit.INCH) {
            meterPerMapUnit = 1 / 2.5399999918E-2;
        } else if (mapUnit === SuperMap.Unit.FOOT) {
            meterPerMapUnit = 0.3048;
        } else {
            return meterPerMapUnit;
        }
        return meterPerMapUnit;
    }

    static isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]'
    }

    static Csv2GeoJSON(csv, options) {
        var defaultOptions = {
            titles: ['lon', 'lat'],
            latitudeTitle: 'lat',
            longitudeTitle: 'lon',
            fieldSeparator: ',',
            lineSeparator: '\n',
            deleteDoubleQuotes: true,
            firstLineTitles: false
        };
        options = options || defaultOptions;
        var _propertiesNames = []
        if (typeof csv === 'string') {
            var titulos = options.titles;
            if (options.firstLineTitles) {
                csv = csv.split(options.lineSeparator);
                if (csv.length < 2) return;
                titulos = csv[0];
                csv.splice(0, 1);
                csv = csv.join(options.lineSeparator);
                titulos = titulos.trim().split(options.fieldSeparator);
                for (var i = 0; i < titulos.length; i++) {
                    titulos[i] = _deleteDoubleQuotes(titulos[i]);
                }
                options.titles = titulos;
            }
            for (var i = 0; i < titulos.length; i++) {
                var prop = titulos[i].toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '_');
                if (prop == '' || prop == '_') prop = 'prop-' + i;
                _propertiesNames[i] = prop;
            }
            csv = _csv2json(csv);
        }
        return csv;

        function _deleteDoubleQuotes(cadena) {
            if (options.deleteDoubleQuotes) cadena = cadena.trim().replace(/^"/, "").replace(/"$/, "");
            return cadena;
        }

        function _csv2json(csv) {
            var json = {};
            json["type"] = "FeatureCollection";
            json["features"] = [];
            var titulos = options.titles;
            csv = csv.split(options.lineSeparator);
            for (var num_linea = 0; num_linea < csv.length; num_linea++) {
                var campos = csv[num_linea].trim().split(options.fieldSeparator)
                    , lng = parseFloat(campos[titulos.indexOf(options.longitudeTitle)])
                    , lat = parseFloat(campos[titulos.indexOf(options.latitudeTitle)]);

                var isInRange = lng < 180 && lng > -180 && lat < 90 && lat > -90;
                if (!(campos.length == titulos.length && isInRange)) {
                    continue;
                }

                var feature = {};
                feature["type"] = "Feature";
                feature["geometry"] = {};
                feature["properties"] = {};
                feature["geometry"]["type"] = "Point";
                feature["geometry"]["coordinates"] = [lng, lat];
                for (var i = 0; i < titulos.length; i++) {
                    if (titulos[i] != options.latitudeTitle && titulos[i] != options.longitudeTitle) {
                        feature["properties"][_propertiesNames[i]] = _deleteDoubleQuotes(campos[i]);
                    }
                }
                json["features"].push(feature);
            }
            return json;
        }
    }

    static createCanvasContext2D(opt_width, opt_height) {
        var canvas = document.createElement('CANVAS');
        if (opt_width) {
            canvas.width = opt_width;
        }
        if (opt_height) {
            canvas.height = opt_height;
        }
        return canvas.getContext('2d');
    }
};

ol.supermap.Util = Util;