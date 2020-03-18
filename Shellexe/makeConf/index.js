var makeConf = {};
var RedisConf = require('./RedisConf.js')
var PGConf = require('./PGConf.js')
var MongoConf = require('./MongoDB.js')
var TimescaleDBConf = require('./TimescaleDB')
var MQTTConf = require('./MQTT')

// 获取Redis配置文件
makeConf.getRedisConf = () => {
    RedisConf.resultConf()
}
// 获取PG配置文件
makeConf.getPGConf = () => {
    PGConf.resultConf()
}
// 获取MongoDB配置文件
makeConf.getMongoDBConf = ()=>{
    MongoConf.resultConf()
}
// 获取TimescaleDB配置文件
makeConf.getTimescaleDB = ()=>{
    TimescaleDBConf.resultConf()
}
// 获取MQTT配置文件
makeConf.getMQTTConf = () =>{
    MQTTConf.resultConf()
}
module.exports = makeConf;