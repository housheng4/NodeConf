var RedisConf = {};
var fs = require('fs')
var path = require('path')
var writeFileRecursive = require('../common.js')

RedisConf.resultConf = () => {
    fs.readFile(path.join(__dirname,"../Json/dbconfig.json"), (err, data) => {
        if (err) {
            console.log("读取json文件错误",err)
            return
        }
        // 解析JSON文件
        let JsonConf = JSON.parse(data)
        // 解析的JSON文件JsonConf对象中的key组成数组,用于判断有无哨兵或者集群字段
        let keyList = [];

        for (const key in JsonConf) {
            keyList.push(key)
        }

        fs.readFile(path.join(__dirname,"../ConfAll/redis/redis.conf"), (err, data) => {

            if (err) {
                console.log(err)
                return
            }
            let BasicKeyList = []

            for (const key in JsonConf.Basic) {
                BasicKeyList.push(key)
            }

            let BasicConf = data.toString()

            let reg1 = new RegExp("\nbind 127.0.0.1 ::1","g")
            BasicConf = BasicConf.replace(reg1,"\nbind "+JsonConf.Basic.ip)

            let reg2 = new RegExp("\nport 6379","g")
            BasicConf = BasicConf.replace(reg2,"\nport "+JsonConf.Basic.port)

            let reg3 = new RegExp("\ntimeout 0","g")
            BasicConf = BasicConf.replace(reg3,"\ntimeout "+JsonConf.Basic.timeout)

            let reg4 = new RegExp("\ndatabases 16","g")
            BasicConf = BasicConf.replace(reg4,"\ndatabases "+JsonConf.Basic.databases)

            // save字段需要提供数组格式？
            let reg5 = new RegExp("\nsave 900 1\nsave 300 10\nsave 60 10000","g")
            BasicConf = BasicConf.replace(reg5,"\nsave "+JsonConf.Basic.save)

            let reg6 = new RegExp("\ndir /var/lib/redis","g")
            BasicConf = BasicConf.replace(reg6,"\ndir "+JsonConf.Basic.dir)

            let reg7 = new RegExp("\n# maxclients 10000","g")
            BasicConf = BasicConf.replace(reg7,"\nmaxclients "+JsonConf.Basic.maxclients)

            let reg8 = new RegExp("\n# maxmemory <bytes>","g")
            BasicConf = BasicConf.replace(reg8,"\nmaxmemory "+JsonConf.Basic.maxmemory)

            let reg9 = new RegExp("\nappendonly no","g")
            BasicConf = BasicConf.replace(reg9,"\nappendonly "+JsonConf.Basic.appendonly)

            let reg10 = new RegExp("\nappendfsync everysec","g")
            BasicConf = BasicConf.replace(reg10,"\bappendfsync "+JsonConf.Basic.appendfsync)


            
            // for (let i = 0; i < BasicKeyList.length; i++) {
            //     let RKLi = BasicKeyList[i]

            //     let reg = new RegExp("\n" + RKLi, "g")

            //     // console.log(RKLi)

            //     BasicConf = BasicConf.replace(reg, "\n" + BasicKeyList[i] + " " + JsonConf.Basic[RKLi])

            // }

            // let regA = new RegExp("\nbind", "g");

            // BasicConf = BasicConf.replace(regA, "\nbind " + JsonConf.Basic.IP)


            // 判断是否是集群
            if (keyList.indexOf('Cluster') != -1) {

                ClusterConf = BasicConf

                let regA = new RegExp("\n# cluster-enabled yes", "g");

                ClusterConf = ClusterConf.replace(regA, "\ncluster-enabled " + JsonConf.Cluster.cluster_enabled)

                let regB = new RegExp("\n# cluster-config-file nodes-6379.conf", "g");

                ClusterConf = ClusterConf.replace(regB, "\ncluster-config-file " + JsonConf.Cluster.cluster_config_file)

                let regC = new RegExp("\n# cluster-node-timeout 15000", "g");

                ClusterConf = ClusterConf.replace(regC, "\ncluster-node-timeout " + JsonConf.Cluster.cluster_node_timeout)

                let regD = new RegExp("\n# cluster-slave-validity-factor 10", "g");

                ClusterConf = ClusterConf.replace(regD, "\ncluster-slave-validity-factor " + JsonConf.Cluster.cluster_slave_validity_factor)

                let regE = new RegExp("\n# cluster-migration-barrier 1", "g");

                ClusterConf = ClusterConf.replace(regE, "\ncluster-migration-barrier " + JsonConf.Cluster.cluster_migration_barrier)

                let regF = new RegExp("\n# cluster-require-full-coverage yes", "g");

                ClusterConf = ClusterConf.replace(regF, "\ncluster-require-full-coverage " + JsonConf.Cluster.cluster_require_full_coverage)

                writeFileRecursive("../newConf/Redis/cluster.conf", ClusterConf, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log("写入Cluster配置")
                })
            } else {
                writeFileRecursive("../newConf/Redis/Basic.conf", BasicConf, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log("写入Basic配置")
                })
            }


        })

        // 判断是否是哨兵
        if (keyList.indexOf('Rdundancy') != -1) {

            fs.readFile("../ConfAll/redis/sentinel.conf", (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                let sentinelConf = data.toString()

         /*        let RdundancyKeyList = [] */

         /*        for (const key in JsonConf.Rdundancy) {
                    RdundancyKeyList.push(key)
                } */

                /* for (let i = 0; i < RdundancyKeyList.length; i++) {

                    let RKLi = RdundancyKeyList[i]

                    let reg = new RegExp("\n" + RKLi, "g");

                    console.log(RKLi)
                    // let regA = new RegExp("\nsentinel "+ RKLi,"g")

                    sentinelConf = sentinelConf.replace(reg, "\n" + RdundancyKeyList[i] + " " + JsonConf.Rdundancy[RKLi])
                } */

                let regA = new RegExp("\nsentinel monitor mymaster 10.1.24.132 6378 2", "g");
                sentinelConf = sentinelConf.replace(regA, "\nsentinel monitor " + JsonConf.Rdundancy.master_appname + " " + JsonConf.Rdundancy.is_master + " " + JsonConf.Rdundancy.slaver_num);

                let regB = new RegExp("\nsentinel down-after-milliseconds mymaster 1500", "g");
                sentinelConf = sentinelConf.replace(regB, "\nsentinel down-after-milliseconds "+JsonConf.Rdundancy.master_appname +" "+ JsonConf.Rdundancy.down_after_milliseconds)

                let regC = new RegExp("\n# sentinel parallel-syncs  <master-name> <numslaves>", "g");
                sentinelConf = sentinelConf.replace(regC, "\nsentinel parallel-syncs " + JsonConf.Rdundancy.master_appname +" "+ JsonConf.Rdundancy.parallel_syncs)

                let regD = new RegExp("\nsentinel failover-timeout mymaster 80000", "g");
                sentinelConf = sentinelConf.replace(regD, "\nsentinel failover-timeout " +JsonConf.Rdundancy.master_appname+ " " + JsonConf.Rdundancy.failover_timeout)

                let regE = new RegExp('\nlogfile "/var/log/redis/sentinel.log"',"g")
                sentinelConf = sentinelConf.replace(regE,"\nlogfile "+JsonConf.Rdundancy.logfile)

                let regF = new RegExp('\ndir "/tmp"',"g")
                sentinelConf = sentinelConf.replace(regF,"\ndir "+JsonConf.Rdundancy.dir)

                let regG = new RegExp("\nport 26379","g")
                sentinelConf = sentinelConf.replace(regG,"\nport "+JsonConf.Rdundancy.port)
                writeFileRecursive("../newConf/Redis/sentinel.conf", sentinelConf, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log("写入哨兵文件")
                })
            })
        }
    })
}

module.exports = RedisConf;