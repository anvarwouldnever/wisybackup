import axios from "axios";
import store from "../store/store";

class Api {

    baseUrl = 'https://tapimywisy.hostweb.uz/api/v1/app';
    baseToken = '633|6R4jaeX3njTdJ7wHJhudU88Rkc2OvGGeIyFiVucS9bc848b4'

    async signUp(email: string, password: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/auth/register`, {
                email: email,
                password: password
            })
            if (response.data.is_success) {
                // console.log(response.data)
                return true
            }
        } catch (error) {
            console.log(error)
            return error?.response?.data?.message;
        }
    }

    async changePassword(email: string, token: string, password: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/auth/change-password`, {
                password: password
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.log(error?.response?.data)
        }
    }

    async resetPassword(email: string, token: string, password: string, password_confirmatior: string) {
        // console.log(email, token, password, password_confirmatior)
        try {
            const response = await axios.post(`${this.baseUrl}/auth/reset-password`, {
                email: email,
                token: token,
                password: password,
                password_confirmation: password_confirmatior
            })   
            console.log(response?.data)
            return response?.data 
        } catch (error) {
            console.log(error.response.data)
            return error?.response?.data?.message
        }
    }

    async signIn(email: string, password: string, lang: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/auth/login`, {
                email: email,
                password: password
            })
            if (response.data.token) {
                const token = response.data?.token
                const children = await this.getChildren(token, lang)
                return { token, children }
            }
            // console.log(response.data)
        } catch (error) {
            console.log(error?.response?.data?.message)
            return error?.response?.data?.message
        }
    }

    async addChild(name: string, avatar: string, birthday: string, gender: number, engagement_time: number, token: string, lang: string) {
        // console.log(name, avatar, birthday, gender, engagement_time)
        try {
            await axios.post(
                `${this.baseUrl}/children`,
                {
                    name: name,
                    avatar_id: avatar,
                    birthday: birthday,
                    gender: gender,
                    engagement_time: engagement_time,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-localization": `en`
                    },
                }
            );

            const children = await this.getChildren(token, lang)
            return children
            
        } catch (error) { 
            console.log(error, 'while adding children')
            console.log(error?.response?.data)
        }
    }

    async getAddChildUI(lang: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/sign-up-settings`, {
                headers: {
                    Authorization: `Bearer ${this.baseToken}`,
                    "X-localization": `${lang}`
                }
            })
            return response.data;
        } catch (error) {
            console.log(error?.response?.data)
        }
    }

    async getSlides(lang: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/onboardings`, {
                headers: {
                    Authorization: `Bearer ${this.baseToken}`,
                    "X-localization": `${lang}`
                }
            })
            return response.data.data;
        } catch (error) {
            console.log(error.response.data)
        }
    }

    async getChildren(token: string, lang: string) {
        // console.log(`children ${token}`)
        try {
            const response = await axios.get(`${this.baseUrl}/children`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-localization": `en`
                }
            })
            return response.data
        } catch (error) {
            console.log(error, 'getting children')
            console.log(error?.response?.data)   
        }
    }

    async getMarketCategories(token: string, lang: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/market/categories`, {
                headers: {
                    Authorization: `Bearer ${this.baseToken}`,
                    "X-localization": `${lang}`
                }
            })
            return response.data.data
        } catch (error) {
            console.log(error.response.data)
        }
    }

    async getMarketItems(param: any) {
        try {
            const response = await axios.get(`${this.baseUrl}/market/categories/${param.id}/items`, {
                headers: {
                    Authorization: `Bearer ${this.baseToken}`,
                    "X-localization": `${param.lang}`
                }
            })
            return response.data.data
        } catch (error) {
            console.log(error.response.data)
        }
    }

    async getAvatars() {
        try {
            const response = await axios.get(`${this.baseUrl}/avatars`, {
                headers: {
                    Authorization: `Bearer ${this.baseToken}`
                }
            })
            return response.data?.data
        } catch (error) {
            console.log(error?.response?.data)
            throw error
        }
    }

    async purchaseItem(param) {
        try {
            const response = await axios.post(`${this.baseUrl}/market/purchase/${param.item_id}`, {
                child_id: param.child_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${param.token}`,
                    "X-localization": `${param.lang}`
                },
            })
            return response.data
        } catch (error) {
            console.log(error.response.data.message)
            return error.response.data
        }
    }

    async getAttributes(token: string, lang: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/attributes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-localization": `${lang}`
                }
            })
            return response?.data?.data
        } catch (error) {
            throw error?.response?.data?.message
        }
    }

    async getAttributeByChild(param) {
        try {
            const response = await axios.get(`${this.baseUrl}/attributes/${param.attribute_id}`, {
                headers: {
                    Authorization: `Bearer ${param.token}`,
                    "X-localization": `${param.lang}`
                },
                params: {
                    child_id: param.child_id,
                    from: param.from,
                    to: param.to
                }
            })
            return response.data
        } catch (error) {
            console.log(error.response.data)
            console.log(error.response.data.message)
        }
    }

    async forgotPassword(email: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/auth/forgot-password`, {
                email: email
            })
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error.response.data)
            return error.response.data.message
        }
    }

    async getCategories(token: string, lang: string) {
        // console.log(`cats ${token}`)
        try {
            const response = await axios.get(`${this.baseUrl}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-localization": `${lang}`
                }
            })
            return response.data;
        } catch (error) {
            console.log(error?.response?.data)
            throw error
        }
    }

    async getCollections(data: any) {
        try {
            const response = await axios.get(`${this.baseUrl}/collections`, {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                    "X-localization": `${data.lang}`
                },
                params: {
                    category_id: data.id,
                    child_id: data.child_id.id
                }
            })
            return response.data
        } catch (error) {
            console.log(error?.response?.data)
            throw error
        }
    }

    async getSubCollections(data: any) {
        
        try {
            const response = await axios.get(`${this.baseUrl}/sub-collections`, {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                    "X-localization": `${data.lang}`
                },
                params: {
                    collection_id: data.id,
                    child_id: data.child_id.id
                }
            })

            return response.data
        } catch (error) {
            console.log(error?.response?.data)
            throw error
        }
    }

    async getTasks(id: any, lang: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/tasks`, {
                headers: {
                    Authorization: `Bearer ${id.token}`,
                    "X-localization": `${lang}`
                },
                params: {
                    sub_collection_id: id.id
                }
            })
            return response?.data?.data
        } catch (error) {
            console.log(id?.id, "tasks");
            console.log(error?.response?.data?.message);
            throw error
        }
    }
    
    async answerTask(task_id: string, attempt: string, voice: any, child_id: string, token: string, lead_time: number, lang: string) {
        try {
            // console.log(lead_time);
            const formData = new FormData();
            formData.append('task_id', task_id);
            formData.append('attempt', attempt);
            formData.append('child_id', child_id);
            formData.append('lead_time', `${lead_time}`);
            formData.append('voice', {
                uri: voice,
                type: 'audio/m4a',
                name: 'voice-recording.m4a',
            });

            const response = await axios.post(`${this.baseUrl}/tasks/answer`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    "X-localization": `${lang}`
                },
            });
            // console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
            console.log(error?.response?.data?.message)
            throw error
        }
    }

    async getSpeech(name: any, lang: any) {
        try {
            const response = await axios.get(`${this.baseUrl}/speeches`, {
                params: {
                    category: name
                },
                headers: {
                    "X-localization": `${lang}` // Указываем правильный тип контента
                },
            })
            return response.data?.data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async sendMessage(data) {
        try {
            const formData = new FormData();
            formData.append('child_id', data?.child_id);
    
            // Добавляем текущую дату в формате YYYY-MM-DD
            // const currentDate = new Date().toISOString().split('T')[0]; 
            // formData.append('time_data', currentDate);

            // formData.append('about_child', 'true')
    
            if (data?.isText) {
                formData.append('message', data?.message);
            } else {
                formData.append('audio', {
                    uri: data.audio,
                    type: 'audio/m4a',
                    name: 'voice-recording.m4a',
                });
            }
    
            const response = await axios.post(`${this.baseUrl}/conversation`, formData, {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                    'Content-Type': 'multipart/form-data',
                    "X-localization": data?.lang,
                },
            });
    
            return response?.data?.data;
        } catch (error) {
            console.log(error?.response?.data)
            console.log(error?.response?.data?.message || "Ошибка при отправке сообщения");
            throw error;
        }
    }
    
    async getMessages(child_id: any, token: any, lang: string) {
        // console.log(child_id, token)
        try {
            const response = await axios.get(`${this.baseUrl}/conversation`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-localization": `${lang}`
                },
                params: {
                    child_id: child_id
                }
            });
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.log(error?.response?.data?.message);
            throw error
        }
    }

    async answerTaskSC(params: any) {
        try {
            // console.log(params)
            const response = await axios.post(`${this.baseUrl}/tasks/answer`, 
            {
                task_id: params.task_id,
                attempt: params.attempt,
                child_id: params.child_id,
                answer: params.answer,
                lead_time: params.lead_time
            },
            {
                headers: {
                    Authorization: `Bearer ${params.token}`,
                    "X-localization": `${params.lang}`
                },
            })
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error?.response?.data)
            throw error?.response?.data?.message
        }
    }

    async answerTaskObjectMatching(params: any) {
        try {
            // console.log(params)
            const response = await axios.post(`${this.baseUrl}/tasks/answer`, 
            {
                task_id: params.task_id,
                attempt: params.attempt,
                child_id: params.child_id,
                success: params.success,
                lead_time: params.lead_time,
                pair_id: params.pair_id,
                target_pair_id: params.target_pair_id
            },
            {
                headers: {
                    Authorization: `Bearer ${params.token}`,
                    "X-localization": `${params.lang}`
                },
            })
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error?.response?.data)
            throw error?.response?.data?.message
        }
    }

    async answerDragAndDrop(params: any) {
        try {
            // console.log(params)
            const response = await axios.post(`${this.baseUrl}/tasks/answer`, 
            {
                task_id: params.task_id,
                attempt: params.attempt,
                child_id: params.child_id,
                success: params.success,
                lead_time: params.lead_time,
                answer_id: params.answer_id,
                image_id: params.image_id
            },
            {
                headers: {
                    Authorization: `Bearer ${params.token}`,
                    "X-localization": `${params.lang}`
                },
            })
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
            throw error?.response?.data?.message
        }
    }

    async answerHandWritten(answer: any) {
        try {
                // console.log(answer.images[0])
                const formData = new FormData();
                formData.append('task_id', `${answer.task_id}`);
                formData.append('attempt', `${answer.attempt}`);
                formData.append('child_id', `${answer.child_id}`);
                formData.append('lead_time', `${answer.lead_time}`);
                formData.append('images[0]', answer.images[0]);

                const response = await axios.post(`${this.baseUrl}/tasks/answer`, formData, {
                    headers: {
                        Authorization: `Bearer ${answer.token}`,
                        'Content-Type': 'multipart/form-data',
                        "X-localization": `${answer.lang}`
                    },
                })
                // console.log(response.data)
                return response?.data
        } catch (error) {
            console.log(error?.response?.data)
            console.log(error?.response?.data?.message)
            throw error?.response?.data?.message
        }
    }
}

export default new Api();