const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ubebus');

const Stop = require('./models/stop');
const Route = require('./models/route');
const Car = require('./models/car');
const Time = require('./models/time');

const async = require('async');

module.exports = (workbooks, stops, routes, cars, times, callback) => {
    console.log('Beginning: database.js');

    async.series([
        /**
         * データベースのデータを削除
         */
        callback => {
            async.parallel([
                callback => { Stop.remove(err => { callback() }); },
                callback => { Route.remove(err => { callback() }); },
                callback => { Car.remove(err => { callback() }); },
                callback => { Time.remove(err => { callback() }); }
            ], err => {
                console.log('Log: database.js > Deleted All Tables');
                callback();
            });
        },
        /**
         * データをデータベースに登録
         */
        callback => {
            async.series([
                /**
                 * 停留所データを登録
                 */
                callback => {
                    console.log('Beginning: database.js > Stops :', stops.length);
                    async.each(stops, (stop, next) => {
                        const _stop = new Stop(stop);
                        _stop.save(err => { next() });
                    }, err => {
                        console.log('Finished: database.js > Stops');
                        callback();
                    });
                },
                /**
                 * 路線データを登録
                 */
                callback => {
                    console.log('Beginning: database.js > Routes :', routes.length);
                    async.each(routes, (route, next) => {
                        const _route = new Route(route);
                        _route.save(err => { next() });
                    }, err => {
                        console.log('Finished: database.js > Routes');
                        callback();
                    });
                },
                /**
                 * 運行データを登録
                 */
                callback => {
                    console.log('Beginning: database.js > Cars :', cars.length);
                    async.each(cars, (car, next) => {
                        const _car = new Car({
                            id: car.id,
                            route_id: car.route_id,
                            date: car.date,
                            _inbound: car._inbound,
                            _slope: car._slope
                        });
                        _car.save(err => { next() });
                    }, err => {
                        console.log('Finished: database.js > Cars');
                        callback();
                    });
                },
                /**
                 * 時刻データを登録
                 */
                callback => {
                    console.log('Beginning: database.js > Times :', times.length);
                    async.each(times, (time, next) => {
                        const _time = new Time(time);
                        _time.save(err => { next() });
                    }, err => {
                        console.log('Finished: database.js > Times');
                        callback();
                    });
                },
                /**
                 * 路線データ照会
                 */
                callback => {
                    async.each(routes, (route, next) => {
                        Route.find({id: route.id}, (err, docs) => {
                            if(docs.length === 0) {
                                console.log('Not found :', route)
                            }
                            next()
                        });
                    }, err => {
                        callback()
                    });
                }
            ], err => {
                callback(null);
            });
        }
    ], err => {
        callback();
    });
}