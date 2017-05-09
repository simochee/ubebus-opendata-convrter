const fs = require('fs');
const async = require('async');
const xlsx = require('xlsx');
const utils = xlsx.utils;

let begin = new Date;

async.waterfall([
    /**
     * excelファイル一覧を取得
     */
    callback => {
        fs.readdir('./sheets', (err ,files) => {
            if (err) throw err;
            callback(null, files);
        });
    },
    /**
     * Excelファイルを取得
     */
    (files, callback) => {
        const workbooks = [];
        files.forEach(file => {
            const workbook = xlsx.readFile(`${__dirname}/sheets/${file}`, {
                cellDates: true
            });
            workbooks.push(workbook);
        });
        callback(null, workbooks);
    },
    /**
     * 停留所データを取得
     * return: workbooks, stops
     */
    require('./stops'),
    /**
     * 路線データを取得
     * return: workbooks, stops, routes
     */
    require('./routes'),
    /**
     * 運転データを取得
     * return: workbooks, stops, routes, cars
     */
    require('./cars'),
    /**
     * 時刻データを取得
     * return: workbooks, stops, routes, cars, times
     */
    require('./times'),
    /**
     * データをデータベースに登録
     * return: null
     */
    require('./database')
], err => {
    console.log(`Complete!: ${new Date() - begin}ms`);
});