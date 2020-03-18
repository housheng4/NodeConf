var fs = require('fs')
var makeConf = require("./makeConf")
// console.log(makeConf)

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
            break;
        case "PostgreSQL":
            makeConf.getPGConf()
            break;
        case "MongoDB":
            makeConf.getMongoDBConf()
            break;
        case "TimescaleDB":
            makeConf.getTimescaleDBConf()
            break;
        case "MQTT":
            makeConf.getMQTTConf()
            break;
        default:
            console.log("找不到数据库")
            break;
    }
})