FROM denoland/deno:latest
WORKDIR /app
COPY . .

CMD ["deno", "task", "start"]
HEALTHCHECK --interval=120s --timeout=1s --start-period=10s \
  CMD curl -f http://localhost:9999/healthz || exit 1
