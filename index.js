let gameBox = document.getElementById('gameBox');
let cover = document.getElementById('cover');
let massageW = document.getElementById('massageWindows');
let timeEl = massageW.getElementsByClassName('time')[0]; // 结算界面显示的时间
let titleEl = massageW.getElementsByClassName('title')[0]; // 结算界面显示的信息
let restartBtn = massageW.getElementsByClassName('restart')[0];
let levelBtn = cover.getElementsByClassName('setLevel')[0].getElementsByTagName('a');
let dataBox = document.getElementById('information');
let timeEle = dataBox.getElementsByClassName('time')[0]; // 游戏界面显示的时间
let surplus = dataBox.getElementsByClassName('surplus')[0]; // 游戏界面显示剩余地雷数
let box = document.getElementById('minefields');
let hacker = document.getElementById('hacker');
let hackerBtn = document.getElementsByClassName('hacker-wrapper')[0].getElementsByTagName('a')[0];
let hackerMassage = document.getElementsByClassName('hacker-wrapper')[0].getElementsByTagName('span')[0];
let divs = box.getElementsByTagName('div');
let data = [];
let widthLen = 10; // 每一行的个数
let heightLen = 10; // 每一列的个数
let landmines = 10;
let normals = 90;
let normalsLen = 90;
let landmine = { // 地雷
  type: 1,
  click: false,
  count: 0
};
let normal = { // 非地雷
  type: 0,
  click: false,
  count: 0
};

let timer = null;
let time = 0;


let levelList = [
  {
    widthLen: 10,
    heightLen: 10,
    landmines: 10,
    normals: 90
  },
  {
    widthLen: 20,
    heightLen: 20,
    landmines: 40,
    normals: 360
  },
  {
    widthLen: 30,
    heightLen: 30,
    landmines: 100,
    normals: 800
  }
]

for (let i = 0; i < levelBtn.length; i++) {
  levelBtn[i].index = i;
  levelBtn[i].addEventListener('click', startGame);
}

function startGame() {
  data = [];
  let index = this.index;
  time = 0;
  timer = setInterval(() => {
    time++;
    timeEle.innerHTML = '已用时：'+ Math.floor(time / 60) +'分'+ (time % 60) +'秒';
  }, 1000)
  widthLen = levelList[index].widthLen;
  heightLen = levelList[index].heightLen;
  landmines = levelList[index].landmines;
  normals = levelList[index].normals;
  normalsLen = normals;
  surplus.innerHTML = '还剩'+ normalsLen +'块安全区';
  box.style.width = (32 * widthLen) + 'px';
  box.style.height = (32 * heightLen) + 'px';
  hacker.style.width = (32 * widthLen) + 'px';
  hacker.style.height = (32 * heightLen) + 'px';
  initData();
  cover.style.display = 'none';
  gameBox.style.display = 'block';
  hackerMassage.style.display = 'none';
  hackerBtn.style.display = 'block';
}

function initData () {
  for (let i = 0; i < landmines; i++) {
    data.push(JSON.parse(JSON.stringify(landmine))); // 生成雷
  }
  for (let i = 0; i < normals; i++) {
    data.push(JSON.parse(JSON.stringify(normal)));  // 生成正常
  }
  data.sort(() => {
    return Math.random() - 0.5; // 打乱顺序
  })
  for (let i = 0; i < data.length; i++) {
    data[i].index = i;
  }
  // console.log(data);
  createEl();
}


function createEl() {
  let str = '';
  let str2 = '';
  box.innerHTML = '';
  hacker.innerHTML = '';
  for(let i = 0; i < data.length; i++){
    // str += '<div>' + data[i].type + '</div>';
    // str += '<div>'+ i +'</div>';
    str += '<div></div>';
  }
  for(let i = 0; i < data.length; i++){
    if (data[i].type === 1) {
      str2 += '<div>砰</div>';
    } else {
      str2 += '<div></div>';
    }
    
  }
  box.innerHTML = str;
  hacker.innerHTML = str2;

  divs = box.getElementsByTagName('div');
  for(let i = 0; i < divs.length; i++){
    divs[i].index = i;
    // divs[i].innerHTML = divs[i].item.index;
    divs[i].addEventListener('click', divClick)
  }
}
function divClick() {
  let index = this.index;
  if (data[index].type === 1) { // 点到雷
    settlement (false);
    return;
  }
  testingData(data[index], index);
}

function testingData(item, index) { // 检测点击元素周围
  if (item.click) {
    // console.log('已经检测过了');
    return;
  }
  data[index].click = true;

  let isLeftEdge = false;
  let isRightEdge = false;

  for (let i = 1; i <= heightLen; i++) {
    if (isRightEdge) {
      // console.log('isRightEdge已经为true了');
      break;
    }
    let num = i * heightLen - 1
    if (index === num) {
      isRightEdge = true;
    }
  }

  for (let i = 1; i < heightLen; i++) {
    if (isLeftEdge) {
      // console.log('isLeftEdge已经为true了');
      break;
    }
    let num = i * heightLen
    if (index === num) {
      isLeftEdge = true;
    }
  }

  let brothers = [];  // 元素的周围
  if (index === 0)  {
    brothers = [data[1], data[widthLen], data[widthLen + 1]];   
    // console.log('点的是左上角:', brothers);
  } else if (index === (widthLen - 1)) {
    brothers = [data[widthLen - 2], data[(widthLen * 2) - 2], data[(widthLen * 2) - 1]]; 
    // console.log('点的是右上角', brothers);
  } else if(index === (widthLen * (heightLen - 1))) {
    brothers = [data[widthLen * (heightLen - 2)], data[(widthLen * (heightLen - 2)) + 1], data[(widthLen * (heightLen - 1)) + 1]];
    // console.log('点的是左下角', brothers);
  } else if (index === ((widthLen * heightLen) - 1)) {
    brothers = [data[widthLen * (heightLen - 2) + (widthLen - 2)], data[widthLen * (heightLen - 2) + (widthLen - 1)], data[(widthLen * heightLen) - 2]];
    // console.log('点的是右下角', brothers);
  } else if (isLeftEdge) {
    brothers = [data[index - widthLen], data[index - widthLen + 1], data[index + 1], data[index + widthLen], data[index + widthLen + 1]]
    // console.log('点的是左侧', brothers);
  } else if (isRightEdge) {
    brothers = [data[index - widthLen - 1], data[index - widthLen], data[index - 1], data[index + widthLen - 1], data[index + widthLen]]
    // console.log('点的是右侧', brothers);
  } else {
    brothers = [data[index - widthLen - 1], data[index - widthLen], data[index - widthLen + 1], data[index - 1], data[index + 1], data[index + widthLen - 1], data[index + widthLen], data[index + widthLen + 1]];
    // console.log('点的不是角落', brothers);
  }
  let count = brothers.filter((item) => {
    if (item) {
      return item.type === 1;
    }
  }).length

  if (count > 0) { // 周围有雷
    // console.log(count);
    divs[index].innerHTML = count;
    if (count <= 2) {
      divs[index].style.color = 'blue';
    } else if (count > 2 && count < 7) {
      divs[index].style.color = 'red';
    } else {
      divs[index].style.color = 'green';
    }
    
    winCount();
  } else { // 周围没有雷
    divs[index].innerHTML = '';
    divs[index].style.background = '#949393';
    winCount();
    let normals = brothers.filter((item) => {
      if (item) {
        return !item.click
      }
    })
    // console.log(normals);
    if (normals.length === 0) {
      return;
    }
    for (let i = 0;i < normals.length; i++) {
      if (normals[i]) {
        testingData(normals[i], normals[i].index);
      }
    }
  }
}
function winCount() {
  normalsLen--;
  surplus.innerHTML = '还剩'+ normalsLen +'块安全区';
  if (normalsLen === 0) {
    settlement (true);
  }
}

function settlement (state) {
  if (state) {
    titleEl.innerHTML = '恭喜你，胜利了！'
  } else {
    titleEl.innerHTML = '真遗憾，你踩到地雷了...'
  }
  clearInterval(timer);
  let min = Math.floor(time / 60);
  let sec = time % 60;
  // console.log(min + '分' + sec + '秒');
  timeEl.innerHTML = '用时：' + min + '分' + sec + '秒';
  gameBox.style.display = 'none';
  massageW.style.display = 'block';
}

restartBtn.addEventListener('click', restart);

function restart() {
  gameBox.style.display = 'none';
  massageW.style.display = 'none';
  cover.style.display = 'block';
}
hackerBtn.addEventListener('click', () => {
  hackerBtn.style.display = 'none';
  hackerMassage.style.display = 'block';
  hacker.style.display = 'block';
  hacker.style.top = box.getBoundingClientRect().bottom + 50 + 'px';
})
