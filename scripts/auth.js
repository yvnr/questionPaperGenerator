// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        // console.log('user logged in: ', user);
        setupUI(user);
    } else {
        // console.log('user logged out');
        setupUI();
    }
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const key = signupForm['signup-key'].value;
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // validate the user for having the correct key
    db.collection('privateKeys').get().then(snapshot => {
        if (snapshot.docs[0].data().key == key) {
            // sign up the user
            auth.createUserWithEmailAndPassword(email, password).then(cred => {
                // console.log(cred);
                const modal = document.querySelector('#modal-signup');
                M.Modal.getInstance(modal).close();
                signupForm.reset();
                signupForm.querySelector('.error').innerHTML = '';
            }).catch(err => {
                signupForm.querySelector('.error').innerHTML = err.message;
            });
        } else {
            signupForm.querySelector('.error').innerHTML = 'OOPS! you don\'t have the authorized key';
        }
    });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log the user in
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        // console.log(cred);
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    });;
});