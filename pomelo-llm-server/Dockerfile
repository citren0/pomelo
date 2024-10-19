FROM nvidia/cuda:12.6.2-devel-ubuntu22.04

RUN useradd -m server

RUN apt -y update
RUN apt -y upgrade
RUN apt -y install python3 python3-pip

WORKDIR /home/server

USER server

COPY requirements.txt .

RUN python3 -m pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python3", "./server.py" ]