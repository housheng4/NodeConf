var Docker = require('dockerode')
var PGContainer = {}
var docker = new Docker({ host: '127.0.0.1', port: 3000 })
PGContainer.PGContainer = function (port, tcpPort) {
    docker.createContainer({
        Image: '',//镜像名字
        Cmd: [],//命令
        name: '',//容器名字
        ExposedPorts: {
            [tcpPort]: {}
        },
        HostConfig: {
            Binds: [],
/*             PortBindings: {
                [tcpPort]: [
                    { "HostPort": port }
                ]
            } */
        }
    },function (err,container) {
        container.start(function (err,data) {
            console.log(err||data)
        })
    })

}

// RdisContainer("8800","80/TCP");
module.exports = PGContainer;