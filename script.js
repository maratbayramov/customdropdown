// класс из observer.js
const observer = Observer.getSingleton();

// оповещаем слушателей что было событие клика на документе
function handleDocumentClick(evt) {
  observer.broadcast(evt);
}

document.addEventListener("click", handleDocumentClick);

// получаем все селекторы с классом dropdown которые мы будем заменять на кастомный dropdown
const selectItems = document.querySelectorAll("select.dropdown");
for (let selectItem of selectItems) {
  // создаем кастомный dropdown
  const customDropdown = new CustomDropdown(selectItem);

  // скрываем селектор
  selectItem.setAttribute("style", "display:none");

  // вставляем dropdown
  selectItem.parentElement.insertBefore(customDropdown, selectItem);
}
