/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let url = options.url;
    let dataToSend = null;

    if (options.method === 'GET') {
      if (options.data) {
         url = options.url + '?';
         for (let prop in options.data) {
            url += prop + '=' + options.data[prop] + '&'
          }
         url = url.substr(0, url.length - 1);
      }

    } else {
        dataToSend = new FormData();
        for (let prop in options.data) {
          dataToSend.append(prop, options.data[prop]);
        }
    }
  
    try {
        xhr.open(options.method, url);
        xhr.send(dataToSend);  
    } catch (err) {
        options.callback(err); 
    }
    
    xhr.onload = () => { options.callback(null, xhr.response) };
}
