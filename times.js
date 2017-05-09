const xlsx = require('xlsx');
const utils = xlsx.utils;
const moment = require('moment');

const u = require('./utils');

module.exports = (workbooks, stops, routes, cars, callback) => {
    console.log('Beginning: times.js');
    
    const times = [];
    
    let route_id;
    cars.forEach(car => {
        route_id = car.route_id;
        car.times.forEach((time, i) => {
            const id = u.genUniqueId('time_id');
            const stop_id = car.stops[i];
            const item = {
                id,
                car_id: car.id,
                time,
                stop_id
            }
            const prev_time = car.times[i - 1];
            const prev_stop = car.stops[i - 1];
            if(prev_time) {
                item.prev = {
                    stop_id: prev_stop,
                    time: prev_time,
                }
            }
            times.push(item);
        });
    });

    callback(null, workbooks, stops, routes, cars, times);
}