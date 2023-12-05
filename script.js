// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50,
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150,
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500,
      },
    ],
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47,
      },
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150,
      },
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400,
      },
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39,
      },
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140,
      },
    },
  ];
  
  function calculateWeightedAverage(assignments, submissions) {
    if (submissions.length === 0) {
      return 0;
    }
  
    let totalWeightedScore = 0;
    let totalWeight = 0;
  
    assignments.forEach((assignment) => {
      const submission = submissions.find(
        (s) => s.assignment_id === assignment.id,
      );
  
      if (submission && submission.submitted_at <= assignment.due_at) {
        console.log(
          `Processing assignment ${assignment.id} for submission ${JSON.stringify(
            submission,
          )}`,
        );
  
        const latePenalty = submission.submitted_at > assignment.due_at ? 0.9 : 1;
        const weightedScore =
          (submission.submission.score / assignment.points_possible) *
          assignment.points_possible *
          latePenalty *
          assignment.group_weight;
  
        console.log(
          `Weighted Score for assignment ${assignment.id}: ${weightedScore}, Late Penalty: ${latePenalty}, Group Weight: ${assignment.group_weight}`,
        );
  
        totalWeightedScore += weightedScore;
        totalWeight += assignment.group_weight;
      }
    });
  
    console.log(
      `Total Weighted Score: ${totalWeightedScore}, Total Weight: ${totalWeight}`,
    );
  
    return totalWeight !== 0 ? (totalWeightedScore / totalWeight).toFixed(3) : 0;
  }
  
  function getLearnerData(course, ag, submissions) {
    try {
      if (ag.course_id !== course.id) {
        throw new Error(
          "Invalid input: Assignment group does not belong to the specified course.",
        );
      }
  
      const result = [];
  
      const uniqueLearnerIds = [...new Set(submissions.map((s) => s.learner_id))];
  
      uniqueLearnerIds.forEach((learnerId) => {
        const learnerData = {
          id: learnerId,
          avg: 0,
        };
  
        const assignmentScores = {};
  
        ag.assignments.forEach((assignment) => {
          const submission = submissions.find(
            (s) =>
              s.learner_id === learnerId && s.assignment_id === assignment.id,
          );
  
          if (
            submission &&
            submission.submission &&
            assignment.points_possible !== 0
          ) {
            const percentageScore =
              (submission.submission.score / assignment.points_possible) * 100;
            assignmentScores[assignment.id] = parseFloat(
              percentageScore.toFixed(3),
            );
          }
        });
  
        console.log(
          `Submissions for learner ${learnerId}: ${JSON.stringify(
            submissions.filter((s) => s.learner_id === learnerId),
          )}`,
        );
  
        learnerData.avg = calculateWeightedAverage(
          ag.assignments,
          submissions.filter((s) => s.learner_id === learnerId),
        );
        learnerData.assignments = assignmentScores;
  
        result.push(learnerData);
      });
  
      return result;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }
  
  // Get learner data
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
  // Log the result
  console.log(result);
  