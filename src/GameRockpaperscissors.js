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
      memory: { type: Array },
      age: { type: Number },
  }
};

  static get styles() {
    return [RockPaperScissorsStyles];
  }

 constructor() {
  super();
  this._maxWidth = 600;
  this._maxHeight = 600;
  this._maxRadius = 80;
  this.id = `wccell-${this.randomNum(1, 1000)}-${  new Date().getTime()}`;
  this.position = {
    top: `${this.randomNum(this._maxRadius, this._maxHeight - this._maxRadius)}px`,
    left: `${this.randomNum(this._maxRadius, this._maxWidth - this._maxRadius)}px`
  };
  this.diameter = '40px';
  this.type = this.randomNum(0, 3);

  this.age = 0;
  const maxLife = 25;
  const minLife = 18;
  this.cycle = {
    life: this.randomNum(minLife, maxLife),
    reproduction: this.randomNum(minLife - 10, maxLife - 10)
  };

  this.letter = ['R', 'P', 'S'];
  this.item = this.randomLetter(this.letter);

  this._growthTime = 1000;

  this._moveTime = 300;
  this.memory = [];

  this._deathTime = this.cycle.life * 1000;

  this.death = this.death.bind(this);
  this.growth = this.growth.bind(this);

  this.move = this.move.bind(this);

  this._searchForACell = this._searchForACell.bind(this);
  this._stopLife = this._stopLife.bind(this);

}

connectedCallback() {
  super.connectedCallback();
  this._deathTimer = setTimeout(this.death, this._deathTime);
  this.growthId = setInterval(this.growth, this._growthTime);
  this.moveId = setInterval(this.move, this._moveTime);
  document.addEventListener('living-wccell-move', this._searchForACell);
  document.addEventListener('living-wccell-STOP', this._stopLife);
}

disconnectedCallback() {
  super.disconnectedCallback();
  this._stopLife();
  document.removeEventListener('living-wccell-move', this._searchForACell);
  document.removeEventListener('living-wccell-STOP', this._stopLife);
}

death() {
  this.dispatchEvent(new CustomEvent('living-wccell-death', { detail: this.id }));
  this.remove();
}

firstUpdated() {
  this._setStyles();
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

growth() {
  this.age += 1;
  if (parseInt(this.diameter, 40) < 40) {
    this.diameter = `${parseInt(this.diameter, 40) + 5}px`;
    this._setStyles();
  }
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

_searchForACell(e) {
  if (e.detail.id !== this.id) {
    // console.log(this._doItFoundACell(e));
    if (this._doItFoundACell(e)) {
      this._otherCellFound(e);
    }
  }
}

_calculateDistance(e) {
  const x = parseInt(this.position.top, 10) - parseInt(e.detail.position.top, 10);
  const y = parseInt(this.position.left, 10) - parseInt(e.detail.position.left, 10);
  // console.log(this.position, e.detail.position);
  return Math.sqrt(x * x + y * y);
}

_doItFoundACell(e) {
  const distance = this._calculateDistance(e);
  const sumRadius = parseInt(this.diameter, 10)/2 + parseInt(e.detail.diameter, 10)/2;
  return (distance <= sumRadius);
}

_otherCellFound(e) {
  if (!this.memory.includes(e.detail.id)) {
    if (this.age >= this.cycle.reproduction) {
      this._insertCell(e);
    }
    // console.log(`${this.id} found a cell with id ${e.detail.id}`);
    this.memory.push(e.detail.id);
    // dispatch stopLife event
    // document.dispatchEvent(new CustomEvent('living-wccell-STOP'));
  }
}

_stopLife() {
  clearInterval(this.growthId);
  clearInterval(this.moveId);
  clearTimeout(this._deathTimer);
  document.removeEventListener('living-wccell-move', this._searchForACell);
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