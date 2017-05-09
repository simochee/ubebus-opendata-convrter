const xlsx = require('xlsx');
const utils = xlsx.utils;
const moment = require('moment');

const u = require('./utils');

const _via = {
    'ｸﾞﾗﾝ': 'フジグラン宇部',
    '参・': '参宮通・',
    '・参': '・参宮通',
    'ﾌﾛﾝﾃｨｱ': 'フロンティア',
    'ゆめﾀｳﾝ': 'ゆめタウン宇部',
    'ゆめタウン': 'ゆめタウン宇部',
    '循大': '循大学病院',
    '工学部': '工学部通',
    '空港': '山口宇部空港',
    'ｻﾝ': 'サンパークあじす',
    '医療ｾﾝﾀｰ': '山口宇部医療センター',
    'ｸﾞﾗﾝ': 'フジグラン宇部',
    '埠頭': '埠頭入口',
    '琴芝': '琴芝駅前',
    '琴・': '琴芝駅前・',
    '・琴': '・琴芝駅前',
    '宇部高': '宇部高校',
    'ﾐｽﾀｰﾏｯｸｽ': 'ミスターマックス宇部店'
}

module.exports = (workbooks, stops, callback) => {
    console.log('Beginning: routes.js');
    
    /**
     * 停留所をオブジェクトに変換
     */
    const _stops = u.encode_stops(stops);
    const _routes = {};
    
    workbooks.forEach(workbook => {
        // Excelシートの取得
        const sheetNames = workbook.SheetNames;
        sheetNames.forEach((sheetName, sheet_idx) => {
            const worksheet = workbook.Sheets[sheetName];
            const range = utils.decode_range( worksheet['!ref'] );
            // ヘッダー行
            const header = [];
            for(let r = range.s.r; r < range.e.r; r++) {
                route = { stops: [] };
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

                    // 路線を仮配列に登録
                    if(r > 3 && c >= 1) {
                        // 路線番号を登録
                        if(header[c - 1] == '路線番号') {
                            route.id = cell.w;
                            route.info = {sheetName, r}
                        }
                        // 経由地を登録
                        if(header[c - 1] == '経由') {
                            // 内容を書き換え
                            let via = cell.w.replace(new RegExp(Object.keys(_via).join('|'), 'g'), (m) => {
                                return _via[m];
                            });
                            let isLoop = false;
                            // 循環線判定
                            if(/^循　*/.test(via)) {
                                via = via.replace(/^循　*/g, '');
                                isLoop = true;
                            }
                            // 停留所の配列に変換
                            route.via = via.split('・');
                            // 循環を追加
                            if(isLoop) {
                                route.via.unshift('循環');
                            }
                        }
                        // 停留所を登録
                        if(cell && moment(cell.w, 'H:mm').isValid()) {
                            route.stops.push(header[c - 1]);
                        }
                    }
                }
                // 路線を判定し登録
                if(route.stops.length) {
                    if(_routes[route.id]) {
                        // 路線は存在するが停留所数が少ない場合は停留所のみ置き換える
                        if(_routes[route.id].stops.length < route.stops.length) {
                            _routes[route.id] = {
                                // のぼり・くだりによって順序を変える
                                stops: sheet_idx % 2 ? route.stops.reverse() : route.stops
                            }
                        }
                    } else {
                        // 路線が存在しないため新規に登録する
                        const via = (() => {
                            const via = route.via;
                            if(sheet_idx % 2) {
                                return via;
                            } else {
                                if(via[0] === '循環') {
                                    const _via = via.slice(1).reverse();
                                    return _via.unshift('循環');
                                } else {
                                    return via.reverse();
                                }
                            }
                        })();
                        _routes[route.id] = {
                            // のぼり・くだりによって順序を変える
                            stops: sheet_idx % 2 ? route.stops.reverse() : route.stops,
                            via
                        }
                    }
                }
            }
        });
    });
    
    /**
     * 路線データを整形
     */
    const routes = [];
    Object.keys(_routes).forEach(id => {
        const route = _routes[id];
        routes.push({
            id,
            stops: route.stops,
            via: route.via
        });
    });

    callback(null, workbooks, stops, routes);
}