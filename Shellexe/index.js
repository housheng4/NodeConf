var fs = require('fs')
var makeConf = require("./makeConf")
var startContainer = requier("./startContainer")
fs.readFile("./Json/project.json", (err, data) => {
    if (err) {
        console.log("Json数据错误")
        return
    }
    let projectData = JSON.parse(data)
    // console.log(projectData)
    switch (projectData.dbType) {
        case "Redis":
            makeConf.getRedisConf()
            startContainer.RedisContainer()
            break;
        case "PostgreSQL":
            makeConf.getPGConf()
            startContainer.PGContainer()
            break;
        case "MongoDB":
            makeConf.getMongoDBConf()
            startContainer.MongoDBContainer()
            break;
        case "TimescaleDB":
            makeConf.getTimescaleDBConf()
            startContainer.TimescaleDBContainer()
            break;
        case "MQTT":
            makeConf.getMQTTConf()
            startContainer.MQTTContainer()
            break;
        default:
            console.log("找不到数据库")
            break;
    }
})