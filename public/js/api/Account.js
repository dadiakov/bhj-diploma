/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  /**
   * Получает информацию о счёте
   * */
  URL: '/account';
  
  static get(id = '', callback){
    createRequest({
      method: 'GET',
      url: this.URL,
      data: {id:id},
      callback: callback
    });
  }
}
