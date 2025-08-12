const API_URL = 'http://localhost:3000';

// DOM selectors
const clientsList = document.getElementById('clients-list');
const invoicesList = document.getElementById('invoices-list');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-id');
const searchResult = document.getElementById('search-result');
const clientForm = document.getElementById('client-form');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');

let editingClientId = null;

// Fetch and display all clients
async function fetchClients() {
  try {
    const res = await fetch(`${API_URL}/clients`);
    if (!res.ok) throw new Error('Error fetching clients');
    const clients = await res.json();
    renderClients(clients);
  } catch (error) {
    alert(error.message);
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
    li.textContent = `${client.customer_name} - ${client.identification}`;

    // Edit and delete buttons
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEditClient(client));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => deleteClient(client.id_client));

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

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

// Create or update client
clientForm.addEventListener('submit', async e => {
  e.preventDefault();

  const clientData = {
    customer_name: clientForm.customer_name.value.trim(),
    identification: clientForm.identification.value.trim(),
    address: clientForm.address.value.trim(),
    phone_number: clientForm.phone_number.value.trim(),
    email: clientForm.email.value.trim()
  };

  try {
    let res;
    if (editingClientId) {
      // Update existing client
      res = await fetch(`${API_URL}/clients/${editingClientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      if (!res.ok) throw new Error('Error updating client');
      alert('Client updated');
    } else {
      // Create new client
      res = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      if (!res.ok) throw new Error('Error creating client');
      alert('Client created');
    }
    resetForm();
    fetchClients();
  } catch (error) {
    alert(error.message);
  }
});

function startEditClient(client) {
  editingClientId = client.id_client;
  formTitle.textContent = 'Edit Client';
  clientForm.id_client.value = client.id_client;
  clientForm.customer_name.value = client.customer_name;
  clientForm.identification.value = client.identification;
  clientForm.address.value = client.address || '';
  clientForm.phone_number.value = client.phone_number || '';
  clientForm.email.value = client.email || '';
  cancelBtn.style.display = 'inline-block';
}

cancelBtn.addEventListener('click', () => {
  resetForm();
});

function resetForm() {
  editingClientId = null;
  formTitle.textContent = 'Create Client';
  clientForm.reset();
  cancelBtn.style.display = 'none';
  searchResult.textContent = '';
  searchInput.value = '';
}

// Delete client
async function deleteClient(id_client) {
  if (!confirm('Are you sure you want to delete this client?')) return;
  try {
    const res = await fetch(`${API_URL}/clients/${id_client}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error deleting client');
    alert('Client deleted');
    fetchClients();
  } catch (error) {
    alert(error.message);
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
    alert(error.message);
  }
}

function renderInvoices(invoices) {
  invoicesList.innerHTML = '';
  if (invoices.length === 0) {
    invoicesList.innerHTML = '<li>No pending invoices.</li>';
    return;
  }
  invoices.forEach(invoice => {
    const pendingAmount = Number(invoice.pending_amount);
    const formattedPending = isNaN(pendingAmount) ? "0.00" : pendingAmount.toFixed(2);

    const li = document.createElement('li');
    li.innerHTML = `
      <div><strong>Client:</strong> ${invoice.customer_name} (${invoice.identification})</div>
      <div><strong>Invoice ID:</strong> ${invoice.id_billing}</div>
      <div><strong>Pending Amount:</strong> $${formattedPending}</div>
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
