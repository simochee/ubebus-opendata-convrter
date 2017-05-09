const fs = require('fs');

/**
 * 停留所データを取得
 * ※生活交通バスは省略
 */
module.exports = (workbooks, callback) => {
    console.log('Beginning: stops.js');
    
    // 停留所のHTMLファイルを取得
    const html = fs.readFileSync('./stops.html', 'utf8');
    // liのみを配列に変換
    const li_array = html
                        .replace(/<(h3|p).+<\/(h3|p)>|<ul>|<\/ul>|\n/g, '')
                        .replace(/^<li>|<\/li>$/g, '')
                        .split('</li><li>');
    // 停留所データ
    const stops = [];
    li_array.forEach(item => {
        // 注釈付き停留所名
        const _name = item
                        .match(/^.+<span/g)[0]
                        .replace(/<span$/g, '');
        // 生活交通バスの停留所でなければ登録処理
        if(!/（生活交通バス）/.test(_name)) {
            // 停留所IDを取得
            const id = item
                        .match(/href="(.*).xls"/g)[0]
                        .match(/\d+/g)[0];
            // 停留所名を取得
            const name = _name.replace(/（.*）/g, '');
            const name_kana = item
                                .match(/<span class="small_90">（.+）<\/span>/g)[0]
                                .replace(/^.+（|）.+$/g, '');
            // 停留所データを登録
            stops.push({
                id,
                name,
                name_kana
            });
        }
    });
    // 次の関数へ渡す
    callback(null, workbooks, stops);
}