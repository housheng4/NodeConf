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

        fs.readFile(path.join(__dirname,"../lastConf/redis.conf"), (err, data) => {

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

                // console.log(RKLi)

                BasicConf = BasicConf.replace(reg, "\n" + BasicKeyList[i] + " " + JsonConf.Basic[RKLi])

            }

            let regA = new RegExp("\nbind", "g");

            BasicConf = BasicConf.replace(regA, "\nbind " + JsonConf.Basic.IP)


            // 判断是否是集群
            if (keyList.indexOf('Cluster') != -1) {

                ClusterConf = BasicConf

                let regA = new RegExp("\n# cluster-enabled", "g");

                ClusterConf = ClusterConf.replace(regA, "\ncluster-enabled " + JsonConf.Cluster.cluster_enabled)

                let regB = new RegExp("\n# cluster-config-file", "g");

                ClusterConf = ClusterConf.replace(regB, "\ncluster-config-file " + JsonConf.Cluster.cluster_config_file)

                let regC = new RegExp("\n# cluster-node-timeout", "g");

                ClusterConf = ClusterConf.replace(regC, "\ncluster-node-timeout " + JsonConf.Cluster.cluster_node_timeout)

                let regD = new RegExp("\n# cluster-slave-validity-factor", "g");

                ClusterConf = ClusterConf.replace(regD, "\ncluster-slave-validity-factor " + JsonConf.Cluster.cluster_slave_validity_factor)

                let regE = new RegExp("\n# cluster-migration-barrier", "g");

                ClusterConf = ClusterConf.replace(regE, "\ncluster-migration-barrier " + JsonConf.Cluster.cluster_migration_barrier)

                let regF = new RegExp("\n# cluster-require-full-coverage", "g");

                ClusterConf = ClusterConf.replace(regF, "\ncluster-require-full-coverage " + JsonConf.Cluster.cluster_require_full_coverage)

                writeFileRecursive("./newConf/Redis/cluster.conf", ClusterConf, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log("写入Cluster配置")
                })
            } else {
                writeFileRecursive("./newConf/Redis/Basic.conf", BasicConf, (err) => {
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

            fs.readFile("./lastConf/sentinel.conf", (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                // console.log(111)
                let sentinelConf = data.toString()

                let RdundancyKeyList = []

                for (const key in JsonConf.Rdundancy) {
                    RdundancyKeyList.push(key)
                }

                for (let i = 0; i < RdundancyKeyList.length; i++) {

                    let RKLi = RdundancyKeyList[i]

                    let reg = new RegExp("\n" + RKLi, "g");

                    console.log(RKLi)
                    // let regA = new RegExp("\nsentinel "+ RKLi,"g")

                    sentinelConf = sentinelConf.replace(reg, "\n" + RdundancyKeyList[i] + " " + JsonConf.Rdundancy[RKLi])
                }

                let regA = new RegExp("\nsentinel monitor", "g");
                sentinelConf = sentinelConf.replace(regA, "\nsentinel monitor " + JsonConf.Rdundancy.master_appname + " " + JsonConf.Rdundancy.is_master + " " + JsonConf.Rdundancy.slaver_num);

                let regB = new RegExp("\nsentinel down-after-milliseconds", "g");
                sentinelConf = sentinelConf.replace(regB, "\nsentinel down-after-milliseconds " + JsonConf.Rdundancy.down_after_milliseconds)

                let regC = new RegExp("\nsentinel parallel-syncs", "g");
                sentinelConf = sentinelConf.replace(regC, "\nsentinel parallel-syncs " + JsonConf.Rdundancy.parallel_syncs)

                let regD = new RegExp("\nsentinel failover-timeout", "g");
                sentinelConf = sentinelConf.replace(regD, "\nsentinel failover-timeout " + JsonConf.Rdundancy.failover_timeout)

                writeFileRecursive("./newConf/Redis/sentinel.conf", sentinelConf, (err) => {
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