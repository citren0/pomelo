FROM nvidia/cuda:12.6.2-devel-ubuntu22.04

RUN useradd -ms /bin/bash server

RUN apt -y update
RUN apt -y upgrade
RUN apt -y install python3 python3-pip python3-venv

WORKDIR /home/server

USER server

COPY requirements.txt .

RUN python3 -m pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python3", "./server.py" ]