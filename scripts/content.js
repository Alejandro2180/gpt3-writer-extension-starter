chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'inject') {
      const { content } = request;
  
      console.log(content);
      wrapperDiv = document.createElement("div");
      wrapperDiv.setAttribute("style","position: absolute; left: 0px; top: 0px; background-color: rgb(255, 255, 255); z-index: 2000;");

      iframeElement = document.createElement("div");
      iframeElement.setAttribute("style","width: 100%; height: 100%;");
      
      
      modalDialogParentDiv = document.createElement("div");
      modalDialogParentDiv.setAttribute("style","position: absolute; width: 350px; border: 1px solid rgb(51, 102, 153); padding: 10px; background-color: rgb(255, 255, 255); z-index: 2001; overflow: auto; text-align: center; top: 149px; left: 497px;");
      
      modalDialogSiblingDiv = document.createElement("div");
      
      modalDialogTextDiv = document.createElement("div"); 
      modalDialogTextDiv.setAttribute("style" , "text-align:center");
      
      modalDialogTextSpan = document.createElement("span");
      modalDialogTextSpan.setAttribute("style","color: black");
      modalDialogText = document.createElement("strong"); 
      modalDialogText.innerHTML = content;

      modalDialogTextSpan.appendChild(modalDialogText);
        modalDialogTextDiv.appendChild(modalDialogTextSpan);
        modalDialogSiblingDiv.appendChild(modalDialogTextDiv);
        modalDialogParentDiv.appendChild(modalDialogSiblingDiv);
        iframeElement.appendChild(modalDialogParentDiv);

      wrapperDiv.appendChild(iframeElement);
        document.body.appendChild(wrapperDiv);
      sendResponse({ status: 'success' });
    }
  });