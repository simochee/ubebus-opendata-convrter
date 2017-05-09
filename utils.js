/**
 * 停留所を停留所名 or 停留所番号をkeyにするオブジェクトに変換
 * mode: true = 名: 番号, false = 番号: 名
 */
exports.encode_stops = (stops, mode = true) => {
    const _stops = {};
    stops.forEach(stop => {
        if(mode) {
            _stops[stop.name] = +stop.id;
        } else {
            _stops[stop.id] = stop.name;
        }
    });
    return _stops;
}

/**
 * 路線を路線名: 路線データのオブジェクトに変換
 */
exports.encode_routes = (routes) => {
    const _routes = {};
    routes.forEach(route => {
        _routes[route.id] = {
            stops: route.stops
        };
    });
    return _routes;
}

/**
 * ユニークなIDを生成する
 */
const ids = {};
exports.genUniqueId = (name, min = 10001, max = 99999) => {
    if(!ids[name]) {
        ids[name] = [];
    }
    let id;
    do {
        id = Math.floor(Math.random() * (max - min) + min);
    } while(ids[name].indexOf(id) >= 0);
    ids[name].push(id);
    return id;
}

/**
 * 数値をゼロ埋めの文字列に変換
 */
exports.zero = (num, lv = 2) => {
    return `0000000000${num}`.slice(-lv);
}