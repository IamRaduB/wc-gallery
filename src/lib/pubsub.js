export class PubSub {
  constructor() {
    this.subscribers = new Map();
  }

  publish(event, payload) {
    const subscribersToEvent = this.subscribers.get(event);
    if (!subscribersToEvent) {
      return;
    }

    subscribersToEvent.forEach((subCallback) => {
      subCallback(payload);
    });
  }

  /**
   * @typedef { { unsubscribe(): void } } Subscription
   * @param { string } event
   * @param callback
   * @returns { Subscription }
   */
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [callback]);
    } else {
      this.subscribers.get(event).push(callback);
    }

    const index = this.subscribers.get(event).length - 1;

    return {
      unsubscribe() {
        this.subscribers.get(event).splice(index, 1);
      },
    };
  }
}

export const pubSub = new PubSub();
