docker exec -it mininet_network bash

# 建立拓樸並連向 Ryu 控制器
mn --controller=remote,ip=ryu,port=6633 --topo=tree,depth=5,fanout=5

# 進入 Mininet CLI
mininet> pingall

# 查看 Mininet 拓樸
mininet> ovs-ofctl show

# 查看 Ryu 拓樸
curl http://localhost:8080/v1.0/topology/links

# 查看 Ryu 拓樸
curl http://localhost:8080/v1.0/topology/nodes

