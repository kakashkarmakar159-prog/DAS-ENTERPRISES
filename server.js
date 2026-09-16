
const express=require("express"),fs=require("fs"),path=require("path"),crypto=require("crypto"),multer=require("multer");
const app=express(),PORT=process.env.PORT||3000,DB=path.join(__dirname,"data/db.json"),UPLOADS=path.join(__dirname,"public/uploads");
fs.mkdirSync(UPLOADS,{recursive:true});app.use(express.json({limit:"2mb"}));app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));app.use("/admin",express.static(path.join(__dirname,"admin")));
const read=()=>JSON.parse(fs.readFileSync(DB,"utf8")),save=d=>fs.writeFileSync(DB,JSON.stringify(d,null,2));
const sessions=new Map(), uid=p=>p+"-"+Date.now().toString(36).toUpperCase();
function creds(){return {u:process.env.ADMIN_USERNAME||"dasinterface1234",h:process.env.ADMIN_PASSWORD_HASH||"REPLACE",s:process.env.ADMIN_PASSWORD_SALT||"REPLACE"}}
function verify(p){const c=creds();if(c.h==="REPLACE")return false;try{const a=crypto.scryptSync(p,Buffer.from(c.s,"base64"),64,{N:16384,r:8,p:1});return crypto.timingSafeEqual(a,Buffer.from(c.h,"base64"))}catch{return false}}
function admin(req,res,next){const t=(req.headers.authorization||"").replace("Bearer ","");if(!sessions.has(t))return res.status(401).json({error:"Unauthorized"});next()}
app.post("/api/admin/login",(q,r)=>{const {username,password}=q.body,c=creds();if(username===c.u&&verify(password)){const t=crypto.randomBytes(32).toString("hex");sessions.set(t,Date.now());return r.json({token:t})}r.status(401).json({error:"Invalid admin username or password"})});
app.post("/api/admin/logout",admin,(q,r)=>{sessions.delete((q.headers.authorization||"").replace("Bearer ",""));r.json({ok:true})});
app.get("/api/products",(q,r)=>{let a=read().products.filter(p=>p.active),{category,cats,q:search,sort}=q.query;if(category&&category!=="All")a=a.filter(p=>p.category.toLowerCase()===category.toLowerCase());if(search)a=a.filter(p=>(p.name+" "+p.category+" "+p.material).toLowerCase().includes(search.toLowerCase()));if(sort==="price-low")a.sort((x,y)=>x.price-y.price);if(sort==="price-high")a.sort((x,y)=>y.price-x.price);if(sort==="newest")a.reverse();r.json(a)});
app.get("/api/products/:id",(q,r)=>{const p=read().products.find(x=>x.id===q.params.id);p?r.json(p):r.status(404).json({error:"Product not found"})});
app.get("/api/categories",(q,r)=>r.json([...new Set(read().products.filter(p=>p.active).map(p=>p.category))]));
app.get("/api/banners",(q,r)=>r.json(read().banners.filter(b=>b.active)));
app.get("/api/coupons/:code",(q,r)=>{const c=read().coupons.find(x=>x.code===q.params.code.toUpperCase()&&x.active);c?r.json(c):r.status(404).json({error:"Invalid coupon"})});
app.post("/api/orders",(q,r)=>{const d=read(),b=q.body;if(!b.customer||!b.mobile||!b.items?.length)return r.status(400).json({error:"Missing order information"});let sub=0,items=[];for(const i of b.items){const p=d.products.find(x=>x.id===i.productId);if(!p||p.stock<i.qty)return r.status(400).json({error:"Insufficient stock"});p.stock-=i.qty;sub+=p.price*i.qty;items.push({productId:p.id,name:p.name,qty:i.qty,price:p.price,image:p.image})}const ship=sub>=1500?0:Number(d.settings.shippingCharge||0),disc=Number(b.discount||0),o={id:uid("DU"),customer:b.customer,mobile:b.mobile,email:b.email||"",items,amount:Math.max(0,sub+ship-disc),subtotal:sub,shipping:ship,discount:disc,payment:b.payment||"Cash on Delivery",status:"Order Received",createdAt:new Date().toISOString(),address:b.address||""};d.orders.unshift(o);save(d);r.json(o)});
app.get("/api/orders/track",(q,r)=>{const o=read().orders.find(x=>x.id===q.query.orderId&&(!q.query.mobile||x.mobile===q.query.mobile));o?r.json(o):r.status(404).json({error:"Order not found"})});
app.get("/api/admin/dashboard",admin,(q,r)=>{const d=read(),sales=d.orders.reduce((s,o)=>s+o.amount,0),customers=new Set(d.orders.map(o=>o.mobile)).size;r.json({totalOrders:d.orders.length,totalSales:sales,totalCustomers:customers,totalProducts:d.products.length,recentOrders:d.orders.slice(0,6)})});
app.get("/api/admin/products",admin,(q,r)=>r.json(read().products));
app.post("/api/admin/products",admin,(q,r)=>{const d=read(),p={...q.body,id:q.body.id||uid("P"),price:+q.body.price||0,oldPrice:+q.body.oldPrice||0,discount:+q.body.discount||0,stock:+q.body.stock||0,active:q.body.active!==false,featured:!!q.body.featured};d.products.unshift(p);save(d);r.json(p)});
app.put("/api/admin/products/:id",admin,(q,r)=>{const d=read(),i=d.products.findIndex(x=>x.id===q.params.id);if(i<0)return r.status(404).json({error:"Not found"});d.products[i]={...d.products[i],...q.body};save(d);r.json(d.products[i])});
app.delete("/api/admin/products/:id",admin,(q,r)=>{const d=read();d.products=d.products.filter(x=>x.id!==q.params.id);save(d);r.json({ok:true})});
app.get("/api/admin/orders",admin,(q,r)=>r.json(read().orders));
app.put("/api/admin/orders/:id",admin,(q,r)=>{const d=read(),o=d.orders.find(x=>x.id===q.params.id);if(!o)return r.status(404).json({error:"Not found"});o.status=q.body.status||o.status;save(d);r.json(o)});
app.get("/api/admin/customers",admin,(q,r)=>{const d=read(),m=new Map();d.orders.forEach(o=>{if(!m.has(o.mobile))m.set(o.mobile,{name:o.customer,mobile:o.mobile,email:o.email,totalOrders:0,totalPurchase:0,lastOrder:o.createdAt});const c=m.get(o.mobile);c.totalOrders++;c.totalPurchase+=o.amount;if(o.createdAt>c.lastOrder)c.lastOrder=o.createdAt});r.json([...m.values()])});
app.get("/api/admin/coupons",admin,(q,r)=>r.json(read().coupons));
app.post("/api/admin/coupons",admin,(q,r)=>{const d=read(),c={code:q.body.code.toUpperCase(),type:q.body.type||"percent",value:+q.body.value||0,minPurchase:+q.body.minPurchase||0,active:true};d.coupons.push(c);save(d);r.json(c)});
app.delete("/api/admin/coupons/:code",admin,(q,r)=>{const d=read();d.coupons=d.coupons.filter(c=>c.code!==q.params.code.toUpperCase());save(d);r.json({ok:true})});
app.get("/api/admin/banners",admin,(q,r)=>r.json(read().banners));
app.post("/api/admin/banners",admin,(q,r)=>{const d=read(),b={id:uid("B"),title:q.body.title||"New Banner",image:q.body.image||"/assets/banners/banner-01.jpg",active:true};d.banners.push(b);save(d);r.json(b)});
app.put("/api/admin/banners/:id",admin,(q,r)=>{const d=read(),b=d.banners.find(x=>x.id===q.params.id);if(!b)return r.status(404).json({error:"Not found"});Object.assign(b,q.body);save(d);r.json(b)});
app.delete("/api/admin/banners/:id",admin,(q,r)=>{const d=read();d.banners=d.banners.filter(x=>x.id!==q.params.id);save(d);r.json({ok:true})});
app.get("/api/admin/reviews",admin,(q,r)=>r.json(read().reviews));
app.put("/api/admin/reviews/:id",admin,(q,r)=>{const d=read(),x=d.reviews.find(x=>x.id===q.params.id);Object.assign(x,q.body);save(d);r.json(x)});
app.get("/api/admin/reports",admin,(q,r)=>{const d=read(),st={};d.orders.forEach(o=>st[o.status]=(st[o.status]||0)+1);r.json({totalSales:d.orders.reduce((s,o)=>s+o.amount,0),totalOrders:d.orders.length,byStatus:st})});
app.get("/api/admin/settings",admin,(q,r)=>r.json(read().settings));
app.put("/api/admin/settings",admin,(q,r)=>{const d=read();d.settings={...d.settings,...q.body};save(d);r.json(d.settings)});
const upload=multer({dest:UPLOADS});app.post("/api/admin/upload",admin,upload.single("image"),(q,r)=>{if(!q.file)return r.status(400).json({error:"No file"});r.json({url:"/uploads/"+q.file.filename})});
app.get("*",(q,r)=>q.path.startsWith("/admin")?r.sendFile(path.join(__dirname,"admin/login.html")):r.sendFile(path.join(__dirname,"public/index.html")));
app.listen(PORT,()=>console.log("DAS ENTERPRISES: http://localhost:"+PORT));
