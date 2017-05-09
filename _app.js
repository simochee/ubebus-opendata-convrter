const fs = require('fs');
const async = require('async');
const xlsx = require('xlsx');
const utils = xlsx.utils;

const via = {
    'ﾐｽﾀｰﾏｯｸｽ': 'ミスターマックス',
    'ｻﾝ': 'サンパークあじす',
    'ｸﾞﾗﾝ': 'フジグラン宇部',
    'ｾﾝﾀｰ': 'センター',
}

async.waterfall([
    callback => {
        fs.readdir('./sheets', (err, files) => {
            if (err) throw err;
            callback(null, files);
        });
    },
    (files, callback) => {
        let routes = {};
        async.each(files, (file, next) => {
            const workbook = xlsx.readFile(`${__dirname}/sheets/${file}`);
            const sheetNames = workbook.SheetNames;
            sheetNames.forEach((sheetName, i) => {
                const worksheet = workbook.Sheets[sheetName];
                const _range = worksheet['!ref'];
                const range = utils.decode_range(_range);
                const info = {};
                const header = [];
                for(let r = range.s.r; r < range.e.r; r++) {
                    for(let c = range.s.c; c < range.e.c; c++) {
                        const adr = utils.encode_cell({ c, r });
                        const cell = worksheet[adr];
                        // 路線を登録
                        if(i == 0 && r == 0 && c == 0) {
                            const vals = cell.v.split('～');
                            routes[file.replace(/\..+$/g, '')] = vals;
                        }
                        if(r == 1 && c == 0) {
                            // 路線を登録
                            info.route = file.replace(/\..+$/g, '');
                            // 平日 or 土日祝
                            const val = cell.v == '土曜、日祝' ? true : false;
                            info.isWeekend = val;
                            // のぼり or くだり （宇部新川方面がのぼり）
                            if(i % 2) {
                                info.isInbound = false;
                            } else {
                                info.isInbound = true;
                            }
                        }
                        // ヘッダーを登録
                        if(r == 2 && c >= 1) {
                            header.push(cell.v);
                        }
                        // 路線、経由、行先、時刻を取得
                        if(r >= 4 && c >= 1) {
                            switch(header[c - 1]) {
                                // スロープ付きを取得
                                case 'スロープ付き':
                                    if(cell && cell.w) {
                                        
                                    }
                                    break;
                                // 路線番号を取得
                                case '路線番号':

                                    break;
                                // 経由を取得
                                case '経由':

                                    break;
                                // 行先を無視
                                case '行先':
                                    // None.
                                    break;
                                // 時刻データを保存
                                default:
                            }
                        }

                    }
                }
            });
            next();
        }, (err) => {
            if (err) throw err;
            callback();
        });
    }
]);

// let workbook = xlsx.readFile('2.xls')

// let sheetNames = workbook.SheetNames;

// console.log(sheetNames);

// let worksheet = workbook.Sheets[sheetNames[0]];

// let range = worksheet['!ref'];

// console.log(range);

// console.log(worksheet['C4']);


