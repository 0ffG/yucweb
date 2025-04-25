//README.md

-> Before running, don't forget to run npm install
npm install


-> In the web console
 (Temporary control to see changes in the navigation bar)

 Login as user
 localStorage.setItem('user', JSON.stringify({ role: 'donor' }));


 Login as admin
localStorage.setItem('user', JSON.stringify({ role: 'admin' }));


 Logout
localStorage.removeItem('user');
