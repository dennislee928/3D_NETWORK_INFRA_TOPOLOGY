FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN python -m pip install --no-cache-dir "setuptools<68" wheel && \
    python -m pip install --no-cache-dir "ryu==4.34"

EXPOSE 8080 6633

CMD ["ryu-manager", "--observe-links", "ryu.app.rest_topology", "ryu.app.ofctl_rest", "ryu.app.simple_switch_13"]
