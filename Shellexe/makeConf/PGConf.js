
var PGConf = {};
var fs = require('fs')
var path = require('path')
var writeFileRecursive = require('../common.js')
PGConf.resultConf = function () {
    fs.readFile(path.join(__dirname, "../Json/dbConfigPG.json"), (err, data) => {
        if (err) {
            console.log("1A1", err)
            return
        }
        // 解析JSON文件
        let JsonConf = JSON.parse(data)
        // 解析的JSON文件JsonConf对象中的key组成数组,用于判断有无哨兵或者集群字段
        let keyList = [];

        for (const key in JsonConf) {
            keyList.push(key)
        }

        fs.readFile(path.join(__dirname, "../lastConf/postgresql.conf"), (err, data) => {

            if (err) {
                console.log(err)
                return
            }

            let BasicConf = data.toString()

            let BasicKeyList = []

            for (const key in JsonConf.Basic) {
                BasicKeyList.push(key)
            }

            for (let i = 0; i < BasicKeyList.length; i++) {
                let RKLi = BasicKeyList[i]

                let reg = new RegExp("\n" + RKLi, "g")

                console.log(RKLi)

                BasicConf = BasicConf.replace(reg, "\n" + BasicKeyList[i] + " = " + JsonConf.Basic[RKLi])

            }


            // 判断是否是主备
            if (keyList.indexOf('Rdundancy') != -1) {

                fs.readFile("./lastConf/postgresql.conf", (err, data) => {
                    if (err) {
                        console.log(err)
                        return
                    }

                    let RdundancyKeyList = []

                    for (const key in JsonConf.Rdundancy) {
                        RdundancyKeyList.push(key)
                    }

                    for (let i = 0; i < RdundancyKeyList.length; i++) {

                        let RKLi = RdundancyKeyList[i]

                        let reg = new RegExp("\n#" + RKLi, "g");

                        // console.log(RKLi)
                        // let regA = new RegExp("\nsentinel "+ RKLi,"g")

                        BasicConf = BasicConf.replace(reg, "\n" + RdundancyKeyList[i] + " = " + JsonConf.Rdundancy[RKLi])
                    }

                    writeFileRecursive("./newConf/PostgreSQL/PGsentinel.conf", BasicConf, (err) => {
                        if (err) {
                            console.log(err)
                            return
                        }
                        console.log("写入哨兵文件")
                    })

                    fs.readFile(path.join(__dirname, "../lastConf/recovery.conf.sample"), (err, data) => {
                        console.log(111)
                        if (err) {
                            console.log(err)
                            return
                        }
                        let recoveryConf = data.toString()

                        let regA = new RegExp("\n#primary_conninfo", "g")
                        recoveryConf = recoveryConf.replace(regA, "\n" + "primary_conninfo = " + JsonConf.Rdundancy.primary_conninfo)
                        let regB = new RegExp("\n#recovery_target_timeline", "g")
                        recoveryConf = recoveryConf.replace(regB, "\n" + "recovery_target_timeline = " + JsonConf.Rdundancy.recovery_target_timeline)

                        writeFileRecursive("./newConf/PostgreSQL/recover.conf.sample", recoveryConf, (err) => {
                            console.log("recovery写入成功" || err)
                        })

                    })



                })
            }
            else {
                writeFileRecursive("./newConf/PostgreSQL/Basic.conf", BasicConf, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log("写入PG-Basic配置")
                })
            }




        })



    })
}

module.exports = PGConf;