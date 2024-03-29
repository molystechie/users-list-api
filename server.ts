/*
 * App: microserver serve list of users 
 * Purpose: Fetch users from API and serve them as API endpoints
 * Deverloper: John Lyimo
 * Technologies Deno: 
 * CreatedOn: March 23, 2023
 * The API already Deploy in Deno Deploy : visit: https://molystechie-users-list-api.deno.dev/
 * Github Repos: https://github.com/molystechie/users-list-api
 * 
 * To run > deno run --allow-net server.ts
 */

import { Application, Router, Context, Status } from "https://deno.land/x/oak/mod.ts";


//https://reqres.in/api/users
type User = {
    id:number,
    first_name:string,
    last_name:string,
    email: string,
    avatar: string
}

const router = new Router();
router.get('/', async (ctx:Context) =>{
    // const resp = await fetch('https://reqres.in/api/users'));
    // const data = await resp.json();

    const data = await fetch('https://reqres.in/api/users').then(res => res.json()).then(user => user.data);
    // console.log(`DEBUG data \n${JSON.stringify(data.length, null, 2)}`);
    
    const usersData = [] as Promise<Response>[]

    for(let idx = 1; idx <= data.length; idx++) {
        usersData.push(await fetch(`https://reqres.in/api/users/${idx}`).then(res => res.json()).then(u => u.data));
    }
    
    // console.log(`DEBUG: userData \n${JSON.stringify(usersData, null, 2)}`);
    
    const promises = await Promise.all(usersData);
    const users = await Promise.all(promises.map(user2 => user2 ));
 

    ctx.response.body = JSON.stringify(users, null, 2);
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
});

const app = new Application();
app.use(router.routes())
app.use(router.allowedMethods())
// app.use(notfound)

// default route if nothing match
const htmlBody = new TextEncoder().encode(`
    <div style="height:100vh; display: flex; flex-direction:column; justify-content: center; align-items: center;">
        <h1>What you are looking not found, ooh sorry!</h1>
        <p>Try again!</p>
    </div>
 `);
app.use((ctx) => {
    ctx.response.status = 404;
    ctx.response.body = htmlBody
    // ctx.response.body = new TextEncoder().encode("<h1>What you are looking not found, ooh sorry!</h1>");

    // ctx.response.body = {
    //   error: "What you are looking not found, ooh sorry!",
    // };
  });

console.log("Server up on running @ http://localhost:8000");
await app.listen({ port: 8000 });
// Go to http://localhost:8000/