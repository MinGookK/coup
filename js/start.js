'use strict';
const main = document.querySelector('#main');
const qna = document.querySelector('#qna');
const resultPage = document.querySelector('#result');
const startQna = document.querySelector('.startQna');
let status = document.querySelector('.statusBar');
const end = qnaList.length;
let resultType = [];
let resultList = infoList;
let sortDirection = true;
for (let i = 0; i < resultList.length; i++) {
  resultList[i].check = 0;
}

startQna.addEventListener('click', () => {
  changePage(main, qna);
  showPage(0);
});
function changePage(remove, change) {
  remove.style.display = 'none';
  change.style.display = 'block';
}

function showPage(qIdx) {
  if (qIdx === end) {
    showResult();
    return 0;
  }
  showSelect(qIdx);
  showQuestion(qIdx);
}

//qnaList의 qIdx번째 질문을 html에 생성한다.
function showQuestion(qIdx) {
  let q = document.querySelector('.qBox');
  q.innerHTML = qnaList[qIdx].q;
}

// qnaList의 qIdx번째 질문type에 따라 다른 버튼을 생성한다.
// qIdx가 endpoin랑 같아지면 Result 페이지 생성.
function showSelect(qIdx) {
  status.style.width = ((qIdx + 1) / end) * 100 + '%';
  let a = document.querySelector('.aBox');
  if (qIdx === qnaList.length) {
    let container = document.querySelector('.container');
    container.style.display = 'none';
    showResult();
  }
  switch (qnaList[qIdx].aType) {
    // 단일선택 문항
    case 'select':
      var info = document.createElement('p');
      info.classList.add('info');
      info.innerHTML = qnaList[qIdx].info;
      for (let i = 0; i < qnaList[qIdx].a.length; i++) {
        let answer = document.createElement('button');
        answer.classList.add('answerList');
        a.appendChild(answer);
        answer.innerHTML = qnaList[qIdx].a[i].answer;
        answer.addEventListener('click', () => {
          resultType.push(qnaList[qIdx].a[i].type);
          let children = document.querySelectorAll('.answerList');
          for (let i = 0; i < children.length; i++) {
            children[i].disabled = true;
            children[i].style.display = 'none';
          }
          info.style.display = 'none';
          showSelect(++qIdx);
          showQuestion(qIdx++);
        });
      }
      a.appendChild(info);
      break;

    // 복수 선택 문항
    case 'multSelect':
      var info = document.createElement('p');
      info.classList.add('info');
      info.innerHTML = qnaList[qIdx].info;
      for (let i = 0; i < qnaList[qIdx].a.length; i++) {
        let answer = document.createElement('input');
        answer.setAttribute('type', 'checkbox');
        answer.setAttribute('id', i);
        answer.setAttribute('name', qIdx);
        answer.setAttribute('value', qnaList[qIdx].a[i].type);
        answer.classList.add('answerList');
        a.appendChild(answer);
        let label = document.createElement('label');
        label.setAttribute('for', i);
        label.innerHTML = qnaList[qIdx].a[i].answer;
        label.classList.add('answerList');
        a.appendChild(label);
        label.addEventListener('click', () => {
          label.classList.toggle('checked');
        });
      }
      a.appendChild(info);
      let next = document.createElement('button');
      next.classList.add('button-next');
      next.classList.add('next');
      a.appendChild(next);
      next.innerHTML = '다음';

      next.addEventListener('click', () => {
        let query = `input[name = '${qIdx}']:checked`;
        const selecedEls = document.querySelectorAll(query);
        let push = [];
        for (let i = 0; i < selecedEls.length; i++) {
          push.push(selecedEls[i].value);
        }
        resultType.concat(push);
        let children = document.querySelectorAll('.answerList');
        for (let i = 0; i < children.length; i++) {
          children[i].disabled = true;
          children[i].style.display = 'none';
        }
        info.style.display = 'none';
        next.style.display = 'none';
        showSelect(++qIdx);
        showQuestion(qIdx++);
      });
      break;
  }
}

// 결과페이지를 보여준다.
function showResult() {
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

// resultList를 바탕으로 적합한 아이템을 생성한다.
function createItem() {
  let items = document.querySelector('.items');
  let dataHtml = '';
  for (let i = 0; i < resultList.length; i++) {
    dataHtml += `
    <div class="item">
      <a href="${resultList[i].link}" target="_blank"><img src="${resultList[i].img}" alt="${resultList[i].name}"></a>
      <div class="protein-info">
        <h2>${resultList[i].name}</h2>
        <ul class="nutrient">
          <h3>10g당 영양소 함량</h3>
          <li>단백질: ${resultList[i].protein_ten}g</li>
          <li>지방: ${resultList[i].fat_ten}g</li>
          <li>탄수화물: ${resultList[i].carbo_ten}g</li>
          <li>칼로리: ${resultList[i].cal_ten}kcal</li>
        </ul>
      </div>
    </div>`;
  }
  items.innerHTML = dataHtml;
}

//영양소 기준으로 필터
const sortProteinBtn = document.querySelector('.sortProtein');
const sortCalBtn = document.querySelector('.sortCal');

sortProteinBtn.addEventListener('click', () => {
  sortDirection = !sortDirection;
  sortProtein(sortDirection);
  sortProteinBtn.classList.toggle('checked');
  if (sortCalBtn.hasAttribute('disabled')) {
    sortCalBtn.removeAttribute('disabled', '');
  } else {
    sortCalBtn.setAttribute('disabled', '');
  }

  createItem();
});
sortCalBtn.addEventListener('click', () => {
  sortDirection = !sortDirection;
  sortCal(sortDirection);
  sortCalBtn.classList.toggle('checked');
  if (sortProteinBtn.hasAttribute('disabled')) {
    sortProteinBtn.removeAttribute('disabled', '');
  } else {
    sortProteinBtn.setAttribute('disabled', '');
  }
  createItem();
});

function sortProtein(sort) {
  resultList = resultList.sort((a, b) => {
    return sort ? a.protein_ten - b.protein_ten : b.protein_ten - a.protein_ten;
  });
}
function sortCal(sort) {
  resultList = resultList.sort((a, b) => {
    return sort ? b.cal_ten - a.cal_ten : a.cal_ten - b.cal_ten;
  });
}
