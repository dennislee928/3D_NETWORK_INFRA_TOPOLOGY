FROM ubuntu:22.04

# 防止互動式提示
ENV DEBIAN_FRONTEND=noninteractive

# 安裝 Mininet 與相關工具
RUN apt-get update && apt-get install -y \
    mininet \
    net-tools \
    iputils-ping \
    iproute2 \
    curl \
    openvswitch-switch \
    && rm -rf /var/lib/apt/lists/*

COPY start-mininet.sh /usr/local/bin/start-mininet.sh

RUN chmod +x /usr/local/bin/start-mininet.sh

ENTRYPOINT ["/usr/local/bin/start-mininet.sh"]

# 啟動時預設進入 bash
CMD ["bash"]
