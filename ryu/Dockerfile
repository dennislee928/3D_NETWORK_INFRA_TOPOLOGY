FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

COPY patch_ryu.py /tmp/patch_ryu.py
COPY ../scripts/test.sh /usr/local/bin/test.sh
RUN chmod +x /usr/local/bin/test.sh

RUN python -m pip install --no-cache-dir "setuptools<68" wheel && \
    python -m pip install --no-cache-dir "ryu==4.34" && \
    python /tmp/patch_ryu.py && \
    rm /tmp/patch_ryu.py

EXPOSE 8080 6633

CMD ["ryu-manager", "--observe-links", "ryu.app.rest_topology", "ryu.app.ofctl_rest", "ryu.app.simple_switch_13"]
# (Optional) This RUN step will execute the test.sh script copied into the image.

# Copy the test script into the container image.

# To execute the test script at build time (uncomment the next line if you want to run at build, or run manually at runtime)
 RUN /usr/local/bin/test.sh

# If you want to run the test script every time the container starts (override CMD):
# CMD ["/usr/local/bin/test.sh"]

# Note: The original CMD to start Ryu is preserved above.
# If you want Ryu to start, keep the original CMD line at the end.
# If you want to start the test script, comment out the ryu-manager CMD and uncomment the alternate CMD above.

