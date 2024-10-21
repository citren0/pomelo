from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from flask import Flask, Response, request
import os
import jwt
import requests
import re
import sys
import time

app = Flask(__name__)

model_id = "meta-llama/Meta-Llama-3-8B-Instruct"

guard_tokenizer = AutoTokenizer.from_pretrained("ProtectAI/deberta-v3-base-prompt-injection-v2")
guard_model = AutoModelForSequenceClassification.from_pretrained("ProtectAI/deberta-v3-base-prompt-injection-v2")

classifier = pipeline(
    "text-classification",
    model=guard_model,
    tokenizer=guard_tokenizer,
    truncation=True,
    max_length=512,
    token=os.environ.get("HUGGING_FACE_TOKEN"),
    device="cpu"
)

pipe = pipeline(
    "text-generation",
    model=model_id,
    model_kwargs=
    {
        "torch_dtype": torch.float16,
        "quantization_config": { "load_in_4bit": True },
        "low_cpu_mem_usage": True,
    },
    token=os.environ.get("HUGGING_FACE_TOKEN"),
    device="cpu",
)



def generate(text):
    messages = [
        {"role": "system", "content": "You are a friendly chatbot."},
        {"role": "user", "content": text},
    ]

    terminators = [
        pipe.tokenizer.eos_token_id,
        pipe.tokenizer.convert_tokens_to_ids("<|eot_id|>")
    ]

    outputs = pipe(
        messages,
        max_new_tokens=256,
        eos_token_id=terminators,
        do_sample=True,
        temperature=0.6,
        top_p=0.9,
    )

    summary = outputs[0]["generated_text"][-1]["content"]
    return summary


def filter_special_chars(text):
    return re.sub('[^A-Za-z0-9 .,?!\\/]+', '', text)


def check_text(text):
    classification = classifier(text)

    highest_prob = max(classification, key = lambda x: x["score"])

    if highest_prob["label"] == "SAFE":
        return True
    else:
        return False


@app.route("/llm", methods=["POST"])
def llm():
    # try:
        # header = request.headers["Authorization"].split(" ")

        # if header[0] != "Bearer":
        #     return Response("Unauthorized.", status=401, mimetype="text/plain")

        # token = header[1]

        # payload = jwt.decode(token, os.environ.get("JWT_SECRET"), algorithms=["HS256"])

        # if "server" not in payload or payload["server"] != True:
        #     return Response("Unauthorized.", status=401, mimetype="text/plain")

    # except Exception:
    #     return Response("Unauthorized.", status=401, mimetype="text/plain")


    content_type = request.headers.get("Content-Type")
    if (content_type == "application/json"):
        json = request.json
        if "text" not in json:
            return Response("Required field missing.", status=400, mimetype="text/plain")
        else:
            no_special_chars = filter_special_chars(json["text"])

            if check_text(no_special_chars) == False:
                return Response("Prompt injection detected.", status=422, mimetype="text/plain")
            
            return Response(generate(no_special_chars), status=200, mimetype="text/plain")
    else:
        return Response("Content type not supported.", status=400, mimetype="text/plain")


@app.errorhandler(404) 
def not_found(e): 
  return Response("Page not found.")



if __name__ == "__main__":
    if os.environ.get("DEV") == "true":
        app.run(host="0.0.0.0", port=3000, debug=True)
    # else:
    #     from waitress import serve
    #     serve(app, host="0.0.0.0", port=3000)
    
    print("Server started.")

    # while True:
    #     time.sleep(1)