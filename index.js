const checkForKey = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['openai-key'], (result) => {
        resolve(result['openai-key']);
      });
    });
}

const checkForCeleb = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['celeb'], (result1) => {
            chrome.storage.local.get(['mood'], (result2) => {
                resolve({celeb: result1['celeb'], mood: result2['mood']});
            })
        })
    })
}

const encode = (input) => {
    return btoa(input);
}


const saveKey = () => {
    const input = document.getElementById('key_input');
    if(input) {
        const {value} = input;
        const encodedValue = encode(value);

        chrome.storage.local.set({'openai-key': encodedValue }, () => {
            document.getElementById('key_needed').style.display = 'none';
            document.getElementById('key_entered').style.display='block';
        });
    }
}

const saveCeleb = () => {
    const celeb = document.getElementById('celeb');
    const mood = document.getElementById('mood');
    if(celeb && mood){
        chrome.storage.local.set({'celeb': celeb.value }, () => {
            chrome.storage.local.set({'mood': mood.value}, () => {
                document.getElementById('celeb_needed').style.display = 'none';
                document.getElementById('celeb_entered').style.display='block';          
                document.getElementById('celebDescription').innerText = `${celeb.value} is in a ${mood.value} mood`; 
            })
        }); 
    }

}

const changeKey = () => {
    document.getElementById('key_needed').style.display = 'block';
    document.getElementById('key_entered').style.display = 'none';
}

const changeCeleb = () => {
    document.getElementById('celeb_needed').style.display = 'block';
    document.getElementById('celeb_entered').style.display = 'none';
}

document.getElementById('save_key_button').addEventListener('click', saveKey);
document.getElementById('change_key_button').addEventListener('click', changeKey);
document.getElementById('saveCeleb').addEventListener('click', saveCeleb);
document.getElementById('changeCeleb').addEventListener('click', changeCeleb);

checkForKey().then((response) => {
    if (response) {
        document.getElementById('key_needed').style.display = 'none';
        document.getElementById('key_entered').style.display = 'block';
    }
});

checkForCeleb().then((response) => {
    if(response.celeb && response.mood){
        document.getElementById('celeb_needed').style.display = 'none';
        document.getElementById('celeb_entered').style.display = 'block';
        document.getElementById('celebDescription').innerText = `${response.celeb} is in a ${response.mood} mood`; 

    }
})