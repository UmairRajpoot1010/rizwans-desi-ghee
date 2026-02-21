const http = require('http')

function get(path){
  return new Promise((resolve,reject)=>{
    const req = http.request({hostname:'localhost',port:5000,path,method:'GET'},res=>{
      let d=''
      res.on('data',c=>d+=c)
      res.on('end',()=>resolve({status: res.statusCode, body: d}))
    })
    req.on('error',e=>reject(e))
    req.end()
  })
}

;(async ()=>{
  try{
    const endpoints = ['/api/auth/me','/api/orders/my','/api/admin/orders']
    for (const ep of endpoints) {
      try{
        const r = await get(ep)
        console.log(`${ep} -> ${r.status}`)
        console.log(r.body)
      }catch(e){
        console.error(`${ep} -> ERROR ${e.message}`)
      }
    }
  }catch(e){
    console.error('ERROR', e.message)
  }
})();
