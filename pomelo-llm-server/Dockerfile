FROM nvidia/cuda:12.6.2-cudnn-devel-ubuntu22.04

SHELL ["/bin/bash", "-c"]

RUN useradd -ms /bin/bash server

RUN apt -y update
RUN apt -y upgrade
RUN apt -y install python3 python3-pip python3-venv

WORKDIR /home/server

USER server

COPY requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python3", "./server.py" ]