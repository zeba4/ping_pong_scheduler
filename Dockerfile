FROM artifactory.cobalt.com/node6:6.9.1
WORKDIR /Users/kumarn/Documents/Projects/ping-ping-scheduler
COPY  . /Users/kumarn/Documents/Projects/ping-ping-scheduler
EXPOSE 8080
RUN  chmod -R 777 /Users/kumarn/Documents/Projects/ping-ping-scheduler && \
     --allow-root && npm install
ENTRYPOINT ["npm","start"]