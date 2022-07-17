FROM node:16-slim

WORKDIR /app
COPY *.json /app/
COPY src/*.ts /app/src/
RUN npm ci --no-audit \
  && npm run build

FROM gcr.io/distroless/nodejs:16
COPY --from=0 --chown=nonroot:nonroot /app/ /app
WORKDIR /app/dist
USER nonroot
ENV NODE_ENV=production

CMD ["index.js"]