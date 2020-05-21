const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const userActionsLinks = document.querySelectorAll('.userActionsInfo');
const addQuestionActionLink = document.querySelector('.addQuestion-action');
const generateQuestionPaperActionLink = document.querySelector('.generateQuestionPaper-action');
const userActionNavigation = document.querySelector('.userActionsNavigation');
const addQuestionForm = document.querySelector('#addques');
const generateQuestionPaperForm = document.querySelector('#generateqp');

// for local
// firebase.functions().useFunctionsEmulator('http://localhost:5001')

const setupUI = (user) => {
    if (user) {
        // account info
        const html = `
            <div>Logged in as ${user.email}</div>
        `;
        accountDetails.innerHTML = html;
        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        // hide account info
        accountDetails.innerHTML = '';
        // toggle UI elements
        loggedOutLinks.forEach(item => item.style.display = 'block');
        loggedInLinks.forEach(item => item.style.display = 'none');
    }
}

// for downloading file
const downloadFile = (filename, content) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Add question
const setupAddQuestionUI = () => {
    logout.style.display = 'none';
    userActionNavigation.style.display = 'block';
    userActionsLinks.forEach(item => item.style.display = 'none');
    addQuestionActionLink.style.display = 'block';
    generateQuestionPaperActionLink.style.display = 'none';

    const elements = addQuestionForm.querySelectorAll('select');
    M.FormSelect.init(elements, {});
}

addQuestionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get the question info
    const questionObject = {
        subject_title: String(addQuestionForm['subject_title'].value),
        subject_code: String(addQuestionForm['subject_code'].value),
        unit_no: String(addQuestionForm['unit_no'].value),
        difficulty_level: String(addQuestionForm['difficulty_level'].value),
        marks_weight: String(addQuestionForm['marks_weight'].value),
        question: String(addQuestionForm['question'].value)
    }
    const addNewQuestion = firebase.functions().httpsCallable('addNewQuestion');
    addNewQuestion({ questionObject: questionObject })
        .then(result => {
            M.toast({ html: 'Given question has been added' });
            addQuestionForm.reset();
        })
        .catch(err => {
            M.toast({ html: 'An error has occured please try again' });
            addQuestionForm.reset();
        });
});

// Generate question paper
const setupGenerateQuestionPaperUI = () => {
    logout.style.display = 'none';
    userActionNavigation.style.display = 'block';
    userActionsLinks.forEach(item => item.style.display = 'none');
    addQuestionActionLink.style.display = 'none';
    generateQuestionPaperActionLink.style.display = 'block';

    const elements = generateQuestionPaperForm.querySelectorAll('select');
    M.FormSelect.init(elements, {});
}

generateQuestionPaperForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const questionPaperObject = {
        branch: String(generateQuestionPaperForm['branch'].value),
        year: String(generateQuestionPaperForm['year'].value),
        subject_code: String(generateQuestionPaperForm['subject_code'].value),
        exam_type: String(generateQuestionPaperForm['exam_type'].value),
        difficulty_level: String(generateQuestionPaperForm['difficulty_level'].value),
    }
    const generateQuestionPaper = firebase.functions().httpsCallable('generateQuestionPaper');
    generateQuestionPaper({ questionPaperObject: questionPaperObject })
        .then(result => {
            console.log(result);
            if (result.data === "") {
                M.toast({ html: 'An error has occured please try again' });
            } else {
                addQuestionForm.reset();
                downloadFile(`${questionPaperObject.exam_type}questionPaper.txt`, result.data);
            }
        })
        .catch(err => {
            M.toast({ html: 'An error has occured please try again' });
            addQuestionForm.reset();
        });
});

// take user to home page
userActionNavigation.addEventListener('click', (e) => {
    logout.style.display = 'block';
    userActionNavigation.style.display = 'none';
    userActionsLinks.forEach(item => item.style.display = 'block');
    addQuestionActionLink.style.display = 'none';
    generateQuestionPaperActionLink.style.display = 'none';
});

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});