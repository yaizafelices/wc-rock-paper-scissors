import { css } from 'lit';

export const RockPaperScissorsStyles = css `
:host {
    display: block;
  }
.cell {
    position: absolute;
    border-radius: 50%;
    cursor: pointer;
    animation-duration: 2s;
    animation-name: show;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  .logo{
    height: 40px;
  }


`;