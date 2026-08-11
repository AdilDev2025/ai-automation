import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';

const path = './data.json';
const git = simpleGit();
const NUM_COMMITS = 20;

const makeCommits = (n) => {
    if (n === 0) {
        console.log('All commits done. Pushing...');
        return git.push()
            .then(() => console.log('Push successful!'))
            .catch((err) => console.error('Push failed:', err));
    }

    const dayOffset = random.int(223, 227);
    const date = moment('2026-01-01')
        .add(dayOffset, 'days')
        .add(random.int(0, 23), 'hours')
        .add(random.int(0, 59), 'minutes')
        .format();

    const data = { date: date };

    jsonfile.writeFile(path, data, (err) => {
        if (err) {
            console.error('Write error:', err);
            return;
        }
        git.add([path])
           .commit(date, { '--date': date })
           .then(() => {
               console.log(`Commit ${NUM_COMMITS - n + 1}/${NUM_COMMITS} done: ${date}`);
               makeCommits(n - 1);
           })
           .catch((err) => console.error('Commit error:', err));
    });
};

console.log('Starting commit generation...');
makeCommits(NUM_COMMITS);