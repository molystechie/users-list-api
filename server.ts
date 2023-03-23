/*
 * App: microserver serve list of users 
 * Purpose: Fetch users from API and serve them as API endpoints
 * Deverloper: John Lyimo
 * Technologies Deno: 
 * CreatedOn: March 23, 2023
 * 
 * To run > deno run --allow-net server.ts
 */

import { Application, Router, Context, Status } from "https://deno.land/x/oak/mod.ts";

type User = {
    id:number,
    name:string,
    username: string,
    email: string
}


const router = new Router();

router.get('/', async (ctx:Context) =>{
    // const resp = await fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json());
    const resp = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await resp.json();

    const usersData = [] as Promise<Response>[]

    for(let idx = 1; idx <= data.length; idx++) {
        usersData.push(fetch(`https://jsonplaceholder.typicode.com/users/${idx}`));
    }
    
    // create an array to store users data
    const promises = await Promise.all(usersData);
    const users = await Promise.all(promises.map(user => user.json() as Promise<User>));

    ctx.response.body = JSON.stringify(users.map(user =>user.name), null, 2);
    // ctx.response.body = users.map(user =>user.name);
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