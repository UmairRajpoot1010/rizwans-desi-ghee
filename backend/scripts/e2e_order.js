const axios = require('axios')
const fs = require('fs')
;(async ()=>{
  try{
    const API = 'http://localhost:5000/api'
    // 1. register
    const email = `testuser+${Date.now()}@example.com`
    const reg = await axios.post(`${API}/auth/register`, { name: 'Test User', email, password: 'password123' })
    console.log('register', reg.data)
    const token = reg.data.data.token
    // 2. list products
    const products = await axios.get(`${API}/products`)
    const items = (products.data.data || []).slice(0,1)
    if (!items.length) { console.error('No products to order'); return }
    const product = items[0]
    console.log('product', product._id)
    // 3. place order (COD)
    const orderPayload = { items: [{ product: product._id, quantity: 1 }], shippingAddress: { name: 'Test User', email, phone: '+911234567890', address: 'Test st 1', city: 'City', state: 'State', zipCode: '12345' } }
    const res = await axios.post(`${API}/orders`, orderPayload, { headers: { Authorization: `Bearer ${token}` } })
    console.log('order create', res.data)
  }catch(e){
    console.error('ERROR', e.response ? e.response.data : e.message)
  }
})()
