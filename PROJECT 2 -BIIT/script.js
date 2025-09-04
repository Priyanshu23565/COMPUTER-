let targets = [];
let payments = [];

// Add Target
function addTarget() {
  const manager = document.getElementById('managerName').value.trim().toLowerCase();
  const students = parseInt(document.getElementById('studentCount').value);
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('targetDate').value;
  const scheme = document.getElementById('scheme').value;

  if (!manager || isNaN(students) || isNaN(amount) || !date || !scheme) {
    alert("❌ Please fill all target fields properly.");
    return;
  }

  targets.push({ manager, students, amount, date, scheme });
  alert("✅ Target Added!");
  clearTargetForm();
  updateManagerDropdown(); // Update dropdown
  renderReport();
}

// Add Payment
function addPayment() {
  const manager = document.getElementById('paymentManager').value;
  const amount = parseFloat(document.getElementById('paymentAmount').value);
  const date = document.getElementById('paymentDate').value;

  if (!manager || isNaN(amount) || !date) {
    alert("❌ Please fill all payment fields properly.");
    return;
  }

  payments.push({ manager, amount, date });
  alert("💰 Payment Recorded!");
  clearPaymentForm();
  renderReport();
}

// Clear Target Form
function clearTargetForm() {
  document.getElementById('managerName').value = '';
  document.getElementById('studentCount').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('targetDate').value = '';
}

// Clear Payment Form
function clearPaymentForm() {
  document.getElementById('paymentManager').value = '';
  document.getElementById('paymentAmount').value = '';
  document.getElementById('paymentDate').value = '';
}

// Filter
function filterData() {
  renderReport();
}

// Render Report & History
function renderReport() {
  const reportTable = document.getElementById('reportTable');
  const historyTable = document.getElementById('paymentHistoryTable');
  reportTable.innerHTML = "";
  historyTable.innerHTML = "";

  const yearFilter = document.getElementById('yearFilter').value;
  const schemeFilter = document.getElementById('schemeFilter').value;

  const managers = [...new Set(targets.map(t => t.manager))];

  managers.forEach(manager => {
    const managerTargets = targets.filter(t => t.manager === manager);
    const managerPayments = payments.filter(p => p.manager === manager);

    managerTargets.forEach(target => {
      const totalPayment = managerPayments.reduce((sum, p) => sum + p.amount, 0);
      const pending = target.amount - totalPayment;
      const lastPaymentDate = managerPayments.length > 0
        ? managerPayments[managerPayments.length - 1].date
        : 'N/A';
      const percentagePaid = ((totalPayment / target.amount) * 100).toFixed(2);

      // Filter by year
      let yearMatch = true;
      if (yearFilter !== "all") {
        const targetYear = parseInt(target.date.substring(0, 4));
        const [start, end] = yearFilter.split("-").map(Number);
        yearMatch = targetYear >= start && targetYear <= end;
      }

      // Filter by scheme
      let schemeMatch = schemeFilter === "all" || target.scheme === schemeFilter;

      if (yearMatch && schemeMatch) {
        const row = `<tr>
          <td>${capitalize(manager)}</td>
          <td>${target.students}</td>
          <td>₹${target.amount.toFixed(2)}</td>
          <td>₹${totalPayment.toFixed(2)}</td>
          <td>₹${pending.toFixed(2)}</td>
          <td>${lastPaymentDate}</td>
          <td>${target.scheme}</td>
          <td>${target.date}</td>
          <td>${percentagePaid}%</td>
        </tr>`;
        reportTable.innerHTML += row;
      }
    });

    // Payment History
    managerPayments.forEach(payment => {
      const row = `<tr>
        <td>${capitalize(manager)}</td>
        <td>₹${payment.amount.toFixed(2)}</td>
        <td>${payment.date}</td>
      </tr>`;
      historyTable.innerHTML += row;
    });
  });
}

// Update Manager Dropdown (from targets)
function updateManagerDropdown() {
  const dropdown = document.getElementById('paymentManager');
  const managers = [...new Set(targets.map(t => t.manager))];

  dropdown.innerHTML = '<option value="">-- Select Manager --</option>';

  managers.forEach(manager => {
    const option = document.createElement('option');
    option.value = manager;
    option.textContent = capitalize(manager);
    dropdown.appendChild(option);
  });
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
