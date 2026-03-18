docker exec -it mininet_network bash

   
    # 建立拓樸並連向 Ryu 控制器
   mn --controller=remote,ip=ryu,port=6633 --topo=tree,depth=5,fanout=5