const xlsx = require('xlsx');
const utils = xlsx.utils;
const moment = require('moment');

const u = require('./utils');

module.exports = (workbooks, stops, routes, callback) => {
    console.log('Beginning: cars.js');
    
    /**
     * 停留所をオブジェクトに変換
     */
    const _stops = u.encode_stops(stops);
    /**
     * 路線をオブジェクトに変換
     */
    const _routes = u.encode_routes(routes);

    const _cars = {};

    workbooks.forEach(workbook => {
        // Excelシートの取得
        const sheetNames = workbook.SheetNames;
        sheetNames.forEach((sheetName, sheet_idx) => {
            const worksheet = workbook.Sheets[sheetName];
            const range = utils.decode_range( worksheet['!ref'] );
            // ヘッダー行
            const header = [];
            for(let r = range.s.r; r < range.e.r; r++) {
                // route = { stops: [] };
                let route;
                let _slope = false;
                for(let c = range.s.c; c < range.e.c; c++) {

                    // Cellを登録
                    const adr = utils.encode_cell({ c, r });
                    const cell = worksheet[adr];

                    // ヘッダーを登録
                    if(r == 2 && c >= 1) {
                        if(_stops[cell.v]) {
                            header.push(_stops[cell.v]);
                        } else {
                            header.push(cell.v);
                        }
                    }

                    // 運転を仮登録
                    if(r > 3 && c >= 1) {
                        // 路線番号を登録
                        if(header[c - 1] == '路線番号') {
                            route = cell.w;
                            const _inbound = sheet_idx % 2 ? false : true;
                            if(_cars[route]) {
                                _cars[route].push({ times: [], stops: [], _inbound, _slope });
                            } else {
                                _cars[route] = [{ times: [], stops: [], _inbound, _slope }];
                            }
                        }

                        // スロープ付きかを登録
                        if(header[c - 1] === 'スロープ付き') {
                            if(cell) {
                                _slope = true;
                            }
                        }

                        // 運転日を登録
                        if(c === range.e.c - 1) {
                            if(sheet_idx > 2) {
                                // 土曜、日・祝
                                if(cell && cell.w === '日祝日運休') {
                                    // 土曜日のみ
                                    _cars[route][_cars[route].length - 1].date = 0;
                                } else {
                                    // 土日祝
                                    _cars[route][_cars[route].length - 1].date = 1;
                                }
                            } else {
                                // 平日
                                _cars[route][_cars[route].length - 1].date = -1;
                            }
                        }

                        if(cell && /^\d+:\d+$/.test(cell.w)) {
                            _cars[route][_cars[route].length - 1].stops.push(header[c - 1]);
                            _cars[route][_cars[route].length - 1].times.push(moment(cell.v).format('HH:mm'));
                        }
                    }
                }
            }
        });
    });

    /**
     * 路線データと照らし合わせて同じ停留所を持つもののみ登録
     */
    const cars = [];

    Object.keys(_cars).forEach(route_id => {
        const _stops = _routes[route_id].stops;
        _cars[route_id].forEach(car => {
            if(_stops.length == car.stops.length) {
                const id = u.genUniqueId('car_id', 101, 999);
                cars.push({
                    id,
                    route_id,
                    date: car.date,
                    _inbound: car._inbound,
                    _slope: car._slope || false,
                    times: car.times,
                    stops: car.stops
                });
            }
        });
    });

    callback(null, workbooks, stops, routes, cars);
}