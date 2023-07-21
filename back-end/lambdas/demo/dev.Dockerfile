FROM public.ecr.aws/lambda/nodejs:18 as base-node

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en

RUN yum upgrade -y && yum clean all && rm -rf /var/cache/yum

FROM base-node as build-node

ADD ./docker-index.js ./

CMD ["docker-index.handler"]
