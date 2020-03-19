var startContainer = {}
var MQTTContainer = require('./containerMQTT')
var RedisContainer = require('./contianerRedis')
var PGContainer = require('./containerPG')
var MongoDBContainer = require('./contianerMongoDB')
var TimescaleDBContainer = require('./containerTimescaleDB')

startContainer.MQTTContainer =()=>{
    MQTTContainer.MQTTContainer()
}

startContainer.RedisContainer = ()=>{
    RedisContainer.RedisContainer()
}

startContainer.PGContainer = ()=>{
    PGContainer.PGContainer()
}
startContainer.MongoDBContainer = ()=>{
    MongoDBContainer.MongoDBContainer()
}
startContainer.TimescaleDBContainer = ()=>{
    TimescaleDBContainer.TimescaleDBContainer()
}
module.exports = startContainer;