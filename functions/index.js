const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // for local
// var serviceAccount = require('./../questionpapergenerator-22e43-firebase-adminsdk-jpw58-4056f6fd97.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://questionpapergenerator-22e43.firebaseio.com'
// });

exports.fetchPrivateKey = functions.https.onCall(async (data, context) => {
    try {
        let snapshot = await admin.firestore().collection('privateKeys').doc('pD6QX4QzRB9AYezmOi70').get();
        return snapshot.data().key;
    } catch (err) {
        console.log(err);
        return null;
    }
});

// add given question
exports.addNewQuestion = functions.https.onCall((data, context) => {
    const questionObject = data.questionObject;
    console.log(questionObject);
    admin.firestore().collection('questions').doc(questionObject.subject_code).collection(questionObject.difficulty_level).doc(questionObject.unit_no).collection(questionObject.marks_weight).add({
        subTitle: questionObject.subject_title,
        question: questionObject.question
    }).then((result) => {
        console.log('success');
        return `Given question has been added`;
    }).catch((err) => {
        console.log(err);
        throw err;
    });
});

// download all questions
exports.downloadAllQuestions = functions.https.onCall(async (data, context) => {
    console.log(`called downloadAllQuestions function`);
    const subjectObject = data.subjectObject;
    console.log(subjectObject);
    let questions = `\t\tQUESTIONS\n`;
    const shortQuestions = await fetchAllQuestionsOfGivenSubjectCodeAndLevel({ queryObject: { 'subject_code': subjectObject.subject_code, 'marks': '2' } });
    const longQuestions = await fetchAllQuestionsOfGivenSubjectCodeAndLevel({ queryObject: { 'subject_code': subjectObject.subject_code, 'marks': '10' } });
    questions = questions + 'Short Answers\n' + shortQuestions.join('\n') + '\nLong Answers\n' + longQuestions.join('\n');
    return questions;
});

// genrate question paper
exports.generateQuestionPaper = functions.https.onCall(async (data, context) => {
    console.log(`called generateQuestionPaper function`);
    const questionPaperObject = data.questionPaperObject;
    console.log(questionPaperObject);
    let shortQuestions = [];
    let longQuestions = [];
    let questionPaper = `\t\tCVR College of Engineering\n`;
    if (questionPaperObject.exam_type === 'mid1') {
        const unit_1_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 1', 'marks': '2' } });
        console.log(`unit_1_2:${unit_1_2}`);
        const unit_1_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 1', 'marks': '10' } });
        console.log(`unit_1_10:${unit_1_10}`);
        const unit_2_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 2', 'marks': '2' } });
        console.log(`unit_2_2:${unit_2_2}`);
        const unit_2_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 2', 'marks': '10' } });
        console.log(`unit_2_10:${unit_2_10}`);
        const unit_3_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 3', 'marks': '2' } });
        console.log(`unit_3_2:${unit_3_2}`);
        const unit_3_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 3', 'marks': '10' } });
        console.log(`unit_3_10:${unit_3_10}`);
        if (unit_1_2 === null || unit_1_10 === null || unit_2_2 === null || unit_2_10 === null || unit_3_2 === null || unit_3_10 === null) {
            questionPaper = '';
        }
        else {
            shortQuestions.push(unit_1_2[0], unit_1_2[1], unit_2_2[0], unit_2_2[1], unit_3_2[0]);
            longQuestions.push(unit_1_10.join('\nOR\n'), unit_2_10.join('\nOR\n'), unit_3_10.join('\nOR\n'));
            questionPaper = questionPaper + 'Short Answers\n' + shortQuestions.join('\n') + '\nLong Answers\n' + longQuestions.join('\n');
        }
    } else if (questionPaperObject.exam_type === 'mid2') {
        const unit_3_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 3', 'marks': '2' } });
        const unit_3_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 3', 'marks': '10' } });
        const unit_4_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 4', 'marks': '2' } });
        const unit_4_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 4', 'marks': '10' } });
        const unit_5_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 5', 'marks': '2' } });
        const unit_5_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 5', 'marks': '10' } });
        if (unit_3_2 === null || unit_3_10 === null || unit_4_2 === null || unit_4_10 === null || unit_5_2 === null || unit_5_10 === null) {
            questionPaper = '';
        }
        else {
            shortQuestions.push(unit_3_2[0], unit_4_2[0], unit_4_2[1], unit_5_2[0], unit_5_2[1]);
            longQuestions.push(unit_3_10.join('\nOR\n'), unit_4_10.join('\nOR\n'), unit_5_10.join('\nOR\n'));
            questionPaper = questionPaper + 'Short Answers\n' + shortQuestions.join('\n') + '\nLong Answers\n' + longQuestions.join('\n');
        }
    } else if (questionPaperObject.exam_type === 'substitution') {
        const unit_1_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 1', 'marks': '2' } });
        const unit_1_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 1', 'marks': '10' } });
        const unit_2_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 2', 'marks': '2' } });
        const unit_2_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 2', 'marks': '10' } });
        const unit_3_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 3', 'marks': '2' } });
        const unit_3_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 3', 'marks': '10' } });
        const unit_4_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 4', 'marks': '2' } });
        const unit_4_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 4', 'marks': '10' } });
        const unit_5_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 5', 'marks': '2' } });
        const unit_5_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 5', 'marks': '10' } });
        if (unit_1_2 === null || unit_1_10 === null || unit_2_2 === null || unit_2_10 === null || unit_3_2 === null || unit_3_10 === null || unit_4_2 === null || unit_4_10 === null || unit_5_2 === null || unit_5_10 === null) {
            questionPaper = '';
        }
        else {
            shortQuestions.push(unit_1_2[0], unit_2_2[0], unit_3_2[0], unit_4_2[0], unit_5_2[0]);
            longQuestions.push(unit_1_10[0] + '\nOR\n' + unit_2_10[1], unit_3_10[0] + '\nOR\n' + unit_3_10[1], unit_4_10[0] + '\nOR\n' + unit_5_10[1]);
            questionPaper = questionPaper + 'Short Answers\n' + shortQuestions.join('\n') + '\nLong Answers\n' + longQuestions.join('\n');
        }
    } else {
        const unit_1_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 1', 'marks': '2' } });
        const unit_1_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 1', 'marks': '10' } });
        const unit_2_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 2', 'marks': '2' } });
        const unit_2_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 2', 'marks': '10' } });
        const unit_3_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 3', 'marks': '2' } });
        const unit_3_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 3', 'marks': '10' } });
        const unit_4_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 4', 'marks': '2' } });
        const unit_4_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 4', 'marks': '10' } });
        const unit_5_2 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 5', 'marks': '2' } });
        const unit_5_10 = await fetchQuestionsOfGivenUnit({ queryObject: { 'subject_code': questionPaperObject.subject_code, 'difficulty_level': questionPaperObject.difficulty_level, 'unit': 'Unit 5', 'marks': '10' } });
        if (unit_1_2 === null || unit_1_10 === null || unit_2_2 === null || unit_2_10 === null || unit_3_2 === null || unit_3_10 === null || unit_4_2 === null || unit_4_10 === null || unit_5_2 === null || unit_5_10 === null) {
            questionPaper = '';
        }
        else {
            shortQuestions = shortQuestions.concat(unit_1_2, unit_2_2, unit_3_2, unit_4_2, unit_5_2);
            longQuestions.push(unit_1_10.join('\nOR\n'), unit_2_10.join('\nOR\n'), unit_3_10.join('\nOR\n'), unit_4_10.join('\nOR\n'), unit_5_10.join('\nOR\n'));
            questionPaper = questionPaper + 'Short Answers\n' + shortQuestions.join('\n') + '\nLong Answers\n' + longQuestions.join('\n');
        }
    }
    return questionPaper;
});

// fetch questions for particular unit
const fetchQuestionsOfGivenUnit = async (data) => {
    console.log(`called fetchQuestionsOfGivenUnit function`);
    const queryObject = data.queryObject;
    console.log(queryObject);
    try {
        let snapshot = await admin.firestore().collection('questions').doc(queryObject.subject_code).collection(queryObject.difficulty_level).doc(queryObject.unit).collection(queryObject.marks).get();
        console.log('got data', snapshot.docs);
        let ques = [];
        for (doc of snapshot.docs) {
            ques.push(doc.data());
        }
        const len = ques.length;
        if (len < 2) {
            return null;
        }
        let res = [];
        let indexOne = indexTwo = len - 1;
        indexOne = Math.floor(Math.random() * len);
        do {
            indexTwo = Math.floor(Math.random() * len);
        } while (indexOne === indexTwo)
        res.push(ques[indexOne].question, ques[indexTwo].question);
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }
};

// fetch questions for given subject
const fetchAllQuestionsOfGivenSubjectCodeAndLevel = async (data) => {
    console.log(`called fetchAllQuestionsOfGivenSubjectCodeAndLevel function`);
    const queryObject = data.queryObject;
    console.log(queryObject);
    const difficulty_levels = ['Easy','Medium','Difficult'];
    const units = ['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5'];
    let ques = [];
    try {
        for (let i=0; i < difficulty_levels.length;i++){
            for (let j=0; j < units.length; j++){
                console.log(difficulty_levels[i], units[j]);
                let snapshot = await admin.firestore().collection('questions').doc(queryObject.subject_code).collection(difficulty_levels[i]).doc(units[j]).collection(queryObject.marks).get();
                // let snapshot = await admin.firestore().collection('questions').doc('007').collection('Medium').doc('Unit 1').collection('10').get();
                console.log('got data', snapshot.docs);
                for (doc of snapshot.docs) {
                    console.log('data');
                    console.log(doc.data().question);
                    ques.push(doc.data().question);
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
    return ques;
};