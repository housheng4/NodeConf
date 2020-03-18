var MongoDB = {};
var fs = require('fs')
var path = require('path')
var writeFileRecursive = require('../common.js')

MongoDB.resultConf = () => {
    fs.readFile(path.join(__dirname, "../Json/dbConfigMo.json"), (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        let JsonConf = JSON.parse(data)

        let user = JsonConf.user
        let auth = JsonConf.auth
        let pwd = JsonConf.pwd
        // 上面这三项在docker启动时作为命令参数
        let keyList = []
        for (const key in JsonConf) {
            keyList.push(key)
        }
        // console.log(keyList)
        fs.readFile(path.join(__dirname, "../lastConf/mongod.conf"), (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            let BasicConf = data.toString()
            console.log(BasicConf)

            let regA = new RegExp("\n  dbpath:","g")
            BasicConf = BasicConf.replace(regA,"\n  dbpath:"+ JsonConf.dbpath)

            let regB = new RegExp("\n#replication:", "g")
            BasicConf = BasicConf.replace(regB,"\nreplication:"+"\nreplSetName:"+JsonConf.replSet)

            let regC = new RegExp("\n#replication:","g")
            BasicConf = BasicConf.replace(regC,"\nreplication:"+"\noplogSize:"+JsonConf.oplogSize)

            if(JsonConf.master === -1) {
                let regD = new RegExp("\n  port: 27017","g")
                BasicConf = BasicConf.replace(regD,"\n  port: "+JsonConf.binds.Port)
                let regE = new RegExp("\n  bingIp: 127.0.0.1","g")
                BasicConf = BasicConf.replace(regE,"\n  bindIp: "+JsonConf.binds.IP)
                fs.writeFileRecursive("./newConf/MongoDB/Basic.conf",BasicConf,(err)=>{
                    console.log(err|| "写入单机配置")
                })
            }else {
                let regF = new RegExp("\n  port: 27017","g")
                BasicConf = BasicConf.replace(regF,"\n  port: "+JsonConf.binds[binds.length].Port)
                let regG = new RegExp("\n  bindIp: 127.0.0.1","g")
                BasicConf = BasicConf.replace(regG,"\n  bindIp: "+JsonConf.binds[binds.length].IP)
                fs.writeFileRecursive("./newConf/MongoDB/Master.conf",BasicConf,(err)=>{
                    console.log(err|| "写入MongoDB主节点配置")
                })
            }
        })
    })
}
MongoDB.resultConf()