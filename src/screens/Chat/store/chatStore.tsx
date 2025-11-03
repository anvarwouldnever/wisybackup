import { makeAutoObservable, runInAction } from "mobx";

class Store { 
    messages = [];
    playinVoiceMessageId = null;

    constructor() {
        makeAutoObservable(this); 
    }

    async setMessages(messages) {
        runInAction(() => {
            this.messages = messages
        })
    }
    
    async setMessage(message: any) {
        runInAction(() => {
            if (message.type == 'text' && message.author === 'MyWisy') {
                this.messages = [
                    { type: message.type, text: message.text, author: message.author },
                    ...this.messages.slice(1),
                ];
            } else {
                this.messages = [{ type: message.type, text: message.text, author: message.author }, ...this.messages]
            }
        })
    }

    async setPlayingVoiceMessageId(id: any) {
        runInAction(() => {
            this.playinVoiceMessageId = id;
        });
    }

    async stopAllPlayingVoiceMessages() {
        runInAction(() => {
            this.playinVoiceMessageId = null;
        });
    }
}

export const chatStore = new Store();