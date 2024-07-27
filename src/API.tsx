import axios from "axios";
import backendURL from "./Global";

export interface ChatMessage
{
    text: string;
    local: boolean;
    image: string;
}

export async function getAllChats(): Promise<number[] | null>
{
    try 
    {
        const data = { token: localStorage.getItem('authtok') };
        const response = await axios.post(backendURL + '/getChats', data);
        console.log('Received chats', response.data);
        return response.data;
    } 
    catch (error) 
    {
        console.error('Unable to get chats!', error);
        return null;
    }
}

export async function createNewChat(): Promise<void>
{
    try 
    {
        const data = { token: localStorage.getItem('authtok') };
        const response = await axios.post(backendURL + '/createChat', data);
        console.log('Created new chat', response.data);
    } 
    catch (error) 
    {
        console.error('Unable to create chat!', error);
    }
}

export async function getChatMessages(chatID: number): Promise<ChatMessage[] | null>
{
    try 
    {
        const data = { token: localStorage.getItem('authtok'), chatID: chatID };
        const response = await axios.post(backendURL + '/getChat', data);
        console.log('Received chat history', response.data);
        return response.data;
    } 
    catch (error) 
    {
        console.error('Unable to get chat history!', error);
        return null;
    }
}

export async function sendChatMessage(chatID: number, outgoingMessage: ChatMessage): Promise<ChatMessage | null>
{
    try 
    {
        const data = { token: localStorage.getItem('authtok'), chatID: chatID, message: outgoingMessage.text, 
            image: ''
            //image: imageBase64 ? imageBase64.replace(/^data:\w+\/\w+;base64,/, '') : ''
        };
        const response = await axios.post(backendURL+'/chatMessage', data);
        console.log('Chat message submitted successfully!', response.data);
        return response.data;
    } 
    catch (error) 
    {
        console.error('Error sending message!', error);
        return null;
    }
}

export async function deleteChat(chatID: number): Promise<void>
{
    try 
    {
        const data = { token: localStorage.getItem('authtok'), chatID: chatID };
        const response = await axios.post(backendURL + '/deleteChat', data);
        console.log('Deleted chat', response.data);
    } 
    catch (error) 
    {
        console.error('Unable to delete chat!', error);
    }
}
