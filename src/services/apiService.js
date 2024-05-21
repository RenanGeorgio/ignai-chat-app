export const baseUrl = process.env.REACT_APP_CHAT_HOST;

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${Cookies.get('token')}`,
      "ngrok-skip-browser-warning": "69420",
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  
  if(!response.ok) {
    let message = "Ocorreu um erro...";
    if(data?.message) {
      message = data.message;
    }
 
    return { error: true, message };
  }

  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${Cookies.get('token')}`,
      "ngrok-skip-browser-warning": "69420",
    }
  });

  const data = await response.json();

  if(!response.ok) {
    let message = "Ocorreu um erro...";
    if(data?.message) {
      message = data.message;
    }

    return { error: true, message };
  }

  return data;
};