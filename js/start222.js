const main = document.querySelector('#main');
const qna = document.querySelector('#qna');
const resultPage = document.querySelector('#result');
const startQna = document.querySelector('.startQna');
const btnStart = document.querySelector('.start');
const end = qnaList.length;
let status = document.querySelector('.statusBar');
let resultType = [];
let resultList = infoList;
let sortDirection = true;
for (let i = 0; i < resultList.length; i++) {
  resultList[i].check = 0;
}

// answerText가 포함된 버튼을 생성한다.
function addBtn(answerText, qIdx, idx) {
  let a = document.querySelector('.aBox');
  let answer = document.createElement('button');
  answer.classList.add('answerList');
  a.appendChild(answer);
  answer.innerHTML = answerText;

  answer.addEventListener('click', () => {
    resultType.push(qnaList[qIdx].a[idx].type);
    let children = document.querySelectorAll('.answerList');
    for (let i = 0; i < children.length; i++) {
      children[i].disabled = true;
      children[i].style.display = 'none';
    }
    goNext(++qIdx);
  });
}

// resultList에 담긴 item들을 html에 생성해줌.
function createItem() {
  let items = document.querySelector('.items');
  // let item = document.createElement('div');
  // item.classList.add('item');
  // items.appendChild(item);
  let dataHtml = '';

  for (let i = 0; i < resultList.length; i++) {
    dataHtml += `
    <div class="item">
    <a href="${resultList[i].link}" target="_blank"><img src="${resultList[i].img}" alt="${resultList[i].name}"></a>
    <h2>${resultList[i].name}</h2>
    <ul class="nutrient">
      <h3>10g당 영양소 함량</h3>
      <li>단백질: ${resultList[i].protein_ten}g</li>
      <li>지방: ${resultList[i].fat_ten}g</li>
      <li>탄수화물: ${resultList[i].carbo_ten}g</li>
      <li>칼로리: ${resultList[i].cal_ten}g</li>
    </ul>
    </div>`;
  }
  items.innerHTML = dataHtml;
}

// Button을 누를 때마다 새로운 question과 답이 생성된다.
function goNext(qIdx) {
  if (qIdx === end) {
    goResult();
    return 0;
  }
  let q = document.querySelector('.qBox');
  q.innerHTML = qnaList[qIdx].q;

  for (let i in qnaList[qIdx].a) {
    addBtn(qnaList[qIdx].a[i].answer, qIdx, i);
  }
  status.style.width = ((qIdx + 1) / end) * 100 + '%';
}

function goResult() {
  resultType = resultType.filter((e) => e !== null);
  console.log(resultType);
  for (let i = 0; i < infoList.length; i++) {
    for (let j = 0; j < resultType.length; j++) {
      if (infoList[i].type.find((e) => e == resultType[j])) {
        console.log(`${i}번째 아이템 hit!`);
        resultList[i].check += 1;
      }
    }
  }
  qna.style.display = 'none';
  resultPage.style.display = 'block';

  resultList = resultList.filter((items) => items.check === resultType.length);
  console.log(resultList);

  createItem();
}
// 시작버튼을 누르면 메인페이지가 없어지고 qna 화면이 나옴
function start() {
  main.style.display = 'none';
  qna.style.display = 'block';
  let qIdx = 0;
  goNext(qIdx);
}

startQna.addEventListener('click', () => {
  start();
});

//click Evt
const sortProteinBtn = document.querySelector('.sortProtein');
const sortCalBtn = document.querySelector('.sortCal');

sortProteinBtn.addEventListener('click', () => {
  sortDirection = !sortDirection;
  sortProtein(sortDirection);
  createItem();
});
sortCalBtn.addEventListener('click', () => {
  sortDirection = !sortDirection;
  sortCal(sortDirection);
  createItem();
});

function sortProtein(sort) {
  resultList = resultList.sort((a, b) => {
    return sort ? a.protein_ten - b.protein_ten : b.protein_ten - a.protein_ten;
  });
}
function sortCal(sort) {
  resultList = resultList.sort((a, b) => {
    return sort ? a.cal_ten - b.cal_ten : b.cal_ten - a.cal_ten;
  });
}
