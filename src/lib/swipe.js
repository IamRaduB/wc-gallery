export class Swipe {
  constructor(element) {
    this.element = element;
    this._onSwipeLeft = null;
    this._onSwipeRight = null;

    this._startX = null;
    this._endX = null;

    this.element.addEventListener('mousedown', this.startMove.bind(this), false);
    this.element.addEventListener('touchstart', this.startMove.bind(this), false);

    this.element.addEventListener('mouseup', this.move.bind(this), false);
    this.element.addEventListener('touchend', this.move.bind(this), false);
  }

  /**
   * If a touch event occurs, the structure of the event changes and we cannot access property "clientX" easily
   * @param { MouseEvent|TouchEvent } ev
   * @returns {*}
   */
  static uniformEvent(ev) {
    return ev.changedTouches ? ev.changedTouches[0] : ev;
  }

  /**
   * Records the start point of the mouse|touch move
   * @param {MouseEvent|TouchEvent} ev
   */
  startMove(ev) {
    // fix to prevent content selection on cursor move
    if (ev.preventDefault) ev.preventDefault();

    const event = Swipe.uniformEvent(ev);
    this._startX = event.clientX;
  }

  /**
   * Determines whether mouse|touch move happened to the left or right
   * @param {MouseEvent|TouchEvent} ev
   * @returns {void}
   */
  move(ev) {
    // fix to prevent content selection on cursor move
    if (ev.preventDefault) ev.preventDefault();

    const event = Swipe.uniformEvent(ev);

    if (!this.onSwipeLeft || !this.onSwipeRight) {
      console.warn('Callbacks for onSwipeLeft/onSwipeRight are missing!');
      return;
    }

    this._endX = event.clientX;
    const dx = this._endX - this._startX;

    if (dx > 0) {
      this.onSwipeLeft();
    } else if (dx < 0) {
      this.onSwipeRight();
    }
  }

  get onSwipeLeft() {
    return this._onSwipeLeft;
  }

  set onSwipeLeft(callback) {
    this._onSwipeLeft = callback;
  }

  get onSwipeRight() {
    return this._onSwipeRight;
  }

  set onSwipeRight(callback) {
    this._onSwipeRight = callback;
  }
}
