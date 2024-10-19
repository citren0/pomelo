from flask import Flask, request, jsonify
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline


class Llama3:
    def __init__(self, model_path):
        self.model_id = model_path
        self.pipeline = transformers.pipeline(
            "text-generation",
            model=self.model_id,
            model_kwargs={
                "torch_dtype": torch.float16,
                "quantization_config": {"load_in_4bit": True},
                "low_cpu_mem_usage": True,
            },
        )
        self.terminators = [
            self.pipeline.tokenizer.eos_token_id,
            self.pipeline.tokenizer.convert_tokens_to_ids(""),
        ]
  
  
    def get_response(self, query, message_history=[], max_tokens=4096, temperature=0.6, top_p=0.9):
        user_prompt = message_history + [{"role": "user", "content": query}]
        prompt = self.pipeline.tokenizer.apply_chat_template(
            user_prompt, tokenize=False, add_generation_prompt=True
        )
        outputs = self.pipeline(
            prompt,
            max_new_tokens=max_tokens,
            eos_token_id=self.terminators,
            do_sample=True,
            temperature=temperature,
            top_p=top_p,
        )
        response = outputs[0]["generated_text"][len(prompt):]
        return response, user_prompt + [{"role": "assistant", "content": response}]
    

    def chatbot(self, user_input, system_instructions=""):
        conversation = [{"role": "system", "content": system_instructions}]
        response, conversation = self.get_response(user_input, conversation)
        return respose



app = Flask("Llama server")
llama = Llama3("/home/server/.cache/Llama-3.1-8B-Instruct")

@app.route('/llama', methods=['POST'])
def generate_response():
    try:
        data = request.get_json()

        # Check if the required fields are present in the JSON data
        if 'prompt' in data and 'max_length' in data:
            prompt = data['prompt']
            max_length = int(data['max_length'])

            response = llama.chatbot(prompt, "You are a helpful chatbot.")

            return jsonify({ "response": response })

        else:
            return jsonify({ "error": "Missing required parameters" }), 400

    except Exception as e:
        return jsonify({ "Error": str(e) }), 500 


@app.errorhandler(404) 
def not_found(e): 
    return Response("Page not found.")


if __name__ == "__main__":
    if os.environ.get("DEV") == "true":
        app.run(host="0.0.0.0", port=3000, debug=True)
    else:
        from waitress import serve
        serve(app, host="0.0.0.0", port=3000)
    
    print("Server started.")



  

if __name__ == "__main__":
    bot.chatbot()