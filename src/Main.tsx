import { useAuth } from './AuthContext';
import { createRef, useEffect, useState } from 'react';
import { Messages } from './Messages';
import { ChatMessage, sendChatMessage, getChatMessages } from './API';
import { Sidebar, SidebarButton } from './Sidebar';


interface OutgoingMessage
{
    text: string;
    image: string;
}

function MainChat() 
{
    const [activeChatID, setActiveChatID] = useState<number>(0);
    const [activeChatHistory, setActiveChatHistory] = useState<ChatMessage[]>([]);
    const [isChatBlocked, setIsChatBlocked] = useState<boolean>(false);
    const [textAreaData, setTextAreaData] = useState<OutgoingMessage>({text: '', image:''});
    const [chatList, setChatList] = useState<number[]>([]);
    const [inOverlay, setInOverlay] = useState<boolean>(false);

    const chatBoxRef = createRef<HTMLDivElement>();
    const sendMessageHandler = async () => 
    {
        try 
        {
            const outgoingChatEntity: ChatMessage = { local: true, text: textAreaData.text, image: '' };
            setActiveChatHistory((activeChatHistory) => [...activeChatHistory, outgoingChatEntity]);      
            setTextAreaData({text: '', image: ''});
            setIsChatBlocked(true);
            const res = await sendChatMessage(activeChatID, outgoingChatEntity);
            if(res)
            {
              setActiveChatHistory((activeChatHistory) => [...activeChatHistory, res]);  
            }     
            setIsChatBlocked(false);            
        } 
        catch (error) 
        {
            console.error('Error sending message!', error);
            setIsChatBlocked(false);
        }
    }    

    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => 
    {
        setTextAreaData({ ...textAreaData, [e.target.name]: e.target.value });
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => 
    {
        if (e.key === 'Enter' && !e.shiftKey) 
        {
            e.preventDefault();
            sendMessageHandler();
        }
    }

    useEffect(() => 
    {
          (async function() {
            const res = await getChatMessages(activeChatID);
            if(res)
                setActiveChatHistory(res);
          })();
    }, [activeChatID]);


    return (
<div>
<Sidebar activeChatID={activeChatID} setActiveChatID={setActiveChatID} setActiveChatHistory={setActiveChatHistory} chatList={chatList} setChatList={setChatList} />
{activeChatID && (<div className="relative h-screen w-full lg:ps-64">
  <div className="py-10 lg:py-14" ref={chatBoxRef}>
    <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
      <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
        LLMBACK
      </h1>
      <p className="mt-3 text-gray-600 dark:text-neutral-400">
        with Preline UI
      </p>
    </div>

    <ul className="mt-16 space-y-5">
      <Messages messageHistory={activeChatHistory} chatRef={chatBoxRef} />
        {isChatBlocked && (
          <li className="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4">
            <span className="shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
              <span className="text-sm font-medium text-white leading-none">AI</span>
            </span>
            <div className="space-y-3">
              <div className="loader"></div>
            </div>
          </li>    
        )}
    </ul>
  </div>

  <div className="max-w-4xl mx-auto sticky bottom-0 z-10 p-3 sm:py-6" >
   <SidebarButton inOverlay={inOverlay} setInOverlay={setInOverlay} />

    <div className="relative" >
      <textarea value={textAreaData.text} name="text" onChange={onChangeHandler} onKeyDown={onKeyDownHandler}
        className="p-4 pb-12 block w-full bg-gray-100 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Ask me anything..." disabled={isChatBlocked}></textarea>

      <div className="absolute bottom-px inset-x-px p-2 rounded-b-lg bg-gray-100 dark:bg-neutral-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button type="button" className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-white focus:z-10 focus:outline-none focus:bg-white dark:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="9" x2="15" y1="15" y2="9"/></svg>
            </button>

            <button type="button" className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-white focus:z-10 focus:outline-none focus:bg-white dark:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
          </div>

          <div className="flex items-center gap-x-1">
            <button type="button" className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-white focus:z-10 focus:outline-none focus:bg-white dark:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>

            <button type="button" onClick={(e)=>{e.preventDefault(); console.log("Submit", textAreaData.text)}} className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:bg-blue-500">
              <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>)}

{!activeChatID && (
  <div className="relative h-screen w-full lg:ps-64">
    <div className="w-full max-w-md mx-auto p-6 py-10 lg:py-14">
      <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
          Welcome to llmback
        </h1>
        <p className="mt-3 text-gray-600 dark:text-neutral-400">
        UI powered by <p><a className="text-blue-600 underline decoration-gray-800 hover:opacity-80 focus:outline-none focus:opacity-80 dark:decoration-white" href="https://preline.co/">preline.co</a></p>
        </p>
      </div>
      <ul className="space-y-1.5 p-12">
        {chatList.length > 0 && chatList.map((entity, index) => (
            <li key={index} onClick={(e)=>{setActiveChatID(entity); e.preventDefault()}}>
                <a className={"flex items-center gap-x-3 py-2 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 dark:focus:bg-neutral-800 dark:focus:text-neutral-300 " + (activeChatID == entity ? 'bg-gray-100 dark:bg-neutral-800 dark:text-neutral-300' : '')} >
                <p className="mt-3 text-gray-600 dark:text-neutral-400">Chat {entity}</p>
                </a>
            </li>
        ))}
      </ul>
      <SidebarButton inOverlay={inOverlay} setInOverlay={setInOverlay} />
    </div>
  </div>
)}

</div>
    );
}

export default MainChat