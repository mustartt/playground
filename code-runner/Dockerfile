FROM coderunner-base:v1.0.0

WORKDIR /app

COPY . .
RUN npm install
RUN echo "WORKING_DIR=/home/playground/workspace" >> .env

RUN useradd -ms /bin/bash playground
USER playground
#WORKDIR /home/playground
RUN mkdir /home/playground/workspace

CMD ["/bin/bash"]