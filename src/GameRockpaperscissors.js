import { html, LitElement } from 'lit';
import { RockPaperScissorsStyles } from'./styles-wc-rock-paper-scissors.js';

export class GameRockpaperscissors extends LitElement {
  static get properties() {
    return  {
      position: { type: Object },
      diameter: { type: String },
      type: { type: String },
      letter: { type: Array },
      item: { type: Array },
      cycle: { type: Object },
      memory: { type: Array }
  }
};

  static get styles() {
    return [RockPaperScissorsStyles];
  }

 constructor() {
  super();
  this._maxWidth = 600;
  this._maxHeight = 600;
  this.id = `wccell-${this.randomNum(1, 1000)}-${  new Date().getTime()}`;
  this.position = {
    top: `${this.randomNum(this._maxRadius, this._maxHeight - this._maxRadius)}px`,
    left: `${this.randomNum(this._maxRadius, this._maxWidth - this._maxRadius)}px`
  };
  this.diameter = '10px';
  this.type = this.randomNum(0, 3);
  

  this.letter = ['R', 'P', 'S'];

  this.item = this.randomLetter(this.letter);

  this._moveTime = 300;
  this.memory = [];

  this.move = this.move.bind(this);

}

move() {
  const newTop = parseInt(this.position.top, 10) + this.randomNum(-10, 10);
  const newLeft = parseInt(this.position.left, 10) + this.randomNum(-10, 10);
  if (newTop >= 0 && newTop <= this._maxHeight - this._maxRadius) {
    this.position.top = `${newTop}px`;
  }
  if (newLeft >= 0 && newLeft <= this._maxWidth - this._maxRadius) {
    this.position.left = `${newLeft}px`;
  }
  this._livingWccellMoveEvent();
  this._setStyles();
}

_livingWccellMoveEvent() {
  document.dispatchEvent(
    new CustomEvent('living-wccell-move', {
      detail: {
        id: this.id,
        position: this.position,
        diameter: this.diameter,
        letter: this.letter
      }
    })
  );
}

_setStyles() {
  const styles = this.shadowRoot.querySelector('.cell').style;
  styles.top = `${this.position.top}`;
  styles.left = `${this.position.left}`;
  styles.width = this.diameter;
  styles.height = this.diameter;
  styles.backgroundColor = `hsl(${this.color * 10}, 100%, 50%)`;
  if (this.age === this.cycle.life - 1) {
    styles.animationName = 'death' ;
  }
}

_calculateDistance(e) {
  const x = parseInt(this.position.top, 10) - parseInt(e.detail.position.top, 10);
  const y = parseInt(this.position.left, 10) - parseInt(e.detail.position.left, 10);
  // console.log(this.position, e.detail.position);
  return Math.sqrt(x * x + y * y);
}

_insertCell(e) {
  const idParts = this.id.split('-');
  const idPartsDetail = e.detail.id.split('-');
  const id = `${idParts[0]}-${idParts[1]+idPartsDetail[1]}-${new Date().getTime()}`;
  console.log(`created cell with id ${id}`);
  if (!document.getElementById(id)) {
    const rockpaperscissors = `<game-rockpaperscissors id="${id}"></game-rockpaperscissors>`;
    document.body.insertAdjacentHTML('beforeend', rockpaperscissors);
    setTimeout(() => {
      const newCell = document.getElementById(id);
      if (newCell) {
        newCell.position = {
          top: `${parseInt(this.position.top, 10) + 50}px`,
          left: `${parseInt(this.position.left, 10) + 50}px`
        };
      }
    }, 100);
  }
}

randomNum(min, max) {
  this._null = null;
  return parseInt(Math.random() * (max + 1 - min), 10) + min;
}

randomLetter() {
  return this.letter[this.randomNum(0, 2)];
}

render() {
  return html`
    <div class="cell">${this.item}</div>
  `;
}

}