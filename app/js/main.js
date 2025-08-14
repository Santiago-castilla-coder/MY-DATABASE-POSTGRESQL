const API_URL = 'http://localhost:3000';

// DOM selectors
const clientsList = document.getElementById('clients-list');
const invoicesList = document.getElementById('invoices-list');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-id');
const searchResult = document.getElementById('search-result');

// Fetch and display all clients
async function fetchClients() {
  try {
    const res = await fetch(`${API_URL}/clients`);
    if (!res.ok) throw new Error('Error fetching clients');
    const clients = await res.json();
    renderClients(clients);
  } catch (error) {
    searchResult.textContent = error.message;
  }
}

function renderClients(clients) {
  clientsList.innerHTML = '';
  if (clients.length === 0) {
    clientsList.innerHTML = '<li>No clients registered.</li>';
    return;
  }
  clients.forEach(client => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${client.customer_name}</strong> - ${client.identification}`;
    clientsList.appendChild(li);
  });
}

// Search client by ID
async function searchClient() {
  const id = searchInput.value.trim();
  if (!id) {
    searchResult.textContent = 'Please enter a valid ID.';
    return;
  }
  try {
    const res = await fetch(`${API_URL}/clients/${id}`);
    if (res.status === 404) {
      searchResult.textContent = 'Client not found.';
      return;
    }
    if (!res.ok) throw new Error('Error searching client');
    const client = await res.json();
    searchResult.textContent = JSON.stringify(client, null, 2);
  } catch (error) {
    searchResult.textContent = error.message;
  }
}

// List pending invoices
async function fetchPendingInvoices() {
  try {
    const res = await fetch(`${API_URL}/pending_invoices`);
    if (!res.ok) throw new Error('Error fetching pending invoices');
    const invoices = await res.json();
    renderInvoices(invoices);
  } catch (error) {
    invoicesList.innerHTML = `<li>${error.message}</li>`;
  }
}

function renderInvoices(invoices) {
  invoicesList.innerHTML = '';
  if (invoices.length === 0) {
    invoicesList.innerHTML = '<li>No pending invoices.</li>';
    return;
  }
  invoices.forEach(invoice => {
    const pendingAmount = Number(invoice.pending_amount).toFixed(2);
    const li = document.createElement('li');
    li.innerHTML = `
      <div><strong>Client:</strong> ${invoice.customer_name} (${invoice.identification})</div>
      <div><strong>Invoice ID:</strong> ${invoice.id_billing}</div>
      <div><strong>Pending Amount:</strong> $${pendingAmount}</div>
      <div><strong>Transaction Date:</strong> ${new Date(invoice.date_time).toLocaleString()}</div>
    `;
    invoicesList.appendChild(li);
  });
}

// Events
searchBtn.addEventListener('click', searchClient);

// Initialization
fetchClients();
fetchPendingInvoices();
