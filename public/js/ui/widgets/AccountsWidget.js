/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(!element) throw new Error('AccountsWidget, что-то пошло не так');
    this.element = element;
    AccountsWidget.registerEvents();
    AccountsWidget.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    document.querySelector('.create-account').onclick = () => {
      App.getModal('createAccount').open();
      this.element.addEventListener('click', e => {
        AccountsWidget.onSelectAccount(e.target);
      })
    }
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if(User.current()) {
      Account.list(User.current(), (err, response) => {
        if(response.success) {
          AccountsWidget.clear();
          response.forEach(e => renderItem(e));
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    Array.from(document.querySelectorAll('ul.sidebar-menu > li.account')).forEach(e => e.parentNode.removeChild(e));
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    Array.from(element.closest('.accounts-panel').querySelectorAll('.account')).forEach(e => e.classList.remove('active'));
    element.classList.add('active');
    let accountId = {};
    accountId[User.current().id] = element.id;
    App.showPage('transactions', accountId);
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `<li class="active account" data-id="${item.id}">
            <a href="#">
              <span>${item.name}</span> /
               <span>${item.sum} ₽</span>
            </a>
            </li>`;

  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    data.forEach(e => {
      this.element.insertAdjacentHTML('beforeend', AccountsWidget.getAccountHTML(e));
    })
  }
}
