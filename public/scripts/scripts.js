// scripts.js

async function fetchPrices(type) {
    try {
        const response = await fetch(`/api/quotes/${type}`);
        const result = await response.json();
        if (result.message === "success") {
            displayTable(result.data);
        } else {
            alert('failed');
        }
    } catch (error) {
        alert('failed');
    }
}

function displayTable(data) {
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';  // 清空之前的表格

    if (data.length === 0) {
        tableContainer.innerHTML = '<p>empty</p>';
        return;
    }

    const table = document.createElement('table');
    table.id = 'prices-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>調整日期</th><th>價格</th>';
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const dataRow = document.createElement('tr');
        dataRow.innerHTML = `<td>${row.adjustment_date}</td><td>${row.price}</td>`;
        tbody.appendChild(dataRow);
    });
    table.appendChild(tbody);

    tableContainer.appendChild(table);
}

async function fetchPricesByDateRange() {
    const startDateInput = document.getElementById('start-date').value;
    const endDateInput = document.getElementById('end-date').value;

    if (!isValidDateFormat(startDateInput) || !isValidDateFormat(endDateInput)) {
        alert('日期格式應為0000-00-00！');
        return;
    }

    try {
        const response = await fetch(`/api/quotes/range?start=${startDateInput}&end=${endDateInput}`);
        const result = await response.json();

        if (result.message === "success") {
            displayTable(result.data);
        } else {
            alert('查詢失敗');
        }
    } catch (error) {
        alert('查詢失敗');
    }
}


function isValidDateFormat(date) {
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    return pattern.test(date);
}
