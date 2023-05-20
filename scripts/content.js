// タイマーリストを格納するMap
let timerList = new Map();

// タイマーリスト画面の表示
function displayTimerList() {
  const timerContainer = document.getElementById('timer-container');
  timerContainer.innerHTML = ''; // タイマーコンテナを初期化

  let totalTime = 0; // 合計時間

  // タイマーリストの表示
  timerList.forEach((timer, index) => {
    const timerItem = document.createElement('div');
    timerItem.classList.add('timer-item');
    timerItem.style.backgroundColor = timer.isStop ? 'lightgrey' : 'mintcream';

    const timerLabel = document.createElement('span');
    timerLabel.innerText = timer.isStop ? '■' : '▶';
    timerLabel.classList.add('timer-label');

    const timerValue = document.createElement('span');
    timerValue.innerText = formatTime(timer.count);
    timerValue.classList.add('timer-value');

    // タイマーを押下した際の再開処理
    timerItem.addEventListener('click', () => {
      if (timer.isStop) {
        resumeTimer(index);
      }
    });

    timerItem.appendChild(timerLabel);
    timerItem.appendChild(timerValue);
    timerContainer.appendChild(timerItem);

    totalTime += timer.count;
  });

  // 合計時間とリセットボタンの表示
  const totalTimeLabel = document.createElement('div');
  totalTimeLabel.innerText = '合計時間: ' + formatTime(totalTime);
  totalTimeLabel.classList.add('total-time-label');

  const resetButton = document.createElement('button');
  resetButton.innerText = 'リセット';
  resetButton.classList.add('reset-button');
  resetButton.addEventListener('click', resetTimers);

  timerContainer.appendChild(totalTimeLabel);
  timerContainer.appendChild(resetButton);
}

// タイマーのカウントアップ処理
function startTimer(index) {
  const timer = timerList.get(index);
  if (!timer.isStop) return; // カウントアップ中は処理しない

  timer.isStop = false;
  const timerValueElement = document.getElementsByClassName('timer-value')[index];

  timer.timerInterval = setInterval(() => {
    timer.count++;
    timerValueElement.innerText = formatTime(timer.count);
  }, 1000);
}

// タイマーの再開処理
function resumeTimer(index) {
  timerList.forEach((timer, timerIndex) => {
    if (index !== timerIndex) {
      stopTimer(timerIndex);
    }
  });

  startTimer(index);
}

// タイマーの停止処理
function stopTimer(index) {
  const timer = timerList.get(index);
  if (timer.isStop) return; // 停止中は処理しない

  timer.isStop = true;
  clearInterval(timer.timerInterval);
}

// タイマーのリセット処理
function resetTimers() {
  timerList.forEach((timer) => {
    timer.count = 0;
    stopTimer(timer.index);
  });

  displayTimerList();
}

// 時間をhh:mm形式にフォーマットする
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${String  .padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// オプション画面の表示
function displayOptions() {
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = ''; // オプションコンテナを初期化

  // タイマーリストの表示
  timerList.forEach((timer, index) => {
    const timerItem = document.createElement('div');
    timerItem.classList.add('timer-item');

    const timerLabelInput = document.createElement('input');
    timerLabelInput.type = 'text';
    timerLabelInput.value = timer.label;
    timerLabelInput.addEventListener('input', (event) => {
      updateTimerLabel(index, event.target.value);
    });

    const displayOrderInput = document.createElement('input');
    displayOrderInput.type = 'number';
    displayOrderInput.value = timer.displayOrder;
    displayOrderInput.addEventListener('input', (event) => {
      updateDisplayOrder(index, event.target.value);
    });

    const hiddenCheckbox = document.createElement('input');
    hiddenCheckbox.type = 'checkbox';
    hiddenCheckbox.checked = timer.isHidden;
    hiddenCheckbox.addEventListener('change', (event) => {
      toggleVisibility(index, event.target.checked);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = '削除';
    deleteButton.addEventListener('click', () => {
      deleteTimer(index);
    });

    timerItem.appendChild(timerLabelInput);
    timerItem.appendChild(displayOrderInput);
    timerItem.appendChild(hiddenCheckbox);
    timerItem.appendChild(deleteButton);

    optionsContainer.appendChild(timerItem);
  });

  // タイマー追加ボタンの表示
  const addTimerButton = document.createElement('button');
  addTimerButton.innerText = 'タイマー追加';
  addTimerButton.classList.add('add-timer-button');
  addTimerButton.addEventListener('click', addTimer);

  optionsContainer.appendChild(addTimerButton);
}

// タイマーのラベル更新
function updateTimerLabel(index, label) {
  const timer = timerList.get(index);
  timer.label = label;
}

// 表示順の更新
function updateDisplayOrder(index, displayOrder) {
  const timer = timerList.get(index);
  timer.displayOrder = parseInt(displayOrder);
}

// 非表示フラグの切り替え
function toggleVisibility(index, isHidden) {
  const timer = timerList.get(index);
  timer.isHidden = isHidden;
}

// タイマーの削除
function deleteTimer(index) {
  timerList.delete(index);
  displayOptions();
}

// タイマーの追加
function addTimer() {
  const newIndex = timerList.size;
  const newTimer = {
    displayOrder: newIndex,
    label: '',
    isHidden: false,
    count: 0,
    isStop: true,
  };
  timerList.set(newIndex, newTimer);
  displayOptions();
}

// タイマーリストの初期データ
function initializeTimerList() {
  // 既定のタイマーを追加
  const defaultTimer = {
    displayOrder: 0,
    label: '',
    isHidden: false,
    count: 0,
    isStop: true,
  };
  timerList.set(0, defaultTimer);
}

// 初期化処理
function initialize() {
  initializeTimerList();
  displayTimerList();
  displayOptions();
}

// ページロード時に初期化処理を実行
document.addEventListener('DOMContentLoaded', initialize);
