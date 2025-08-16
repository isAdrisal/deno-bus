FROM denoland/deno:latest
WORKDIR /app
COPY . .

CMD ["deno", "task", "start"]
HEALTHCHECK --interval=30s --timeout=1s --start-period=10s \
  CMD deno eval "try { await fetch('http://localhost:9999/healthz'); } catch { Deno.exit(1); }"
