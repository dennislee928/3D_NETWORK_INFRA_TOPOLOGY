# Build stage
FROM rust:1.82-slim AS builder

WORKDIR /app
COPY . .
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from:builder /app/target/release/backend /app/sdn-adapter

EXPOSE 4000
CMD ["./sdn-adapter"]
