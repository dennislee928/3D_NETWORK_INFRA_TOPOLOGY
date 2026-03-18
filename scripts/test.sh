docker exec -it mininet_network bash

mn --controller=remote,ip=opendaylight,port=6633 --topo=single,25

mininet> pingall