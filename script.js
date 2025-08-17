// 게임 시작할 때 모달창 열기
document.addEventListener('DOMContentLoaded', () => {
  showModal("2048 게임", "숫자를 합쳐 2048을 만드는 게임입니다. 게임판 내에서 스와이프하거나 방향키로 조작할 수 있습니다.")
});

// 모달창 닫기
document.getElementById('btn-confirm').addEventListener('click', () => {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
});

// 모달창 바깥을 클릭하면 닫기
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// 모달창 표시
function showModal(title, content) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');

  modalTitle.textContent = title;
  modalMessage.textContent = content;
  modal.style.display = 'block';
}


// 초기 변수 설정
let grid = [
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0]
]; // 게임판
let score = 0; // 현재 점수
let success = false; // 2048이 완성됐는지 확인하는 변수

// 게임 시작화면 세팅
createNumber();
createNumber();
display();

// 임의의 숫자를 임의의 위치에 생성하는 함수
function createNumber() {
  let hasZero = false;
  o:
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        hasZero = true;
        break o;
      }
    }
  }
  if (hasZero) {
    let x = Math.floor(Math.random() * 4);
    let y = Math.floor(Math.random() * 4);
    if (grid[x][y] === 0) {
      grid[x][y] = Math.random() < 0.9 ? 2 : 4;
    } else {
      createNumber();
    }
  }
}

// 현재 게임판을 화면에 출력하는 함수
function display() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let cell = document.getElementById(`cell-${i}-${j}`);
      cell.style.backgroundColor = getColor(grid[i][j]);
      cell.textContent = grid[i][j] === 0 ? '' : grid[i][j];
    }
  }
  let scorePrint = document.getElementById('score');
  scorePrint.textContent = score;
}

// 각 숫자에 맞는 색을 출력하는 함수
function getColor(num) {
  switch (num) {
    case 0:
      return '#cdc1b4';
    case 2:
      return '#eee4da';
    case 4:
      return '#ede0c8';
    case 8:
      return '#f2b179';
    case 16:
      return '#f59563';
    case 32:
      return '#f67c5f';
    case 64:
      return '#f65e3b';
    case 128:
      return '#edcf72';
    case 256:
      return '#edcc61';
    case 512:
      return '#edc850';
    default:
      return '#edc22e';
  }
}

// 스와이프 이벤트 관련 변수
const gameBoard = document.querySelector('.grid-container');
let startX = 0;
let startY = 0
let isSwiping = false;

gameBoard.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  isSwiping = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: false });

gameBoard.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;
  // 스와이프 중 브라우저 스크롤 방지 (passive:false 필수)
  e.preventDefault();
}, { passive: false });

gameBoard.addEventListener('touchend', (e) => {
  if (!isSwiping) return;
  isSwiping = false;

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const dx = endX - startX;
  const dy = endY - startY;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const THRESHOLD = 10; // 최소 스와이프 거리

  if (Math.max(absX, absY) < THRESHOLD) return;

  if (absX > absY) {
    move(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
  } else {
    move(dy > 0 ? 'ArrowDown' : 'ArrowUp');
  }
}, { passive: false });

// 키보드 입력
document.addEventListener('keydown', (e) => {
  move(e.key);
});

// 스와이프 or 방향키 입력에 따라 이동하는 함수
function move(key) {
  let canMove = false;
  switch (key) {
    case 'ArrowUp':
      canMove = moveUp();
      break;
    case 'ArrowDown':
      canMove = moveDown();
      break;
    case 'ArrowLeft':
      canMove = moveLeft();
      break;
    case 'ArrowRight':
      canMove = moveRight();
      break;
    default:
      return;
  }
  if (canMove) {
    createNumber();
    display();
    success = checkGameEnd(success) || success;
  }
}

function moveUp() {
  let canMove = false;
  for (let i = 0; i < 4; i++) {
    let column = [grid[0][i], grid[1][i], grid[2][i], grid[3][i]];
    column = removeZero(column);
    column = mergeCells(column);
    column = addZero(column);
    for (let j = 0; j < 4; j++) {
      if (grid[j][i] !== column[j]) {
        canMove = true;
        grid[j][i] = column[j];
      }
    }
  }
  return canMove;
}

function moveDown() {
  let canMove = false;
  for (let i = 0; i < 4; i++) {
    let column = [grid[0][i], grid[1][i], grid[2][i], grid[3][i]];
    column = removeZero(column);
    column = mergeCellsReverse(column);
    column = addZeroReverse(column);
    for (let j = 0; j < 4; j++) {
      if (grid[j][i] !== column[j]) {
        canMove = true;
        grid[j][i] = column[j];
      }
    }
  }
  return canMove;
}

function moveLeft() {
  let canMove = false;
  for (let i = 0; i < 4; i++) {
    let row = [grid[i][0], grid[i][1], grid[i][2], grid[i][3]];
    row = removeZero(row);
    row = mergeCells(row);
    row = addZero(row);
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] !== row[j]) {
        canMove = true;
        grid[i][j] = row[j];
      }
    }
  }
  return canMove;
}

function moveRight() {
  let canMove = false;
  for (let i = 0; i < 4; i++) {
    let row = [grid[i][0], grid[i][1], grid[i][2], grid[i][3]];
    row = removeZero(row);
    row = mergeCellsReverse(row);
    row = addZeroReverse(row);
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] !== row[j]) {
        canMove = true;
        grid[i][j] = row[j];
      }
    }
  }
  return canMove;
}

function removeZero(cells) {
  let newCells = [];
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] !== 0) {
      newCells.push(cells[i]);
    }
  }
  return newCells;
}

function mergeCells(cells) {
  let newCells = [];
  for (let i = 0; i < cells.length; i++) {
    if (i < cells.length - 1 && cells[i] === cells[i + 1]) {
      newCells.push(cells[i] * 2);
      score += cells[i] * 2;
      i++;
    } else {
      newCells.push(cells[i]);
    }
  }
  return newCells;
}

function mergeCellsReverse(cells) {
  let newCells = [];
  for (let i = cells.length - 1; i >= 0; i--) {
    if (i >= 1 && cells[i] === cells[i - 1]) {
      newCells.unshift(cells[i] * 2);
      score += cells[i] * 2;
      i--;
    } else {
      newCells.unshift(cells[i]);
    }
  }
  return newCells;
}

function addZero(cells) {
  while (cells.length < 4) {
    cells.push(0);
  }
  return cells;
}

function addZeroReverse(cells) {
  while (cells.length < 4) {
    cells.unshift(0);
  }
  return cells;
}

// 게임 종료를 확인하는 함수
function checkGameEnd(success) {
  let hasZero = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!success && grid[i][j] === 2048) {
        showModal("2048 성공!", `현재 점수는 ${score}점 입니다. 이어서 진행하려면 확인 후 계속 진행해주세요.`);
        return true;
      }
      if (grid[i][j] === 0) {
        hasZero = true;
      }
    }
  }
  if (hasZero) {
    return false;
  }

  let canMove = false;
  o:
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] === grid[i][j + 1] || grid[j][i] === grid[j + 1][i]) {
        canMove = true;
        break o;
      }
    }
  }
  if (canMove) {
    return false;
  }

  showModal("게임 종료", `최종 점수는 ${score}점 입니다. 다시 시작하려면 확인 후 새로고침해주세요.`);
  return false;
}
