import { html, LitElement } from 'lit';
import { RockPaperScissorsStyles } from'./styles-wc-rock-paper-scissors.js';

export class GameRockpaperscissors extends LitElement {

  static get properties() {
    return  {
      position: { type: Object },
      diameter: { type: String },
      letter: { type: String },
      memory: { type: Array },
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
  this.id = `wccell-${this.randomNum(1, 1000)}`;
  this.position = {
    top: `${this.randomNum(this._maxRadius, this._maxHeight - this._maxRadius)}px`,
    left: `${this.randomNum(this._maxRadius, this._maxWidth - this._maxRadius)}px`
  };
  this.diameter = '40px';

  this.lettersOptions = ['R', 'P', 'S'];
  this.letter = this.randomLetter(this.lettersOptions);
  this.color = this.colorOfLetter(this.letter);

  this._moveTime = 500;
  this.memory = [];

  this.move = this.move.bind(this);

  this._searchForACell = this._searchForACell.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.moveId = setInterval(this.move, this._moveTime);
    document.addEventListener('living-wccell-move', this._searchForACell);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('living-wccell-move', this._searchForACell);
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
    styles.backgroundColor = this.color;
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
    // console.log(e);
    if (!this.memory.includes(e.detail.id)) {
      const myLetter = this.letter;
      const otherLetter = e.detail.letter;

      if ((myLetter === 'P' && otherLetter === 'S') || (otherLetter === 'P' && myLetter === 'S')) {
        this.letter = 'S';
        e.detail.letter = 'S';
        this.color = this.colorOfLetter(this.letter);
      }

      if ((myLetter === 'R' && otherLetter === 'S') || (otherLetter === 'R' && myLetter === 'S')) {
        this.letter = 'R';
        e.detail.letter = 'R';
        this.color = this.colorOfLetter(this.letter);
      }

      if ((myLetter === 'R' && otherLetter === 'P') || (otherLetter === 'R' && myLetter === 'P')) {
        this.letter = 'P';
        e.detail.letter = 'P';
        this.color = this.colorOfLetter(this.letter);
      }

    }
  }

  _insertCell(e) {
    const idParts = this.id.split('-');
    const idPartsDetail = e.detail.id.split('-');
    const id = `${idParts[0]}-${idParts[1]+idPartsDetail[1]}-${new Date().getTime()}`;
    // console.log(`created cell with id ${id}`);
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

  randomLetter(lettersOptions) {
    return lettersOptions[this.randomNum(0, 2)];
  }

  colorOfLetter(letter) {
    this._null = null;
    if(letter === 'R'){
      return 'grey';
    }
    if(letter === 'P'){
      return 'blue';
    }
    return 'red';
  }

  render() {
    return html`
      <div class="cell">${this.letter}</div>
    `;
  }
}