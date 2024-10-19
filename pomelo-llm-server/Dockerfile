FROM nvidia/cuda:12.6.2-cudnn-devel-ubuntu22.04

WORKDIR /home/server

COPY requirements.txt .

RUN apt -y update
RUN apt -y upgrade
RUN apt -y install python3 python3-pip

RUN useradd -ms /bin/bash server

RUN mkdir /home/server

RUN chown server:server /home/server

USER server

RUN python3 -m venv env

RUN source env/bin/activate

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python3", "./server.py" ]