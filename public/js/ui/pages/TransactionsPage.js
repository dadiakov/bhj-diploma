/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
 class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element) throw new Error('Проблемы в TransactionsPage. Элемент не передан');
    this.element = element;
    this.registerEvents();
    this.lastOptions = null;
  }
 
    
  
  

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', e => {
      if (e.target.classList.contains('remove-account')) {
        this.removeAccount();
      } 
      if (e.target.closest('button')) {

        if (e.target.closest('button').classList.contains('transaction__remove')) {
        this.removeTransaction({id: e.target.closest('button').dataset.id});
      } 
    }});
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if(!this.lastOptions) return;
    if (confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove({id:this.lastOptions.account_id}, (err, response) => {
        if (response.success) App.updateWidgets();      
      });
      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, (err, response) => {
        if (response.success) App.update();      
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) return;
    this.lastOptions = options;
    Account.get(options.account_id, (err, response) => {
      if (response.success) {
        this.renderTitle(response.data.name);
      }
    });
    Transaction.list(options, (err, response) => {
          if (response.success) {
            this.renderTransactions(response.data);
          }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').textContent = `${name}`;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    if (!date) return;
 
    let str1 = new Date(date).toLocaleDateString();
    let str2 = new Date(date).toLocaleTimeString();

    let array1 = str1.split('.');
    let array2 = str2.split(':');

    let yy = array1[2];
    let dd = array1[0];
    let mth = array1[1];
    let hh = array2[0];
    let mm = array2[1];

    switch(mth) {
    case '01':
      mth = 'января';
      break;
    case '02':
      mth = 'февраля';
      break;   
    case '03':
      mth = 'марта'
      break;
    case '04':
      mth = 'апреля';
      break;
    case '05':
      mth = 'мая';
      break;   
    case '06':
      mth = 'июня'
      break;
    case '07':
      mth = 'июля';
      break;
    case '08':
      mth = 'августа';
      break;   
    case '09':
      mth = 'сентября'
      break;
    case '10':
      mth = 'октября';
      break;
    case '11':
      mth = 'ноября';
      break;   
    case '12':
      mth = 'декабря'
      break;
    }

    return dd + ' ' + mth + ' ' + yy + ' г. в ' + hh + ':' + mm;

  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    let html = `
      <div class="transaction transaction_${item.type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <!-- дата -->
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
        <!--  сумма -->
            ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
          <!-- в data-id нужно поместить id -->
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
              <i class="fa fa-trash"></i>  
          </button>
      </div>
      </div>`;
      return html;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    let html = ``;
    data.forEach(e => {
      html += this.getTransactionHTML(e);
    }
    );
    document.querySelector('.content').innerHTML = html;
  }
}