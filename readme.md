# Old-man - a speech to text service for converting whatsapp voice messages to text

![Logo](ico/logo.png?raw=true "App logo")

### **Important notice**

This is just a proof of concept. Deployment instrunctions should be carefully followed if you want to deploy your own copy of the app. Accordingly change environment variables. Currenly only English is supported.

# Usage

Just send a voice message like this to the number (explained how to get one) and you'll get a transcript of your voice message
![img3](ico/img3.png?raw=true "img3")

# Run

**Note:** The server must have a gpu with sufficient VRAM available. Clone Open AI's Whisper (see https://github.com/openai/whisper) on the server
![img4](ico/open-ai.png?raw=true "img4")

```console
pip install git+https://github.com/openai/whisper.git
```

### **MacOS**

using Homebrew (https://brew.sh/)

```console
foo@bar:~/old-man$ brew install ffmpeg
```

### **Ubuntu or Debian**

```console
foo@bar:~/old-man$ sudo apt update && sudo apt install ffmpeg
```

```console
foo@bar:~/$ git clone https://github.com/grussdorian/old-man
foo@bar:~/$ cd old-man
foo@bar:~/old-man$ npm init
```

Install ngrok and twilio cli from respective package manager

### **MacOS**

```console
foo@bar:~/old-man$ brew tap twilio/brew && brew install twilio
foo@bar:~/old-man$ twilio login
foo@bar:~/old-man$ brew install ngrok
```

### **Debian / apt repo / snap package (ngrok not available as snap package)**

```console
foo@bar:~/old-man$ sudo apt install twilio
foo@bar:~/old-man$ twilio login
foo@bar:~/old-man$ sudo snap install ngrok
```

**Build**
(Typescript support to be added later)

```console
foo@bar:~/old-man$ npm run build
```

**Register for Twilio account** https://www.twilio.com/try-twilio

Create a .env file

```console
foo@bar:~/old-man$ touch .env
```

```console
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="twilio_auth_token"
PORT=port_number
NUMBER='whatsapp:+country_code_number'
```

### Run ngrok and forward the port where the server is running

```console
foo@bar:~/old-man$ ngrok http 8085
```

Gives

```console
POST /message                  200 OK
ngrok                                                                                   (Ctrl+C to quit)

Join us in the ngrok community @ https://ngrok.com/slack

Session Status                online
Account                       your_email (Plan: Free)
Version                       3.1.0
Region                        country
Latency                       26ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://temp-url-ngrok.io -> http://localhost:8085

Connections                   ttl     opn     rt1     rt5     p50     p90
                              10      0       0.00    0.00    5.04    5.05
```

## ngrok is used to port forward our local server as it has a gpu

**Keep in mind that the validity of port forwarding is only 3 hours**

Copy the forwaded url and paste it in twilio's console
![img1](ico/img1.png?raw=true "img1")

Send the specified message to the number shown
![img2](ico/img2.png?raw=true "img2")

## Further Development

1. Text summarisation using Open AI's GPT 3 or some open source semantic analyzer
2. Transfer learning for different Indo Aryan languages for better accuracy.
3. Implementing a stt, translation, semantic analysis, tts pipeline for interactive voice assistance
4. Deploy the app to a real whatsapp number
