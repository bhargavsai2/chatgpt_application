
import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form_selected = document.getElementById("inputForm");
const chat_container = document.getElementById("chat_container");

let loadstate;

function loader(elem){
  elem.textContent = ''

  loadstate = setInterval(() => {
    elem.textContent+='.';
    
    if(elem.textContent == '....'){
      elem.textContent=''
    }
  },300)
}

function textTypin(elem, text){
  let i=0;
  let interval= setInterval(()=>{
  if(i<text.length()){
    elem.innerHTML+= text.charAt(i);
    i++
  }
  else{
    clearInterval(interval);
  }
},20)
}

function genUniqID(){
  const tstamp = Date.now()
  const rnum = Math.random()
  const hexstring = rnum.toString(16)

  return `id-${tstamp}-${hexstring}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
      `
      <div class="wrapper ${isAi && 'ai'}">
          <div class="chat">
              <div class="profile">
                  <img 
                    src=${isAi ? bot : user} 
                    alt="${isAi ? 'bot' : 'user'}" 
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
  `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData(form_selected)

  //user's chatstripe
  chat_container.innerHTML += chatStripe(false, data.get('prompt'))

  form_selected.reset();

  //bot's chatstripe
  const uniqueId = genUniqID();
  chat_container.innerHTML += chatStripe(true, " ", uniqueId);

  chat_container.scrollTop = chat_container.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  // current messageDiv innerhtml = "..."
  debugger;
  loader(messageDiv);

  const response = await fetch('http://localhost:5002/',{
    method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

  clearInterval(loadstate)
  messageDiv.innerHTML = " "

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData)

  } else{
    const err = await response.text()

    messageDiv.innerHTML = "Something went wrong!"
    alert(err)
  }
  
}

form_selected.addEventListener('submit', handleSubmit)
form_selected.addEventListener('keyup', (e)=>{
  //if pressed enter key condition
  if(e.keyCode===13){
    handleSubmit(e)
  }
})
