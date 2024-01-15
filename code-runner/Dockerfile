FROM coderunner-base:v1.0.0

WORKDIR /app

COPY . .
RUN npm install
RUN echo "WORKING_DIR=/home/playground/workspace" >> .env

RUN useradd -ms /bin/bash playground
USER playground
RUN mkdir /home/playground/workspace

WORKDIR /app

CMD ["/bin/bash"]
ENTRYPOINT ["/usr/bin/npm", "run", "start"]