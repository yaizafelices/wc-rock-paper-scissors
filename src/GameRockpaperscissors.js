import { html, LitElement } from 'lit';
import { RockPaperScissorsStyles } from'./styles-wc-rock-paper-scissors.js';

export class GameRockpaperscissors extends LitElement {

  static get properties() {
    return  {
      position: { type: Object },
      diameter: { type: String },
      item: { type: Object },
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
  this.id = `wccell-${this.randomNum(1, 1000)}-${  new Date().getTime()}`;
  this.position = {
    top: `${this.randomNum(this._maxRadius, this._maxHeight - this._maxRadius)}px`,
    left: `${this.randomNum(this._maxRadius, this._maxWidth - this._maxRadius)}px`
  };
  this.diameter = '40px';

  this.rockObject = { 
    type: 'R',
    image: 'rock.png',
    description:'rock'
  };

  this.paperObject = { 
    type: 'P',
    image: 'paper.png',
    description:'paper'
  };

  this.scissorsObject = { 
    type: 'S',
    image: 'scissors.png',
    description:'scissors'
  };

  this.itemOptions = [
    this.rockObject,
    this.paperObject,
    this.scissorsObject
  ];

  this.item = this.randomItem(this.itemOptions);

  this._moveTime = 200;
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
          item: this.item
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
      const myItemType = this.item.type;
      const otherItemType = e.detail.item.type;

      if ((myItemType === 'P' && otherItemType === 'S') || (otherItemType === 'P' && myItemType === 'S')) {
        this.item = this.scissorsObject;
        e.detail.item = this.scissorsObject;
      }

      if ((myItemType === 'R' && otherItemType === 'S') || (otherItemType === 'R' && myItemType === 'S')) {
        this.item = this.rockObject;
        e.detail.item = this.rockObject;
      }

      if ((myItemType === 'R' && otherItemType === 'P') || (otherItemType === 'R' && myItemType === 'P')) {
        this.item = this.paperObject;
        e.detail.item = this.paperObject;
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

  randomItem(itemOptions) {
    return itemOptions[this.randomNum(0, 2)];
  }


  render() {
    return html`
      <div class="cell"><img src='../images/${this.item.image}' alt='${this.item.description}' class='logo ${this.item.description}'></div>
    `;
  }
}