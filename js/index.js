const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

const getMonthlyData = () => {
  return months.reduce((data, month) => {
    const income = parseFloat(document.getElementById(`${month}-income`).value) || 0;
    const expenses = parseFloat(document.getElementById(`${month}-expenses`).value) || 0;

    data.income.push(income);
    data.expenses.push(expenses);

    return data;
  }, { income: [], expenses: [] });
};

const onLoad = () => {
  const usernameInput = document.getElementById('username');
  usernameInput.addEventListener('input', ({ target }) => {
    const { value: username } = target;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const isValid = regex.test(username);
    target.style.borderColor = isValid ? 'green' : 'red';

    localStorage.setItem('username', username);
  });

  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months.map(month => month.charAt(0).toUpperCase() + month.slice(1)),
      datasets: [
        {
          label: 'Income',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: [],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  document.getElementById('chart-tab').addEventListener('click', () => {
    const monthlyData = getMonthlyData();
    myChart.data.datasets[0].data = monthlyData.income;
    myChart.data.datasets[1].data = monthlyData.expenses;
    myChart.update();
  });

  document.getElementById('download').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = document.getElementById('myChart').toDataURL('image/png');
    link.download = 'chart.png';
    link.click();
  });

  const getStorageData = key => JSON.parse(localStorage.getItem(key) ?? '{}');

  const setStorageData = (key, month, value) => {
    const data = getStorageData(key);
    localStorage.setItem(key, JSON.stringify({ ...data, [month]: value }));
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

    monthIncomeElement.addEventListener('change', ({ target }) => {
      setStorageData(dataIncomeKey, month, target.value);
    });

    monthExpensesElement.addEventListener('change', ({ target }) => {
      setStorageData(dataExpensesKey, month, target.value);
    });
  });
};

window.onload = onLoad;