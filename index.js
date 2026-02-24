import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

const makeCommit = async (date) => {
  const data = { date };

  await jsonfile.writeFile(path, data);

  await git.add([path]);
  await git.commit(date, { "--date": date });
};

const generateCommits = async () => {
  const startDate = moment("2022-01-01");
  const endDate = moment("2022-12-31");

  const totalDays = endDate.diff(startDate, "days");

  for (let i = 0; i <= totalDays; i++) {
    const currentDay = startDate.clone().add(i, "days");

    const dayOfWeek = currentDay.day();

    // 45% chance to skip day
    if (random.float() < 0.45) continue;

    let commitsToday;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend
      commitsToday = random.int(0, 2);
    } else {
      // Weekday
      commitsToday = random.int(1, 4);
    }

    for (let j = 0; j < commitsToday; j++) {
      const commitDate = currentDay
        .clone()
        .hour(random.int(9, 21))
        .minute(random.int(0, 59))
        .second(random.int(0, 59))
        .format();

      console.log("Commit:", commitDate);

      await makeCommit(commitDate);
    }
  }

  await git.push();
  console.log("Done ✅ 2022 commits generated");
};

generateCommits();