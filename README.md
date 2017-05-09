# UbeBus Opendata Converter

宇部市営バスが公開しているオープンデータを再利用可能なJavaScriptオブジェクトに変換します。

## Usage

0. `npm i`
1. `./sheets`ディレクトリに路線の時刻データ（xlsx形式）を配置します
    * xlsxファイルの名前は`[ Route ID ].xls`としてください
2. `database.js`に記載されているMongoDBの設定を変更します。
    * DBに保存しない場合は、`app.js`の`require('./database')`を削除してください
3. `npm start`

### バス停留所一覧について

バス停留所は宇部市営バスウェブサイトの停留所別時刻表ページのHTMLコードを使用しています

詳しくは`stops.html`を参照してください

## Note

* 時刻データは2017年5月時点のデータ形式にのみ対応しています

## Links

* [宇部市営バス](http://www.ubebus.jp/)

* [async](https://www.npmjs.com/package/async)