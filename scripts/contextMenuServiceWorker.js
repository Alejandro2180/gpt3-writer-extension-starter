const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            if (result['openai-key']) {
                const decodedKey = atob(result['openai-key']);
                resolve(decodedKey);
            }
        })
    })
}

const getCeleb = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['celeb'], (result1) => {
            chrome.storage.local.get(['mood'], (result2) => {
                if (result1['celeb'] && result2['mood']) {
                    resolve({celeb: result1['celeb'], mood: result2['mood']})
                }
            })
        })
    })
}

const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0].id;
  
      chrome.tabs.sendMessage(
        activeTab,
        { message: 'inject', content },
        (response) => {
          if (response.status === 'failed') {
            console.log('injection failed.');
          }
        }
      );
    });
};

const generate = async (prompt) => {
    const key = await getKey();
    const url = 'https://api.openai.com/v1/chat/completions';

    const completionResponse = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-0125',
            messages: [{role:"user", content: prompt}]
        })
    });

    const completion = await completionResponse.json();
    return completion.choices.pop().message.content;
}


const generateCompletionAction = async (info) => {
    try {
        const {celeb, mood} = await getCeleb();
        const { selectionText } = info;
        const basePromptPrefix = `
        Respond to the given input as if you were ${celeb} when in a ${mood} mood.

        input:
        `;

        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`)
        console.log(baseCompletion);
        sendMessage(celeb +":\n" + baseCompletion);
    } catch(error) {
        console.log(error);
        sendMessage(error);
    }
}

chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
      id: 'context-run',
      title: `Get Celeb\'s Reaction!`,
      contexts: ['selection'],
    });
});
  
chrome.contextMenus.onClicked.addListener(generateCompletionAction);