class Observer {
  constructor() {
    this.observers = [];
    this.singleton;
  }

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter(subscriber => subscriber !== fn);
  }

  broadcast(data) {
    this.observers.forEach(subscriber => subscriber(data));
  }

  static getSingleton() {
    if (!this.singleton) {
      this.singleton = new Observer();
    }

    return this.singleton;
  }
}
