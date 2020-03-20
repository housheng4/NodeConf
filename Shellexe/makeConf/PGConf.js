
var PGConf = {};
var fs = require('fs')
var path = require('path')
var writeFileRecursive = require('../common.js')
PGConf.resultConf = function () {
    fs.readFile(path.join(__dirname, "../Json/dbConfigPG.json"), (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        // 解析JSON文件
        let JsonConf = JSON.parse(data)
        // 解析的JSON文件JsonConf对象中的key组成数组,用于判断有无哨兵或者集群字段
        let keyList = [];

        for (const key in JsonConf) {
            keyList.push(key)
        }

        fs.readFile(path.join(__dirname, "../ConfAll/PG/postgresql.conf"), (err, data) => {

            if (err) {
                console.log(err)
                return
            }

            let BasicConf = data.toString()

            let BasicKeyList = []

            for (const key in JsonConf.Basic) {
                BasicKeyList.push(key)
            }

            /* for (let i = 0; i < BasicKeyList.length; i++) {
                let RKLi = BasicKeyList[i]

                let reg = new RegExp("\n" + RKLi, "g")

                console.log(RKLi)

                BasicConf = BasicConf.replace(reg, "\n" + BasicKeyList[i] + " = " + JsonConf.Basic[RKLi])

            } */

            let reg1 = new RegExp("\ndata_directory = '/var/lib/postgresql/10/main'", "g")
            BasicConf = BasicConf.replace(reg1, "\ndata_directory" + JsonConf.Basic.data_directory)

            let reg2 = new RegExp("\nhba_file = '/etc/postgresql/10/main/pg_hba.conf'", "g")
            BasicConf = BasicConf.replace(reg2, "\nhba_file = " + JsonConf.Basic.hba_file)

            let reg3 = new RegExp("\nport = 5432", "g")
            BasicConf = BasicConf.replace(reg3, "\nport = " + JsonConf.Basic.port)

            let reg4 = new RegExp("\nmax_connections = 100", "g")
            BasicConf = BasicConf.replace(reg4, "\nmax_connections = " + JsonConf.Basic.max_connections)

            let reg5 = new RegExp("\nshared_buffers = 128MB", "g")
            BasicConf = BasicConf.replace(reg5, "\nshared_buffers = " + JsonConf.Basic.shared_buffers)

            let reg6 = new RegExp("\n#temp_buffers = 8MB", "g")
            BasicConf = BasicConf.replace(reg6, "\ntemp_buffers = " + JsonConf.Basic.temp_buffers)

            let reg7 = new RegExp("\n#work_mem = 4MB", "g")
            BasicConf = BasicConf.replace(reg7, "\nwork_mem = " + JsonConf.Basic.work_mem)


            // 判断是否是主备
            if (keyList.indexOf('Rdundancy') != -1) {


                let RdundancyKeyList = []

                for (const key in JsonConf.Rdundancy) {
                    RdundancyKeyList.push(key)
                }

                let regA = new RegExp("\n#wal_level = replica", "g")
                BasicConf = BasicConf.replace(regA, "wal_level = " + JsonConf.Rdundancy.wal_level)

                let regB = new RegExp("\n#max_wal_senders = 10", "g")
                BasicConf = BasicConf.replace(regB, "max_wal_senders = " + JsonConf.Rdundancy.max_wal_senders)

                let regC = new RegExp("\n#wal_keep_segments = 0", "g")
                BasicConf = BasicConf.replace(regC, "wal_keep_segments = " + JsonConf.Rdundancy.wal_keep_segments)

                let regD = new RegExp("\n#wal_sender_timeout = 60s", "g")
                BasicConf = BasicConf.replace(regD, "wal_sender_timeout = " + JsonConf.Rdundancy.wal_sender_timeout)

                let regE = new RegExp("\n#hot_standby = on", "g")
                BasicConf = BasicConf.replace(regE, "hot_standby = " + JsonConf.Rdundancy.hot_standby)

                let regF = new RegExp("\n#max_standby_streaming_delay = 30s", "g")
                BasicConf = BasicConf.replace(regF, "max_standby_streaming_delay = " + JsonConf.Rdundancy.max_standby_streaming_delay)

                let regG = new RegExp("\n#wal_receiver_status_interval = 10s", "g")
                BasicConf = BasicConf.replace(regG, "wal_receiver_status_interval = " + JsonConf.Rdundancy.wal_receiver_status_interval)

                let regH = new RegExp("\n#hot_standby_feedback = off", "g")
                BasicConf = BasicConf.replace(regH, "hot_standby_feedback = " + JsonConf.Rdundancy.hot_standby_feedback)

                /* for (let i = 0; i < RdundancyKeyList.length; i++) {

                    let RKLi = RdundancyKeyList[i]

                    let reg = new RegExp("\n#" + RKLi, "g");

                    // console.log(RKLi)
                    // let regA = new RegExp("\nsentinel "+ RKLi,"g")

                    BasicConf = BasicConf.replace(reg, "\n" + RdundancyKeyList[i] + " = " + JsonConf.Rdundancy[RKLi])
                } */

                writeFileRecursive("../newConf/PostgreSQL/PGsentinel.conf", BasicConf, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log("写入主备文件")
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

                    writeFileRecursive("../newConf/PostgreSQL/recover.conf.sample", recoveryConf, (err) => {
                        console.log("recovery写入成功" || err)
                    })

                })




            }
            else {
                writeFileRecursive("../newConf/PostgreSQL/Basic.conf", BasicConf, (err) => {
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