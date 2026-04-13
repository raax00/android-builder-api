FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Basic tools
RUN apt update && apt install -y \
    openjdk-17-jdk \
    wget unzip git curl \
    nodejs npm \
    gradle

# Android SDK Setup
RUN mkdir -p /android-sdk/cmdline-tools
WORKDIR /android-sdk

RUN wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O sdk.zip \
    && unzip sdk.zip -d cmdline-tools \
    && mv cmdline-tools/cmdline-tools cmdline-tools/latest

ENV ANDROID_HOME=/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Accept licenses + install tools
RUN yes | sdkmanager --licenses

RUN sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# App folder
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]