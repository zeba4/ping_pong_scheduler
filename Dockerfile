FROM artifactory.cobalt.com/node6:6.9.1
USER root
WORKDIR /projects/ping-ping-scheduler
COPY  . /projects/ping-ping-scheduler
EXPOSE 8080
RUN chmod -R 777 /projects/ping-ping-scheduler && \
    npm install
ENTRYPOINT ["npm","start"]