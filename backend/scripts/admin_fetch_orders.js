const axios = require('axios')
;(async ()=>{
  try{
    const API = 'http://localhost:5000/api'
    const login = await axios.post(`${API}/admin/auth/login`, { email: 'admin@rizwansdesighee.com', password: 'admin123' })
    console.log('admin login', login.data.success)
    const token = login.data.data.token
    const res = await axios.get(`${API}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
    console.log('orders fetched', res.data.meta?.total, 'items')
    console.log(JSON.stringify(res.data.data.slice(0,3), null, 2))
  }catch(e){ console.error('ERR', e.response ? e.response.data : e.message) }
})()
