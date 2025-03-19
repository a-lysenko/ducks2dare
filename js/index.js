const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

function getMonthlyData() {
  const data = {
    income: [],
    expenses: []
  };

  months.forEach(month => {
    const income = document.getElementById(`${month}-income`).value;
    const expenses = document.getElementById(`${month}-expenses`).value;

    data.income.push(parseFloat(income) || 0);
    data.expenses.push(parseFloat(expenses) || 0);
  });

  return data;
}

function onLoad() {

  document.getElementById('username').addEventListener('input', function () {
    const username = this.value;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const isValid = regex.test(username);
    this.style.borderColor = isValid ? 'green' : 'red';

    localStorage.setItem('username', username);

  });

  const ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'January', 'February',
        'March', 'April', 'May',
        'June', 'July', 'August',
        'September', 'October', 'November',
        'December'
      ],
      datasets: [{
        label: 'Income',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }, {
        label: 'Expenses',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  document.getElementById('chart-tab').addEventListener('click', function () {
    const monthlyData = getMonthlyData();
    myChart.data.datasets[0].data = monthlyData.income;
    myChart.data.datasets[1].data = monthlyData.expenses;
    myChart.update();
  });

  // Download canvas as an image
  document.getElementById('download').addEventListener('click', function () {
    var link = document.createElement('a');
    link.href = document.getElementById('myChart').toDataURL('image/png');
    link.download = 'chart.png';
    link.click();
  });

  function getStorageData(key) {
    const dataRaw = localStorage.getItem(key) ?? null;
    return JSON.parse(dataRaw) || {};
  };

  function setStorageData(key, month, value) {
    const data = getStorageData(key);
    const updatedData = { ...data, ...{ [month]: value } };
    localStorage.setItem(key, JSON.stringify(updatedData));
  };

  const dataIncomeKey = 'dataIncome';
  const dataExpensesKey = 'dataExpenses';

  const incomeStoredData = getStorageData(dataIncomeKey);
  const expensesStoredData = getStorageData(dataExpensesKey);

  months.forEach(month => {
    const monthIncomeElement = document.getElementById(`${month}-income`);
    const monthExpensesElement = document.getElementById(`${month}-expenses`);
    if (incomeStoredData[month]) {
      monthIncomeElement.value = incomeStoredData[month];
    }
    if (expensesStoredData[month]) {
      monthExpensesElement.value = expensesStoredData[month];
    }

    monthIncomeElement.addEventListener('change', function () {
      setStorageData(dataIncomeKey, month, this.value);
    });

    monthExpensesElement.addEventListener('change', function () {
      setStorageData(dataExpensesKey, month, this.value);
    });
  });

}

window.onload = onLoad;