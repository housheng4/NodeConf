{
## Node Max Clients Size.
## @@最大客户端数，没有效果
## Value: String
<!-- node.max_clients = 1024000 -->

## Value: Number [1024-134217727]
##  @@erlang的进程数,如果超过指定，程序将直接奔溃
## vm.args: +P Number
node.process_limit = 2048000

## Value: Number [1024-134217727]
## @@网络文件句柄数，=接入的客户端数量+集群的TCP连接数量+其他的网络文件句柄
## vm.args: +Q Number
node.max_ports = 1024000

## @@集群的TCP通信协议,如果修改为inet6_tcp,node.name必须按照IPV6格式修改，否则无法正常停止
## @@配置inet_tls将采用IPV4地址，不过感觉意义不大，这是集群内部通信
## vm.args: -proto_dist inet_tcp
node.proto_dist = inet_tcp

## @@erlang的进程通信的消息数量阀值，超过将强制关闭进程，根据现场状况而已，预计默认值已经足够使用
## Default:
##   - 8000|800MB on ARCH_64 system
##   - 1000|100MB on ARCH_32 sytem
zone.external.force_shutdown_policy = 100000|800MB

## Maximum size of the Inflight Window storing QoS1/2 messages delivered but unacked.
## @@飞行窗口数,指Broker分发消息的并发数,数值越大，并发量越大
## Value: Number
zone.external.max_inflight = 1024

## Maximum QoS2 packets (Client -> Broker) awaiting PUBREL, 0 means no limit.
## @@Broker中等待Qos2消息的PUBREL报文的最大排队数量
## Value: Number
zone.external.max_awaiting_rel = 102400

## @@消息队列长度，待发消息超过阀值，conn将会被关闭
## Value: Number >= 0
zone.external.max_mqueue_len = 102400

## @@Qos0级别消息是否存储到队列，false可以提高q0的传输效率
## Value: false | true
zone.external.mqueue_store_qos0 = false

## @@最大客户端连接数
## Value: Number
listener.tcp.external.max_connections = 1024000

## @@conn增速,如果太小，无法支撑短时间内的大量接入，出现接入超时
## Value: Number
listener.tcp.external.max_conn_rate = 1024

## @@tcp半开连接等待队列，配置太小,无法支撑短时间内的大量接入，出现接入超时
## Value: Number >= 0
listener.tcp.external.backlog = 1024

## @@tcp数据包接收后，直接发送，不等待缓冲区满的在发送，提高消息的及时性
## Value: true | false
listener.tcp.external.nodelay = true
}


{
    "Node":{
        "node.max_clients": 1024000,
        "node.process_limit":2048000,
        "node.max_ports":1024000,
        "node.proto_dist":"inet_tcp"
    },
    "Zones":{
        "zone.external.force_shutdown_policy": "100000|800M",
        "zone.external.max_inflight":1024,
        "zone.external.max_awaiting_rel":102400,
        "zone.external.max_mqueue_len":102400,
        "zone.external.mqueue_store_qos0":false
    },
    "Listeners":{
        "listener.tcp.external.max_conn_rate": 1024,
        "listener.tcp.external.nodelay":true
    }
}