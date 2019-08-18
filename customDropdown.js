// имя тега в dom
const tagName = "custom-dropdown";
// шаблон кастомного dropdown
const template = document.createElement("template");
template.innerHTML = `
        <div class='customdropdown__value'>
          <div class='customdropdown__placeholder'></div>
          <input class='customdropdown__input' placeholder='Search...'></input>
        </div>
        <ul class='customdropdown__options'></ul>`;

class CustomDropdown extends HTMLElement {
  constructor(nativeSelect) {
    super();
    this.nativeSelect = nativeSelect;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.renderOptions = this.renderOptions.bind(this);

    // класс из observer.js, создаем слушатель событий на документе, нужен для закрытия dropdown
    const observer = Observer.getSingleton();
    observer.subscribe(this.handleDocumentClick);
  }

  connectedCallback() {
    // добавляем шаблон dropdown в наш элемент
    this.innerHTML = template.innerHTML;
    // сохраняем ссылки на dom элементы для быстрого доступа
    this.$value = this.querySelector(".customdropdown__value");
    this.$placeholder = this.querySelector(".customdropdown__placeholder");
    this.$input = this.querySelector(".customdropdown__input");
    this.$options = this.querySelector(".customdropdown__options");

    // смешение выпадаюшего списка от левого края, что бы он был ровно под dropdown
    this.$value.setAttribute(
      "style",
      `width:${this.$placeholder.getBoundingClientRect().width}px`
    );

    // добавляем текст placeholder-а
    this.$placeholder.innerHTML = this.nativeSelect.getAttribute(
      "data-placeholder"
    );

    // dropdown по умолчанию закрыт
    this.setAttribute("data-open", false);

    this.addEventListener("click", this.handleClick);
    this.$input.addEventListener("input", this.handleInputValueChange);

    // переносит все опции из нативного селектора в наш dropdown
    this.renderOptions();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
    this.$input.removeEventListener("input", this.handleInputValueChange);
  }

  // вызывается когда было событие клика на документе
  handleDocumentClick(evt) {
    if (evt.target.closest("custom-dropdown") != this) {
      // проверяем было ли событие на dropdown, если нет закрываем dropdown
      this.closeDropdown();
    }
  }

  // события клика на dropdown
  handleClick(evt) {
    if (evt.target.className === "customdropdown__value") {
      // если событие произошло на customdropdown__value, то считаем что пользователь хочет закрыть/открыть dropdown
      this.toggleDropdown();
    } else if (evt.target.className === "customdropdown__input") {
      // если событие произошло на customdropdown__input, то считаем что пользователь хочет ввести фразу для поиска
      return;
    } else if (evt.target.className === "customdropdown__placeholder") {
      // если событие произошло на customdropdown__placeholder, то открываем dropdown
      this.openDropdown();
    }
  }

  // событие происходит при изменении значения customdropdown__input
  handleInputValueChange(evt) {
    for (const option of this.$options.children) {
      // фильтруем опции по фразе которую ввел пользователь
      if (
        option
          .getAttribute("data-meta")
          .toLocaleLowerCase()
          .includes(evt.target.value)
      ) {
        // если фраза присутствует в метаданных опции показываем ее
        option.setAttribute("style", "display:block");
      } else {
        // иначе скрываем
        option.setAttribute("style", "display:none");
      }
    }
  }

  // показываем/скрываем dropdown
  toggleDropdown() {
    if (this.getAttribute("data-open") === "true") {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  // показываем dropdown
  openDropdown() {
    this.$options.setAttribute(
      "style",
      `left:${this.$value.getBoundingClientRect().left}px`
    );
    this.setAttribute("data-open", true);
  }

  // скрываем dropdown
  closeDropdown() {
    this.setAttribute("data-open", false);
  }

  // отображаем опцию которая является элементом iframe
  renderIFrameOption(nativeOption) {
    const customOption = document.createElement("li");
    const iframe = document.createElement("iframe");
    customOption.setAttribute(
      "class",
      "customdropdown__option customdropdown__option--iframe"
    );
    customOption.setAttribute("data-value", nativeOption.value);
    customOption.setAttribute("data-index", nativeOption.index);
    customOption.setAttribute(
      "data-meta",
      nativeOption.getAttribute("data-meta")
    );
    iframe.setAttribute("src", nativeOption.getAttribute("data-src"));
    iframe.setAttribute("allow", nativeOption.getAttribute("data-allow"));
    iframe.setAttribute(
      "allowfullscreen",
      nativeOption.getAttribute("data-allowfullscreen")
    );
    customOption.appendChild(iframe);
    return customOption;
  }

  // отображаем опцию которая является элементом image
  renderImageOption(nativeOption) {
    const customOption = document.createElement("li");
    const image = new Image();
    customOption.setAttribute(
      "class",
      "customdropdown__option customdropdown__option--image"
    );
    customOption.setAttribute("data-value", nativeOption.value);
    customOption.setAttribute("data-index", nativeOption.index);
    customOption.setAttribute(
      "data-meta",
      nativeOption.getAttribute("data-meta")
    );
    image.setAttribute("src", nativeOption.getAttribute("data-src"));
    image.setAttribute("alt", nativeOption.getAttribute("data-meta"));
    customOption.appendChild(image);
    return customOption;
  }

  // отображаем опцию которая является элементом audio
  renderAudioOption(nativeOption) {
    const customOption = document.createElement("li");
    const audio = document.createElement("audio");
    customOption.setAttribute(
      "class",
      "customdropdown__option customdropdown__option--audio"
    );
    customOption.setAttribute("data-value", nativeOption.value);
    customOption.setAttribute("data-index", nativeOption.index);
    customOption.setAttribute(
      "data-meta",
      nativeOption.getAttribute("data-meta")
    );
    audio.setAttribute("src", nativeOption.getAttribute("data-src"));
    audio.setAttribute("controls", true);
    audio.innerHTML =
      "Your browser does not support the <code>audio</code> element";
    customOption.appendChild(audio);
    return customOption;
  }

  // отображаем опцию которая является элементом ul
  renderListOption(nativeOption) {
    const customOption = document.createElement("li");
    const list = document.createElement("ul");
    customOption.setAttribute(
      "class",
      "customdropdown__option customdropdown__option--list"
    );
    customOption.setAttribute("data-value", nativeOption.value);
    customOption.setAttribute("data-index", nativeOption.index);
    customOption.setAttribute(
      "data-meta",
      nativeOption.getAttribute("data-meta")
    );
    for (const name of nativeOption.getAttributeNames()) {
      if (name.toLowerCase().includes("data-listitem")) {
        const listItem = document.createElement("li");
        listItem.innerHTML = nativeOption.getAttribute(name);
        list.appendChild(listItem);
      }
    }
    customOption.innerHTML = nativeOption.innerHTML;
    customOption.appendChild(list);
    return customOption;
  }

  // перебираем все опции селектора и рендерим их
  renderOptions() {
    const fragment = document.createDocumentFragment();

    for (const option of this.nativeSelect.options) {
      const dataType = option.getAttribute("data-type");

      if (dataType === "iframe") {
        fragment.appendChild(this.renderIFrameOption(option));
      } else if (dataType === "image") {
        fragment.appendChild(this.renderImageOption(option));
      } else if (dataType === "audio") {
        fragment.appendChild(this.renderAudioOption(option));
      } else if (dataType === "list") {
        fragment.appendChild(this.renderListOption(option));
      } else {
        continue;
      }
    }

    this.$options.appendChild(fragment);
  }
}

window.customElements.define("custom-dropdown", CustomDropdown);
