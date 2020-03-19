var MQTTConf = {}
var fs = require('fs')
var path = require('path')
var writeFileRecursive = require('../common.js')

MQTTConf.resultConf = function () {
    fs.readFile(path.join(__dirname,"../Json/dbConfigMQ.json"),(err,data)=>{
        if(err) {
            console.log(err,"json文件读取失败")
            return
        }
        // 解析JSON文件
        let JsonConf = JSON.parse(data)
        // 解析的JSON文件JsonConf对象中的key组成数组,用于判断有无哨兵或者集群字段
        let keyList = [];

        for (const key in JsonConf) {
            keyList.push(key)
        }
        fs.readFile(path.join(__dirname,"../lastConf/emqx.conf"),(err,data)=>{
            if(err) {
                console.log(err)
                return
            }
            let BasicConf = data.toString()

            let regA = new RegExp("\n## node.process_limit = 2097152","g")
            BasicConf = BasicConf.replace(regA,"\nnode.process_limit = "+JsonConf.Cluster.process_limit)
            let regB = new RegExp("\n## node.max_ports = 1048576","g")
            BasicConf = BasicConf.replace(regB,"\nnode.max_ports = "+JsonConf.Cluster.max_ports)
            let regC = new RegExp("\ncluster.proto_dist = inet_tcp","g")
            BasicConf = BasicConf.replace(regC,"\ncluster.proto_dist = "+ JsonConf.Cluster.inet_tcp)
            writeFileRecursive("../newConf/MQTT/cluster.conf", BasicConf, (err) => {
                if (err) {
                    console.log(err)
                    return
                }
                console.log("写入MQTT配置")
            })
        })
    })
}
MQTTConf.resultConf()