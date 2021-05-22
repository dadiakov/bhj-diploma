/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
 class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  super(element) {
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(null, (err, response) => {
      if (response.success) {
        let optionsToInsert = ``;
        response.data.forEach(e => {
          optionsToInsert += `<option value="${e.id}">${e.name}</option>`;
        });
        this.element.querySelector('.accounts-select').innerHTML = optionsToInsert;
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
        let modifiedData = data;
        if (this.element == document.getElementById('new-expense-form')) {
          modifiedData.type = 'expense';
        } else {
          modifiedData.type = 'income';
        };
     Transaction.create(modifiedData, (err, response) => {
       if(response.success) {
           this.element.reset();
           this.element.closest('.modal').style.display = 'none';
           App.update();
       }
     });
  }
}